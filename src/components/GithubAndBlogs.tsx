import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { GITHUB_REPOS, TECHNICAL_BLOGS, PERSONAL_INFO } from '../data';
import { Github, Star, GitFork, BookOpen, Calendar, Clock, ChevronRight, CornerDownRight, ExternalLink, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ADDITIONAL_NEWS_POOL = [
  {
    id: "ai-news-6",
    title: "DeepSeek-V3: Redefining Ultra-Low-Cost MoE Implementations",
    summary: "How Mixture-of-Experts (MoE) architectures with multi-head latent attention (MLA) are drastically cutting inference and training computation requirements.",
    content: `Mixture-of-Experts (MoE) is no longer a fringe optimization—it is the modern standard for ultra-efficient model scaling. With the open-source release of DeepSeek-V3, developers are analyzing how a model with 671 billion total parameters can run with only 37 billion active parameters per token.

### Multi-Head Latent Attention (MLA)
One of the core breakthroughs is MLA, which significantly reduces the Key-Value (KV) cache size during inference. This allows larger batch sizes and much faster token generation speeds.

### Multi-Token Prediction (MTP)
V3 introduces a training objective where the model predicts multiple future tokens in parallel rather than a single next token. This enhances the model's structural representation of code and logic, boosting complex reasoning capacity.

### Cost Efficiency
By training on a massive 14.8-trillion-token high-quality corpus with state-of-the-art FP8 mixed-precision, training costs were kept below $6 million—a fraction of the budget typical for models of this tier.`,
    readTime: "5 min read",
    tags: ["DeepSeek", "MoE", "MLA", "Inference Scaling", "Open Source"]
  },
  {
    id: "ai-news-7",
    title: "OpenAI o3 & Reasoning Models: Shifting Paradigm from Retrieval to Computation",
    summary: "An in-depth look at test-time compute scaling and reinforcement learning loops that enable AI models to solve complex mathematical proofs and competitive coding puzzles.",
    content: `The frontier of AI is shifting from pre-training larger neural networks to scaling *test-time compute*. OpenAI's o3 model demonstrates that giving a model time to 'think' and execute hidden chains of thought yields dramatic improvements in complex domains.

### What is Test-Time Compute?
Instead of outputting the first token that comes to mind, the model runs a reinforcement learning (RL) guided tree-search:
- Evaluates multiple alternative solution paths.
- Self-corrects its code or mathematical reasoning when it detects structural errors.
- Refines its reasoning steps before generating the final user-facing answer.

### The Impact on Engineering
For software engineering, this means the model can reason about complex race conditions, optimize deep database indices, and design distributed systems with unprecedented accuracy.`,
    readTime: "7 min read",
    tags: ["OpenAI o3", "Reasoning Models", "Test-Time Compute", "RLHF", "Advanced Coding"]
  },
  {
    id: "ai-news-8",
    title: "Next-Gen Vector Databases: High-Throughput Search with Low Memory Footprint",
    summary: "An analysis of Scalar Quantization and Product Quantization techniques enabling massive vectors to fit entirely in memory with 95%+ recall accuracy.",
    content: `As enterprise AI adoption scales, vector databases are storing billions of high-dimensional embeddings. The main bottleneck has shifted from query latency to the sheer cost of keeping high-dimensional floating-point vectors in RAM.

### Compression: Scalar Quantization (SQ8)
SQ8 maps 32-bit floats (FP32) to 8-bit integers (INT8), compressing the database footprint by 4x:
- **Disk/Memory footprint**: Reduced by 75%.
- **Recall Accuracy**: Maintains 98%+ of the original similarity search accuracy.

### Advanced Product Quantization (PQ)
Product Quantization goes even further by splitting vectors into smaller sub-vectors and clustering them, reducing memory footprint by up to 16x. Combined with disk-backed graph indexes like DiskANN, engineers can query billion-scale datasets on single-node instances.`,
    readTime: "4 min read",
    tags: ["Vector Databases", "Quantization", "Milvus", "Qdrant", "High-Throughput"]
  },
  {
    id: "ai-news-9",
    title: "Liquid Neural Networks: Time-Continuous Adaptive AI Models",
    summary: "How differential equations are inspiring a new breed of neural networks that adapt dynamically to continuous physical streams like radar, lidars, and medical telemetries.",
    content: `Most deep learning models are static; their weights are locked after training, and they process data in discrete time steps. **Liquid Neural Networks (LNNs)**, developed at MIT, challenge this by using differential equations to compute state changes continuously.

### Continuous Adaptation
LNNs adapt their parameters dynamically to incoming data streams. If a camera feed gets blurry or a sensor experiences noise, the network's equations adapt in real-time to preserve prediction accuracy.

### Massive Parameter Reduction
Because LNNs are analytically compact, they can achieve complex control behaviors (like keeping an autonomous drone on path) using just 20 to 50 neurons, compared to the millions required by deep reinforcement learning models.`,
    readTime: "6 min read",
    tags: ["Liquid Networks", "Edge Robotics", "MIT", "Adaptive AI", "Continuous Streams"]
  }
];

export default function GithubAndBlogs() {
  const [blogs, setBlogs] = useState(TECHNICAL_BLOGS);
  const [selectedBlogId, setSelectedBlogId] = useState(TECHNICAL_BLOGS[0].id);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  const poolIndexRef = useRef(0);

  // Track elapsed time since last sync
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerSync = useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      // Pick next article from pool
      const nextArticle = ADDITIONAL_NEWS_POOL[poolIndexRef.current % ADDITIONAL_NEWS_POOL.length];
      poolIndexRef.current += 1;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + " (Just now)";

      const articleWithUpdatedDate = {
        ...nextArticle,
        id: `dynamic-${nextArticle.id}-${Date.now()}`,
        date: dateStr
      };

      setBlogs(prevBlogs => {
        // Prepend the new article to the state list, avoiding duplicates
        const filtered = prevBlogs.filter(b => b.title !== nextArticle.title);
        return [articleWithUpdatedDate, ...filtered];
      });

      // Automatically focus on the new article
      setSelectedBlogId(articleWithUpdatedDate.id);

      setIsSyncing(false);
      setSyncSuccess(true);
      setSecondsSinceUpdate(0);

      // Reset success animation flag
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  }, [isSyncing]);

  // Automatic Background Interval (60 seconds auto-refresh)
  useEffect(() => {
    const autoSyncInterval = setInterval(() => {
      triggerSync();
    }, 60000);

    return () => clearInterval(autoSyncInterval);
  }, [triggerSync]);

  const activeBlog = blogs.find(b => b.id === selectedBlogId) || blogs[0];

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
        ease: [0.16, 1, 0.3, 1] as any
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
        ease: [0.16, 1, 0.3, 1] as any,
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
              <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
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
                    {repo.topics.slice(0, 2).map((tag, idx) => (
                      <span key={`${tag}-${idx}`} className="text-[10px] font-mono bg-white dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-550 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
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
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                <BookOpen size={11} />
                <span>06 / AI Sector News Feed</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
                AI Sector News & Magazines
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-end">
              <div className="flex flex-col items-end text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Auto-Sync Active (60s)</span>
                </div>
                <div>
                  {secondsSinceUpdate === 0 ? "Just synced" : `Last check: ${secondsSinceUpdate}s ago`}
                </div>
              </div>

              <button
                onClick={triggerSync}
                disabled={isSyncing}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] font-mono font-bold transition-all duration-300 shadow-sm ${
                  isSyncing
                    ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                    : syncSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-850 text-emerald-600 dark:text-emerald-400'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-150/40 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-200'
                }`}
              >
                {isSyncing ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : syncSuccess ? (
                  <Check size={11} className="scale-110 text-emerald-500" />
                ) : (
                  <RefreshCw size={11} />
                )}
                <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Synced' : 'Refresh Feed'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 h-[410px]">
            {/* Sidebar selector */}
            <div className="md:w-52 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
              {blogs.map((blog) => (
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
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 font-light">
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
                  {activeBlog.tags.map((tag, idx) => (
                    <span key={`${tag}-${idx}`} className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/45 text-indigo-600 dark:text-indigo-400 font-mono font-bold px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content text */}
                <div className="text-zinc-650 dark:text-zinc-300 text-xs leading-relaxed font-light space-y-3.5">
                  <ReactMarkdown
                    components={{
                      h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-5 mb-2.5 font-display tracking-tight" {...props} />,
                      p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3.5 space-y-2 text-zinc-650 dark:text-zinc-300" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-zinc-900 dark:text-indigo-300" {...props} />,
                    }}
                  >
                    {activeBlog.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Discussion Pitch */}
              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-4 text-[10px] text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-light">Interested in discussing these AI sector insights?</span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}?subject=Inquiry regarding AI Sector: ${encodeURIComponent(activeBlog.title)}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-500 dark:hover:text-indigo-300 font-bold uppercase tracking-wider text-[10px] font-mono"
                >
                  Discuss AI Sector Trends with Karim
                </a>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
