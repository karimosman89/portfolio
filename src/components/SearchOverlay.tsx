import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, FolderGit2, BookOpen, Cpu, Briefcase, ChevronRight, CornerDownLeft } from 'lucide-react';
import { GITHUB_REPOS, TECHNICAL_BLOGS, SKILL_CATEGORIES, EXPERIENCES } from '../data';

interface SearchResult {
  type: 'project' | 'blog' | 'skill' | 'experience';
  title: string;
  subtitle: string;
  id?: string;
  url?: string;
  matchScore: number;
}

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleOpenSearch = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleOpenSearch);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleOpenSearch);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search Projects
    GITHUB_REPOS.forEach(repo => {
      let score = 0;
      if (repo.name.toLowerCase().includes(q)) score += 10;
      if (repo.description.toLowerCase().includes(q)) score += 5;
      if (repo.topics.some(t => t.toLowerCase().includes(q))) score += 5;
      if (repo.language.toLowerCase().includes(q)) score += 3;

      if (score > 0) {
        newResults.push({
          type: 'project',
          title: repo.name,
          subtitle: repo.description.substring(0, 80) + '...',
          url: repo.url,
          matchScore: score
        });
      }
    });

    // Search Blogs
    TECHNICAL_BLOGS.forEach(blog => {
      let score = 0;
      if (blog.title.toLowerCase().includes(q)) score += 10;
      if (blog.summary.toLowerCase().includes(q)) score += 5;
      if (blog.tags.some(t => t.toLowerCase().includes(q))) score += 5;

      if (score > 0) {
        newResults.push({
          type: 'blog',
          title: blog.title,
          subtitle: blog.summary.substring(0, 80) + '...',
          id: blog.id,
          matchScore: score
        });
      }
    });

    // Search Skills
    SKILL_CATEGORIES.forEach(category => {
      let score = 0;
      const matchedSkills = category.skills.filter(s => s.toLowerCase().includes(q));
      
      if (category.title.toLowerCase().includes(q)) score += 10;
      if (matchedSkills.length > 0) score += matchedSkills.length * 5;

      if (score > 0) {
        newResults.push({
          type: 'skill',
          title: category.title,
          subtitle: matchedSkills.length > 0 ? `Matches: ${matchedSkills.join(', ')}` : 'Category match',
          matchScore: score
        });
      }
    });

    // Search Experience
    EXPERIENCES.forEach(exp => {
      let score = 0;
      if (exp.company.toLowerCase().includes(q)) score += 10;
      if (exp.role.toLowerCase().includes(q)) score += 8;
      if (exp.description.toLowerCase().includes(q)) score += 3;
      if (exp.modelsUsed.some(m => m.toLowerCase().includes(q))) score += 5;

      if (score > 0) {
        newResults.push({
          type: 'experience',
          title: exp.role + ' @ ' + exp.company,
          subtitle: exp.period,
          matchScore: score
        });
      }
    });

    // Sort by score descending and take top 10
    newResults.sort((a, b) => b.matchScore - a.matchScore);
    setResults(newResults.slice(0, 10));
    setSelectedIndex(0);
  }, [query]);

  const handleAction = (result: SearchResult) => {
    setIsOpen(false);
    
    // Perform navigation or scrolling based on type
    setTimeout(() => {
      if (result.type === 'project' && result.url) {
        window.open(result.url, '_blank');
      } else if (result.type === 'blog') {
        // Dispatch custom event to open blog modal or scroll to blogs section
        const el = document.getElementById('github-and-technical-blogs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        // Optional: trigger opening the specific blog post if there's a global event for it
      } else if (result.type === 'skill') {
        const el = document.getElementById('skills-stack');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (result.type === 'experience') {
        const el = document.getElementById('career-and-education');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleAction(results[selectedIndex]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <FolderGit2 size={16} className="text-indigo-500" />;
      case 'blog': return <BookOpen size={16} className="text-emerald-500" />;
      case 'skill': return <Cpu size={16} className="text-amber-500" />;
      case 'experience': return <Briefcase size={16} className="text-rose-500" />;
      default: return <Search size={16} className="text-zinc-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Repository';
      case 'blog': return 'Publication';
      case 'skill': return 'Skillset';
      case 'experience': return 'Role';
      default: return 'Result';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-zinc-900/60 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl pointer-events-auto flex flex-col max-h-[80vh]"
            >
              {/* Search Header */}
              <div className="relative flex items-center border-b border-zinc-100 dark:border-zinc-800/80 px-4">
                <Search size={20} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search projects, skills, blogs..."
                  className="flex-1 bg-transparent px-4 py-5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none text-base font-sans"
                />
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800 px-2 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                    ESC
                  </kbd>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors sm:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {query.trim() === '' ? (
                  <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <p>Start typing to search across my portfolio.</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs">
                        <FolderGit2 size={12} /> Projects
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs">
                        <BookOpen size={12} /> Articles
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs">
                        <Cpu size={12} /> Skills
                      </span>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <p>No results found for "<span className="text-zinc-900 dark:text-zinc-200 font-medium">{query}</span>"</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {results.map((result, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <li key={index}>
                          <button
                            onClick={() => handleAction(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-left transition-colors ${
                              isSelected 
                                ? 'bg-indigo-50/80 dark:bg-indigo-500/10' 
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                                isSelected 
                                  ? 'border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-indigo-500/20' 
                                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                              }`}>
                                {getTypeIcon(result.type)}
                              </div>
                              <div className="min-w-0">
                                <p className={`truncate font-medium text-sm ${
                                  isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-zinc-900 dark:text-white'
                                }`}>
                                  {result.title}
                                </p>
                                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {result.subtitle}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0 hidden sm:flex">
                              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                                isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'
                              }`}>
                                {getTypeLabel(result.type)}
                              </span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-500 dark:text-indigo-400">
                                  <CornerDownLeft size={10} />
                                  <span>Jump</span>
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Search Footer */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <kbd className="flex h-5 w-5 items-center justify-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-medium shadow-sm">
                      ↑
                    </kbd>
                    <kbd className="flex h-5 w-5 items-center justify-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-medium shadow-sm">
                      ↓
                    </kbd>
                    <span className="ml-1">to navigate</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <kbd className="flex h-5 px-1.5 items-center justify-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-medium shadow-sm">
                      Enter
                    </kbd>
                    <span className="ml-1">to select</span>
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">
                  Portfolio Search
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
