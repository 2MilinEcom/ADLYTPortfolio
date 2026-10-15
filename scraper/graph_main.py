# This will be what will be cutting up videos for us

import subprocess
import os
from langgraph.graph import StateGraph, END
from openai import OpenAI
import json
from extract_audio import extract_audio
from splice_videos import splice_videos
from transcribe_videos import transcribe_videos

# Set up OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Input/output paths
INPUT_VIDEO_PATH_0 = "/Users/isaacromero/Downloads/VID_0.mp4"
INPUT_VIDEO_PATH_1 = "/Users/isaacromero/Downloads/VID_4.mp4"
# INPUT_VIDEO_PATH_2 = "/Users/essencia/Desktop/AI TEST BATCH 1/VID_2.mp4"
# INPUT_VIDEO_PATH_3 = "/Users/essencia/Desktop/AI TEST BATCH 1/VID_3.mp4"
# INPUT_VIDEO_PATH_4 = "/Users/essencia/Desktop/AI TEST BATCH 1/VID_4.mp4"
# INPUT_VIDEO_PATH_5 = "/Users/essencia/Desktop/AI TEST BATCH 1/VID_5.mp4"


OUTPUT_PATH = "/Users/isaacromero/Downloads/EDITED.mp4"

video_paths = [INPUT_VIDEO_PATH_0, INPUT_VIDEO_PATH_1]
# Extract audio
video_0 = extract_audio(INPUT_VIDEO_PATH_0, "/Users/isaacromero/Downloads/audio_0.mp3")
video_1 = extract_audio(INPUT_VIDEO_PATH_1, "/Users/isaacromero/Downloads/audio_1.mp3")
# video_2 = extract_audio(INPUT_VIDEO_PATH_2, "/Users/essencia/Desktop/AI TEST BATCH 1/audio_2.mp3")
# video_3 = extract_audio(INPUT_VIDEO_PATH_3, "/Users/essencia/Desktop/AI TEST BATCH 1/audio_3.mp3")
# video_4 = extract_audio(INPUT_VIDEO_PATH_4, "/Users/essencia/Desktop/AI TEST BATCH 1/audio_4.mp3")
# video_5 = extract_audio(INPUT_VIDEO_PATH_5, "/Users/essencian/Desktop/AI TEST BATCH 1/audio_5.mp3")

audios_list = [video_0, video_1]


# MOCKED RESPONSES
# with open("mock_transcripts.txt", "r") as f:
#     transcribed_audios = json.load(f)

transcribed_audios = transcribe_videos(audios_list, video_paths)

# FFmpeg splicer

def plan_video_edit(state):
    input_transcript = state["transcript"]
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
        "video_path": "/Users/isaacromero/Downloads/VID_0.mp4",
        "start": 0,
        "end": 5,
        "role": "hook",
        "reason": "Grabs attention by showing a problem everyone has."
        }},
        {{
        "video_path": "/Users/isaacromero/Downloads/VID_1.mp4",
        "start": 0,
        "end": 8,
        "role": "bridge",
        "reason": "Sets up a smooth transition to the solution."
        }}
    ],
    "output_path": "/Users/isaacromero/Downloads/VID_0.mp4/final_output.mp4"
    }}

    Transcript:
    {input_transcript}
    """
                }
            ],
            temperature=0.3
        )
    plan = json.loads(response.choices[0].message.content or "{}")
    return {"edit_plan": plan}

# Run the splicing tool

def run_splice_tool(state):
    plan = state["edit_plan"]
    segments = plan["segments"]
    output_path = plan["output_path"]
    result = splice_videos(segments, output_path)
    return {"final_output": result}

# Build the graph

graph = StateGraph(dict)
graph.add_node("plan_edit", plan_video_edit)
graph.add_node("splice", run_splice_tool)

graph.set_entry_point("plan_edit")
graph.add_edge("plan_edit", "splice")
graph.add_edge("splice", END)

app = graph.compile()

# Sample run
if __name__ == "__main__":
    transcript = transcribed_audios
    result = app.invoke({"transcript": transcript})
    print("✅ Final stitched video saved to:", result["final_output"])
