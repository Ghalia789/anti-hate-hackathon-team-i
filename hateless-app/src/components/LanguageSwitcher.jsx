import { useLanguage } from '../context/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
        onClick={() => setLanguage('fr')}
      >
        🇫🇷 FR
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        🇬🇧 EN
      </button>
      <button
        className={`lang-btn ${language === 'it' ? 'active' : ''}`}
        onClick={() => setLanguage('it')}
      >
        🇮🇹 IT
      </button>
    </div>
  )
}

export default LanguageSwitcher
