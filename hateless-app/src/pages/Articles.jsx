import { useState, useMemo } from 'react'
import './Articles.css'

const articlesData = [
  {
    id: 1,
    title: 'Comprendre le Hatespeech : Définitions et Impacts',
    category: 'hatespeech',
    readTime: 5,
    content: 'Explorez ce qu\'est le hatespeech, ses formes et ses impacts profonds sur les individus et les communautés. Apprenez à le reconnaître.',
    author: 'Dr. Marie Dupont'
  },
  {
    id: 2,
    title: 'Gérer l\'Anxiété Liée aux Réseaux Sociaux',
    category: 'sante-mentale',
    readTime: 8,
    content: 'Découvrez des stratégies efficaces pour gérer l\'anxiété et le stress causés par l\'exposition au contenu nuisible en ligne.',
    author: 'Dr. Jean Martin'
  },
  {
    id: 3,
    title: 'Dialogue Constructif : Comment Répondre au Hatespeech',
    category: 'communication',
    readTime: 6,
    content: 'Apprenez les techniques de communication non-violente pour répondre au hatespeech de manière constructive et respectueuse.',
    author: 'Sophie Bernard'
  },
  {
    id: 4,
    title: 'Pratiques Quotidiennes pour Renforcer Votre Résilience',
    category: 'bien-etre',
    readTime: 7,
    content: 'Découvrez des exercices simples et quotidiens pour renforcer votre résilience émotionnelle et mentale face aux défis.',
    author: 'Prof. Laurent Lefevre'
  },
  {
    id: 5,
    title: 'Les Conséquences Psychologiques du Hatespeech',
    category: 'hatespeech',
    readTime: 9,
    content: 'Une analyse approfondie des impacts psychologiques et émotionnels du hatespeech sur les victimes et les communautés marginalisées.',
    author: 'Dr. Claire Moreau'
  },
  {
    id: 6,
    title: 'Autogestion des Émotions en Ligne',
    category: 'sante-mentale',
    readTime: 6,
    content: 'Techniques pratiques pour gérer vos émotions dans un environnement numérique complexe et parfois toxique.',
    author: 'Dr. Pierre Rousseau'
  }
]

function Articles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredArticles = useMemo(() => {
    return articlesData.filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !selectedCategory || article.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <section className="articles-section">
      <div className="articles-container">
        <h1>Articles et Ressources</h1>
        <p className="section-subtitle">
          Découvrez nos ressources pour combattre le hatespeech et promouvoir le bien-être mental
        </p>

        {/* Search and Filter */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            <option value="sante-mentale">Santé Mentale</option>
            <option value="hatespeech">Hatespeech</option>
            <option value="communication">Communication</option>
            <option value="bien-etre">Bien-être</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <article key={article.id} className="article-card">
                <div className="article-header">
                  <span className="category-badge">{
                    article.category === 'sante-mentale' ? 'Santé Mentale' :
                    article.category === 'hatespeech' ? 'Hatespeech' :
                    article.category === 'communication' ? 'Communication' :
                    'Bien-être'
                  }</span>
                  <span className="read-time">{article.readTime} min</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.content}</p>
                <div className="article-footer">
                  <span className="author">Par {article.author}</span>
                  <a href="#" className="read-more">Lire plus →</a>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>Aucun article ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resources Section */}
      <section className="resources-highlight">
        <div className="resources-container">
          <h2>Ressources Supplémentaires</h2>
          <div className="resources-grid">
            <div className="resource-item">
              <span className="resource-icon">📖</span>
              <h3>Guides Pratiques</h3>
              <p>Téléchargez nos guides gratuits pour mieux comprendre et combattre le hatespeech.</p>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🎥</span>
              <h3>Vidéos Éducatives</h3>
              <p>Regardez nos vidéos de sensibilisation et d'éducation sur les enjeux de la santé mentale.</p>
            </div>
            <div className="resource-item">
              <span className="resource-icon">💬</span>
              <h3>Communauté</h3>
              <p>Rejoignez notre communauté de soutien bienveillante et inclusive.</p>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🎧</span>
              <h3>Podcasts</h3>
              <p>Écoutez nos podcasts sur le bien-être mental et la résilience.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Articles
