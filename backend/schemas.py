from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class VideoJobCreate(BaseModel):
    video_url: str

class VideoJobResponse(BaseModel):
    id: str
    video_url: str
    video_id: str
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ClipRequestCreate(BaseModel):
    job_id: str
    query: str

class TimestampSegment(BaseModel):
    start_time: str
    end_time: str
    text: str
    start_seconds: float
    relevance_score: float

class ClipResponse(BaseModel):
    request_id: str
    job_id: str
    query: str
    timestamps: List[TimestampSegment]
    clip_urls: List[str]
    status: str

class AIAnswerResponse(BaseModel):
    answer: str
    relevant_timestamps: List[TimestampSegment]