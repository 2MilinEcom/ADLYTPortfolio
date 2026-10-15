import cv2
from product_comparison import compare_images
from frame_extraction import extract_frame_at_time

def compare_two_videos_by_middle_frames(video_1, video_2):
    # Extract middle frames from both videos
    vid_1_time = _get_video_duration(video_1) / 2
    vid_2_time = _get_video_duration(video_2) / 2

    frame1 = extract_frame_at_time(video_1, vid_1_time, output_path="/Users/essencia/Desktop/AI TEST BATCH 0/frame1.jpg")
    frame2 = extract_frame_at_time(video_2, vid_2_time, output_path="/Users/essencia/Desktop/AI TEST BATCH 0/frame2.jpg")

    # Compare the extracted frames
    return frame1, frame2

def _get_video_duration(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise FileNotFoundError(f"Could not open video at {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    duration = total_frames / fps
    cap.release()
    return duration




if __name__ == "__main__":
    import sys
    import os
    video_path1 = "/Users/essencia/Desktop/AI TEST BATCH 0/vid_0.mp4"
    video_path2 = "/Users/essencia/Desktop/AI TEST BATCH 0/vid_2.mp4"
    img1, img2 = compare_two_videos_by_middle_frames(video_path1, video_path2)


    if not os.path.exists(img1) or not os.path.exists(img2):
        print("One or both image paths are invalid.")
        sys.exit(1)

    print(compare_images(img1, img2))