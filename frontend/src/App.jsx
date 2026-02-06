import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['isActive'], (data) => {
      setIsActive(data.isActive || false)
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
    } catch (err) {
      setError(err.message || 'Failed to analyze text')
    } finally {
      setAnalyzing(false)
    }
  }

  const toggleExtension = () => {
    const newState = !isActive
    setIsActive(newState)
    chrome.storage.sync.set({ isActive: newState })
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'toggleDetection', 
        isActive: newState 
      })
    })
  }

  const getSentimentEmoji = (label) => {
    if (label.toLowerCase().includes('positive')) return ''
    if (label.toLowerCase().includes('negative')) return ''
    return ''
  }

  const getToxicityColor = (isToxic) => {
    return isToxic ? '#ff4444' : '#44ff44'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Anti-Hate Speech</h1>
        <button 
          className={`toggle-btn ${isActive ? 'active' : ''}`}
          onClick={toggleExtension}
        >
          {isActive ? 'Active' : 'Inactive'}
        </button>
      </header>

      <div className="content">
        <div className="input-section">
          <textarea
            className="text-input"
            placeholder="Enter text to analyze for hate speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
          <button 
            className="analyze-btn"
            onClick={analyzeText}
            disabled={analyzing || !text.trim()}
          >
            {analyzing ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className="results">
            <div className="result-card">
              <h3>Sentiment {getSentimentEmoji(result.sentiment.label)}</h3>
              <div className="result-value">
                <span className="label">{result.sentiment.label}</span>
                <span className="score">
                  {(result.sentiment.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${result.sentiment.score * 100}%` }}
                />
              </div>
            </div>

            <div className="result-card">
              <h3>Toxicity Analysis</h3>
              <div 
                className="toxicity-status"
                style={{ backgroundColor: getToxicityColor(result.toxicity.is_toxic) }}
              >
                {result.toxicity.is_toxic ? 'Toxic Content Detected' : 'Content is Safe'}
              </div>
              
              <div className="toxicity-scores">
                {Object.entries(result.toxicity.scores)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([label, score]) => (
                    <div key={label} className="score-item">
                      <span className="score-label">{label}</span>
                      <div className="score-bar-container">
                        <div 
                          className="score-bar"
                          style={{ 
                            width: `${score * 100}%`,
                            backgroundColor: score > 0.5 ? '#ff4444' : '#4444ff'
                          }}
                        />
                      </div>
                      <span className="score-value">{(score * 100).toFixed(1)}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="info">
          <p>
            {isActive 
              ? 'Real-time detection is active on this page'
              : 'Real-time detection is inactive'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
