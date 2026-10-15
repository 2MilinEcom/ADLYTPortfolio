import cv2
import os

def extract_frame_at_time(video_path, timestamp_sec, output_path):
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video not found at: {video_path}")

    # Load the video
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Calculate the target frame number
    target_frame = int(timestamp_sec * fps)

    # Set the frame position
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

    # Read the frame
    success, frame = cap.read()
    if not success:
        raise ValueError(f"Failed to extract frame at {timestamp_sec}s")

    # Save the frame
    cv2.imwrite(output_path, frame)
    print(f"Saved frame at {timestamp_sec}s to: {output_path}")

    cap.release()
    return output_path


