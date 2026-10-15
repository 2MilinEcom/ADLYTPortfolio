"""
Video Processing Orchestrator
-----------------------------
End-to-end pipeline:
1. Load videos (manual preferred)
2. Extract audio
3. Transcribe
4. Plan edit with AI
5. Splice final video
"""

import os
import json
from typing import Dict, List

from langgraph.graph import StateGraph, END
from openai import OpenAI

from extract_audio import extract_audio
from splice_videos import splice_videos
from transcribe_videos import transcribe_videos
from chunk_editor.plan_edit_chunked import plan_edit_chunked

from video_getter import get_videos
from config import config, get_test_path, get_output_path

# ============================================================================
# GLOBAL CONFIG
# ============================================================================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# ----- Paths -----
PRODUCT_IMAGE_PATH = str(get_test_path("product_reference.jpg", is_input=True))
OUTPUT_DIR = str(config.test_output_dir)
AUDIO_DIR = os.path.join(OUTPUT_DIR, "audio")
FINAL_OUTPUT_PATH = str(get_output_path("final_edited_video.mp4"))

# ----- Manual videos (highest priority) -----
MANUAL_TIKTOK_VIDEOS = [
    "/Users/essencia/Desktop/test_inputs/vid_0.mp4",
    "/Users/essencia/Desktop/test_inputs/vid_1.mp4",
    "/Users/essencia/Desktop/test_inputs/vid_2.mp4",
    "/Users/essencia/Desktop/test_inputs/vid_3.mp4"
]

# ----- Behavior flags -----
ALLOW_SUPABASE_FALLBACK = False  # 🔒 hard safety switch

# ============================================================================
# HELPERS
# ============================================================================

def ensure_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(AUDIO_DIR, exist_ok=True)

def fail(msg: str) -> Dict:
    print(f"❌ {msg}")
    return {"error": msg}

# ============================================================================
# STEP 1 — LOAD VIDEOS
# ============================================================================

def load_videos(_: Dict) -> Dict:
    print("🎬 Step 1: Loading videos")

    valid_manual = [
        v for v in MANUAL_TIKTOK_VIDEOS
        if v and os.path.exists(v)
    ]

    if valid_manual:
        print(f"✅ Using {len(valid_manual)} manual video(s)")
        return {"videos": valid_manual}

    if not ALLOW_SUPABASE_FALLBACK:
        return fail("No manual videos found and Supabase fallback disabled")

    print("☁️ Falling back to Supabase")
    try:
        videos = get_videos()
        if not videos:
            return fail("Supabase returned no videos")
        return {"videos": videos}
    except Exception as e:
        return fail(f"Supabase error: {e}")

# ============================================================================
# STEP 2 — EXTRACT AUDIO + TRANSCRIBE
# ============================================================================

def transcribe_step(state: Dict) -> Dict:
    print("🎤 Step 2: Extracting audio & transcribing")

    videos: List[str] = state.get("videos", [])
    if not videos:
        return fail("No videos provided")

    ensure_dirs()

    audio_paths = []
    for i, video in enumerate(videos):
        audio_path = os.path.join(AUDIO_DIR, f"audio_{i}.mp3")
        try:
            print(f"🎵 Extracting: {os.path.basename(video)}")
            extract_audio(video, audio_path)
            audio_paths.append(audio_path)
        except Exception as e:
            print(f"⚠️ Skipped {video}: {e}")

    if not audio_paths:
        return fail("No audio extracted")

    try:

        transcripts = transcribe_videos(audio_paths, videos)

        # Save transcripts
        transcript_dump = {
            "videos": videos,
            "transcripts": transcripts
        }
        transcript_path = os.path.join(OUTPUT_DIR, "transcripts.json")
        with open(transcript_path, "w") as f:
            json.dump(transcript_dump, f, indent=2)

        print(f"✅ Transcribed {len(transcripts)} video(s)")

        # 🔥 NEW: Chunk and plan edit from transcripts
        edit_plan = plan_edit_chunked(transcripts)

        # Save edit plan
        edit_plan_path = os.path.join(OUTPUT_DIR, "edit_plan.json")
        with open(edit_plan_path, "w") as f:
            json.dump(edit_plan, f, indent=2)

        print(f"✅ Edit plan created with {len(edit_plan['segments'])} segments")

        return {
            "transcripts": transcripts,
            "edit_plan": edit_plan
        }

    except Exception as e:
        return fail(f"Transcription or planning failed: {e}")


# ============================================================================
# STEP 3 — PLAN VIDEO EDIT (AI)
# ============================================================================

def plan_edit(state: Dict) -> Dict:
    print("🧠 Step 3: Planning edit with AI")

    transcripts = state.get("transcripts")
    if not transcripts:
        return fail("No transcripts available")

    prompt = f"""
You are a professional short-form video editor.

Given timestamped transcripts from multiple videos, select the best segments to form a high-conversion short-form video.

🎯 Rules:
- Select at least **one segment from EACH video**
- Use only the provided timestamps
- Maintain a natural, engaging flow
- Include a clear structure: **Hook → Body → Ending**
- Prioritize segments with emotion, clarity, and energy
- Return strictly valid JSON (no extra commentary)

Format (return ONLY this):
{{
  "segments": [
    {{
      "video_path": "...",
      "start": 0.0,
      "end": 5.0,
      "role": "hook",
      "reason": "why this segment was chosen"
    }}
  ],
  "output_path": "{FINAL_OUTPUT_PATH}"
}}

Transcript data:
{json.dumps(transcripts, indent=2)}
"""



    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.3,
            messages=[
                {"role": "system", "content": "You are a video editing AI. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        raw = response.choices[0].message.content
        cleaned = raw.strip().strip("```json").strip("```").strip()

        try:
            plan = json.loads(cleaned)
        except json.JSONDecodeError as e:
            print("❌ JSON Error:", e)
            print("🔍 GPT Output (raw):\n", raw)
            return fail("AI returned invalid JSON — maybe truncated or malformed.")


        plan_path = os.path.join(OUTPUT_DIR, "edit_plan.json")
        with open(plan_path, "w") as f:
            json.dump(plan, f, indent=2)

        print(f"✅ Edit plan created ({len(plan.get('segments', []))} segments)")
        return {"edit_plan": plan}

    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
        print(f"Raw output:\n{raw}")
        return fail("AI returned invalid JSON")
    except Exception as e:
        return fail(f"AI planning failed: {e}")


# ============================================================================
# STEP 4 — EXECUTE EDIT
# ============================================================================

def execute_edit(state: Dict) -> Dict:
    print("✂️ Step 4: Executing edit")

    plan = state.get("edit_plan")
    if not plan or "segments" not in plan:
        return fail("Invalid edit plan")

    try:
        output = splice_videos(
            plan["segments"],
            FINAL_OUTPUT_PATH
        )
        print(f"🎉 Final video created: {output}")
        return {"final_output": output}
    except Exception as e:
        return fail(f"Video edit failed: {e}")

# ============================================================================
# WORKFLOW GRAPH
# ============================================================================

def build_workflow():
    graph = StateGraph(dict)

    graph.add_node("load", load_videos)
    graph.add_node("transcribe", transcribe_step) #includes plan_edit
    graph.add_node("edit", execute_edit)

    graph.set_entry_point("load")
    graph.add_edge("load", "transcribe")
    graph.add_edge("transcribe", "edit") #includes plan_edit
    graph.add_edge("edit", END)

    return graph.compile()

# ============================================================================
# MAIN
# ============================================================================

def run():
    print("🚀 Starting Video Workflow")
    print("=" * 50)

    app = build_workflow()
    result = app.invoke({})

    if result.get("error"):
        print(f"\n❌ Workflow failed: {result['error']}")
        return False

    print("\n🎉 Workflow completed successfully")
    return True

if __name__ == "__main__":
    run()
