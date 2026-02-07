import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { FiPower, FiSearch, FiSettings, FiCheckCircle, FiXCircle, FiGlobe, FiAlertTriangle, FiShield } from 'react-icons/fi'

const API_URL = 'https://hate-speech-api-486614.uc.r.appspot.com/api'

// Translations for all supported languages
const translations = {
  en: {
    subtitle: 'Powered by Generative AI',
    protectionActive: '● Protection Active',
    protectionDisabled: '○ Protection Disabled',
    analyzed: 'Analyzed',
    blocked: 'Blocked',
    analyze: 'Analyze',
    settings: 'Settings',
    placeholder: 'Paste or type text to check for hate speech, toxicity, or harmful content...',
    clear: 'Clear',
    analyzing: 'Analyzing...',
    analyzeText: 'Analyze Text',
    enterText: 'Please enter some text to analyze',
    failedAnalyze: 'Failed to analyze text',
    languageDetected: 'Language Detected',
    sentimentAnalysis: 'Sentiment Analysis',
    toxicityAnalysis: 'Toxicity Analysis',
    toxicContent: '⚠️ Toxic Content Detected',
    safeContent: '✓ Content is Safe',
    confidence: 'Confidence',
    breakdown: 'Breakdown',
    appearance: 'Appearance',
    darkMode: '🌙 Dark Mode',
    lightMode: '☀️ Light Mode',
    themeDesc: 'Switch between dark and light theme',
    detectionSettings: 'Detection Settings',
    realtimeProtection: 'Real-time Protection',
    realtimeDesc: 'Monitor text as you type',
    childMode: '🛡️ Child Protection Mode',
    childModeDesc: 'Block all harmful content completely (no reveal option)',
    languages: 'Languages',
    interfaceLang: 'Interface Language',
    statistics: 'Statistics',
    totalAnalyzed: 'Total Analyzed',
    resetStats: 'Reset Statistics',
    clickDisable: 'Click to disable',
    clickEnable: 'Click to enable'
  },
  fr: {
    subtitle: 'Propulsé par IA Générative',
    protectionActive: '● Protection Active',
    protectionDisabled: '○ Protection Désactivée',
    analyzed: 'Analysés',
    blocked: 'Bloqués',
    analyze: 'Analyser',
    settings: 'Paramètres',
    placeholder: 'Collez ou tapez du texte pour vérifier les discours haineux, la toxicité ou le contenu nuisible...',
    clear: 'Effacer',
    analyzing: 'Analyse...',
    analyzeText: 'Analyser le texte',
    enterText: 'Veuillez entrer du texte à analyser',
    failedAnalyze: 'Échec de l\'analyse',
    languageDetected: 'Langue Détectée',
    sentimentAnalysis: 'Analyse de Sentiment',
    toxicityAnalysis: 'Analyse de Toxicité',
    toxicContent: '⚠️ Contenu Toxique Détecté',
    safeContent: '✓ Contenu Sûr',
    confidence: 'Confiance',
    breakdown: 'Détails',
    appearance: 'Apparence',
    darkMode: '🌙 Mode Sombre',
    lightMode: '☀️ Mode Clair',
    themeDesc: 'Basculer entre thème sombre et clair',
    detectionSettings: 'Paramètres de Détection',
    realtimeProtection: 'Protection en Temps Réel',
    realtimeDesc: 'Surveiller le texte pendant la saisie',
    childMode: '🛡️ Mode Protection Enfant',
    childModeDesc: 'Bloquer tout contenu nuisible (sans option de révélation)',
    languages: 'Langues',
    interfaceLang: 'Langue de l\'Interface',
    statistics: 'Statistiques',
    totalAnalyzed: 'Total Analyzed',
    resetStats: 'Réinitialiser',
    clickDisable: 'Cliquer pour désactiver',
    clickEnable: 'Cliquer pour activer'
  },
  ar: {
    subtitle: 'مدعوم بالذكاء الاصطناعي التوليدي',
    protectionActive: '● الحماية نشطة',
    protectionDisabled: '○ الحماية معطلة',
    analyzed: 'محلل',
    blocked: 'محظور',
    analyze: 'تحليل',
    settings: 'الإعدادات',
    placeholder: 'الصق أو اكتب نصًا للتحقق من خطاب الكراهية أو السمية أو المحتوى الضار...',
    clear: 'مسح',
    analyzing: 'جاري التحليل...',
    analyzeText: 'تحليل النص',
    enterText: 'الرجاء إدخال نص للتحليل',
    failedAnalyze: 'فشل في تحليل النص',
    languageDetected: 'اللغة المكتشفة',
    sentimentAnalysis: 'تحليل المشاعر',
    toxicityAnalysis: 'تحليل السمية',
    toxicContent: '⚠️ تم اكتشاف محتوى سام',
    safeContent: '✓ المحتوى آمن',
    confidence: 'الثقة',
    breakdown: 'التفاصيل',
    appearance: 'المظهر',
    darkMode: '🌙 الوضع الداكن',
    lightMode: '☀️ الوضع الفاتح',
    themeDesc: 'التبديل بين المظهر الداكن والفاتح',
    detectionSettings: 'إعدادات الكشف',
    realtimeProtection: 'الحماية في الوقت الحقيقي',
    realtimeDesc: 'مراقبة النص أثناء الكتابة',
    childMode: '🛡️ وضع حماية الأطفال',
    childModeDesc: 'حظر جميع المحتويات الضارة تمامًا',
    languages: 'اللغات',
    interfaceLang: 'لغة الواجهة',
    statistics: 'الإحصائيات',
    totalAnalyzed: 'إجمالي التحليل',
    resetStats: 'إعادة تعيين',
    clickDisable: 'انقر للتعطيل',
    clickEnable: 'انقر للتفعيل'
  },
  it: {
    subtitle: 'Alimentato da IA Generativa',
    protectionActive: '● Protezione Attiva',
    protectionDisabled: '○ Protezione Disattivata',
    analyzed: 'Analizzati',
    blocked: 'Bloccati',
    analyze: 'Analizza',
    settings: 'Impostazioni',
    placeholder: 'Incolla o digita testo per verificare discorsi d\'odio, tossicità o contenuti dannosi...',
    clear: 'Cancella',
    analyzing: 'Analisi...',
    analyzeText: 'Analizza Testo',
    enterText: 'Inserisci del testo da analizzare',
    failedAnalyze: 'Analisi fallita',
    languageDetected: 'Lingua Rilevata',
    sentimentAnalysis: 'Analisi del Sentiment',
    toxicityAnalysis: 'Analisi della Tossicità',
    toxicContent: '⚠️ Contenuto Tossico Rilevato',
    safeContent: '✓ Contenuto Sicuro',
    confidence: 'Confidenza',
    breakdown: 'Dettagli',
    appearance: 'Aspetto',
    darkMode: '🌙 Modalità Scura',
    lightMode: '☀️ Modalità Chiara',
    themeDesc: 'Passa tra tema scuro e chiaro',
    detectionSettings: 'Impostazioni Rilevamento',
    realtimeProtection: 'Protezione in Tempo Reale',
    realtimeDesc: 'Monitora il testo durante la digitazione',
    childMode: '🛡️ Modalità Protezione Bambini',
    childModeDesc: 'Blocca completamente tutti i contenuti dannosi',
    languages: 'Lingue',
    interfaceLang: 'Lingua Interfaccia',
    statistics: 'Statistiche',
    totalAnalyzed: 'Totale Analizzato',
    resetStats: 'Azzera Statistiche',
    clickDisable: 'Clicca per disattivare',
    clickEnable: 'Clicca per attivare'
  }
}

function App() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isChildMode, setIsChildMode] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [lang, setLang] = useState('en')
  const [stats, setStats] = useState({ analyzed: 0, blocked: 0 })
  const [activeTab, setActiveTab] = useState('analyze')

  const t = translations[lang] || translations.en

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['isActive', 'isChildMode', 'isDarkMode', 'lang', 'stats'], (data) => {
      setIsActive(data.isActive || false)
      setIsChildMode(data.isChildMode || false)
      setIsDarkMode(data.isDarkMode !== false) // Default to dark mode
      setLang(data.lang && data.lang !== 'ar' ? data.lang : 'fr')
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

  const toggleTheme = useCallback(() => {
    const newState = !isDarkMode
    setIsDarkMode(newState)
    chrome.storage.sync.set({ isDarkMode: newState })
  }, [isDarkMode])

  const changeLanguage = useCallback((newLang) => {
    setLang(newLang)
    chrome.storage.sync.set({ lang: newLang })
  }, [])

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
    <div className={`app ${isDarkMode ? '' : 'light-mode'} ${lang === 'ar' ? 'rtl' : ''}`}>
      {/* Animated Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className={`logo-icon ${isActive ? 'active' : ''}`}>
              <img src="icons/icon-128.png" alt="HateLess" />
              {isActive && <div className="logo-pulse"></div>}
            </div>
            <div className="logo-text">
              <span className="logo-title">HateLess</span>
              <span className="logo-subtitle">{t.subtitle}</span>
            </div>
          </div>
        </div>
        <button 
          className={`power-btn ${isActive ? 'active' : ''}`}
          onClick={toggleExtension}
          title={isActive ? t.clickDisable : t.clickEnable}
        >
          <FiPower />
        </button>
      </header>

      {/* Status Bar */}
      <div className={`status-bar ${isActive ? 'active' : 'inactive'}`}>
        <div className="status-indicator">
          <span className={`status-dot ${isActive ? 'pulse' : ''}`}></span>
          <span className="status-text">
            {isActive ? t.protectionActive : t.protectionDisabled}
          </span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{stats.analyzed}</span>
            <span className="stat-label">{t.analyzed}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value danger">{stats.blocked}</span>
            <span className="stat-label">{t.blocked}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <FiSearch />
          {t.analyze}
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings />
          {t.settings}
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'analyze' && (
          <div className="analyze-section">
            <div className="input-group">
              <textarea
                className="text-input"
                placeholder={t.placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
              <div className="input-footer">
                <span className="char-count">{text.length} / 5000</span>
                {text && (
                  <button className="clear-btn" onClick={clearResults}>
                    {t.clear}
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
                  {t.analyzing}
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  {t.analyzeText}
                </>
              )}
            </button>

            {error && (
              <div className="error-card">
                <FiXCircle />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="results">
                {/* Language Card */}
                {result.language && (
                  <div className="result-card language-card">
                    <div className="card-header">
                      <FiGlobe />
                      <span>{t.languageDetected}</span>
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
                    <span>{t.sentimentAnalysis}</span>
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
                        <FiAlertTriangle />
                    ) : (
                        <FiCheckCircle />
                    )}
                    <span>{t.toxicityAnalysis}</span>
                  </div>
                  
                  <div className={`toxicity-badge ${result.toxicity?.is_toxic ? 'toxic' : 'safe'}`}>
                    {result.toxicity?.is_toxic ? t.toxicContent : t.safeContent}
                  </div>

                  {result.toxicity?.confidence !== undefined && (
                    <div className="confidence-meter">
                      <span className="confidence-label">{t.confidence}</span>
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
                      <div className="breakdown-title">{t.breakdown}</div>
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

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="setting-group">
              <div className="setting-header">
                <h3>{t.interfaceLang}</h3>
              </div>
              <div className="languages-grid">
                <div className={`language-chip ${lang === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>🇬🇧 English</div>
                <div className={`language-chip ${lang === 'fr' ? 'active' : ''}`} onClick={() => changeLanguage('fr')}>🇫🇷 Français</div>
                <div className={`language-chip ${lang === 'it' ? 'active' : ''}`} onClick={() => changeLanguage('it')}>🇮🇹 Italiano</div>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-header">
                <h3>{t.appearance}</h3>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-title">{isDarkMode ? t.darkMode : t.lightMode}</span>
                  <span className="setting-desc">{t.themeDesc}</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-header">
                <h3>{t.detectionSettings}</h3>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-title">{t.realtimeProtection}</span>
                  <span className="setting-desc">{t.realtimeDesc}</span>
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
                  <span className="setting-title">{t.childMode}</span>
                  <span className="setting-desc">{t.childModeDesc}</span>
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
                <h3>{t.statistics}</h3>
              </div>
              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-icon blue">
                    <FiSearch />
                  </div>
                  <div className="stats-info">
                    <span className="stats-number">{stats.analyzed}</span>
                    <span className="stats-label">{t.totalAnalyzed}</span>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon red">
                    <FiShield />
                  </div>
                  <div className="stats-info">
                    <span className="stats-number">{stats.blocked}</span>
                    <span className="stats-label">{t.blocked}</span>
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
                {t.resetStats}
              </button>
            </div>

            <div className="about-section">
              <p className="version">HateLess v1.0.0</p>
              <p className="copyright">Powered by ML Models</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
