import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Metrics from './components/Metrics';
import AIDemos from './components/AIDemos';
import ExperienceTimeline from './components/ExperienceTimeline';
import SkillsBento from './components/SkillsBento';
import GithubAndBlogs from './components/GithubAndBlogs';
import ContactForm from './components/ContactForm';
import { PERSONAL_INFO } from './data';
import { Mail, Linkedin, Github, FileText, ArrowUp, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-zinc-950 font-sans text-zinc-850 dark:text-zinc-200 selection:bg-indigo-500/20 selection:text-indigo-900 transition-colors duration-300">
      
      {/* Premium subtle light grid background overlay */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-15 bg-grid-mask" />
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] blur-[140px]" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[70%] rounded-full bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] blur-[140px]" />
      </div>

      <div className="relative flex flex-col min-h-screen z-10">
        
        {/* Animated Main Content Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {/* 1. Header & Bio Hero Summary */}
          <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

          {/* 2. Core Quantitative Impact Metrics */}
          <Metrics />

          {/* 3. Rich Interactive Sandboxes */}
          <AIDemos />

          {/* 4. Experience & Careers Timeline */}
          <ExperienceTimeline />

          {/* 5. Categorized Bento Skills Matrix */}
          <SkillsBento />

          {/* 6. GitHub Repositories & Publication split-pane */}
          <GithubAndBlogs />

          {/* 7. Business and Freelance Inquiry Desk */}
          <ContactForm />

        </motion.div>

        {/* Global Minimal Footer */}
        <footer className="border-t border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 py-12 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between text-xs text-zinc-500 dark:text-zinc-400">
              
              {/* Identity area */}
              <div className="space-y-2">
                <div className="font-display text-sm font-extrabold text-zinc-900 dark:text-white tracking-wider uppercase flex items-center gap-2">
                  <Milestone size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{PERSONAL_INFO.name}</span>
                </div>
                <p className="text-zinc-650 dark:text-zinc-350 font-light max-w-md leading-relaxed">
                  Senior AI Engineer &amp; Machine Learning Architect. Dedicated to orchestrating high-performance neural pipelines and secure multi-agent RAG endpoints.
                </p>
                <p className="font-mono text-[10px] text-zinc-455 dark:text-zinc-500">
                  &copy; 2026. Dual authorized for European &amp; Italian roles.
                </p>
              </div>

              {/* Action Buttons & Utilities */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="cursor-pointer flex items-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-zinc-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  title="Export a physical PDF of this resume"
                >
                  <FileText size={14} />
                  <span>Generate PDF Resume</span>
                </button>

                <button
                  onClick={scrollToTop}
                  className="cursor-pointer flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-950 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                  title="Scroll to top of portfolio"
                >
                  <ArrowUp size={15} />
                </button>
              </div>

            </div>

            {/* Print-friendly styles for beautiful physical PDF exporting */}
            <style>{`
              @media print {
                body {
                  background: white !important;
                  color: black !important;
                }
                nav, footer, button, select, input, textarea, .sticky, #interactive-ai-playground, #business-inquiry-desk {
                  display: none !important;
                }
                #career-and-education, #skills-stack, #metrics-dashboard, #github-and-technical-blogs {
                  display: block !important;
                  width: 100% !important;
                  color: black !important;
                  border: none !important;
                  margin: 0 !important;
                  padding: 10px 0 !important;
                  page-break-inside: avoid;
                }
                #skills-stack .grid {
                  display: grid !important;
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  gap: 16px !important;
                }
                #skills-stack .grid > div {
                  page-break-inside: avoid;
                  background: #f9f9fb !important;
                  border: 1px solid #e4e4e7 !important;
                }
                .text-zinc-800, .text-zinc-900, .dark\\:text-white {
                  color: #050505 !important;
                }
                .text-indigo-600, .text-zinc-500, .dark\\:text-zinc-400 {
                  color: #2e2e2e !important;
                }
                .bg-zinc-50, .border-zinc-200, .dark\\:border-zinc-800 {
                  background: transparent !important;
                  border-color: #dddddd !important;
                }
                h1, h2, h3, h4, h5 {
                  color: black !important;
                  page-break-after: avoid;
                }
                p, li {
                  color: #1a1a1a !important;
                }
              }
            `}</style>

          </div>
        </footer>

      </div>
    </div>
  );
}
