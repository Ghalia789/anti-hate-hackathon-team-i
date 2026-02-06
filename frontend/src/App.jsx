import React, { useState } from 'react';
import './App.css';
import api from './api';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeText(text);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛡️ Anti-Hate Speech Detector</h1>
        <p className="privacy-notice">
          🔒 GDPR-Compliant | No Data Storage | Stateless Processing
        </p>
      </header>

      <main className="App-main">
        <div className="container">
          <form onSubmit={handleAnalyze} className="analyze-form">
            <div className="form-group">
              <label htmlFor="text-input">
                Enter text to analyze for hate speech:
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text here..."
                rows="6"
                maxLength="5000"
                disabled={loading}
              />
              <div className="char-counter">
                {text.length} / 5000 characters
              </div>
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !text.trim()}
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result-container">
              <h2>Analysis Results</h2>
              <div className="result-content">
                {result.analysis && Array.isArray(result.analysis) && result.analysis.length > 0 && (
                  <div className="classification-results">
                    {result.analysis[0].map((item, index) => (
                      <div key={index} className="classification-item">
                        <span className="label">{item.label}</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${(item.score * 100).toFixed(1)}%` }}
                          />
                        </div>
                        <span className="score">{(item.score * 100).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="metadata">
                  <p><strong>Text Length:</strong> {result.text_length} characters</p>
                  <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                  <p className="privacy-note">
                    <em>🔒 {result.privacy_note}</em>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="info-box">
            <h3>About This Tool</h3>
            <ul>
              <li>✅ <strong>Privacy-First:</strong> No data is stored or logged</li>
              <li>✅ <strong>GDPR Compliant:</strong> Stateless, in-memory processing only</li>
              <li>✅ <strong>No Tracking:</strong> No cookies, no localStorage, no analytics</li>
              <li>✅ <strong>Open Source:</strong> Transparent and auditable</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Built for 24h Anti-Hate Hackathon | Privacy-Focused Architecture</p>
      </footer>
    </div>
  );
}

export default App;
