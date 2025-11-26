<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin: 20px 0;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        h2 {
            color: #34495e;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #3498db;
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
        }
        .tech-tag {
            background: #e74c3c;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
        }
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background: #2980b9;
        }
        .demo-section {
            text-align: center;
            margin: 30px 0;
        }
        .workflow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .step {
            text-align: center;
            flex: 1;
            min-width: 200px;
            margin: 10px;
        }
        .step-number {
            background: #3498db;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 AI Video Clipper</h1>
        <p style="text-align: center; font-size: 1.2em; color: #7f8c8d;">
            Intelligent YouTube video clipping powered by AI. Extract precise clips from any video using natural language commands.
        </p>

        <div class="demo-section">
            <a href="#" class="btn">🚀 Live Demo</a>
            <a href="#" class="btn" style="background: #2ecc71;">📖 Documentation</a>
            <a href="#" class="btn" style="background: #e74c3c;">⭐ Star on GitHub</a>
        </div>

        <h2>✨ Features</h2>
        <div class="feature-grid">
            <div class="feature-card">
                <h3>🎯 Smart Video Clipping</h3>
                <p>Enter any YouTube URL and let AI analyze the transcript to create precise clips based on your descriptions.</p>
            </div>
            <div class="feature-card">
                <h3>📝 Transcript-Based Analysis</h3>
                <p>AI processes video transcripts to understand content and identify relevant segments for clipping.</p>
            </div>
            <div class="feature-card">
                <h3>🔧 Multi-Clip Compilation</h3>
                <p>Compile multiple clips from the same video into a single cohesive compilation.</p>
            </div>
            <div class="feature-card">
                <h3>🤖 Natural Language Processing</h3>
                <p>Use simple English commands to tell the AI what parts of the video you want to clip.</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Fast Processing</h3>
                <p>Quick transcript extraction and AI analysis for rapid clip generation.</p>
            </div>
            <div class="feature-card">
                <h3>📱 Easy to Use</h3>
                <p>Simple interface - just paste URL, describe what you need, and get your clips.</p>
            </div>
        </div>

        <h2>🛠️ How It Works</h2>
        <div class="workflow">
            <div class="step">
                <div class="step-number">1</div>
                <h3>Paste YouTube URL</h3>
                <p>Enter any YouTube video link</p>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <h3>AI Transcript Analysis</h3>
                <p>AI processes and understands video content</p>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <h3>Describe Your Clip</h3>
                <p>Tell AI what part you want to extract</p>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <h3>Get Your Clips</h3>
                <p>Download precise video segments</p>
            </div>
        </div>

        <h2>💻 Technology Stack</h2>
        <div class="tech-stack">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">Groq AI</span>
            <span class="tech-tag">YouTube API</span>
            <span class="tech-tag">FFmpeg</span>
            <span class="tech-tag">React</span>
            <span class="tech-tag">SQLite</span>
            <span class="tech-tag">Tailwind CSS</span>
        </div>

        <h2>🚀 Quick Start</h2>
        <div class="code-block">
<pre>
# Clone the repository
git clone https://github.com/productivep13-collab/aivideocutt.git
cd aivideocutt

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export GROQ_API_KEY=your_api_key_here

# Run the application
python main.py
</pre>
        </div>

        <h2>📖 Usage Example</h2>
        <div class="code-block">
<pre>
# Input YouTube URL
https://www.youtube.com/watch?v=example123

# AI Command Examples:
• "Clip the part where they explain machine learning"
• "Extract all funny moments from the video"
• "Create compilation of tutorial segments"
• "Get clips where they discuss AI ethics"

# Output: Precise video clips based on your description
</pre>
        </div>

        <h2>🔧 API Endpoints</h2>
        <div class="code-block">
<pre>
POST /api/analyze-video
{
    "youtube_url": "https://youtube.com/watch?v=...",
    "clip_description": "extract tutorial sections"
}

POST /api/generate-clips  
{
    "video_id": "abc123",
    "clip_timestamps": ["00:10-00:30", "01:15-02:00"]
}

GET /api/transcript/{video_id}
</pre>
        </div>

        <h2>📁 Project Structure</h2>
        <div class="code-block">
<pre>
aivideocutt/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── video_processor.py   # Video clipping logic
│   ├── yt.py               # YouTube transcript extraction
│   ├── models.py           # Database models
│   └── schemas.py          # Pydantic schemas
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API calls
│   └── public/
└── requirements.txt
</pre>
        </div>

        <h2>🤝 Contributing</h2>
        <p>We welcome contributions! Please feel free to submit pull requests, report bugs, or suggest new features.</p>

        <h2>📄 License</h2>
        <p>This project is licensed under the MIT License - see the LICENSE file for details.</p>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
            <p>Made with ❤️ by ProductiveP13 Collab</p>
            <p>
                <a href="#" class="btn" style="background: #333;">GitHub</a>
                <a href="#" class="btn" style="background: #7289da;">Discord</a>
                <a href="#" class="btn" style="background: #0088cc;">Telegram</a>
            </p>
        </div>
    </div>
</body>
</html>
