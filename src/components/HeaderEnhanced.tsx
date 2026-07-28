import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github, FileText, Moon, Sun, Palette } from 'lucide-react';
import { PERSONAL_INFO } from '../data';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const themes = [
  { id: 'ai-dark', label: 'AI Dark', colors: 'from-indigo-500 to-emerald-500' },
  { id: 'aurora', label: 'Aurora', colors: 'from-emerald-400 to-purple-500' },
  { id: 'cyber-blue', label: 'Cyber Blue', colors: 'from-cyan-450 to-blue-500' },
  { id: 'glass-purple', label: 'Glass Purple', colors: 'from-fuchsia-400 to-indigo-500' },
  { id: 'emerald-ai', label: 'Emerald AI', colors: 'from-teal-400 to-emerald-500' },
  { id: 'neon-gradient', label: 'Neon', colors: 'from-pink-400 to-orange-500' }
];

export default function HeaderEnhanced({ isDark, toggleDarkMode, activeTheme, setActiveTheme }: HeaderProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl transition-all duration-300"
      style={{
        boxShadow: scrollY > 10 ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Name */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="font-display font-bold text-white text-lg relative z-10">K</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-zinc-900 dark:text-white text-lg">
                {PERSONAL_INFO.name.split(' ')[0]}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                AI Engineer & ML Architect
              </p>
            </div>
          </motion.div>

          {/* Navigation & Controls */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 md:gap-4"
          >
            {/* Social Links */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.a
                href={`mailto:${PERSONAL_INFO.email}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                title="Email"
              >
                <Mail size={18} className="text-zinc-600 dark:text-zinc-400" />
              </motion.a>
              <motion.a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={18} className="text-zinc-600 dark:text-zinc-400" />
              </motion.a>
              <motion.a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                title="GitHub"
              >
                <Github size={18} className="text-zinc-600 dark:text-zinc-400" />
              </motion.a>
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                title="Select Theme"
              >
                <Palette size={18} className="text-zinc-600 dark:text-zinc-400" />
              </motion.button>

              {/* Theme Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: showThemeMenu ? 1 : 0,
                  scale: showThemeMenu ? 1 : 0.95,
                  pointerEvents: showThemeMenu ? 'auto' : 'none',
                }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-3 space-y-2"
              >
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setActiveTheme(theme.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeTheme === theme.id
                        ? 'bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.colors}`} />
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {theme.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun size={18} className="text-zinc-600 dark:text-zinc-400" />
              ) : (
                <Moon size={18} className="text-zinc-600 dark:text-zinc-400" />
              )}
            </motion.button>

            {/* Resume Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
            >
              <FileText size={16} />
              Resume
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
