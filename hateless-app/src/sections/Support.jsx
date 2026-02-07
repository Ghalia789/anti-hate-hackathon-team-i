import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Support.css'

function Support() {
  const { t } = useLanguage()
  const [showCommunityModal, setShowCommunityModal] = useState(false)

  return (
    <section className="support">
      <div className="support-container">
        <div className="support-header">
          <h2>{t('support.title')}</h2>
          <p>{t('support.subtitle')}</p>
        </div>

        {/* Quick Help */}
        <div className="quick-help">
          <div className="help-card help-card-featured">
            <div className="help-icon">💬</div>
            <h3>{t('support.needHelp')}</h3>
            <p>{t('support.needHelpText')}</p>
            <a href="https://theramind-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn btn-pink">
              {t('support.accessTheramind')}
            </a>
          </div>

          <div className="help-card">
            <div className="help-icon">📞</div>
            <h3>{t('support.emergency')}</h3>
            <p>{t('support.emergencyText')}</p>
            <div className="help-numbers">
              <a href="tel:3144">3144 - Suicide Écoute</a>
              <a href="tel:119">119 - Allô Enfance en Danger</a>
            </div>
          </div>

          <div className="help-card">
            <div className="help-icon">🤝</div>
            <h3>{t('support.community')}</h3>
            <p>{t('support.communityText')}</p>
            <button className="btn btn-pink" onClick={() => setShowCommunityModal(true)}>
              {t('support.joinCommunity')}
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="faqs">
          <h3>{t('support.faqs')}</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>📌 {t('support.faq1Title', 'Que faire si je suis victime de hatespeech?')}</h4>
              <p>Documentez l'incident, bloquez l'auteur et signalez-le à la plateforme. N'hésitez pas à chercher du soutien auprès de proches ou de professionnels via notre application Theramind.</p>
            </div>
            <div className="faq-item">
              <h4>📌 {t('support.faq2Title', 'Comment signaler le hatespeech?')}</h4>
              <p>Utilisez les outils de signalement disponibles sur les réseaux sociaux. Vous pouvez également nous contacter directement via notre plateforme avec les preuves (screenshots).</p>
            </div>
            <div className="faq-item">
              <h4>📌 {t('support.faq3Title', 'Comment protéger ma santé mentale en ligne?')}</h4>
              <p>Limitez votre exposition au contenu toxique, prenez des pauses régulières, entourez-vous de communautés positives et utilisez notre application pour du soutien psychologique guidé.</p>
            </div>
            <div className="faq-item">
              <h4>📌 {t('support.faq4Title', 'Existe-t-il des lois contre le hatespeech?')}</h4>
              <p>Oui, dans de nombreux pays. Le hatespeech peut être illégal selon les contextes. Consultez les lois locales et n'hésitez pas à contacter les autorités compétentes si nécessaire.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Modal */}
      {showCommunityModal && (
        <div className="community-modal-overlay" onClick={() => setShowCommunityModal(false)}>
          <div className="community-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCommunityModal(false)}>✕</button>
            <div className="modal-header">
              <h2>🤝 {t('support.community')}</h2>
            </div>
            <div className="modal-body">
              <h3>A propos de Notre Communauté</h3>
              <p>Notre plateforme de communauté offre un **espace sécurisé et modéré** où les utilisateurs peuvent:</p>
              
              <ul>
                <li><strong>Partager leurs expériences</strong> - Racontez votre histoire et apprenez des autres</li>
                <li><strong>Échanger des conseils</strong> - Obtenez des stratégies éprouvées pour gérer le cyberharcèlement</li>
                <li><strong>Recevoir du soutien entre pairs</strong> - Connectez-vous avec d'autres qui comprennent votre situation</li>
                <li><strong>Trouver des ressources</strong> - Accédez à des guides, articles et outils pratiques</li>
                <li><strong>Construire de liens positifs</strong> - Participez à des discussions constructives et respectueuses</li>
              </ul>

              <h3>Règles de la Communauté</h3>
              <ul>
                <li>Bienveillance - Traitez les autres avec respect</li>
                <li>Confidentialité - Ne partagez pas les informations personnelles d'autres</li>
                <li>Inclusivité - Accueillez tous les individus, peu importe leur origine</li>
                <li>Proactivité - Les modérateurs sont actifs pour maintenir un environnement sain</li>
              </ul>

              <div className="community-join">
                <p><strong>Prêt à rejoindre notre communauté?</strong></p>
                <p>Remplissez le formulaire d'inscription ci-dessous pour créer votre compte.</p>
                
                <form className="community-form">
                  <input type="text" placeholder="Votre pseudonyme" required />
                  <input type="email" placeholder="Votre email" required />
                  <textarea placeholder="Dites-nous un peu sur vous (optionnel)" rows="4"></textarea>
                  <button type="submit" className="btn btn-pink">Rejoindre Maintenant</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Support
