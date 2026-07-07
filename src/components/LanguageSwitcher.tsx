import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div id="language-switcher" className="flex items-center p-0.5 h-8 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
      <button
        onClick={() => setLang('en')}
        className={`cursor-pointer h-full px-2.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all flex items-center justify-center ${
          lang === 'en'
            ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-700 font-bold shadow-xs'
            : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => setLang('it')}
        className={`cursor-pointer h-full px-2.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all flex items-center justify-center ${
          lang === 'it'
            ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-700 font-bold shadow-xs'
            : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
        title="Italiano"
      >
        IT
      </button>
      <button
        onClick={() => setLang('fr')}
        className={`cursor-pointer h-full px-2.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all flex items-center justify-center ${
          lang === 'fr'
            ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-700 font-bold shadow-xs'
            : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
        title="Français"
      >
        FR
      </button>
    </div>
  );
}
