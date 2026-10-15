#!/usr/bin/env python3
"""
Migration script to replace hardcoded paths with the new configuration system.
This script will help you identify and replace hardcoded paths in your codebase.
"""

import os
import re
import shutil
from pathlib import Path
from config import config

def find_hardcoded_paths(directory="."):
    """Find all files with hardcoded paths."""
    hardcoded_files = []
    
    # Common hardcoded path patterns
    patterns = [
        r'/Users/[^/]+/Desktop/',
        r'/Users/[^/]+/Downloads/',
        r'/Users/[^/]+/Documents/',
        r'~/Desktop/',
        r'~/Downloads/',
        r'~/Documents/'
    ]
    
    for root, dirs, files in os.walk(directory):
        # Skip certain directories
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', 'selenium']]
        
        for file in files:
            if file.endswith(('.py', '.md', '.txt', '.json')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    for pattern in patterns:
                        if re.search(pattern, content):
                            hardcoded_files.append((file_path, pattern))
                            break
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return hardcoded_files

def suggest_replacements(file_path, pattern):
    """Suggest replacements for hardcoded paths."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    suggestions = []
    
    # Find all matches
    matches = re.finditer(pattern, content)
    for match in matches:
        full_path = match.group(0)
        
        # Suggest replacement based on path content
        if 'Desktop' in full_path:
            if 'test' in full_path.lower():
                suggestion = "config.test_output_dir"
            elif 'vision' in full_path.lower():
                suggestion = "config.vision_test_dir"
            else:
                suggestion = "config.default_desktop_dir"
        elif 'Downloads' in full_path:
            suggestion = "config.video_download_dir"
        else:
            suggestion = "config.default_output_dir"
        
        suggestions.append({
            'original': full_path,
            'suggestion': suggestion,
            'line': content[:match.start()].count('\n') + 1
        })
    
    return suggestions

def create_migration_report():
    """Create a detailed migration report."""
    print("🔍 Scanning for hardcoded paths...")
    hardcoded_files = find_hardcoded_paths()
    
    if not hardcoded_files:
        print("✅ No hardcoded paths found!")
        return
    
    print(f"\n📋 Found {len(hardcoded_files)} files with hardcoded paths:")
    print("=" * 80)
    
    for file_path, pattern in hardcoded_files:
        print(f"\n📁 File: {file_path}")
        print(f"🔍 Pattern: {pattern}")
        
        suggestions = suggest_replacements(file_path, pattern)
        for suggestion in suggestions:
            print(f"   Line {suggestion['line']}: {suggestion['original']}")
            print(f"   → Replace with: {suggestion['suggestion']}")
    
    print("\n" + "=" * 80)
    print("💡 Migration Instructions:")
    print("1. Copy env_template.txt to .env and customize paths")
    print("2. Replace hardcoded paths with config functions")
    print("3. Test your scripts to ensure they work correctly")
    print("4. Remove the old hardcoded paths")

def create_env_file():
    """Create a .env file from the template."""
    template_path = "env_template.txt"
    env_path = ".env"
    
    if os.path.exists(env_path):
        print(f"⚠️  {env_path} already exists. Skipping creation.")
        return
    
    if os.path.exists(template_path):
        shutil.copy(template_path, env_path)
        print(f"✅ Created {env_path} from template")
        print("📝 Please edit .env with your specific paths")
    else:
        print(f"❌ Template file {template_path} not found")

if __name__ == "__main__":
    print("🚀 Path Migration Tool")
    print("=" * 50)
    
    # Create .env file
    create_env_file()
    
    # Generate migration report
    create_migration_report()
    
    print("\n🎯 Next Steps:")
    print("1. Review the migration report above")
    print("2. Edit .env file with your specific paths")
    print("3. Update your Python files to use the config system")
    print("4. Test your scripts")
    print("5. Remove hardcoded paths once everything works") 