import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  
  // Compilation state
  const [compilationId, setCompilationId] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentClips, setCurrentClips] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  
  const chatEndRef = useRef(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Load YouTube API
  useEffect(() => {
    let destroyed = false;

    function injectScript() {
      if (window.YT && window.YT.Player) return Promise.resolve();
      return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        document.head.appendChild(s);
        window.onYouTubeIframeAPIReady = () => resolve();
      });
    }

    function createPlayer() {
      if (playerRef.current || !playerContainerRef.current) return;
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: { controls: 1, modestbranding: 1, rel: 0 },
      });
    }

    injectScript().then(() => {
      if (!destroyed) createPlayer();
    });

    return () => {
      destroyed = true;
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, []);

  const processVideo = async () => {
    if (!url) return setMessage('Enter YouTube URL or ID');
    setLoading(true);
    setMessage('Processing...');
    try {
      const res = await fetch(`${API_BASE}/api/process-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setVideoId(data.video_id);
      setMessage(`Processed: ${data.video_id} — ${data.chunks} chunks ready for compilation`);
    } catch (err) {
      setMessage('Error: ' + (err.message || String(err)));
    }
    setLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !videoId) return;
    
    const userMessage = chatInput;
    setChatInput('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/create-compilation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: videoId,
          query: userMessage,
          compilation_id: compilationId || undefined
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      
      // Update state
      setCompilationId(data.compilation_id);
      setCurrentClips(data.clips);
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.explanation + `\n\n📹 Found ${data.clip_count} clips for your compilation.`
      }]);
      
      setMessage(`Compilation updated with ${data.clip_count} clips`);
    } catch (err) {
      setMessage('Error: ' + (err.message || String(err)));
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    }
    
    setLoading(false);
  };

  const renderCompilation = async () => {
    if (!compilationId) return setMessage('Create a compilation first');
    setLoading(true);
    setMessage('Rendering final video...');
    
    try {
      const res = await fetch(`${API_BASE}/api/render-compilation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compilation_id: compilationId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      
      setFinalVideoUrl(data.compilation_url);
      setMessage(`✅ Compilation ready! ${data.clip_count} clips combined.`);
      
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: `🎬 Your compilation is ready! I've combined ${data.clip_count} clips into one video.`
      }]);
    } catch (err) {
      setMessage('Error: ' + (err.message || String(err)));
    }
    
    setLoading(false);
  };

  const playClip = (clip) => {
    if (!playerRef.current) return;
    try {
      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: clip.start_seconds,
        endSeconds: clip.end_seconds,
        suggestedQuality: 'large'
      });
    } catch (err) {
      setMessage('Error playing clip: ' + err.message);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/videos`);
      const data = await res.json();
      setVideos(data);
      setMessage(`Loaded ${data.length} videos`);
    } catch (err) {
      setMessage('Error: ' + (err.message || String(err)));
    }
  };

  const downloadVideoFile = async (videoId) => {
    setLoading(true);
    setMessage(`Downloading video file for ${videoId}...`);
    
    try {
      const res = await fetch(`${API_BASE}/api/download-video/${videoId}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Download failed');
      
      setMessage(data.message);
      loadVideos(); // Refresh list
    } catch (err) {
      setMessage('Error: ' + (err.message || String(err)));
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        

        {message && (
          <div style={{
            background: message.includes('Error') || message.includes('⚠') ? '#f8d7da' : 'rgba(255,255,255,0.95)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: message.includes('Error') ? '2px solid #dc3545' : 'none',
            color: message.includes('Error') ? '#721c24' : 'inherit'
          }}>
            {message}
          </div>
        )}

        {/* Warning for old videos */}
        {videos.some(v => !v.has_video_file) && (
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <strong>⚠️ Action Required:</strong> Some videos were processed before video download was added. 
            Click the 📥 button to download video files for creating compilations.
          </div>
        )}

        {/* Step 1: Process Video */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>📥 Step 1: Add Video</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="YouTube URL or Video ID"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button
              onClick={processVideo}
              disabled={loading}
              style={{
                padding: '12px 30px',
                background: loading ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Processing...' : 'Process'}
            </button>
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            This downloads subtitles and prepares the video for AI-powered compilation
          </p>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Left: Chat Interface */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '600px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px' }}>💬 Chat with AI</h2>
            
            {!videoId ? (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                textAlign: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '18px' }}>👆 Process a video first to start chatting</p>
                  <p style={{ fontSize: '14px' }}>Then ask things like:</p>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                    <li>• "Find all the funny moments"</li>
                    <li>• "Create a highlights compilation"</li>
                    <li>• "Remove the third clip"</li>
                    <li>• "Add the part about AI"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  marginBottom: '15px',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  {chatHistory.length === 0 && (
                    <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                      Start chatting to create your compilation!
                    </div>
                  )}
                  
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '80%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: msg.role === 'user' ? '#667eea' : '#e9ecef',
                        color: msg.role === 'user' ? 'white' : '#333',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Ask AI to create or modify compilation..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                    disabled={loading}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={loading || !chatInput.trim()}
                    style={{
                      padding: '12px 20px',
                      background: (loading || !chatInput.trim()) ? '#ccc' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: (loading || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: Preview & Clips */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px' }}>🎥 Preview</h2>
            
            <div style={{
              background: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '20px',
              aspectRatio: '16/9'
            }}>
              <div ref={playerContainerRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {currentClips.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ margin: 0 }}>📋 Current Clips ({currentClips.length})</h3>
                  <button
                    onClick={renderCompilation}
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      background: loading ? '#ccc' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Rendering...' : '🎬 Render Final Video'}
                  </button>
                </div>

                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px'
                }}>
                  {currentClips.map((clip, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <strong style={{ color: '#667eea' }}>Clip {idx + 1}</strong>
                          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                            {clip.start_time} → {clip.end_time}
                          </span>
                        </div>
                        <button
                          onClick={() => playClip(clip)}
                          style={{
                            padding: '6px 12px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ▶ Preview
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', color: '#555' }}>
                        {clip.text.substring(0, 100)}...
                      </div>
                      {clip.reason && (
                        <div style={{
                          fontSize: '12px',
                          color: '#888',
                          marginTop: '6px',
                          fontStyle: 'italic'
                        }}>
                          💡 {clip.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {finalVideoUrl && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#d4edda',
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Compilation Ready!</h3>
                <a
                  href={API_BASE + finalVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  📥 Download Compilation
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Video Library */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginTop: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>📚 Video Library</h2>
            <button
              onClick={loadVideos}
              style={{
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
          
          {videos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '15px',
              marginTop: '20px'
            }}>
              {videos.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {v.video_id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    {new Date(v.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                    {v.has_video_file ? (
                      <span style={{ color: '#28a745' }}>✓ Video file ready</span>
                    ) : (
                      <span style={{ color: '#dc3545' }}>⚠ Video file missing</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => {
                        setVideoId(v.video_id);
                        setUrl(v.url);
                        setMessage('Selected: ' + v.video_id);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Use
                    </button>
                    {!v.has_video_file && (
                      <button
                        onClick={() => downloadVideoFile(v.video_id)}
                        disabled={loading}
                        style={{
                          padding: '8px 12px',
                          background: loading ? '#ccc' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        📥
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>💡 Pro Tips</h3>
          <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
            <li><strong>Create compilations:</strong> "Find all funny moments" or "Create highlights compilation"</li>
            <li><strong>Edit clips:</strong> "Remove the second clip" or "Remove clips 2 and 4"</li>
            <li><strong>Add more:</strong> "Add the part where they discuss AI" or "Include opening segment"</li>
            <li><strong>Refine:</strong> Chat naturally to iteratively improve your compilation</li>
            <li><strong>Preview:</strong> Click any clip to preview it before rendering final video</li>
          </ul>
        </div>
      </div>
    </div>
  );
}