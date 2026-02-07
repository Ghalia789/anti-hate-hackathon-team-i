import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Retrouvez votre équilibre intérieur</h1>
          <p className="hero-tagline">Votre compagnon IA pour la santé mentale</p>
          <p className="hero-subtitle">
            Découvrez un nouveau type de soutien émotionnel. Notre plateforme vous écoute, vous comprend et vous guide sur votre parcours de vie.
          </p>

          <div className="mood-selector">
            <p className="mood-label">Quel que soit votre ressenti, nous sommes là pour vous écouter</p>
            <div className="emotions">
              <div className="emotion-item">
                <span className="emotion-icon">😢</span>
                <span>Triste</span>
              </div>
              <div className="emotion-item">
                <span className="emotion-icon">😐</span>
                <span>Plutôt bien</span>
              </div>
              <div className="emotion-item">
                <span className="emotion-icon">😊</span>
                <span>Paisible</span>
              </div>
              <div className="emotion-item">
                <span className="emotion-icon">😄</span>
                <span>Heureux(se)</span>
              </div>
              <div className="emotion-item">
                <span className="emotion-icon">✨</span>
                <span>Enthousiaste</span>
              </div>
            </div>
            <div className="mood-slider-container">
              <input type="range" min="1" max="5" defaultValue="3" className="mood-slider" />
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/articles" className="btn btn-primary">Commencer votre parcours</Link>
            <Link to="/api-tester" className="btn btn-secondary">Tester l'API</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>IA Intelligente</h3>
            <p>Une compagne IA capable de comprendre vos émotions et vos besoins avec empathie.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Ressources</h3>
            <p>Accédez à des articles et ressources pour combattre le hatespeech et promouvoir le bien-être.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Soutien Continu</h3>
            <p>Un soutien émotionnel 24/7 pour vous accompagner dans votre parcours personnel.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
