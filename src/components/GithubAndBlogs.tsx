import React, { useState } from 'react';
import { GITHUB_REPOS, TECHNICAL_BLOGS, PERSONAL_INFO } from '../data';
import { Github, Star, GitFork, BookOpen, Calendar, Clock, ChevronRight, CornerDownRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GithubAndBlogs() {
  const [selectedBlogId, setSelectedBlogId] = useState(TECHNICAL_BLOGS[0].id);

  const activeBlog = TECHNICAL_BLOGS.find(b => b.id === selectedBlogId) || TECHNICAL_BLOGS[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      }
    }
  };

  return (
    <motion.section
      id="github-and-technical-blogs"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="grid gap-12 lg:grid-cols-2">
        
        {/* GitHub Segment (Left Pane) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                <Github size={11} />
                <span>05 / Open-Source blueprint</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
                GitHub Repositories
              </h2>
            </div>
            
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold flex items-center gap-1 transition font-mono"
            >
              <span>Follow @karimosman89</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 sm:grid-cols-2 font-sans"
          >
            {GITHUB_REPOS.map((repo) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -3, borderColor: "rgba(79, 70, 229, 0.35)" }}
                className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-5 flex flex-col justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CornerDownRight size={11} /> {repo.language}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-550 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <ExternalLink size={13} />
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-extrabold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {repo.name}
                  </h3>
                  
                  <p className="text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed line-clamp-3 font-light">
                    {repo.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-medium">
                    <span className="flex items-center gap-0.5">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork size={11} /> {repo.forks}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-mono bg-white dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-550 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Technical Blogs Segment (Right Pane) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="space-y-6 font-sans"
        >
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <BookOpen size={11} />
              <span>06 / Technical Publications</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
              Engineering Journals
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-5 h-[410px]">
            {/* Sidebar selector */}
            <div className="md:w-52 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
              {TECHNICAL_BLOGS.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => setSelectedBlogId(blog.id)}
                  className={`cursor-pointer w-full text-left p-3.5 rounded border text-xs transition-all duration-200 flex items-center justify-between gap-2 group ${
                    selectedBlogId === blog.id
                      ? 'border-indigo-150/50 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-400 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/15 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 truncate">
                    <div className="truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold">{blog.title}</div>
                    <div className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 font-light">
                      <Calendar size={10} /> {blog.date}
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Content Reader */}
            <div className="flex-1 bg-zinc-50/30 dark:bg-zinc-950/10 border border-zinc-200 dark:border-zinc-800 rounded p-5.5 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="space-y-1.5 pb-3.5 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-wrap gap-2 items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-450 font-mono">
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                      <Calendar size={11} /> {activeBlog.date}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-450 dark:text-zinc-500">
                      <Clock size={11} /> {activeBlog.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight leading-snug">
                    {activeBlog.title}
                  </h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {activeBlog.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/45 text-indigo-600 dark:text-indigo-400 font-mono font-bold px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content text */}
                <p className="text-zinc-650 dark:text-zinc-300 text-xs leading-relaxed whitespace-pre-line font-light">
                  {activeBlog.content}
                </p>
              </div>

              {/* Discussion Pitch */}
              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-4 text-[10px] text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-light">Interested in discussing these optimization details?</span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}?subject=Inquiry regarding your article: ${encodeURIComponent(activeBlog.title)}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-500 dark:hover:text-indigo-300 font-bold uppercase tracking-wider text-[9px] font-mono"
                >
                  Establish correspondence with Karim
                </a>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
