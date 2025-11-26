from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class VideoJob(Base):
    __tablename__ = "video_jobs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    video_url = Column(String, nullable=False)
    video_id = Column(String, nullable=False, index=True)
    status = Column(String, default="processing")  # processing, completed, error
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Store processed data
    chunks_data = Column(JSON)  # Store timestamped chunks
    embeddings_data = Column(JSON)  # Store embeddings
    
    # Video download info
    video_file_path = Column(String)
    duration = Column(Float)

class ClipRequest(Base):
    __tablename__ = "clip_requests"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, nullable=False, index=True)
    query = Column(Text, nullable=False)
    timestamps = Column(JSON)  # Store identified timestamps
    clips_generated = Column(JSON)  # Store generated clip paths
    status = Column(String, default="processing")  # processing, completed, error
    created_at = Column(DateTime, default=func.now())