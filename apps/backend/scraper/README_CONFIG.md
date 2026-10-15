# 🧹 Path Configuration System

This document explains how to use the new centralized configuration system to replace hardcoded paths in your codebase.

## 🎯 Problem Solved

**Before**: Hardcoded paths scattered throughout your code:
```python
# ❌ Hardcoded paths everywhere
img1 = "/Users/essencia/Desktop/vision_test/img_0.jpg"
OUTPUT_DIR = "/Users/isaacromero/Desktop/test_outputs"
download_dir = "/Users/essencia/Downloads/TEST0"
```

**After**: Centralized configuration system:
```python
# ✅ Clean, portable configuration
from config import get_vision_test_path, config
img1 = str(get_vision_test_path("img_0.jpg"))
OUTPUT_DIR = str(config.test_output_dir)
download_dir = str(config.video_download_dir)
```

## 🚀 Quick Start

### 1. Set up your environment

Copy the template and customize it:
```bash
cp env_template.txt .env
```

Edit `.env` with your specific paths:
```bash
# Video Processing Configuration
VIDEO_DOWNLOAD_DIR=~/Downloads
VIDEO_OUTPUT_DIR=./outputs
TEMP_DIR=./temp
TEST_INPUT_DIR=~/Desktop/test_inputs
TEST_OUTPUT_DIR=~/Desktop/test_outputs
VISION_TEST_DIR=~/Desktop/vision_test
```

### 2. Use the configuration in your code

```python
from config import config, get_test_path, get_output_path

# Get paths dynamically
product_image = str(get_test_path("product_reference.jpeg", is_input=True))
output_video = str(get_output_path("final_edited_video.mp4"))
temp_file = str(config.get_temp_path("temp_clip.mp4"))
```

## 📁 Directory Structure

The configuration system automatically creates these directories:

```
project_root/
├── outputs/           # Video outputs
├── temp/             # Temporary files
└── config.py         # Configuration system

user_home/
├── Desktop/
│   ├── test_inputs/  # Test input files
│   ├── test_outputs/ # Test output files
│   └── vision_test/  # Image comparison tests
└── Downloads/        # Downloaded videos
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VIDEO_DOWNLOAD_DIR` | `~/Downloads` | Where TikTok videos are downloaded |
| `VIDEO_OUTPUT_DIR` | `./outputs` | Where processed videos are saved |
| `TEMP_DIR` | `./temp` | Temporary files directory |
| `TEST_INPUT_DIR` | `~/Desktop/test_inputs` | Test input files |
| `TEST_OUTPUT_DIR` | `~/Desktop/test_outputs` | Test output files |
| `VISION_TEST_DIR` | `~/Desktop/vision_test` | Image comparison tests |

### Configuration Functions

```python
from config import config

# Get specific paths
config.video_download_dir      # Video download directory
config.video_output_dir        # Video output directory
config.temp_dir               # Temporary files
config.test_input_dir         # Test inputs
config.test_output_dir        # Test outputs
config.vision_test_dir        # Vision tests

# Helper functions
get_video_path("video.mp4")           # Full path to video file
get_output_path("output.mp4")         # Full path to output file
get_test_path("test.jpg", True)       # Full path to test input
get_test_path("result.mp4", False)    # Full path to test output
get_temp_path("temp.mp4")             # Full path to temp file
get_vision_test_path("img.jpg")       # Full path to vision test file
```

## 🔄 Migration Guide

### Step 1: Run the migration script

```bash
python3 migrate_paths.py
```

This will:
- Create a `.env` file from template
- Scan for hardcoded paths
- Generate a migration report

### Step 2: Update your files

Replace hardcoded paths with configuration functions:

**Before:**
```python
PRODUCT_IMAGE_PATH = "/Users/essencia/Desktop/MAX_TEST/headphones.jpg"
OUTPUT_DIR = "/Users/isaacromero/Desktop/test_outputs"
```

**After:**
```python
from config import get_test_path, config
PRODUCT_IMAGE_PATH = str(get_test_path("headphones.jpg", is_input=True))
OUTPUT_DIR = str(config.test_output_dir)
```

### Step 3: Test your changes

```bash
# Test the configuration system
python3 -c "from config import config; print('Config loaded successfully')"

# Test your updated scripts
python3 product_comparison.py
```

## 📋 Files to Update

Based on the migration scan, update these files:

1. **`video_getter.py`** - Line 14
2. **`debugger.py`** - Lines 21, 24
3. **`splice_videos.py`** - Line 11
4. **`_test_image_comparison.py`** - Lines 10, 11, 35, 36
5. **`README_ORCHESTRATOR.md`** - Lines 21, 24, 123, 124

## 🎯 Benefits

✅ **Portable**: Works on any machine without path changes  
✅ **Configurable**: Easy to change paths via environment variables  
✅ **Organized**: All paths in one place  
✅ **Safe**: Automatic directory creation  
✅ **Flexible**: Override defaults per environment  

## 🚨 Important Notes

1. **Environment Variables**: Set them before running your scripts
2. **Directory Creation**: The system automatically creates missing directories
3. **Backward Compatibility**: Old hardcoded paths will still work until you remove them
4. **Testing**: Always test after making changes

## 🔍 Troubleshooting

### Path not found errors
```bash
# Check if directories exist
ls -la ~/Desktop/test_inputs
ls -la ~/Desktop/test_outputs

# Create missing directories manually if needed
mkdir -p ~/Desktop/test_inputs
mkdir -p ~/Desktop/test_outputs
```

### Configuration not loading
```python
# Test configuration loading
python3 -c "from config import config; print(config.test_output_dir)"
```

### Environment variables not working
```bash
# Check if .env file is loaded
python3 -c "import os; print(os.getenv('TEST_OUTPUT_DIR'))"
```

## 📚 Examples

### Complete example with configuration

```python
from config import config, get_test_path, get_output_path

# Configuration
PRODUCT_IMAGE_PATH = str(get_test_path("product_reference.jpeg", is_input=True))
OUTPUT_DIR = str(config.test_output_dir)
FRAMES_DIR = str(config.test_output_dir / "frames")
AUDIO_DIR = str(config.test_output_dir / "audio")
FINAL_OUTPUT_PATH = str(get_output_path("final_edited_video.mp4"))

# Video processing
TIKTOK_DOWNLOAD_DIR = str(config.video_download_dir)
TEMP_DIR = str(config.temp_dir)

print(f"Product image: {PRODUCT_IMAGE_PATH}")
print(f"Output directory: {OUTPUT_DIR}")
print(f"Download directory: {TIKTOK_DOWNLOAD_DIR}")
```

This system makes your code much cleaner and more maintainable! 🎉 