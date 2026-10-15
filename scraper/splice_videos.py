import subprocess
import os

def splice_videos(segments: list[dict], output_path: str):
    temp_files = []
    valid_segments = []
    
    # Get the output directory for placing the concat list
    output_dir = os.path.dirname(output_path)
    concat_list_path = os.path.join(output_dir, "concat_list.txt")
    
    # Validate segments and filter out invalid ones
    for i, seg in enumerate(segments):
        video_path = seg["video_path"]
        if not os.path.exists(video_path):
            print(f"⚠️  Skipping segment {i}: Video file not found - {video_path}")
            continue
        valid_segments.append(seg)
    
    if not valid_segments:
        raise ValueError("No valid video segments found! All referenced video files are missing.")
    
    print(f"✅ Processing {len(valid_segments)} valid segments out of {len(segments)} total")
    
    for i, seg in enumerate(valid_segments):
        start = seg["start"]
        end = seg["end"]
        duration = end - start
        video_path = seg["video_path"]
        temp_output = f"/Users/isaacromero/Downloads/temp_clip_{i}.mp4"

        print(f"📹 Creating clip {i+1}/{len(valid_segments)}: {os.path.basename(video_path)} ({start}s-{end}s)")
        
        subprocess.run([
            "ffmpeg", "-y",
            "-ss", str(start),
            "-i", video_path,
            "-t", str(duration),
            "-c:v", "libx264", "-c:a", "aac",
            temp_output
        ])

        temp_files.append(temp_output)

    # Create concat list in the same directory as output
    with open(concat_list_path, "w") as f:
        for clip in temp_files:
            f.write(f"file '{clip}'\n")

    print(f"🎬 Concatenating {len(temp_files)} clips into final video...")
    print(f"📄 Using concat list: {concat_list_path}")
    
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-c", "copy",
        output_path
    ])

    # Clean up temp files, but handle missing files gracefully
    for f in temp_files:
        try:
            if os.path.exists(f):
                os.remove(f)
        except OSError as e:
            print(f"⚠️  Could not remove temp file {f}: {e}")
    
    try:
        if os.path.exists(concat_list_path):
            os.remove(concat_list_path)
    except OSError as e:
        print(f"⚠️  Could not remove concat_list.txt: {e}")

    return output_path