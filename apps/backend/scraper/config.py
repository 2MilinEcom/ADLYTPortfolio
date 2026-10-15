import os
from pathlib import Path
from typing import Optional

class Config:
    """Centralized configuration for all file paths and settings."""
    
    def __init__(self):
        # Base directories
        self.project_root = Path(__file__).parent.parent.parent.parent
        self.user_home = Path.home()
        
        # Environment-based configuration
        self.username = os.getenv('USER', 'default_user')
        
        # Default directories (can be overridden by environment variables)
        self.default_download_dir = self.user_home / "Downloads"
        self.default_desktop_dir = self.user_home / "Desktop"
        self.default_output_dir = self.project_root / "outputs"
        
        # Video processing directories
        self.video_download_dir = Path(os.getenv('VIDEO_DOWNLOAD_DIR', str(self.default_download_dir)))
        self.video_output_dir = Path(os.getenv('VIDEO_OUTPUT_DIR', str(self.default_output_dir)))
        self.temp_dir = Path(os.getenv('TEMP_DIR', str(self.project_root / "temp")))
        
        # Test directories
        self.test_input_dir = Path(os.getenv('TEST_INPUT_DIR', str(self.default_desktop_dir / "test_inputs")))
        self.test_output_dir = Path(os.getenv('TEST_OUTPUT_DIR', str(self.default_desktop_dir / "test_outputs")))
        
        # Product comparison directories
        self.vision_test_dir = Path(os.getenv('VISION_TEST_DIR', str(self.default_desktop_dir / "vision_test")))
        
        # Create directories if they don't exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create necessary directories if they don't exist."""
        directories = [
            self.video_download_dir,
            self.video_output_dir,
            self.temp_dir,
            self.test_input_dir,
            self.test_output_dir,
            self.vision_test_dir
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def get_video_path(self, filename: str, directory: Optional[Path] = None) -> Path:
        """Get full path for a video file."""
        base_dir = directory or self.video_download_dir
        return base_dir / filename
    
    def get_output_path(self, filename: str, directory: Optional[Path] = None) -> Path:
        """Get full path for an output file."""
        base_dir = directory or self.video_output_dir
        return base_dir / filename
    
    def get_test_path(self, filename: str, is_input: bool = True) -> Path:
        """Get full path for test files."""
        base_dir = self.test_input_dir if is_input else self.test_output_dir
        return base_dir / filename
    
    def get_temp_path(self, filename: str) -> Path:
        """Get full path for temporary files."""
        return self.temp_dir / filename
    
    def get_vision_test_path(self, filename: str) -> Path:
        """Get full path for vision test files."""
        return self.vision_test_dir / filename

# Global configuration instance
config = Config()

# Convenience functions for backward compatibility
def get_video_path(filename: str, directory: Optional[Path] = None) -> Path:
    return config.get_video_path(filename, directory)

def get_output_path(filename: str, directory: Optional[Path] = None) -> Path:
    return config.get_output_path(filename, directory)

def get_test_path(filename: str, is_input: bool = True) -> Path:
    return config.get_test_path(filename, is_input)

def get_temp_path(filename: str) -> Path:
    return config.get_temp_path(filename)

def get_vision_test_path(filename: str) -> Path:
    return config.get_vision_test_path(filename) 