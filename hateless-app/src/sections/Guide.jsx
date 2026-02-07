// import { useLanguage } from '../context/LanguageContext'
// import './Guide.css'

// function Guide() {
//   const { t } = useLanguage()

//   return (
//     <section className="guide">
//       <div className="guide-container">
//         <div className="guide-header">
//           <h2>{t('guide.title')}</h2>
//           <p>{t('guide.subtitle')}</p>
//         </div>

//         <div className="steps">
//           <div className="step">
//             <div className="step-number">1</div>
//             <div className="step-content">
//               <h3>{t('guide.step1Title')}</h3>
//               <p>{t('guide.step1')}</p>
//             </div>
//           </div>

//           <div className="step">
//             <div className="step-number">2</div>
//             <div className="step-content">
//               <h3>{t('guide.step2Title')}</h3>
//               <p>{t('guide.step2')}</p>
//             </div>
//           </div>

//           <div className="step">
//             <div className="step-number">3</div>
//             <div className="step-content">
//               <h3>{t('guide.step3Title')}</h3>
//               <p>{t('guide.step3')}</p>
//             </div>
//           </div>

//           <div className="step">
//             <div className="step-number">4</div>
//             <div className="step-content">
//               <h3>{t('guide.step4Title')}</h3>
//               <p>{t('guide.step4')}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Guide

import { useLanguage } from "../context/LanguageContext";
import "./Guide.css";
import { FiKey, FiSend, FiSettings, FiCheckCircle } from "react-icons/fi";

function Guide() {
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      title: t("guide.step1Title"),
      text: t("guide.step1"),
      icon: <FiKey />,
    },
    {
      id: 2,
      title: t("guide.step2Title"),
      text: t("guide.step2"),
      icon: <FiSend />,
    },
    {
      id: 3,
      title: t("guide.step3Title"),
      text: t("guide.step3"),
      icon: <FiSettings />,
    },
    {
      id: 4,
      title: t("guide.step4Title"),
      text: t("guide.step4"),
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <section className="guide-modern">
      <div className="guide-container">
        <header className="guide-header">
          <h2>{t("guide.title")}</h2>
          <p>{t("guide.subtitle")}</p>
        </header>

        <div className="timeline">
          {steps.map((step, index) => (
            <div className="timeline-step" key={step.id}>
              <div className="timeline-dot">
                <span>{step.icon}</span>
              </div>

              {index !== steps.length - 1 && <div className="timeline-line" />}

              <div className="timeline-content">
                <span className="step-index">
                  {String(step.id).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Guide;
