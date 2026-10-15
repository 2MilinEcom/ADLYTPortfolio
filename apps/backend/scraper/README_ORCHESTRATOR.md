# Video Processing Orchestrator

This orchestrator combines all your video processing steps into one automated workflow:

1. **Download videos** from Supabase storage
2. **Extract frames** at a specific time
3. **Compare frames** with a product image (True/False)
4. **Scrape TikTok videos** for additional content
5. **Combine and transcribe** all videos (original + TikTok)
6. **AI plan** the video edit
7. **Execute** the final video edit

## 🚀 Quick Start

### 1. Configure Paths

Edit `graph_main.py` and update these paths:

```python
# Input: Product image to compare against
PRODUCT_IMAGE_PATH = "/Users/essencia/Desktop/product_image.jpg"  # FILL THIS IN

# Output directories
OUTPUT_DIR = "/Users/essencia/Desktop/processed_videos"  # FILL THIS IN

# TikTok configuration
TIKTOK_SEARCH_TERM = "strapless bra"  # What to search for
MANUAL_TIKTOK_VIDEOS = [
    "/Users/essencia/Downloads/TEST0/tiktok_video_1.mp4",  # FILL THESE IN
    "/Users/essencia/Downloads/TEST0/tiktok_video_2.mp4",  # FILL THESE IN
    "/Users/essencia/Downloads/TEST0/tiktok_video_3.mp4",  # FILL THESE IN
]
```

### 2. Set Thresholds

```python
SIMILARITY_THRESHOLD = 0.5  # True if similarity >= 0.5, False otherwise
FRAME_EXTRACTION_TIME = 2.0  # Extract frame at this many seconds
```

### 3. Run the Workflow

```bash
cd apps/backend/scraper
python graph_main.py
```

## 📋 What You Need

1. **Product Image**: A clear image of the product you want to match
2. **Supabase Videos**: Videos uploaded to your `temp-videos` bucket
3. **TikTok Videos**: Either manually downloaded or scraped videos
4. **Environment Variables**: 
   - `OPENAI_API_KEY` for transcription and AI planning
   - Supabase credentials in `video_getter.py`

## 🔄 Workflow Steps

### Step 1: Download Videos
- Uses `video_getter.py` to download videos from Supabase
- Downloads to `~/Downloads/TEST0` by default

### Step 2: Extract & Compare Frames
- Extracts a frame from each video at `FRAME_EXTRACTION_TIME` seconds
- Compares frame with your product image using AI vision
- **Returns True/False**: Only videos with `True` continue to next step
- **Stops processing** videos that return `False`

### Step 3: Scrape TikTok Videos
- Searches TikTok for additional content using `TIKTOK_SEARCH_TERM`
- Downloads up to `TIKTOK_VIDEO_LIMIT` videos
- **Manual option**: Add video paths to `MANUAL_TIKTOK_VIDEOS` list

### Step 4: Combine and Transcribe
- Combines original matching videos + TikTok videos
- Extracts audio from all videos
- Transcribes audio using OpenAI Whisper
- Creates timestamped segments for all content

### Step 5: AI Video Planning
- Uses GPT-4 to analyze all transcripts
- Plans video segments (hook, bridge, body, call-to-action)
- Creates edit plan with timestamps from both sources

### Step 6: Execute Video Edit
- Uses FFmpeg to splice video segments
- Creates final edited video from all sources

## 📁 Output Structure

```
processed_videos/
├── frames/           # Extracted frames from original videos
├── audio/           # Extracted audio files (original + TikTok)
│   ├── audio_original_0.mp3
│   ├── audio_tiktok_0.mp3
│   └── ...
└── final_edited_video.mp4  # Final result
```

## ⚙️ TikTok Configuration

### Manual Video Paths (Recommended)
Add downloaded TikTok video paths to `MANUAL_TIKTOK_VIDEOS`:
```python
MANUAL_TIKTOK_VIDEOS = [
    "/Users/essencia/Downloads/TEST0/tiktok_video_1.mp4",
    "/Users/essencia/Downloads/TEST0/tiktok_video_2.mp4",
    "/Users/essencia/Downloads/TEST0/tiktok_video_3.mp4",
]
```

### Automatic Scraping (Future)
- Set `TIKTOK_SEARCH_TERM` to your search query
- Set `TIKTOK_VIDEO_LIMIT` to number of videos to download
- Requires manual browser interaction for now

## 🎯 Example Usage

```python
# Example configuration
PRODUCT_IMAGE_PATH = "/Users/essencia/Desktop/bra_product.jpg"
OUTPUT_DIR = "/Users/essencia/Desktop/bra_ads"
TIKTOK_SEARCH_TERM = "strapless bra"
MANUAL_TIKTOK_VIDEOS = [
    "/Users/essencia/Downloads/TEST0/bra_tiktok_1.mp4",
    "/Users/essencia/Downloads/TEST0/bra_tiktok_2.mp4",
    "/Users/essencia/Downloads/TEST0/bra_tiktok_3.mp4",
]
SIMILARITY_THRESHOLD = 0.5
FRAME_EXTRACTION_TIME = 2.0
```

This will:
1. Download videos from Supabase
2. Extract frames at 2 seconds
3. Compare with bra product image
4. **Only continue** with videos that return `True` (≥50% similarity)
5. Add 3 TikTok videos to the mix
6. Transcribe all videos (original + TikTok)
7. Create final bra advertisement video from all sources

## 🔍 Boolean Logic

The product comparison now uses simple True/False logic:
- **True**: Video matches product (similarity ≥ threshold) → Continue processing
- **False**: Video doesn't match product (similarity < threshold) → Skip to next video

This makes the workflow more efficient by only processing relevant videos!

## 📱 TikTok Integration

The workflow now combines:
- **Original videos**: From Supabase (product-matched)
- **TikTok videos**: Additional content for variety
- **Final result**: Stitched video using best segments from all sources 