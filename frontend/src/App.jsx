import { useState, useEffect, useCallback } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isChildMode, setIsChildMode] = useState(false)
  const [stats, setStats] = useState({ analyzed: 0, blocked: 0 })
  const [activeTab, setActiveTab] = useState('analyze')

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['isActive', 'isChildMode', 'stats'], (data) => {
      setIsActive(data.isActive || false)
      setIsChildMode(data.isChildMode || false)
      setStats(data.stats || { analyzed: 0, blocked: 0 })
    })
  }, [])

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze text')
      }

      const data = await response.json()
      setResult(data)
      
      // Update stats
      const newStats = {
        analyzed: stats.analyzed + 1,
        blocked: stats.blocked + (data.toxicity?.is_toxic ? 1 : 0)
      }
      setStats(newStats)
      chrome.storage.sync.set({ stats: newStats })
    } catch (err) {
      setError(err.message || 'Failed to analyze text')
    } finally {
      setAnalyzing(false)
    }
  }

  const toggleExtension = useCallback(() => {
    const newState = !isActive
    setIsActive(newState)
    chrome.storage.sync.set({ isActive: newState })
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleDetection', 
          isActive: newState 
        }).catch(() => {})
      }
    })
  }, [isActive])

  const toggleChildMode = useCallback(() => {
    const newState = !isChildMode
    setIsChildMode(newState)
    chrome.storage.sync.set({ isChildMode: newState })
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleChildMode', 
          isChildMode: newState 
        }).catch(() => {})
      }
    })
  }, [isChildMode])

  const getSentimentEmoji = (label) => {
    const l = label?.toLowerCase() || ''
    if (l.includes('positive')) return '😊'
    if (l.includes('negative')) return '😔'
    return '😐'
  }

  const getSentimentColor = (label) => {
    const l = label?.toLowerCase() || ''
    if (l.includes('positive')) return '#10b981'
    if (l.includes('negative')) return '#ef4444'
    return '#f59e0b'
  }

  const clearResults = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className={`logo-icon ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">SafeGuard AI</span>
              <span className="logo-subtitle">Anti-Hate Detection</span>
            </div>
          </div>
        </div>
        <button 
          className={`power-btn ${isActive ? 'active' : ''}`}
          onClick={toggleExtension}
          title={isActive ? 'Click to disable' : 'Click to enable'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
            <line x1="12" y1="2" x2="12" y2="12"/>
          </svg>
        </button>
      </header>

      {/* Status Bar */}
      <div className={`status-bar ${isActive ? 'active' : 'inactive'}`}>
        <div className="status-indicator">
          <span className={`status-dot ${isActive ? 'pulse' : ''}`}></span>
          <span className="status-text">
            {isActive ? 'Protection Active' : 'Protection Disabled'}
          </span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{stats.analyzed}</span>
            <span className="stat-label">Analyzed</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value danger">{stats.blocked}</span>
            <span className="stat-label">Blocked</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Analyze
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Activity
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'analyze' && (
          <div className="analyze-section">
            <div className="input-group">
              <textarea
                className="text-input"
                placeholder="Paste or type text to check for hate speech, toxicity, or harmful content..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
              <div className="input-footer">
                <span className="char-count">{text.length} / 5000</span>
                {text && (
                  <button className="clear-btn" onClick={clearResults}>
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <button 
              className={`analyze-btn ${analyzing ? 'analyzing' : ''}`}
              onClick={analyzeText}
              disabled={analyzing || !text.trim()}
            >
              {analyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Analyze Text
                </>
              )}
            </button>

            {error && (
              <div className="error-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="results">
                {/* Language Card */}
                {result.language && (
                  <div className="result-card language-card">
                    <div className="card-header">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      <span>Language Detected</span>
                    </div>
                    <div className="language-display">
                      <span className="lang-code">{result.language.detected?.toUpperCase()}</span>
                      {result.language.dialect && (
                        <span className="dialect-tag">{result.language.dialect}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sentiment Card */}
                <div className="result-card sentiment-card">
                  <div className="card-header">
                    <span className="sentiment-emoji">{getSentimentEmoji(result.sentiment?.label)}</span>
                    <span>Sentiment Analysis</span>
                  </div>
                  <div className="sentiment-display">
                    <div 
                      className="sentiment-label"
                      style={{ color: getSentimentColor(result.sentiment?.label) }}
                    >
                      {result.sentiment?.label}
                    </div>
                    <div className="sentiment-score">
                      <div className="score-bar-bg">
                        <div 
                          className="score-bar-fill"
                          style={{ 
                            width: `${(result.sentiment?.score || 0) * 100}%`,
                            backgroundColor: getSentimentColor(result.sentiment?.label)
                          }}
                        />
                      </div>
                      <span className="score-text">{((result.sentiment?.score || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Toxicity Card */}
                <div className={`result-card toxicity-card ${result.toxicity?.is_toxic ? 'toxic' : 'safe'}`}>
                  <div className="card-header">
                    {result.toxicity?.is_toxic ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                    <span>Toxicity Analysis</span>
                  </div>
                  
                  <div className={`toxicity-badge ${result.toxicity?.is_toxic ? 'toxic' : 'safe'}`}>
                    {result.toxicity?.is_toxic ? '⚠️ Toxic Content Detected' : '✓ Content is Safe'}
                  </div>

                  {result.toxicity?.confidence !== undefined && (
                    <div className="confidence-meter">
                      <span className="confidence-label">Confidence</span>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${result.toxicity.confidence * 100}%` }}
                        />
                      </div>
                      <span className="confidence-value">{(result.toxicity.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}

                  {result.toxicity?.scores && Object.keys(result.toxicity.scores).length > 0 && (
                    <div className="toxicity-breakdown">
                      <div className="breakdown-title">Breakdown</div>
                      {Object.entries(result.toxicity.scores)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([label, score]) => (
                          <div key={label} className="breakdown-item">
                            <span className="breakdown-label">{label}</span>
                            <div className="breakdown-bar">
                              <div 
                                className="breakdown-fill"
                                style={{ 
                                  width: `${score * 100}%`,
                                  backgroundColor: score > 0.5 ? '#ef4444' : score > 0.3 ? '#f59e0b' : '#10b981'
                                }}
                              />
                            </div>
                            <span className="breakdown-value">{(score * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h3>Activity Log</h3>
              <p>Your recent analysis history will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="setting-group">
              <div className="setting-header">
                <h3>Detection Settings</h3>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-title">Real-time Protection</span>
                  <span className="setting-desc">Monitor text as you type</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={toggleExtension}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item child-mode">
                <div className="setting-info">
                  <span className="setting-title">🛡️ Child Protection Mode</span>
                  <span className="setting-desc">Block all harmful content completely (no reveal option)</span>
                </div>
                <label className="switch orange">
                  <input 
                    type="checkbox" 
                    checked={isChildMode}
                    onChange={toggleChildMode}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-header">
                <h3>Languages</h3>
              </div>
              <div className="languages-grid">
                <div className="language-chip active">🇬🇧 English</div>
                <div className="language-chip active">🇫🇷 Français</div>
                <div className="language-chip active">🇸🇦 العربية</div>
                <div className="language-chip active">🇮🇹 Italiano</div>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-header">
                <h3>Statistics</h3>
              </div>
              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <div className="stats-info">
                    <span className="stats-number">{stats.analyzed}</span>
                    <span className="stats-label">Total Analyzed</span>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="stats-info">
                    <span className="stats-number">{stats.blocked}</span>
                    <span className="stats-label">Blocked</span>
                  </div>
                </div>
              </div>
              <button 
                className="reset-stats-btn"
                onClick={() => {
                  setStats({ analyzed: 0, blocked: 0 })
                  chrome.storage.sync.set({ stats: { analyzed: 0, blocked: 0 } })
                }}
              >
                Reset Statistics
              </button>
            </div>

            <div className="about-section">
              <p className="version">SafeGuard AI v1.0.0</p>
              <p className="copyright">Powered by ML Models</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
