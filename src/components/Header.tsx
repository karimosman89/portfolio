import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data';
import { Mail, Linkedin, Github, MapPin, Phone, Briefcase, Award, ArrowUpRight, Globe2, ChevronRight, FileText, Settings, ShieldAlert, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDark, toggleDarkMode }: HeaderProps) {
  const [lang, setLang] = useState<'en' | 'it'>('en');

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
        ease: [0.16, 1, 0.3, 1]
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
              <img
                src="/src/assets/images/karim_personal_avatar_1783292406420.jpg"
                alt="Karim Osman"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
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
            <a href="#metrics-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">01 / Metrics</a>
            <a href="#interactive-ai-playground" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">02 / Playground</a>
            <a href="#career-and-education" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">03 / Experience</a>
            <a href="#skills-stack" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">04 / Tech Stack</a>
            <a href="#github-and-technical-blogs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">05 / Journals</a>
          </div>

          {/* Right Action Links */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle Switch */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={13.5} className="text-amber-500" /> : <Moon size={13.5} className="text-indigo-600" />}
            </button>

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
              <span>Available for Freelance Projects, B2B Contracts &amp; Senior AI Roles</span>
            </motion.div>

            {/* Core Display Title - Karpathy & Stripe Editorial Mix */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-6xl leading-tight">
                Engineering <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">reliable</span> <br />
                enterprise AI systems.
              </h1>
              
              <p className="font-sans text-base text-zinc-500 dark:text-zinc-400 md:text-lg leading-relaxed font-light">
                Senior Machine Learning Architect with <span className="text-zinc-850 dark:text-zinc-200 font-semibold">5+ years of production experience</span>. 
                I design custom LLM-as-a-Service layers, optimize RAG databases, and adapt specialized parameters using Hugging Face PEFT/LoRA.
              </p>
            </motion.div>

            {/* Quick architectural specs / metadata row */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest border-t border-zinc-200/80 dark:border-zinc-800 pt-5">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-indigo-600 dark:text-indigo-400" /> Siena, Italy &amp; Global (Remote)
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={11} className="text-indigo-600 dark:text-indigo-400" /> 5+ Years Industry Practice
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-200/40 dark:border-emerald-800/20">
                ⚡ -40% Latency / -25% Host Cost
              </span>
            </motion.div>

            {/* Language Switchable Summary Card */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-md shadow-zinc-100/50 dark:shadow-none">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <Globe2 size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{lang === 'en' ? 'Core Summary' : 'Sommario Tecnico'}</span>
                </div>
                
                {/* Language buttons inside the box */}
                <div className="flex items-center p-0.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-805">
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
                </div>
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-300 text-xs md:text-sm leading-relaxed font-light">
                {lang === 'en' ? PERSONAL_INFO.summaryEn : PERSONAL_INFO.summaryIt}
              </p>
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
                
                {/* Desk Header */}
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4.5 flex items-start gap-4">
                  <img
                    src="/src/assets/images/karim_personal_avatar_1783292406420.jpg"
                    alt="Karim Osman - Senior AI Engineer"
                    className="w-16 h-16 rounded object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-1">Contractor Desk</div>
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">Freelance &amp; B2B</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-light">
                      Open to B2B consultations, contracts, and senior technical roles. Fully insured &amp; VAT registered.
                    </p>
                  </div>
                </div>

                {/* Engagement fields formatted like a Spec Sheet */}
                <div className="space-y-3 font-mono text-[10px]">
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">ENGAGEMENT STYLE</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase">B2B / Freelance / Contract</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">VAT / TAX STATUS</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase">Registered Business Entity</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-zinc-400 dark:text-zinc-500">AVAILABILITY WEEKLY</span>
                    <span className="text-emerald-700 dark:text-emerald-450 font-bold">UP TO 40 HOURS / FLEXIBLE</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400 dark:text-zinc-500">CITIZENSHIP / REGION</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold">EUROPEAN UNION / GLOBAL REMOTE</span>
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
                      <div className="text-[9px] font-mono text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Corporate Mailbox</div>
                      <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{PERSONAL_INFO.email}</div>
                    </div>
                    <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition" />
                  </a>

                  {/* Dual Phones Box */}
                  <div className="rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 p-3.5 space-y-2">
                    <div className="text-[9px] font-mono text-zinc-450 dark:text-zinc-550 uppercase tracking-wider">Direct Business Lines</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      <a href={`tel:${PERSONAL_INFO.phoneItaly.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-450 transition">
                        <span className="text-[9px] text-zinc-455 dark:text-zinc-500">IT</span> {PERSONAL_INFO.phoneItaly}
                      </a>
                      <a href={`tel:${PERSONAL_INFO.phoneFrance.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-450 transition justify-end">
                        <span className="text-[9px] text-zinc-455 dark:text-zinc-500">FR</span> {PERSONAL_INFO.phoneFrance}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    id="hero-recruitment-linkedin"
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded bg-indigo-600 dark:bg-indigo-500 py-3 text-center text-[10px] font-mono uppercase tracking-wider font-extrabold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm"
                  >
                    <Linkedin size={12} fill="currentColor" stroke="none" />
                    <span>Engage LinkedIn</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="cursor-pointer flex items-center justify-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition"
                  >
                    <FileText size={12} className="text-zinc-450 dark:text-zinc-550" />
                    <span>Print Specsheet</span>
                  </button>
                </div>

                {/* Small disclaimer info */}
                <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
                  SECURE CHANNELS &bull; GLOBAL SERVICE PROVISION &bull; Siena / Florence Remote
                </div>

              </div>
            </div>
          </motion.div>

        </div>

      </section>

    </div>
  );
}
