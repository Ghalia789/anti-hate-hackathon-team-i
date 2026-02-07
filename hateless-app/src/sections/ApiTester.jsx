import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  FiSend,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import "./ApiTester.css";

function ApiTester() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://hate-speech-api-486614.uc.r.appspot.com/api/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const score = result
    ? result.hate_speech_score.toFixed(2)
    : 0;

  const isHate = result?.is_hate_speech;

  return (
    <section className="api-demo">
      <div className="api-wrapper">
        <header className="api-header">
          <h2>{t("apiTester.title")}</h2>
          <p>{t("apiTester.subtitle")}</p>
        </header>

        <div className="api-card">
          <label className="api-label">Texte à analyser</label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez un texte ici..."
          />

          <button
            className="analyze-btn"
            onClick={analyzeText}
            disabled={loading || !text.trim()}
          >
            <FiSend />
            {loading ? "Analyse..." : "Analyser"}
          </button>

          {result && (
            <div className={`result ${isHate ? "danger" : "safe"}`}>
              <div className="result-header">
                {isHate ? (
                  <>
                    <FiAlertTriangle />
                    Discours haineux détecté
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Aucun discours haineux
                  </>
                )}
              </div>

              <div className="confidence">
                <span>Confiance</span>
                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <strong>{score}%</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ApiTester;
