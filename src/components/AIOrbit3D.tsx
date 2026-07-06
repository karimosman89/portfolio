import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ShieldAlert, Sparkles, Database, Layers, Eye, Zap, HelpCircle, Activity } from 'lucide-react';

interface AIOrbit3DProps {
  activeTheme: string;
  isDark: boolean;
}

interface SpecialtyNode {
  id: string;
  name: string;
  icon: any;
  description: string;
  distance: number;
  speed: number;
  size: number;
  color: number; // Hex code
  technologies: string[];
  metrics: string;
}

const SPECIALTIES: SpecialtyNode[] = [
  {
    id: 'genai',
    name: 'Generative AI',
    icon: Sparkles,
    description: 'Engineering cutting-edge agentic workflows, prompt alignment mechanisms, and multi-agent system orchestrations.',
    distance: 12,
    speed: 0.8,
    size: 0.9,
    color: 0x6366f1, // Indigo
    technologies: ['Claude-3.5-Sonnet', 'Llama-3-8B', 'CrewAI', 'LangGraph'],
    metrics: 'Multi-Agent systems deployed to 500+ corporate users'
  },
  {
    id: 'rag',
    name: 'RAG Systems',
    icon: Database,
    description: 'Designing hyper-accurate, high-throughput text chunking, sliding-window vector embeddings, and semantic search routing.',
    distance: 17,
    speed: 0.55,
    size: 1.1,
    color: 0x10b981, // Emerald
    technologies: ['Pinecone', 'FAISS', 'BGE-Large-Embeddings', 'Redis'],
    metrics: '95% certified accuracy over 10k daily PDFs'
  },
  {
    id: 'mlops',
    name: 'MLOps & Scaling',
    icon: Layers,
    description: 'Orchestrating robust pipelines, Post-Training Quantization, multi-region auto-scaling, and containerization.',
    distance: 22,
    speed: 0.4,
    size: 1.0,
    color: 0x06b6d4, // Cyan
    technologies: ['AWS SageMaker', 'Docker', 'Kubernetes', 'MLflow'],
    metrics: '25% cost savings & 99.9% multi-region uptime'
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    icon: Eye,
    description: 'Fine-tuning industrial object detection networks and real-time edge processing engines.',
    distance: 27,
    speed: 0.3,
    size: 0.8,
    color: 0xf43f5e, // Rose
    technologies: ['YOLO v8 (Ultralytics)', 'PyTorch', 'NVIDIA TensorRT'],
    metrics: '22% increase in industrial defect detection'
  },
  {
    id: 'finetuning',
    name: 'LLM Fine-Tuning',
    icon: Zap,
    description: 'Adapting open-source foundational LLMs with parameter-efficient methods (PEFT/LoRA) for specialized domains.',
    distance: 32,
    speed: 0.2,
    size: 0.95,
    color: 0xa855f7, // Purple
    technologies: ['LoRA / PEFT', 'Hugging Face Transformers', 'INT8 Quantization'],
    metrics: '40% latency reduction with factual precision preserved'
  }
];

export default function AIOrbit3D({ activeTheme, isDark }: AIOrbit3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<SpecialtyNode>(SPECIALTIES[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Auto-detect browser/system reduced motion accessibility setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  // Keep state in ref for render loop access
  const themeRef = useRef({ activeTheme, isDark });
  useEffect(() => {
    themeRef.current = { activeTheme, isDark };
  }, [activeTheme, isDark]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Ambient light inside scene
    const ambientLight = new THREE.AmbientLight(isDark ? 0x18181b : 0xf4f4f5, 1.2);
    scene.add(ambientLight);

    // Directional light for shadows and glow
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 15);
    scene.add(dirLight);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 18, 42);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Helper to get matching hex color based on theme settings
    const getThemeColors = () => {
      if (!isDark) {
        return {
          centerColor: 0x4f46e5, // Indigo
          orbitRingColor: 0xe4e4e7, // Light grey
        };
      }
      switch (activeTheme) {
        case 'aurora':
          return { centerColor: 0x10b981, orbitRingColor: 0x064e3b };
        case 'cyber-blue':
          return { centerColor: 0x06b6d4, orbitRingColor: 0x1e3a8a };
        case 'glass-purple':
          return { centerColor: 0xd946ef, orbitRingColor: 0x4a044e };
        case 'emerald-ai':
          return { centerColor: 0x14b8a6, orbitRingColor: 0x115e59 };
        case 'neon-gradient':
          return { centerColor: 0xf43f5e, orbitRingColor: 0x431407 };
        default:
          return { centerColor: 0x6366f1, orbitRingColor: 0x1e1b4b };
      }
    };

    const colors = getThemeColors();

    // --- CENTRAL CORE (AI COGNITIVE ENGINE) ---
    const coreGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: colors.centerColor,
      emissive: colors.centerColor,
      emissiveIntensity: 0.6,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner wireframe shell for technological look
    const wireGeometry = new THREE.SphereGeometry(3.8, 16, 16);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: colors.centerColor,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    coreMesh.add(wireMesh);

    // --- ORBITAL RINGS & NODES ---
    const orbitGroups: THREE.Group[] = [];
    const planetMeshes: THREE.Mesh[] = [];

    SPECIALTIES.forEach((spec, index) => {
      // 1. Create Orbit Path Ring
      const ringGeometry = new THREE.RingGeometry(spec.distance - 0.08, spec.distance + 0.08, 64);
      // Rotate ring to be horizontal
      ringGeometry.rotateX(-Math.PI / 2);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colors.orbitRingColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      scene.add(ringMesh);

      // 2. Create Node Group to ease rotational animation
      const nodeGroup = new THREE.Group();
      // Set initial orbital offset to distribute them evenly around the core statically
      const initialAngle = (index / SPECIALTIES.length) * Math.PI * 2;
      nodeGroup.rotation.y = initialAngle;
      scene.add(nodeGroup);
      orbitGroups.push(nodeGroup);

      // 3. Planet/Specialty Node Sphere
      const planetGeometry = new THREE.SphereGeometry(spec.size, 16, 16);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Position planet along its orbit
      planetMesh.position.set(spec.distance, 0, 0);

      // Apply a static hover scale when in reduced-motion state (since pulsing is disabled)
      if (prefersReducedMotion && hoveredNode === spec.id) {
        planetMesh.scale.set(1.15, 1.15, 1.15);
      }

      nodeGroup.add(planetMesh);
      planetMeshes.push(planetMesh);
    });

    // --- MOUSE REACTION STATE ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return; // Completely disable mouse-tracking camera rotation under reduced motion
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = -((event.clientY - rect.top) / height) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- ANIMATION LOOP ---
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        // Dynamic theme update
        const currentColors = getThemeColors();
        coreMaterial.color.setHex(currentColors.centerColor);
        coreMaterial.emissive.setHex(currentColors.centerColor);
        wireMaterial.color.setHex(currentColors.centerColor);

        // Position camera statically
        camera.position.set(0, 18, 42);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        return; // Skip animation frame loops entirely to save CPU/GPU cycles
      }

      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Dynamic theme update
      const currentColors = getThemeColors();
      coreMaterial.color.setHex(currentColors.centerColor);
      coreMaterial.emissive.setHex(currentColors.centerColor);
      wireMaterial.color.setHex(currentColors.centerColor);

      // Interpolate mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate camera subtly based on mouse
      camera.position.x = mouse.x * 6;
      camera.position.y = 18 + mouse.y * 4;
      camera.lookAt(0, 0, 0);

      // Spin Core Cognitive Engine
      coreMesh.rotation.y += 0.006;
      coreMesh.rotation.x += 0.002;
      wireMesh.rotation.y -= 0.012;

      // Rotate specialties at different relative velocities
      SPECIALTIES.forEach((spec, index) => {
        const group = orbitGroups[index];
        const planet = planetMeshes[index];

        // Basic orbital rotation rate
        const hoverFactor = hoveredNode === spec.id ? 0.15 : 1.0;
        group.rotation.y += spec.speed * delta * 0.4 * hoverFactor;

        // Self-spin on nodes
        planet.rotation.y += 0.015;

        // Pulse the glowing size of hovered nodes
        if (hoveredNode === spec.id) {
          const pulse = 1.0 + Math.sin(time * 6) * 0.12;
          planet.scale.set(pulse, pulse, pulse);
        } else {
          planet.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE OBSERVER ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        // Manually render a single frame when static on resize
        if (prefersReducedMotion) {
          renderer.render(scene, camera);
        }
      }
    });
    resizeObserver.observe(container);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      
      planetMeshes.forEach(m => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach(mat => mat.dispose());
        } else {
          m.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, [activeTheme, isDark, hoveredNode, prefersReducedMotion]);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm flex flex-col lg:flex-row relative z-10">
      
      {/* 3D Stage Column */}
      <div 
        ref={containerRef}
        className="lg:w-3/5 h-[340px] lg:h-[420px] relative bg-zinc-50/50 dark:bg-zinc-950/20 flex justify-center items-center"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Absolute Instruction Tags */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 px-2 py-1 text-[9px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none select-none">
          <Activity size={10} className="text-indigo-600 animate-pulse" />
          <span>Interactive Cognitive HUD</span>
        </div>

        {/* Accessibility Motion Toggle Badge */}
        <button
          onClick={() => setPrefersReducedMotion(prev => !prev)}
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded bg-zinc-100/85 dark:bg-zinc-900/85 border border-zinc-200/50 dark:border-zinc-800/50 px-2.5 py-1 text-[9px] font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition duration-150 cursor-pointer select-none"
          title={prefersReducedMotion ? "Enable full 3D orbital animation" : "Reduce motion for vestibulary comfort"}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${prefersReducedMotion ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="uppercase tracking-widest">Motion: {prefersReducedMotion ? 'Reduced' : 'Active'}</span>
        </button>

        {/* Dynamic Float-Overlay Labels near bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-1.5 z-10">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedNode.id === spec.id;
            return (
              <button
                key={spec.id}
                onMouseEnter={() => setHoveredNode(spec.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(spec)}
                className={`cursor-pointer text-[10px] font-mono rounded px-2.5 py-1.5 border transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-bold'
                    : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-650 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/35 hover:text-indigo-600'
                }`}
              >
                <span 
                  className="h-1.5 w-1.5 rounded-full" 
                  style={{ backgroundColor: `#${spec.color.toString(16)}` }} 
                />
                <span>{spec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specialty Telemetry Analytics Column */}
      <div className="lg:w-2/5 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.id}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -15 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* HUD Node Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
                  <selectedNode.icon size={16} />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white leading-tight">
                    {selectedNode.name}
                  </h3>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    Telemetry Node {selectedNode.id.toUpperCase()}-00
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed font-light font-sans">
              {selectedNode.description}
            </p>

            {/* Tech Stack Badge Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-550 block font-mono">
                Validated Ecosystem Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Metrics */}
            <div className="rounded-lg border border-indigo-100/50 dark:border-indigo-950 bg-indigo-50/15 dark:bg-indigo-950/10 p-4 space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">
                Validated Industrial Impact
              </span>
              <div className="font-sans text-xs text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                {selectedNode.metrics}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Telemetry Footer Info */}
        <div className="pt-6 mt-6 border-t border-zinc-150 dark:border-zinc-850 flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Cpu size={10} className="text-indigo-600" />
            SECURE INFRASTRUCTURE UPTIME: 99.9%
          </span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
            ONLINE
          </span>
        </div>
      </div>

    </div>
  );
}
