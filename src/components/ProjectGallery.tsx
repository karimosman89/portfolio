import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GITHUB_REPOS, EXPERIENCES } from '../data';
import { Search, SlidersHorizontal, Github, Cpu, Briefcase, Star, GitFork, CornerDownRight, ExternalLink, Eye, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { Experience } from '../types';

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'genai' | 'vision' | 'mlops' | 'devtools';
  tags: string[];
  type: 'industrial' | 'open-source';
  stars?: number;
  forks?: number;
  url?: string;
  originalExperience?: Experience;
}

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'alphabetical'>('rating');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  // Unify Experiences and Github Repos into a common high-quality representation
  const galleryItems = useMemo(() => {
    const items: GalleryItem[] = [];

    // Map GitHub repositories
    GITHUB_REPOS.forEach((repo) => {
      // Intelligently assign category based on topics and name
      let category: 'genai' | 'vision' | 'mlops' | 'devtools' = 'devtools';
      const topicsLower = repo.topics.map(t => t.toLowerCase());
      
      if (topicsLower.includes('genai') || topicsLower.includes('llm') || topicsLower.includes('agents') || repo.description.toLowerCase().includes('claude') || repo.description.toLowerCase().includes('gpt')) {
        category = 'genai';
      } else if (topicsLower.includes('vision') || topicsLower.includes('yolo') || topicsLower.includes('image')) {
        category = 'vision';
      } else if (topicsLower.includes('mlops') || topicsLower.includes('pipeline') || topicsLower.includes('scaling')) {
        category = 'mlops';
      }

      items.push({
        id: `repo-${repo.name}`,
        title: repo.name,
        subtitle: repo.description,
        category,
        tags: Array.from(new Set([repo.language, ...repo.topics.slice(0, 3)])),
        type: 'open-source',
        stars: repo.stars,
        forks: repo.forks,
        url: repo.url
      });
    });

    // Map Industrial roles
    EXPERIENCES.forEach((exp, idx) => {
      let category: 'genai' | 'vision' | 'mlops' | 'devtools' = 'genai';
      const modelsLower = exp.modelsUsed.map(m => m.toLowerCase());
      
      if (modelsLower.some(m => m.includes('yolo') || m.includes('vision') || m.includes('cnn'))) {
        category = 'vision';
      } else if (modelsLower.some(m => m.includes('mlops') || m.includes('aws') || m.includes('docker') || m.includes('kubernetes'))) {
        category = 'mlops';
      }

      items.push({
        id: `exp-${idx}`,
        title: exp.role,
        subtitle: `${exp.company} — ${exp.period}. ${exp.description}`,
        category,
        tags: Array.from(new Set(exp.modelsUsed.slice(0, 4))),
        type: 'industrial',
        originalExperience: exp
      });
    });

    return items;
  }, []);

  // Filtering and searching logic
  const filteredItems = useMemo(() => {
    return galleryItems
      .filter((item) => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        } else {
          // Sort by "rating" (stars first, then type importance)
          const scoreA = (a.stars || 0) + (a.type === 'industrial' ? 50 : 0);
          const scoreB = (b.stars || 0) + (b.type === 'industrial' ? 50 : 0);
          return scoreB - scoreA;
        }
      });
  }, [galleryItems, activeCategory, searchQuery, sortBy]);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'genai', label: 'Generative AI & LLMs' },
    { id: 'vision', label: 'Computer Vision (CV)' },
    { id: 'mlops', label: 'MLOps & Systems' },
    { id: 'devtools', label: 'Developer Tooling' },
  ];

  return (
    <section id="project-gallery-section" className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Cpu size={11} className="animate-pulse" />
            <span>04 / Case workspace</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            Project &amp; Production <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">Workspace</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            A filterable blueprint of open-source libraries, micro-agent sandboxes, and highly scalable industrial enterprise products.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search technologies, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-sans rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-9 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/30"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center p-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shrink-0 text-xs">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-2 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer ${
                sortBy === 'rating'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
              }`}
            >
              Top Impact
            </button>
            <button
              onClick={() => setSortBy('alphabetical')}
              className={`px-3 py-2 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer ${
                sortBy === 'alphabetical'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
              }`}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`cursor-pointer px-4 py-2 text-[10px] font-mono uppercase tracking-wider rounded border transition-all ${
              activeCategory === cat.id
                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-500/10'
                : 'bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div 
        layout
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs hover:border-indigo-500/30 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-zinc-100/50 dark:hover:shadow-none transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header Tag / Icon */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                    item.type === 'industrial'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40'
                  }`}>
                    {item.type === 'industrial' ? (
                      <>
                        <Briefcase size={9} />
                        <span>Corporate Case Study</span>
                      </>
                    ) : (
                      <>
                        <Github size={9} />
                        <span>Open Source</span>
                      </>
                    )}
                  </span>

                  <span className="text-[9px] font-mono uppercase font-bold text-zinc-400 dark:text-zinc-550">
                    {item.category === 'genai' ? 'GenAI / LLM' :
                     item.category === 'vision' ? 'CV / YOLO' :
                     item.category === 'mlops' ? 'MLOps' : 'DevTool'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-extrabold text-sm text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed font-light mt-2 line-clamp-3">
                    {item.subtitle}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, idx) => (
                    <span 
                      key={`${tag}-${idx}`} 
                      className="text-[9px] font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-650 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs">
                {item.type === 'open-source' ? (
                  <div className="flex gap-3 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" /> {item.stars}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork size={11} /> {item.forks}
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1 font-bold">
                    <CheckCircle2 size={11} /> High Uptime Live
                  </span>
                )}

                {item.type === 'industrial' && item.originalExperience ? (
                  <button
                    onClick={() => setSelectedExperience(item.originalExperience || null)}
                    className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-mono font-bold text-[10px] flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>Inspect Case</span>
                    <Eye size={11} />
                  </button>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-mono font-bold text-[10px] flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Repository</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Embedded Project Modal for inspect case actions */}
      <ProjectModal
        isOpen={selectedExperience !== null}
        onClose={() => setSelectedExperience(null)}
        project={selectedExperience}
      />
    </section>
  );
}
