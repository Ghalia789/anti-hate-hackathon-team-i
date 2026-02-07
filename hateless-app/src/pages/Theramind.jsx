import './Theramind.css'

function Theramind() {
  return (
    <section className="theramind-section">
      <div className="theramind-container">
        <div className="theramind-header">
          <h1>Theramind</h1>
          <p className="subtitle">Votre compagnon IA pour la santé mentale</p>
          <p className="description">
            Theramind est une application complète dédiée à votre bien-être mental et émotionnel. Accédez à des outils d'évaluation, de support et de ressources thérapeutiques.
          </p>
        </div>

        {/* Quick Access Buttons */}
        <div className="quick-access">
          <a
            href="https://theramind-frontend.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-large"
          >
            Accéder à Theramind
          </a>
          <p className="access-note">Cliquez pour accéder à l'application complète (sans connexion requise)</p>
        </div>

        {/* Features Overview */}
        <div className="features-overview">
          <h2>Fonctionnalités Principales</h2>
          <div className="features-columns">
            <div className="feature-column">
              <h3>📊 Évaluation Personnalisée</h3>
              <ul>
                <li>Analyse de votre état émotionnel</li>
                <li>Suivi de votre bien-être au fil du temps</li>
                <li>Rapports personnalisés</li>
              </ul>
            </div>
            <div className="feature-column">
              <h3>🧠 Support Cognitif</h3>
              <ul>
                <li>Techniques de gestion du stress</li>
                <li>Exercices de mindfulness</li>
                <li>Conseils adaptés à votre profil</li>
              </ul>
            </div>
            <div className="feature-column">
              <h3>📚 Ressources Éducatives</h3>
              <ul>
                <li>Articles sur la santé mentale</li>
                <li>Guides pratiques</li>
                <li>Conseils de professionnels</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Embedded Theramind */}
        <div className="theramind-embed-section">
          <h2>Aperçu de Theramind</h2>
          <div className="theramind-embed-container">
            <iframe
              src="https://theramind-frontend.onrender.com/"
              title="Theramind Application"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="embed-note">
            Si l'application n'apparaît pas correctement,{' '}
            <a href="https://theramind-frontend.onrender.com/" target="_blank" rel="noopener noreferrer">
              cliquez ici pour l'ouvrir dans une nouvelle fenêtre
            </a>
            .
          </p>
        </div>

        {/* Integration Benefits */}
        <div className="integration-benefits">
          <h2>Pourquoi Intégrer Theramind</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">✨</span>
              <h3>Approche Holistique</h3>
              <p>Theramind et Hateless travaillent ensemble pour vous offrir un soutien complet contre le hatespeech et pour votre bien-être mental.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🤝</span>
              <h3>Continuité du Soutien</h3>
              <p>Bénéficiez d'un suivi continu et personnalisé de votre état émotionnel et mental.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🎯</span>
              <h3>Objectifs Personnalisés</h3>
              <p>Définissez et atteignez vos objectifs de bien-être avec des outils adaptés à vos besoins.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">💪</span>
              <h3>Renforcement de la Résilience</h3>
              <p>Développez votre résilience face aux défis émotionnels et aux environnements numériques toxiques.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Questions Fréquemment Posées</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h4>Est-ce que Theramind remplace une thérapie professionnelle?</h4>
              <p>Non. Theramind est un outil de soutien supplémentaire. Si vous avez besoin d'une aide professionnelle, consultez un psychologue ou un psychiatre.</p>
            </div>
            <div className="faq-item">
              <h4>Dois-je créer un compte pour utiliser Theramind?</h4>
              <p>Non, vous pouvez accéder à de nombreuses fonctionnalités sans créer de compte. Certaines fonctionnalités avancées peuvent nécessiter une inscription.</p>
            </div>
            <div className="faq-item">
              <h4>Mes données sont-elles sécurisées?</h4>
              <p>Oui. Theramind utilise des protocoles de sécurité modernes pour protéger vos données personnelles et votre confidentialité.</p>
            </div>
            <div className="faq-item">
              <h4>Comment Theramind se connecte-t-il avec Hateless?</h4>
              <p>Les deux plates-formes sont complémentaires. Hateless vous aide à combattre le hatespeech, tandis que Theramind soutient votre bien-être mental global.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Theramind
