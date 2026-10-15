import subprocess
import os
from config import get_temp_path

def splice_videos(segments: list[dict], output_path: str):
    temp_files = []

    for i, seg in enumerate(segments):
        start = round(seg["start"], 3)
        end = round(seg["end"], 3)
        duration = round(end - start, 3)
        video_path = seg["video_path"]
        temp_output = str(get_temp_path(f"temp_clip_{i}.mp4"))

        # Trim each segment with safe sync flags
        subprocess.run([
            "ffmpeg", "-y",
            "-fflags", "+genpts",
            "-i", video_path,
            "-ss", str(start),
            "-t", str(duration),
            "-avoid_negative_ts", "make_zero",
            "-c:v", "libx264",
            "-preset", "medium",
            "-r", "30",
            "-c:a", "aac",
            "-movflags", "+faststart",
            temp_output
        ], check=True)

        temp_files.append(temp_output)

    # Write concat list
    concat_list_path = "concat_list.txt"
    with open(concat_list_path, "w") as f:
        for clip in temp_files:
            f.write(f"file '{clip}'\n")

    # Run concat step with re-encoding and optional frame sync
    result = subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-fflags", "+genpts",
        "-avoid_negative_ts", "make_zero",
        "-c:v", "libx264",
        "-preset", "fast",
        "-r", "30",
        "-vsync", "cfr",  # Optional: try without this if issues
        "-c:a", "aac",
        "-movflags", "+faststart",
        output_path
    ], capture_output=True, text=True)

    print("STDOUT:\n", result.stdout)
    print("STDERR:\n", result.stderr)

    if result.returncode != 0:
        raise RuntimeError("❌ ffmpeg concat step failed")

    for f in temp_files:
        os.remove(f)
    os.remove(concat_list_path)

    print(f"🎉 Final video created at: {output_path}")
    return output_path
