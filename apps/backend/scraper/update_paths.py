#!/usr/bin/env python3
"""
Quick script to update hardcoded paths in your files.
This script will replace common hardcoded paths with the new configuration system.
"""

import os
import re
from pathlib import Path

def update_file_paths(file_path):
    """Update hardcoded paths in a single file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Common replacements
    replacements = [
        # Desktop paths
        (r'/Users/[^/]+/Desktop/test_outputs', 'str(config.test_output_dir)'),
        (r'/Users/[^/]+/Desktop/test_inputs', 'str(config.test_input_dir)'),
        (r'/Users/[^/]+/Desktop/vision_test', 'str(config.vision_test_dir)'),
        (r'/Users/[^/]+/Desktop/MAX_TEST', 'str(config.test_output_dir)'),
        (r'/Users/[^/]+/Desktop/TEST_RUN', 'str(config.test_output_dir)'),
        (r'/Users/[^/]+/Desktop/AI TEST BATCH 0', 'str(config.test_output_dir)'),
        
        # Downloads paths
        (r'/Users/[^/]+/Downloads/TEST0', 'str(config.video_download_dir)'),
        (r'/Users/[^/]+/Downloads', 'str(config.video_download_dir)'),
        
        # Generic Desktop paths (fallback)
        (r'/Users/[^/]+/Desktop/', 'str(config.default_desktop_dir) + "/"'),
    ]
    
    # Apply replacements
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    # Add import if needed
    if 'config.test_output_dir' in content and 'from config import' not in content:
        # Find the best place to add the import
        lines = content.split('\n')
        import_added = False
        
        for i, line in enumerate(lines):
            if line.startswith('import ') or line.startswith('from '):
                # Add after existing imports
                lines.insert(i + 1, 'from config import config')
                import_added = True
                break
        
        if not import_added:
            # Add at the beginning if no imports found
            lines.insert(0, 'from config import config')
        
        content = '\n'.join(lines)
    
    # Write back if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Update paths in all relevant files."""
    files_to_update = [
        'video_getter.py',
        'debugger.py', 
        'splice_videos.py',
        '_test_image_comparison.py'
    ]
    
    print("🔄 Updating hardcoded paths...")
    
    for file_name in files_to_update:
        if os.path.exists(file_name):
            print(f"📝 Updating {file_name}...")
            if update_file_paths(file_name):
                print(f"✅ Updated {file_name}")
            else:
                print(f"ℹ️  No changes needed in {file_name}")
        else:
            print(f"⚠️  File {file_name} not found")
    
    print("\n🎯 Next steps:")
    print("1. Review the changes made")
    print("2. Test your scripts to ensure they work")
    print("3. Update any remaining hardcoded paths manually")
    print("4. Remove old hardcoded paths once everything works")

if __name__ == "__main__":
    main() 