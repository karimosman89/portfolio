import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'it';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.experience': 'Experience',
    'nav.skills': 'Tech Stack',
    'nav.openSource': 'Open Source',
    'nav.blog': 'AI News',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.metrics': 'Metrics',
    'nav.playground': 'Playground',
    'hero.greeting': 'Hi, I am',
    'hero.location': 'Based in',
    'hero.remote': 'Worldwide Remote',
    'hero.summaryTitle': 'Core Summary',
    'hero.bookCall': 'Book a Call',
    'hero.hireMe': 'Hire Me',
    'hero.resume': 'Print Specsheet',
    'contact.title': 'Initiate Engagement',
    'contact.subtitle': 'Select a pathway to initiate B2B consultancy, freelance contracts, or secure full-time placement.',
    'contact.calendlyTab': 'Book a Call (Calendly)',
    'contact.nativeTab': 'Native Booking',
    'contact.messageTab': 'Direct Dispatch',
  },
  it: {
    'nav.experience': 'Esperienza',
    'nav.skills': 'Competenze',
    'nav.openSource': 'Open Source',
    'nav.blog': 'Notizie AI',
    'nav.services': 'Servizi',
    'nav.contact': 'Contatti',
    'nav.metrics': 'Metriche',
    'nav.playground': 'Playground',
    'hero.greeting': 'Ciao, sono',
    'hero.location': 'Basato a',
    'hero.remote': 'Remoto Globale',
    'hero.summaryTitle': 'Sommario Tecnico',
    'hero.bookCall': 'Prenota una Chiamata',
    'hero.hireMe': 'Assumimi',
    'hero.resume': 'Stampa CV',
    'contact.title': 'Avvia Collaborazione',
    'contact.subtitle': 'Seleziona un percorso per avviare una consulenza B2B, contratti freelance o inserimento a tempo pieno.',
    'contact.calendlyTab': 'Prenota (Calendly)',
    'contact.nativeTab': 'Prenotazione Nativa',
    'contact.messageTab': 'Messaggio Diretto',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('karim_lang') as Language;
    if (savedLang === 'en' || savedLang === 'it') return savedLang;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'it' ? 'it' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('karim_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
