# Debugger Script - Start from extract_and_compare_frames step
import subprocess
import os
from langgraph.graph import StateGraph, END
from openai import OpenAI
import json
from extract_audio import extract_audio
from splice_videos import splice_videos
from transcribe_videos import transcribe_videos
from frame_extraction import extract_frame_at_time
from product_comparison import compare_images
from config import config, get_test_path, get_output_path

# Set up OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ============================================================================
# CONFIGURATION - MANUAL INPUT
# ============================================================================

# Input: Product image to compare against
PRODUCT_IMAGE_PATH = str(get_test_path("img_0.jpg", is_input=True))

# Output directories
OUTPUT_DIR = str(config.test_output_dir)
FRAMES_DIR = os.path.join(OUTPUT_DIR, "frames")
AUDIO_DIR = os.path.join(OUTPUT_DIR, "audio")
FINAL_OUTPUT_PATH = str(get_output_path("final_edited_video.mp4"))

# MANUAL INPUT: Provide your video paths here
MANUAL_VIDEO_PATHS = [
    str(config.get_video_path("vid_0.mp4")),
    str(config.get_video_path("vid_1.mp4")), 
    str(config.get_video_path("vid_2.mp4")),
]

# Thresholds
SIMILARITY_THRESHOLD = 0.1
FRAME_EXTRACTION_TIME = 2.0

# ============================================================================
# WORKFLOW FUNCTIONS (Starting from extract_and_compare_frames)
# ============================================================================

def extract_and_compare_frames(state):
    """Step 1: Extract frames and compare with product image (using manual video paths)"""
    print("🖼️  Step 1: Extracting frames and comparing with product...")
    
    # Use manual video paths instead of state
    videos = MANUAL_VIDEO_PATHS
    
    if not videos:
        return {"error": "No videos to process", "matching_videos": []}
    
    # Create output directories
    os.makedirs(FRAMES_DIR, exist_ok=True)
    
    matching_videos = []
    
    for i, video_path in enumerate(videos):
        try:
            video_filename = os.path.splitext(os.path.basename(video_path))[0]
            frame_path = os.path.join(FRAMES_DIR, f"frame_{video_filename}_{i}.jpg")
            print(f"📸 Extracting frame at {FRAME_EXTRACTION_TIME}s from: {os.path.basename(video_path)}")
            extract_frame_at_time(video_path, FRAME_EXTRACTION_TIME, frame_path)
            is_match = compare_images(PRODUCT_IMAGE_PATH, frame_path, SIMILARITY_THRESHOLD)
            print(f"Video {i+1} ({os.path.basename(video_path)}): Match = {is_match}")
            if is_match:
                matching_videos.append({
                    "video_path": video_path,
                    "frame_path": frame_path,
                    "similarity_score": "matched"
                })
                print(f"✅ Video {i+1} ({os.path.basename(video_path)}) matches product - continuing to next step")
            else:
                print(f"❌ Video {i+1} ({os.path.basename(video_path)}) doesn't match product - skipping to next video")
        except Exception as e:
            print(f"❌ Error processing video {i+1}: {e}")
            continue
    print(f"✅ Found {len(matching_videos)} matching videos")
    return {"matching_videos": matching_videos, "error": None}

def combine_and_transcribe_videos(state):
    """Step 2: Combine and transcribe matching videos"""
    print("🎤 Step 2: Combining and transcribing videos...")
    
    matching_videos = state.get("matching_videos", [])
    
    if not matching_videos:
        print("❌ No matching videos to transcribe")
        return {"error": "No matching videos to transcribe", "transcribed_data": {}}
    
    print(f"📹 Processing {len(matching_videos)} matching videos")
    
    # Create audio directory
    os.makedirs(AUDIO_DIR, exist_ok=True)
    
    # Extract audio from all matching videos
    audio_paths = []
    video_paths = []
    
    for i, video_info in enumerate(matching_videos):
        video_path = video_info["video_path"]
        audio_path = os.path.join(AUDIO_DIR, f"audio_{i}.mp3")
        
        try:
            print(f"🎵 Extracting audio from video {i+1}: {os.path.basename(video_path)}")
            extract_audio(video_path, audio_path)
            audio_paths.append(audio_path)
            video_paths.append(video_path)
        except Exception as e:
            print(f"❌ Error extracting audio from video {i+1}: {e}")
            continue
    
    if not audio_paths:
        print("❌ No audio extracted from any videos")
        return {"error": "No audio extracted", "transcribed_data": {}}
    
    # Transcribe all audio files
    try:
        transcribed_data = transcribe_videos(audio_paths, video_paths)
        print(f"✅ Transcribed {len(transcribed_data)} videos")
        print(f"📝 Transcription data keys: {list(transcribed_data.keys())}")
        return {"transcribed_data": transcribed_data, "error": None}
    except Exception as e:
        print(f"❌ Transcription failed: {e}")
        return {"error": f"Transcription failed: {e}", "transcribed_data": {}}

def plan_video_edit(state):
    """Step 3: Plan the video edit using AI"""
    print("🧠 Step 3: Planning video edit with AI...")
    
    transcribed_data = state.get("transcribed_data", {})
    if not transcribed_data:
        print("❌ No transcribed data available")
        return {"error": "No transcribed data to plan with", "edit_plan": {}}
    
    print(f"📝 Transcribed data keys: {list(transcribed_data.keys())}")
    
    # Debug: Print the actual transcription data structure
    print("🔍 DEBUG: Transcription data structure:")
    for key, value in transcribed_data.items():
        print(f"   {key}: {type(value)}")
        if isinstance(value, dict):
            print(f"     Keys: {list(value.keys())}")
        elif isinstance(value, list):
            print(f"     Length: {len(value)}")
        print(f"     Sample: {str(value)[:200]}...")
    
    # Get all available video paths from the transcription data
    available_videos = []
    for key, value in transcribed_data.items():
        if isinstance(value, dict) and "video_path" in value:
            available_videos.append(value["video_path"])
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict) and "video_path" in item:
                    available_videos.append(item["video_path"])
    
    print(f"🎬 Available videos from transcription: {available_videos}")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a video editor that selects segments from transcripts to assemble short, high-engaging videos that end with customer sales."
                },
                {
                    "role": "user",
                    "content": f"""
You are given a transcript with timestamped segments from multiple videos. Choose which segments (with timestamps) to use. Provide start, end, and source video for each clip. Do not guess timestamps — only use those provided.

IMPORTANT: You MUST use segments from MULTIPLE different videos to create variety. Do not use only one video.

Available video paths:
{available_videos}

Your job is to:
- Identify and extract sections that best fit the structure:
1. Hook (captures attention in the first 3–10 seconds)
2. Bridge (transitions or features a solution or wow factor)
3. Body (main content, benefits, emotional story, etc.)
4. Call to Action or Ending (what the viewer should do or final punch)

Return the results in JSON like:
{{
"segments": [
    {{
    "video_path": "{available_videos[0] if available_videos else '/path/to/video.mp4'}",
    "start": 0,
    "end": 5,
    "role": "hook",
    "reason": "Grabs attention by showing a problem everyone has."
    }},
    {{
    "video_path": "{available_videos[-1] if len(available_videos) > 1 else available_videos[0] if available_videos else '/path/to/video.mp4'}",
    "start": 0,
    "end": 8,
    "role": "bridge",
    "reason": "Sets up a smooth transition to the solution."
    }},
    {{
    "video_path": "{available_videos[0] if available_videos else '/path/to/video.mp4'}",
    "start": 0,
    "end": 5,
    "role": "end",
    "reason": "Sets up a wrap up of the product benefits."
    }}
],
"output_path": "{FINAL_OUTPUT_PATH}"
}}

Transcript:
{json.dumps(transcribed_data, indent=2)}
"""
                }
            ],
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        if content is None:
            print("❌ AI returned empty response")
            return {"error": "AI returned empty response", "edit_plan": {}}
        
        print(f"🤖 AI Response: {content[:200]}...")
        
        try:
            edit_plan = json.loads(content)
            print(f"✅ AI edit plan created with {len(edit_plan.get('segments', []))} segments")
            
            # Debug: Check what videos are being used in the plan
            used_videos = set()
            for segment in edit_plan.get('segments', []):
                video_path = segment.get('video_path')
                if video_path:
                    used_videos.add(os.path.basename(video_path))
            
            print(f"🎬 Videos used in plan: {list(used_videos)}")
            print(f"📊 Segments per video:")
            for video in used_videos:
                count = sum(1 for seg in edit_plan.get('segments', []) 
                           if os.path.basename(seg.get('video_path', '')) == video)
                print(f"   {video}: {count} segments")
            
            return {"edit_plan": edit_plan, "error": None}
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse AI response as JSON: {e}")
            print(f"Raw content: {content}")
            return {"error": f"AI response not valid JSON: {e}", "edit_plan": {}}
        
    except Exception as e:
        print(f"❌ AI planning failed: {e}")
        return {"error": f"AI planning failed: {e}", "edit_plan": {}}

def execute_video_edit(state):
    """Step 4: Execute the video edit"""
    print("✂️  Step 4: Executing video edit...")
    
    edit_plan = state.get("edit_plan", {})
    print(f"📋 Edit plan keys: {list(edit_plan.keys()) if edit_plan else 'None'}")
    
    if not edit_plan:
        print("❌ No edit plan in state")
        return {"error": "No edit plan to execute", "final_output": None}
    
    if "segments" not in edit_plan:
        print(f"❌ Edit plan missing 'segments' key. Available keys: {list(edit_plan.keys())}")
        return {"error": "Edit plan missing segments", "final_output": None}
    
    try:
        segments = edit_plan["segments"]
        output_path = edit_plan.get("output_path", FINAL_OUTPUT_PATH)
        
        print(f"🎬 Processing {len(segments)} segments")
        print(f"📁 Output path: {output_path}")
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        result = splice_videos(segments, output_path)
        print(f"✅ Final video created: {result}")
        return {"final_output": result, "error": None}
        
    except Exception as e:
        print(f"❌ Video editing failed: {e}")
        return {"error": f"Video editing failed: {e}", "final_output": None}

# ============================================================================
# BUILD THE WORKFLOW GRAPH
# ============================================================================

def create_debug_workflow():
    """Create the debug workflow graph (starting from extract_and_compare_frames)"""
    
    # Define the state structure
    workflow = StateGraph(dict)
    
    # Add nodes for each step
    workflow.add_node("extract_compare", extract_and_compare_frames)
    workflow.add_node("combine_transcribe", combine_and_transcribe_videos)
    workflow.add_node("plan_edit", plan_video_edit)
    workflow.add_node("execute_edit", execute_video_edit)
    
    # Set entry point
    workflow.set_entry_point("extract_compare")
    
    # Define the flow
    workflow.add_edge("extract_compare", "combine_transcribe")
    workflow.add_edge("combine_transcribe", "plan_edit")
    workflow.add_edge("plan_edit", "execute_edit")
    workflow.add_edge("execute_edit", END)
    
    return workflow.compile()

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def run_debug_workflow():
    """Run the debug workflow starting from extract_and_compare_frames"""
    print("🔧 Starting Debug Workflow (from extract_and_compare_frames)")
    print("=" * 60)
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"🖼️  Product image: {PRODUCT_IMAGE_PATH}")
    print(f"🎯 Similarity threshold: {SIMILARITY_THRESHOLD}")
    print(f"⏰ Frame extraction time: {FRAME_EXTRACTION_TIME}s")
    print(f"📹 Manual video paths: {len(MANUAL_VIDEO_PATHS)} videos")
    for i, path in enumerate(MANUAL_VIDEO_PATHS):
        print(f"   {i+1}. {os.path.basename(path)}")
    print("=" * 60)
    
    # Validate inputs
    if not os.path.exists(PRODUCT_IMAGE_PATH):
        print(f"❌ Product image not found at: {PRODUCT_IMAGE_PATH}")
        return False
    
    existing_videos = []
    for path in MANUAL_VIDEO_PATHS:
        if os.path.exists(path):
            existing_videos.append(path)
        else:
            print(f"❌ Video not found: {path}")
    
    if not existing_videos:
        print("❌ No video files found!")
        return False
    
    print(f"✅ Found {len(existing_videos)} existing videos")
    
    # Create the workflow
    app = create_debug_workflow()
    
    # Run the workflow
    try:
        result = app.invoke({})
        
        if result.get("error"):
            print(f"❌ Workflow failed: {result['error']}")
            return False
        
        if result.get("final_output"):
            print(f"🎉 SUCCESS! Final video saved to: {result['final_output']}")
            return True
        else:
            print("❌ No final output produced")
            return False
            
    except Exception as e:
        print(f"❌ Workflow execution failed: {e}")
        return False

if __name__ == "__main__":
    # Run the debug workflow
    success = run_debug_workflow()
    
    if success:
        print("\n🎉 Debug workflow completed successfully!")
    else:
        print("\n❌ Debug workflow failed!")
