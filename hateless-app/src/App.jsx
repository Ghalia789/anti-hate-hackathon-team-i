import { useRef, useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Guide from "./sections/Guide";
import ApiTester from "./sections/ApiTester";
import ApiIntegration from "./sections/ApiIntegration";
import Support from "./sections/Support";
import ArticlesSection from "./sections/ArticlesSection";
import "./App.css";

function AppContent() {
  const guideRef = useRef(null);
  const apiTesterRef = useRef(null);
  const apiIntegrationRef = useRef(null);
  const articlesRef = useRef(null);
  const supportRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navigation
        onScroll={{
          guide: () => scrollToSection(guideRef),
          apiTester: () => scrollToSection(apiTesterRef),
          apiIntegration: () => scrollToSection(apiIntegrationRef),
          articles: () => scrollToSection(articlesRef),
          support: () => scrollToSection(supportRef),
        }}
      />
      <main className="main-content">
        <Hero onGetStarted={() => scrollToSection(guideRef)} />
        <div ref={guideRef}>
          <Guide />
        </div>
        <div ref={apiTesterRef}>
          <ApiTester />
        </div>
        <div ref={apiIntegrationRef}>
          <ApiIntegration />
        </div>
        <div ref={articlesRef}>
          <ArticlesSection />
        </div>
        <div ref={supportRef}>
          <Support />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
