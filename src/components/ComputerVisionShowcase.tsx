import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Brain, Zap, Eye, Cpu, Sparkles } from 'lucide-react';

interface CVProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  technologies: string[];
  keyFeatures: string[];
  impact: string;
  color: string;
}

const cvProjects: CVProject[] = [
  {
    id: 'gesture-recognition',
    title: 'Real-time Gesture Recognition',
    subtitle: 'Hand Pose Estimation & Control',
    description: 'Advanced computer vision system leveraging MediaPipe and TensorFlow for real-time hand gesture detection and skeletal tracking. Perfect for touchless interfaces and interactive applications.',
    image: '/src/assets/images/cv_gesture_recognition.png',
    technologies: ['MediaPipe', 'TensorFlow', 'WebGL', 'WebRTC'],
    keyFeatures: [
      '21-point hand skeleton tracking',
      '98.7% accuracy on gesture recognition',
      'Real-time 120 FPS processing',
      'Multi-hand simultaneous detection'
    ],
    impact: 'Enables intuitive gesture-based UI control for accessibility and immersive applications',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'autonomous-drone',
    title: 'Autonomous Drone Navigation',
    subtitle: 'Vision-Based Path Planning',
    description: 'Sophisticated computer vision pipeline for autonomous drone navigation using depth mapping, obstacle detection, and real-time pathfinding algorithms.',
    image: '/src/assets/images/cv_autonomous_drone.png',
    technologies: ['OpenCV', 'YOLO', 'SLAM', 'ROS'],
    keyFeatures: [
      'Real-time object detection & tracking',
      'Depth mapping and 3D reconstruction',
      'Autonomous obstacle avoidance',
      'GPS-free indoor navigation'
    ],
    impact: 'Enables fully autonomous aerial systems for surveillance, delivery, and exploration',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'retail-analytics',
    title: 'Smart Retail Analytics',
    subtitle: 'Customer Behavior Intelligence',
    description: 'Enterprise-grade computer vision solution for retail environments providing real-time heatmaps, customer tracking, and behavioral analytics for optimization.',
    image: '/src/assets/images/cv_retail_analytics.png',
    technologies: ['YOLOv8', 'DeepSORT', 'Python', 'FastAPI'],
    keyFeatures: [
      'Real-time customer density heatmaps',
      'Skeletal tracking & movement analysis',
      'Dwell time & conversion metrics',
      'Gender & age demographic analysis'
    ],
    impact: 'Provides actionable insights for store layout optimization and customer experience enhancement',
    color: 'from-purple-500 to-pink-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ComputerVisionShowcase() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">
          <Brain size={10} />
          <span>07 / Computer Vision 2026</span>
        </div>
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-4">
          Cutting-Edge Computer Vision
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl leading-relaxed">
          Proof-of-concept projects showcasing advanced computer vision capabilities for 2026. From gesture recognition to autonomous systems, these solutions demonstrate enterprise-grade AI integration.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-8 lg:grid-cols-3"
      >
        {cvProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="group relative"
          >
            <div
              className="relative overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur transition-all duration-500 hover:border-indigo-500/50 dark:hover:border-indigo-500/30 cursor-pointer"
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {project.subtitle}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedProject === project.id ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </motion.div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Expandable Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: selectedProject === project.id ? 1 : 0,
                    height: selectedProject === project.id ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Key Features
                      </p>
                      <ul className="space-y-1">
                        {project.keyFeatures.map((feature) => (
                          <li key={feature} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                            <Zap size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Business Impact
                      </p>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {project.impact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${project.color} pointer-events-none rounded-xl`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-16 rounded-xl border border-indigo-200/50 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
            Ready to Deploy Computer Vision Solutions?
          </h3>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto">
          These POC projects demonstrate production-ready computer vision capabilities. Let's discuss how to integrate these technologies into your enterprise infrastructure.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50">
          <Eye size={18} />
          Schedule a Demo
          <ChevronRight size={18} />
        </button>
      </motion.div>
    </section>
  );
}
