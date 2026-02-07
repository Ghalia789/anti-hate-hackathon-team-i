import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navigation.css";

function Navigation({ onScroll }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    // <nav className="navbar">
    //   <div className="nav-container">
    //     <div className="logo">
    //       <img src="/logo.png" alt="Hateless Logo" className="logo-icon" />
    //       <span className="logo-text">Hateless</span>
    //     </div>
    //     <ul className="nav-links">
    //       <li>
    //         <button
    //           className="nav-link"
    //           onClick={() => {
    //             onScroll.guide();
    //             setIsOpen(false);
    //           }}
    //         >
    //           {t("nav.guide")}
    //         </button>
    //       </li>
    //       <li>
    //         <button
    //           className="nav-link"
    //           onClick={() => {
    //             onScroll.apiTester();
    //             setIsOpen(false);
    //           }}
    //         >
    //           {t("nav.apiTest")}
    //         </button>
    //       </li>
    //       <li>
    //         <button
    //           className="nav-link"
    //           onClick={() => {
    //             onScroll.apiIntegration();
    //             setIsOpen(false);
    //           }}
    //         >
    //           {t("nav.apiIntegration")}
    //         </button>
    //       </li>
    //       <li>
    //         <button
    //           className="nav-link"
    //           onClick={() => {
    //             onScroll.articles();
    //             setIsOpen(false);
    //           }}
    //         >
    //           {t("nav.articles")}
    //         </button>
    //       </li>
    //       <li>
    //         <button
    //           className="nav-link"
    //           onClick={() => {
    //             onScroll.support();
    //             setIsOpen(false);
    //           }}
    //         >
    //           {t("nav.support")}
    //         </button>
    //       </li>
    //     </ul>
    //     <LanguageSwitcher />
    //   </div>
    // </nav>
    <nav className="navbar glass">
      <div className="nav-container">
        <div className="logo">
          <img src="/logo.png" alt="Hateless Logo" className="logo-icon" />
          <span className="logo-text">HateLess</span>
        </div>

        <ul className="nav-links desktop-only">
          <li>
            <button className="nav-link" onClick={onScroll.guide}>
              {t("nav.guide")}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={onScroll.apiTester}>
              {t("nav.apiTest")}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={onScroll.apiIntegration}>
              {t("nav.apiIntegration")}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={onScroll.articles}>
              {t("nav.articles")}
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={onScroll.support}>
              {t("nav.support")}
            </button>
          </li>
        </ul>

        <LanguageSwitcher />
      </div>
    </nav>
  );
}

export default Navigation;
