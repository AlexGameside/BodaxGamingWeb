import { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

export const useCookieConsent = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};

export const CookieProvider = ({ children }) => {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Load consent from localStorage
    const consent = localStorage.getItem('cookieConsent');
    const analytics = localStorage.getItem('analyticsConsent');
    const marketing = localStorage.getItem('marketingConsent');

    if (consent) {
      setConsentGiven(true);
      setAnalyticsConsent(analytics === 'accepted');
      setMarketingConsent(marketing === 'accepted');
    }
  }, []);

  const updateConsent = (analytics, marketing) => {
    setAnalyticsConsent(analytics);
    setMarketingConsent(marketing);
    setConsentGiven(true);
    
    localStorage.setItem('analyticsConsent', analytics ? 'accepted' : 'declined');
    localStorage.setItem('marketingConsent', marketing ? 'accepted' : 'declined');
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('analyticsConsent');
    localStorage.removeItem('marketingConsent');
    setConsentGiven(false);
    setAnalyticsConsent(false);
    setMarketingConsent(false);
  };

  const value = {
    analyticsConsent,
    marketingConsent,
    consentGiven,
    updateConsent,
    resetConsent
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};
