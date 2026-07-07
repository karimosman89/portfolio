import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data';
import { Mail, Linkedin, Github, MapPin, Phone, Briefcase, Award, ArrowUpRight, Globe2, ChevronRight, FileText, Settings, ShieldAlert, Sun, Moon, Sparkles, Palette, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LazyImage from './LazyImage';
import { useLanguage, Language } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import avatarImg from '../assets/images/karim_personal_avatar_1783292406420.png';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const typewriterPhrasesMap: Record<Language, string[]> = {
  en: [
    "I Build Enterprise AI Systems",
    "Generative AI Engineer",
    "LLM Architect",
    "AI Automation Architect",
    "Multi-Agent Systems Developer",
    "Turning AI Ideas into Production"
  ],
  it: [
    "Costruisco Sistemi IA Aziendali",
    "Ingegnere di IA Generativa",
    "Architetto di LLM",
    "Architetto di Automazione IA",
    "Sviluppatore di Sistemi Multi-Agente",
    "Trasformo Idee IA in Produzione"
  ],
  fr: [
    "Je construis des systèmes IA d'entreprise",
    "Ingénieur en IA Générative",
    "Architecte LLM",
    "Architecte d'Automatisation IA",
    "Développeur de Systèmes Multi-Agents",
    "Transformer les Idées IA en Production"
  ]
};

const localTranslations: Record<Language, Record<string, string>> = {
  en: {
    availability: "Available for Freelance Projects, B2B Contracts & Senior AI Roles",
    engineering: "Engineering",
    reliable: "reliable",
    subTitle: "Senior Machine Learning Architect with 5+ years of production experience. I design custom LLM-as-a-Service layers, optimize RAG databases, and adapt specialized parameters using Hugging Face PEFT/LoRA.",
    location: "Siena, Italy & Global (Remote)",
    experience: "5+ Years Industry Practice",
    latencyBadge: "⚡ -40% Latency / -25% Host Cost",
    deskHeader: "Contractor Desk",
    deskTitle: "Freelance & B2B",
    deskDesc: "Open to B2B consultations, contracts, and senior technical roles. Fully insured & VAT registered.",
    engagementStyle: "ENGAGEMENT STYLE",
    engagementVal: "B2B / Freelance / Contract",
    vatStatus: "VAT / TAX STATUS",
    vatVal: "Registered Business Entity",
    availabilityWeekly: "AVAILABILITY WEEKLY",
    availabilityVal: "UP TO 40 HOURS / FLEXIBLE",
    citizenshipRegion: "CITIZENSHIP / REGION",
    citizenshipVal: "EUROPEAN UNION / GLOBAL REMOTE",
    bookCall: "Book a Call",
    hireMe: "Hire Me",
    disclaimer: "SECURE CHANNELS • GLOBAL SERVICE PROVISION • Siena / Florence Remote",
    corporateMailbox: "Corporate Mailbox",
    directBusinessLines: "Direct Business Lines",
    search: "Search"
  },
  it: {
    availability: "Disponibile per Progetti Freelance, Contratti B2B e Ruoli IA Senior",
    engineering: "Ingegneria di",
    reliable: "affidabile",
    subTitle: "Senior Machine Learning Architect con oltre 5 anni di esperienza in produzione. Progetto layer LLM-as-a-Service personalizzati, ottimizzo database RAG e adatto parametri specializzati tramite Hugging Face PEFT/LoRA.",
    location: "Siena, Italia e Globale (Remoto)",
    experience: "Oltre 5 Anni di Pratica Industriale",
    latencyBadge: "⚡ -40% Latenza / -25% Costi Host",
    deskHeader: "Scrivania del Consulente",
    deskTitle: "Freelance e B2B",
    deskDesc: "Aperto a consulenze B2B, contratti e ruoli tecnici senior. P.IVA registrata e assicurazione completa.",
    engagementStyle: "STILE DI ENGAGEMENT",
    engagementVal: "B2B / Freelance / Contratto",
    vatStatus: "STATO IVA / TASSE",
    vatVal: "Partita IVA Registrata",
    availabilityWeekly: "DISPONIBILITÀ SETTIMANALE",
    availabilityVal: "FINO A 40 ORE / FLESSIBILE",
    citizenshipRegion: "CITTADINANZA / REGIONE",
    citizenshipVal: "UNIONE EUROPEA / REMOTO GLOBALE",
    bookCall: "Prenota una Chiamata",
    hireMe: "Assumimi",
    disclaimer: "CANALI SICURI • FORNITURA DI SERVIZI GLOBALE • Siena / Firenze Remoto",
    corporateMailbox: "Casella Postale Aziendale",
    directBusinessLines: "Linee Commerciali Dirette",
    search: "Cerca"
  },
  fr: {
    availability: "Disponible pour projets freelance, contrats B2B et rôles IA senior",
    engineering: "Ingénierie de l'",
    reliable: "fiable",
    subTitle: "Architecte Senior en Machine Learning avec plus de 5 ans d'expérience en production. Je conçois des couches LLM-as-a-Service personnalisées, j'optimise les bases de données RAG et j'adapte des paramètres spécialisés avec Hugging Face PEFT/LoRA.",
    location: "Sienne, Italie & Global (Télétravail)",
    experience: "Plus de 5 ans de pratique industrielle",
    latencyBadge: "⚡ -40% de latence / -25% de coût d'hébergement",
    deskHeader: "Bureau de Consultation",
    deskTitle: "Freelance & B2B",
    deskDesc: "Ouvert aux consultations B2B, contrats et rôles techniques de haut niveau. Entièrement assuré et enregistré pour la TVA.",
    engagementStyle: "STYLE D'ENGAGEMENT",
    engagementVal: "B2B / Freelance / Contrat",
    vatStatus: "STATUT TVA / FISCAL",
    vatVal: "Entité commerciale enregistrée",
    availabilityWeekly: "DISPONIBILITÉ HEBDOMADAIRE",
    availabilityVal: "JUSQU'À 40 HEURES / FLEXIBLE",
    citizenshipRegion: "CITOYENNETÉ / RÉGION",
    citizenshipVal: "UNION EUROPÉENNE / TÉLÉTRAVAIL GLOBAL",
    bookCall: "Réserver un appel",
    hireMe: "M'embaucher",
    disclaimer: "CANAUX SÉCURISÉS • PRESTATION DE SERVICES GLOBALE • Sienne / Florence Télétravail",
    corporateMailbox: "Boîte aux lettres d'entreprise",
    directBusinessLines: "Lignes commerciales directes",
    search: "Recherche"
  }
};

export default function Header({ isDark, toggleDarkMode, activeTheme, setActiveTheme }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const triggerContactTab = (tabName: 'booking' | 'calendly' | 'message') => {
    const event = new CustomEvent('set-contact-tab', { detail: tabName });
    window.dispatchEvent(event);
    
    // Smooth scroll to the inquiry section
    const el = document.getElementById('business-inquiry-desk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Typewriter parameters
  const typewriterPhrases = typewriterPhrasesMap[lang] || typewriterPhrasesMap.en;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const fullPhrase = typewriterPhrases[phraseIndex];

    const type = () => {
      if (!isDeleting) {
        setTypedText(fullPhrase.substring(0, typedText.length + 1));
        if (typedText === fullPhrase) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        setTypedText(fullPhrase.substring(0, typedText.length - 1));
        if (typedText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
          return;
        }
      }
      const delay = isDeleting ? 35 : 75;
      timer = setTimeout(type, delay);
    };

    timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  const themes = [
    { id: 'ai-dark', name: 'AI Dark', color: 'bg-zinc-900 border-zinc-800' },
    { id: 'aurora', name: 'Aurora Space', color: 'bg-emerald-950/80 border-emerald-800' },
    { id: 'cyber-blue', name: 'Cyber Blue', color: 'bg-blue-950/80 border-blue-800' },
    { id: 'glass-purple', name: 'Glass Purple', color: 'bg-fuchsia-950/80 border-fuchsia-800' },
    { id: 'emerald-ai', name: 'Emerald AI', color: 'bg-teal-950/80 border-teal-800' },
    { id: 'neon-gradient', name: 'Neon Peak', color: 'bg-pink-950/80 border-pink-800' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <div className="relative w-full">
      
      {/* 1. Global Navigation Bar - Stripe/Linear Inspired Ultra-Thin Layout */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          
          {/* Left Brand Area */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <LazyImage
                src={avatarImg}
                alt="Karim Osman"
                className="w-full h-full"
              />
              <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white dark:border-zinc-950 animate-pulse" />
            </div>
            <div>
              <div className="font-display font-semibold text-xs tracking-tight text-zinc-900 dark:text-zinc-100">{PERSONAL_INFO.name}</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">Senior AI &amp; B2B Consultant</div>
            </div>
          </div>

          {/* Center Navigation Links - Minimalist Editorial Styling */}
          <div className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            <a href="#metrics-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">01 / {t('nav.metrics') || 'Metrics'}</a>
            <a href="#interactive-ai-playground" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">02 / {t('nav.playground') || 'Playground'}</a>
            <a href="#career-and-education" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">03 / {t('nav.experience')}</a>
            <a href="#skills-stack" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">04 / {t('nav.skills')}</a>
            <a href="#github-and-technical-blogs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">05 / {t('nav.blog')}</a>
          </div>

          {/* Right Action Links */}
          <div className="flex items-center gap-2.5">
            {/* Theme Customizer Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
                title="Select Theme Presets"
              >
                <Palette size={13.5} className="text-indigo-600 dark:text-indigo-400" />
              </button>
              
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-1.5 shadow-xl backdrop-blur-md z-20 font-mono text-[10px]">
                    <div className="px-2.5 py-1.5 text-[8px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-900 mb-1 flex items-center justify-between">
                      <span>Neural Themes</span>
                      <Sparkles size={9} className="text-indigo-500 animate-pulse" />
                    </div>
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTheme(t.id);
                          setShowThemeMenu(false);
                        }}
                        className={`cursor-pointer w-full text-left px-2.5 py-2 rounded flex items-center justify-between transition ${
                          activeTheme === t.id
                            ? 'bg-zinc-100 dark:bg-zinc-900 font-bold text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="capitalize">{t.name}</span>
                        <span className={`h-2 w-2 rounded-full border border-white dark:border-zinc-950 ${
                          t.id === 'ai-dark' ? 'bg-zinc-500' :
                          t.id === 'aurora' ? 'bg-emerald-400' :
                          t.id === 'cyber-blue' ? 'bg-cyan-400' :
                          t.id === 'glass-purple' ? 'bg-fuchsia-500' :
                          t.id === 'emerald-ai' ? 'bg-teal-400' :
                          'bg-pink-500'
                        }`} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Global Search Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
              className="cursor-pointer inline-flex h-8 items-center justify-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
              title="Search Portfolio (Ctrl+K)"
            >
              <Search size={11} className="text-zinc-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex h-4 items-center justify-center rounded bg-zinc-200/50 dark:bg-zinc-800 px-1 font-sans text-[8px] font-bold text-zinc-500 dark:text-zinc-400">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle Switch */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={13.5} className="text-amber-500" /> : <Moon size={13.5} className="text-indigo-600" />}
            </button>

            {/* Language Switcher in Header */}
            <LanguageSwitcher />

            <motion.a
              id="nav-email-btn"
              href={`mailto:${PERSONAL_INFO.email}?subject=B2B Contract/Freelance Opportunity`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Mail size={11} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Email</span>
            </motion.a>

            <motion.a
              id="nav-linkedin-btn"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Linkedin size={11} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">LinkedIn</span>
              <ArrowUpRight size={10} className="text-zinc-450 dark:text-zinc-500" />
            </motion.a>
            
            <motion.a
              id="nav-github-btn"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-900 dark:border-zinc-850 bg-zinc-900 dark:bg-zinc-950 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white hover:bg-zinc-850 dark:hover:bg-zinc-900 transition-colors"
            >
              <Github size={11} />
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>
          </div>

        </div>
      </nav>

      {/* Grid Alignment Helper Lines (Architectural Accent) */}
      <div className="architectural-line-x w-full" />

      {/* 2. Stunning Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-16 md:px-8 md:pt-20">
        
        {/* Subtle grid backdrop for the Hero */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 dark:opacity-[0.15] bg-grid-mask pointer-events-none" />

        {/* Three.js-based animated 3D neural network background */}
        <NeuralNetworkBackground activeTheme={activeTheme} isDark={isDark} />

        <div className="grid gap-12 lg:grid-cols-12 lg:items-start relative z-10">
          
          {/* Left Column: Core Editorial Headline (Col Span 7) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            
            {/* Recruiting Availability Badge - Highly Stylized */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded border border-emerald-200/70 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>{t('hero.availability')}</span>
            </motion.div>

            {/* Core Display Title - Karpathy & Stripe Editorial Mix */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5.5xl lg:text-6xl leading-none min-h-[160px] sm:min-h-[140px] md:min-h-[190px]">
                {t('hero.title.part1')} <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">{t('hero.title.part2')}</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 dark:from-indigo-400 dark:via-violet-300 dark:to-emerald-450 drop-shadow-sm font-black uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl">
                  {typedText}
                </span>
                <span className="ml-1.5 inline-block h-6 sm:h-8 md:h-11 w-1 bg-indigo-500 dark:bg-indigo-400 animate-pulse align-middle" />
              </h1>
              
              <p className="font-sans text-base text-zinc-500 dark:text-zinc-400 md:text-lg leading-relaxed font-light">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Quick architectural specs / metadata row */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest border-t border-zinc-200/80 dark:border-zinc-800 pt-5">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-indigo-600 dark:text-indigo-400" /> {t('hero.location.details')}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={11} className="text-indigo-600 dark:text-indigo-400" /> {t('hero.experience.details')}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-200/40 dark:border-emerald-800/20">
                {t('hero.kpi.details')}
              </span>
            </motion.div>

            {/* Language Switchable Summary Card */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-md shadow-zinc-100/50 dark:shadow-none">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <Globe2 size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{t('hero.summaryTitle')}</span>
                </div>
                
                {/* Language buttons inside the box */}
                <div className="flex items-center p-0.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                  <button
                    onClick={() => setLang('en')}
                    className={`cursor-pointer px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
                      lang === 'en' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-800 font-bold shadow-xs' : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('it')}
                    className={`cursor-pointer px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
                      lang === 'it' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-800 font-bold shadow-xs' : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    IT
                  </button>
                  <button
                    onClick={() => setLang('fr')}
                    className={`cursor-pointer px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
                      lang === 'fr' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-800 font-bold shadow-xs' : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    FR
                  </button>
                </div>
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-300 text-xs md:text-sm leading-relaxed font-light">
                {lang === 'en' ? PERSONAL_INFO.summaryEn : lang === 'it' ? PERSONAL_INFO.summaryIt : PERSONAL_INFO.summaryFr}
              </p>
            </motion.div>

            {/* Direct Editorial CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={() => triggerContactTab('calendly')}
                className="cursor-pointer flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold uppercase tracking-wider text-[10px] px-5 py-3.5 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200"
              >
                <Calendar size={13} className="animate-pulse" />
                <span>{t('hero.bookCall')}</span>
              </button>
              
              <button
                onClick={() => triggerContactTab('message')}
                className="cursor-pointer flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-mono font-bold uppercase tracking-wider text-[10px] px-5 py-3.5 transition-all duration-200"
              >
                <Briefcase size={13} className="text-indigo-600 dark:text-indigo-400" />
                <span>{t('hero.hireMe')}</span>
              </button>
            </motion.div>

          </motion.div>

          {/* Right Column: High-End Freelance & B2B Engagement Desk (Col Span 5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6.5 shadow-xl shadow-zinc-200/40 dark:shadow-none">
              
              <div className="space-y-6">
                
                {/* Desk Header with Holographic Avatar */}
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4.5 flex items-start gap-4">
                  {/* Futuristic CG / Hologram Container */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-indigo-500/30 shrink-0 group/avatar shadow-inner shadow-black/10">
                    
                    {/* Animated laser scan bar */}
                    <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent z-10 opacity-70"
                         style={{
                           animation: 'laserScan 3.5s linear infinite',
                           boxShadow: '0 0 8px #6366f1, 0 0 12px #6366f1'
                         }}
                    />
                    
                    {/* Matrix style grid background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

                    <LazyImage
                      src={avatarImg}
                      alt="Karim Osman - Senior AI Engineer"
                      className="w-full h-full"
                      imgClassName="grayscale brightness-110 contrast-105 group-hover/avatar:scale-105 group-hover/avatar:grayscale-0 transition-all duration-700"
                    />

                    {/* Hologram glitch border lines on hover */}
                    <div className="absolute inset-0 border border-indigo-400/0 group-hover/avatar:border-indigo-400/40 transition-colors pointer-events-none z-10" />
                    
                    {/* Tiny blinking status LED */}
                    <div className="absolute right-1 top-1 flex h-1.5 w-1.5 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </div>

                    {/* Coordinates telemetry */}
                    <div className="absolute bottom-0.5 left-1 text-[6px] font-mono text-zinc-400 dark:text-zinc-550 select-none pointer-events-none bg-black/60 px-0.5 rounded leading-none">
                      SYS_SYS_OK
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping" />
                      <span>{t('hero.desk.badge')}</span>
                    </div>
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">{t('hero.desk.title')}</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-light">
                      {t('hero.desk.desc')}
                    </p>
                  </div>
                </div>

                {/* Engagement fields formatted like a Spec Sheet */}
                <div className="space-y-3 font-mono text-[10px]">
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">{t('hero.desk.style.label')}</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase">{t('hero.desk.style.value')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">{t('hero.desk.tax.label')}</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase">{t('hero.desk.tax.value')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">{t('hero.desk.availability.label')}</span>
                    <span className="text-emerald-700 dark:text-emerald-450 font-bold">{t('hero.desk.availability.value')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400 dark:text-zinc-500">{t('hero.desk.region.label')}</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold">{t('hero.desk.region.value')}</span>
                  </div>
                </div>

                {/* Action channels */}
                <div className="space-y-3">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}?subject=B2B Contract/Freelance Opportunity`}
                    className="flex items-center gap-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/30 dark:hover:bg-zinc-900 transition group"
                  >
                    <span className="rounded bg-indigo-50 dark:bg-indigo-950 p-2 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Mail size={14} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-mono text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">{t('hero.desk.corporate_mailbox')}</div>
                      <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{PERSONAL_INFO.email}</div>
                    </div>
                    <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition" />
                  </a>

                  {/* Dual Phones & WhatsApp Box */}
                  <div className="rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 p-3.5 space-y-2.5">
                    <div className="text-[9px] font-mono text-zinc-455 dark:text-zinc-555 uppercase tracking-wider">{t('hero.desk.business_lines')}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      <a href={`tel:${PERSONAL_INFO.phoneItaly.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-450 transition">
                        <span className="text-[9px] text-zinc-455 dark:text-zinc-500">IT</span> {PERSONAL_INFO.phoneItaly}
                      </a>
                      <a href={`tel:${PERSONAL_INFO.phoneFrance.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-450 transition justify-end">
                        <span className="text-[9px] text-zinc-455 dark:text-zinc-500">FR</span> {PERSONAL_INFO.phoneFrance}
                      </a>
                    </div>
                    {PERSONAL_INFO.phoneWhatsapp && (
                      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 flex justify-center">
                        <a
                          href={`https://wa.me/${PERSONAL_INFO.phoneWhatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-450 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 transition"
                        >
                          <span className="text-[9px] text-emerald-500 font-bold px-1 rounded bg-emerald-500/10 dark:bg-emerald-500/20">WA</span> {PERSONAL_INFO.phoneWhatsapp}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => triggerContactTab('calendly')}
                    className="cursor-pointer flex items-center justify-center gap-2 rounded bg-indigo-600 dark:bg-indigo-500 py-3 text-center text-[10px] font-mono uppercase tracking-wider font-extrabold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm"
                  >
                    <Calendar size={12} />
                    <span>{t('hero.bookCall')}</span>
                  </button>

                  <button
                    onClick={() => triggerContactTab('message')}
                    className="cursor-pointer flex items-center justify-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition"
                  >
                    <Briefcase size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{t('hero.hireMe')}</span>
                  </button>
                </div>

                {/* Small disclaimer info */}
                <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
                  {t('hero.desk.disclaimer')}
                </div>

              </div>
            </div>
          </motion.div>

        </div>

      </section>

    </div>
  );
}
