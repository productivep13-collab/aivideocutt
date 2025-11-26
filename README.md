<h1>🎬 AI Video Clipper</h1>

<p><strong>Intelligent YouTube video clipping powered by AI.</strong> Extract precise clips from any video using natural language commands based on transcript analysis.</p>

<h2>✨ Features</h2>
<ul>
    <li>🎯 <strong>Smart Video Clipping</strong> - Extract precise clips using AI transcript analysis</li>
    <li>📝 <strong>YouTube URL Support</strong> - Process any YouTube video by pasting the URL</li>
    <li>🤖 <strong>Natural Language Processing</strong> - Describe what you want to clip in plain English</li>
    <li>🔧 <strong>Multi-Clip Compilation</strong> - Create compilations from multiple segments</li>
    <li>⚡ <strong>Fast Processing</strong> - Quick transcript extraction and AI analysis</li>
</ul>

<h2>🚀 Quick Start</h2>

<h3>Prerequisites</h3>
<ul>
    <li>Python 3.8+</li>
    <li>FFmpeg installed</li>
    <li>Groq API key</li>
</ul>

<h3>Installation</h3>
<pre><code># Clone the repository
git clone https://github.com/productivep13-collab/aivideocutt.git
cd aivideocutt

# Install dependencies
pip install -r requirements.txt

# Run the application
python backend/main.py
</code></pre>

<h3>Environment Setup</h3>
<pre><code># Create .env file
GROQ_API_KEY=your_groq_api_key_here
</code></pre>

<h2>💡 How It Works</h2>

<ol>
    <li><strong>Input YouTube URL</strong> - Paste any YouTube video link</li>
    <li><strong>AI Transcript Analysis</strong> - System extracts and analyzes video transcript</li>
    <li><strong>Describe Your Clip</strong> - Tell AI what segments you want using natural language</li>
    <li><strong>Get Precise Clips</strong> - AI identifies timestamps and generates clips</li>
</ol>

<h2>🎯 Usage Examples</h2>

<h3>Basic Usage</h3>
<pre><code>Input: https://www.youtube.com/watch?v=example123

AI Commands:
• "Clip the introduction section"
• "Extract all tutorial segments"
• "Get funny moments from the video"
• "Create compilation of key points"
</code></pre>

<h3>API Endpoints</h3>
<pre><code>POST /api/analyze-video
{
    "youtube_url": "https://youtube.com/watch?v=...",
    "clip_description": "extract tutorial sections"
}

POST /api/generate-clips
{
    "video_id": "abc123",
    "clip_timestamps": ["00:10-00:30", "01:15-02:00"]
}
</code></pre>

<h2>🛠️ Technology Stack</h2>

<ul>
    <li><strong>Backend:</strong> Python, FastAPI</li>
    <li><strong>AI:</strong> Groq API for natural language processing</li>
    <li><strong>Video Processing:</strong> FFmpeg, YouTube Transcript API</li>
    <li><strong>Database:</strong> SQLite</li>
    <li><strong>Frontend:</strong> React (if applicable)</li>
</ul>

<h2>📁 Project Structure</h2>

<pre><code>aivideocutt/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── video_processor.py   # Video clipping logic
│   ├── yt.py               # YouTube transcript extraction
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   └── database.py         # Database configuration
├── requirements.txt
└── README.md
</code></pre>

<h2>🔧 Configuration</h2>

<h3>Environment Variables</h3>
<pre><code>GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=optional_youtube_key
DATABASE_URL=postgresDB
</code></pre>



