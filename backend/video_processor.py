import subprocess
import json
from pathlib import Path
from typing import List, Dict
import os
from .models import TimestampedChunk  # You'll need to adapt your existing classes

class VideoProcessor:
    def __init__(self, storage_path: str = "./storage"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(exist_ok=True)
        
        self.videos_path = self.storage_path / "videos"
        self.clips_path = self.storage_path / "clips"
        self.videos_path.mkdir(exist_ok=True)
        self.clips_path.mkdir(exist_ok=True)
    
    def download_video(self, video_id: str, video_url: str) -> Dict:
        """Download full video for clipping"""
        output_path = self.videos_path / f"{video_id}.mp4"
        
        cmd = [
            "yt-dlp",
            "-f", "best[height<=720]",
            "-o", str(output_path),
            video_url
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Get video duration
            duration_cmd = [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(output_path)
            ]
            
            duration_result = subprocess.run(duration_cmd, capture_output=True, text=True, check=True)
            duration = float(duration_result.stdout.strip())
            
            return {
                "success": True,
                "video_path": str(output_path),
                "duration": duration
            }
            
        except subprocess.CalledProcessError as e:
            return {
                "success": False,
                "error": f"Download failed: {e.stderr}"
            }
    
    def create_clip(self, video_path: str, start_time: str, end_time: str, clip_id: str) -> str:
        """Create clip from video using ffmpeg"""
        start_seconds = self.timestamp_to_seconds(start_time)
        end_seconds = self.timestamp_to_seconds(end_time)
        
        # Add some padding
        padding = 2
        start_seconds = max(0, start_seconds - padding)
        end_seconds = end_seconds + padding
        
        output_path = self.clips_path / f"{clip_id}.mp4"
        
        cmd = [
            "ffmpeg", "-y",  # -y to overwrite output file
            "-ss", str(start_seconds),
            "-to", str(end_seconds),
            "-i", video_path,
            "-c", "copy",  # Copy without re-encoding for speed
            "-avoid_negative_ts", "make_zero",
            str(output_path)
        ]
        
        try:
            subprocess.run(cmd, capture_output=True, check=True)
            return str(output_path)
        except subprocess.CalledProcessError as e:
            raise Exception(f"Clip creation failed: {e.stderr}")
    
    def timestamp_to_seconds(self, timestamp: str) -> float:
        """Convert MM:SS or HH:MM:SS to seconds"""
        parts = timestamp.split(':')
        if len(parts) == 3:
            h, m, s = parts
            return int(h) * 3600 + int(m) * 60 + float(s)
        elif len(parts) == 2:
            m, s = parts
            return int(m) * 60 + float(s)
        return 0.0
    
    def generate_clip_url(self, clip_path: str) -> str:
        """Generate URL for accessing the clip"""
        clip_filename = Path(clip_path).name
        return f"/clips/{clip_filename}"