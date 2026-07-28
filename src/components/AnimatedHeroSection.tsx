import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Code2, Brain, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function AnimatedHeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-6 md:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50 px-4 py-2 mb-6"
          >
            <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Welcome to the Future of AI
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight"
          >
            <span className="block">Senior AI Engineer &</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
              ML Architect
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Orchestrating high-performance neural pipelines, secure multi-agent RAG endpoints, and enterprise-grade AI solutions for forward-thinking organizations.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 mb-12 md:mb-16"
          >
            {[
              { label: 'Projects', value: '50+' },
              { label: 'Clients', value: '30+' },
              { label: 'Experience', value: '8+ yrs' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur"
              >
                <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const event = new CustomEvent('switch-tab', { detail: { id: 'capabilities', scrollToTop: true } });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 group"
            >
              <span>Explore My Work</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const event = new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-8 py-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <span>Get in Touch</span>
              <Zap size={18} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 md:mt-32"
        >
          {[
            {
              icon: Brain,
              title: 'AI & ML',
              description: 'Advanced neural architectures and deep learning pipelines',
            },
            {
              icon: Code2,
              title: 'Full Stack',
              description: 'End-to-end development from backend to frontend',
            },
            {
              icon: Sparkles,
              title: 'Innovation',
              description: 'Cutting-edge solutions with computer vision & NLP',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block p-3 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-950/50 transition-colors"
              >
                <feature.icon className="text-indigo-600 dark:text-indigo-400" size={24} />
              </motion.div>
              <h3 className="font-display font-bold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
