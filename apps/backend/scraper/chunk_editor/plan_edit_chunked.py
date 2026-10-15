import json
import os
from openai import OpenAI
from chunk_editor.chunk_segments import chunk_segments

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

FINAL_OUTPUT_PATH = "final_output.mp4"


def plan_edit_chunked(transcripts: dict) -> dict:
    print("\U0001f9e0 Chunked planning...")

    all_segments = []
    all_chunks_by_video = {}

    for label, data in transcripts.items():
        if not isinstance(data, dict) or "segments" not in data or "path" not in data:
            print(f"⚠️ Skipping {label}: invalid transcript structure")
            continue

        segments = data["segments"]
        path = data["path"]
        if not segments:
            print(f"⚠️ Skipping {label}: empty segments")
            continue

        chunks = chunk_segments(segments)
        print(f"✅ {label} has {len(segments)} segments → {len(chunks)} chunks")

        for chunk in chunks:
            text = " ".join(s["text"] for s in chunk)
            start = chunk[0]["start"]
            end = chunk[-1]["end"]
            duration = end - start

            all_segments.append({
                "video_path": path,
                "start": start,
                "end": end,
                "duration": duration,
                "role": "body",  # default role
                "text": text
            })

    if not all_segments:
        raise ValueError("No usable segments from transcripts")

    # 🧠 Optional: sort or tag roles based on heuristics
    all_segments.sort(key=lambda x: x["start"])  # or any logic to order

    prompt = f"""
You are a short-form video editor.

Here are approved transcript segments from multiple videos. Your task is to select the BEST 4–6 segments that:

- Include AT LEAST ONE segment from EACH unique video_path
- Total no more than 45 seconds in combined duration
- Have a clear flow: Hook → Body → Ending
- Are emotionally engaging and easy to follow
- Use segments with different energy, tone, or topic to keep it dynamic

Return strictly valid JSON in this format:
{{
  "segments": [
    {{
      "video_path": "...",
      "start": 0.0,
      "end": 5.0,
      "role": "hook",
      "reason": "Engaging opener"
    }}
  ],
  "output_path": "{FINAL_OUTPUT_PATH}"
}}

Here are your segment options:
{json.dumps(all_segments, indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.3,
            messages=[
                {"role": "system", "content": "You are a video editing AI. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        raw = response.choices[0].message.content.strip().strip("```json").strip("```")
        plan = json.loads(raw)

        print(f"✅ Final edit plan has {len(plan['segments'])} segments")
        return plan

    except Exception as e:
        raise ValueError(f"GPT failed to generate plan: {e}")