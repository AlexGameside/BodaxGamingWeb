import { useState, useEffect } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('analyticsConsent', 'accepted');
    localStorage.setItem('marketingConsent', 'accepted');
    setShowBanner(false);
    
    // Here you would initialize analytics if you decide to use them
    // initializeAnalytics();
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('analyticsConsent', 'declined');
    localStorage.setItem('marketingConsent', 'declined');
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  const handleCustomAccept = (analytics, marketing) => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('analyticsConsent', analytics ? 'accepted' : 'declined');
    localStorage.setItem('marketingConsent', marketing ? 'accepted' : 'declined');
    setShowBanner(false);
    
    if (analytics) {
      // initializeAnalytics();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <h3 className="cookie-banner-title">🍪 Cookie-Einstellungen</h3>
          <p className="cookie-banner-text">
            Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
            Einige Cookies sind notwendig für den Betrieb der Website, während andere uns helfen, 
            diese Website und die Nutzererfahrung zu verbessern.
          </p>
          
          {!showDetails ? (
            <div className="cookie-banner-buttons">
              <button 
                className="cookie-btn cookie-btn-accept" 
                onClick={handleAcceptAll}
              >
                Alle akzeptieren
              </button>
              <button 
                className="cookie-btn cookie-btn-necessary" 
                onClick={handleAcceptNecessary}
              >
                Nur notwendige
              </button>
              <button 
                className="cookie-btn cookie-btn-customize" 
                onClick={handleCustomize}
              >
                Anpassen
              </button>
            </div>
          ) : (
            <CookieDetails onAccept={handleCustomAccept} onBack={() => setShowDetails(false)} />
          )}
          
          <div className="cookie-banner-links">
            <a href="/privacy" className="cookie-link">Datenschutzerklärung</a>
            <a href="/impressum" className="cookie-link">Impressum</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const CookieDetails = ({ onAccept, onBack }) => {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    onAccept(analytics, marketing);
  };

  return (
    <div className="cookie-details">
      <div className="cookie-category">
        <div className="cookie-category-header">
          <h4>Notwendige Cookies</h4>
          <span className="cookie-required">Erforderlich</span>
        </div>
        <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</p>
      </div>

      <div className="cookie-category">
        <div className="cookie-category-header">
          <h4>Analytics Cookies</h4>
          <label className="cookie-toggle">
            <input 
              type="checkbox" 
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem sie Informationen anonym sammeln und melden.</p>
      </div>

      <div className="cookie-category">
        <div className="cookie-category-header">
          <h4>Marketing Cookies</h4>
          <label className="cookie-toggle">
            <input 
              type="checkbox" 
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <p>Diese Cookies werden verwendet, um Besuchern auf Webseiten zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind.</p>
      </div>

      <div className="cookie-details-buttons">
        <button className="cookie-btn cookie-btn-back" onClick={onBack}>
          Zurück
        </button>
        <button className="cookie-btn cookie-btn-save" onClick={handleSave}>
          Einstellungen speichern
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
