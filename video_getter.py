#!/usr/bin/env python3
"""
Simple Video Getter - Download videos using direct signed URLs from Supabase dashboard
Usage: python video_getter.py
"""

import os
import json
import requests

def get_videos():
    """Get videos from Supabase using direct signed URLs"""
    
    # Use Downloads folder
    download_dir = os.path.expanduser("~/Downloads/TEST0")
    
    # I keep signed download URLs in my local environment.
    signed_urls = json.loads(os.environ.get("VIDEO_SIGNED_URLS_JSON", "[]"))
    if not isinstance(signed_urls, list) or any(
        not isinstance(url, str) or not url.startswith("https://")
        for url in signed_urls
    ):
        raise ValueError("VIDEO_SIGNED_URLS_JSON must contain a JSON array of HTTPS URLs")

    print(f"🎬 Found {len(signed_urls)} video(s) to download")
    
    downloaded_paths = []
    
    for i, signed_url in enumerate(signed_urls, 1):
        print(f"\n📹 Processing video {i}/{len(signed_urls)}")
        
        # Extract filename from URL
        filename = extract_filename_from_url(signed_url)
        if not filename:
            print(f"❌ Could not extract filename from URL")
            continue
            
        local_path = download_video(filename, signed_url, download_dir)
        if local_path:
            downloaded_paths.append(local_path)
    
    return downloaded_paths

def extract_filename_from_url(signed_url):
    """Extract filename from signed URL"""
    try:
        # Extract the path part before the token
        path_part = signed_url.split('?token=')[0]
        # Get the last part of the path
        filename = path_part.split('/')[-1]
        # URL decode the filename
        import urllib.parse
        filename = urllib.parse.unquote(filename)
        return filename
    except:
        return None

def download_video(filename, signed_url, download_dir):
    """Download a single video using signed URL"""
    
    # Check if file already exists
    local_path = os.path.join(download_dir, filename)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 1000000:  # More than 1MB
        print(f"✅ Already exists: {filename}")
        return local_path
    
    print(f"⬇️  Downloading: {filename}")
    
    try:
        response = requests.get(signed_url, stream=True)
        response.raise_for_status()
        
        total_size = 0
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    total_size += len(chunk)
        
        print(f"✅ Downloaded: {filename} ({total_size} bytes)")
        return local_path
        
    except Exception as e:
        print(f"❌ Error downloading {filename}: {e}")
        return None

def main():
    """Main function"""
    print("🎬 Simple Video Getter")
    print("=" * 50)
    print("💡 To add more videos:")
    print("   1. Go to Supabase dashboard → Storage")
    print("   2. Right-click video → Copy signed URL")
    print("   3. Set VIDEO_SIGNED_URLS_JSON in my local environment")
    print("=" * 50)
    
    videos = get_videos()
    
    if videos:
        print(f"\n✅ Successfully downloaded {len(videos)} video(s):")
        for video in videos:
            print(f"   📹 {video}")
        print(f"\n💡 Use with extract_audio.py:")
        print(f"   from extract_audio import extract_audio")
        print(f"   extract_audio('{videos[0]}')")
    else:
        print("❌ No videos downloaded")

if __name__ == "__main__":
    main() 