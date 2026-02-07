import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./ArticlesSection.css";

function ArticlesSection() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articlesData = useMemo(
    () => [
      {
        id: 1,
        title: t("articlesContent.article1.title"),
        category: "hatespeech",
        readTime: 5,
        excerpt: t("articlesContent.article1.excerpt"),
        fullContent: t("articlesContent.article1.fullContent"),
        author: t("articlesContent.article1.author"),
      },
      {
        id: 2,
        title: t("articlesContent.article2.title"),
        category: "sante-mentale",
        readTime: 8,
        excerpt: t("articlesContent.article2.excerpt"),
        fullContent: t("articlesContent.article2.fullContent"),
        author: t("articlesContent.article2.author"),
      },
      {
        id: 3,
        title: t("articlesContent.article3.title"),
        category: "communication",
        readTime: 6,
        excerpt: t("articlesContent.article3.excerpt"),
        fullContent: t("articlesContent.article3.fullContent"),
        author: t("articlesContent.article3.author"),
      },
      {
        id: 4,
        title: t("articlesContent.article4.title"),
        category: "bien-etre",
        readTime: 7,
        excerpt: t("articlesContent.article4.excerpt"),
        fullContent: t("articlesContent.article4.fullContent"),
        author: t("articlesContent.article4.author"),
      },
    ],
    [t, language],
  );

  const getCategoryLabel = (category) => {
    const categoryMap = {
      "sante-mentale": t("articles.mentalHealth"),
      hatespeech: t("articles.hatespeech"),
      communication: t("articles.communication"),
      "bien-etre": t("articles.wellness"),
    };
    return categoryMap[category] || category;
  };

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articlesData, searchTerm, selectedCategory]);

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <section className="articles-section">
      <div className="articles-container">
        <div className="articles-header">
          <h2>{t("articles.title")}</h2>
          <p>{t("articles.subtitle")}</p>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <input
            type="text"
            placeholder={t("articles.search")}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">{t("articles.allArticles")}</option>
            <option value="sante-mentale">{t("articles.mentalHealth")}</option>
            <option value="hatespeech">{t("articles.hatespeech")}</option>
            <option value="communication">{t("articles.communication")}</option>
            <option value="bien-etre">{t("articles.wellness")}</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <article
                key={article.id}
                className="article-card"
                onClick={() => handleSelectArticle(article)}
              >
                <div className="article-badge">
                  {getCategoryLabel(article.category)}
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="article-meta">
                  <span className="read-time">📖 {article.readTime} min</span>
                  <span className="author">• {article.author}</span>
                </div>
                <button className="read-more-btn">
                  {t("articles.readMore")}
                </button>
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>{t("articles.noResults")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="article-modal-overlay" onClick={handleCloseModal}>
          <div className="article-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✕
            </button>
            <div className="modal-header">
              <div className="modal-badge">
                {getCategoryLabel(selectedArticle.category)}
              </div>
              <h2>{selectedArticle.title}</h2>
              <div className="modal-meta">
                <span>
                  {t("articles.by", "Par")} {selectedArticle.author}
                </span>{" "}
                • <span>📖 {selectedArticle.readTime} min</span>
              </div>
            </div>
            <div className="modal-body">
              {selectedArticle.fullContent
                .split("\n\n")
                .map((paragraph, idx) => {
                  if (paragraph.startsWith("##")) {
                    return <h3 key={idx}>{paragraph.replace("## ", "")}</h3>;
                  } else if (paragraph.startsWith("###")) {
                    return <h4 key={idx}>{paragraph.replace("### ", "")}</h4>;
                  } else if (paragraph.includes("- ")) {
                    const items = paragraph
                      .split("\n")
                      .filter((line) => line.trim().startsWith("-"));
                    return (
                      <ul key={idx}>
                        {items.map((item, i) => (
                          <li key={i}>
                            {item.replace(/^- /, "").replace(/\*\*/g, "")}
                          </li>
                        ))}
                      </ul>
                    );
                  } else if (paragraph.match(/^\d+\./)) {
                    const items = paragraph
                      .split("\n")
                      .filter((line) => line.trim());
                    return (
                      <ol key={idx}>
                        {items.map((item, i) => (
                          <li key={i}>
                            {item.replace(/^\d+\. /, "").replace(/\*\*/g, "")}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ArticlesSection;