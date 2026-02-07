import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  FiCode,
  FiCopy,
  FiCheck,
  FiZap,
  FiGlobe,
  FiLock,
} from "react-icons/fi";
import "./ApiIntegration.css";

function ApiIntegration() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const codeExample = `fetch("https://hate-speech-api-486614.uc.r.appspot.com/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Votre texte ici" })
})
.then(res => res.json())
.then(data => console.log(data));`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="api-access">
      <div className="api-access-container">
        {/* HEADER */}
        <div className="api-access-header">
          <h2>{t("apiInt.title")}</h2>
          <p>{t("apiInt.subtitle")}</p>
        </div>

        <div className="api-access-grid">
          {/* CODE BLOCK */}
          <div className="code-card">
            <div className="code-top">
              <div className="code-lang">
                <FiCode />
                <span>JavaScript</span>
              </div>

              <button className="copy-btn" onClick={copyCode}>
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? t("apiInt.copied") : t("apiInt.copy")}
              </button>
            </div>

            <pre>
              <code>{codeExample}</code>
            </pre>
          </div>

          {/* FEATURES */}
          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <FiZap />
              </div>
              <div>
                <h3>{t("apiInt.fastTitle")}</h3>
                <p>{t("apiInt.fastDesc")}</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <FiGlobe />
              </div>
              <div>
                <h3>{t("apiInt.freeTitle")}</h3>
                <p>{t("apiInt.freeDesc")}</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <FiLock />
              </div>
              <div>
                <h3>{t("apiInt.secureTitle")}</h3>
                <p>{t("apiInt.secureDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApiIntegration;