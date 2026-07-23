import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { 
  Send, FileText, Sliders, Play, Brain, RefreshCw, Layers, CheckCircle, 
  AlertTriangle, Eye, Terminal, Sparkles, User, Info, Cpu, Mic, MicOff, 
  Phone, PhoneOff, Search, MapPin, Radio, Image, Video, Music, X, Volume2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular Subcomponents
import AIPaintbox from './AIPaintbox';
import AICinematic from './AICinematic';
import AISoundstage from './AISoundstage';
import AIMediaAnalyzer from './AIMediaAnalyzer';
import LazyImage from './LazyImage';

import rotorBladeImg from '../assets/images/rotor_blade_spec_1783290618549.jpg';
import siliconCellImg from '../assets/images/silicon_cell_spec_1783290633275.jpg';
import impellerHubImg from '../assets/images/impeller_hub_spec_1783290649239.jpg';

// Example texts for Summarizer Demo
const PRESEEDED_TEXTS = {
  turbine: `OPERATIONAL MAINTENANCE MANUAL - GE GAS TURBINE ROTOR BLADE ASSEMBLIES
SECTION 4.2.1: THERMAL BARRIER COATING (TBC) DEGRADATION ANALYSIS
Rotor blade elements in high-pressure compressor stages are continuously exposed to exhaust temperatures exceeding 1,150°C. To maintain structural integrity and suppress thermal fatigue, blades are coated with a Yttria-Stabilized Zirconia (YSZ) thermal barrier coating applied via electron-beam physical vapor deposition. 
Over operational intervals of 12,000 equivalent baseload hours, thermal cycling causes microscopic spallation along the bond coat boundary. Standard manual crack inspections suffer from visual fatigue, leading to undetected micro-cracks (welding pores) below 0.5mm. YOLO v8 object detection coupled with thermal imagery can capture thermal gradients indicative of sub-surface delamination. Any detected crack exceeding a critical threshold of 1.2mm requires instant rotor isolation, conveyor stoppage, and direct chemical strip and recoat of the affected alloy turbine blades.`,
  mlops: `MLOPS PRODUCTION DEPLOYMENT BLUEPRINT: AUTOSCALING FOR DOMAIN LLMS
When hosting fine-tuned parameter-efficient adapters (such as Llama-3 8B adapters optimized via LoRA on niche corporate databases), inference cost and response latency remain major bottlenecks. Standard cloud servers running float16 models consume massive high-tier V100 or A100 GPU resources.
To deploy models efficiently at scale:
1. QUANTIZATION: Post-training INT8 or FP4 quantization maps float32/16 weights to lower bit-widths, shrinking the VRAM footprint from 16GB to 5.5GB, fitting Llama-3 comfortably on A10G GPUs.
2. SPOT INSTANCES: AWS Spot instances offer up to 70% cost reduction but suffer from abrupt node termination. By crafting a distributed Kubernetes architecture paired with warm standby endpoints and automated weights loading, we ensure zero lost user requests.
3. CACHING: Implement redis-based semantic embeddings cache. If a new query is semantically identical (>96% cosine similarity) to an existing query, return the cached result instantly, reducing server load by 25%.`
};

interface VisualPart {
  id: string;
  name: string;
  type: string;
  imageBg: string;
  imageUrl: string;
  rawIssues: Array<{ label: string; conf: number; x: number; y: number; w: number; h: number; severity: 'High' | 'Medium' | 'Minor'; desc: string }>;
}

const YOLO_PARTS: VisualPart[] = [
  {
    id: "part-1",
    name: "H-Stage Rotor Blade A-4",
    type: "Heavy Turbine Blade (Alloy)",
    imageBg: "from-zinc-950 to-zinc-900",
    imageUrl: rotorBladeImg,
    rawIssues: [
      { label: "Thermal Crack", conf: 0.94, x: 25, y: 35, w: 20, h: 4, severity: "High", desc: "Thermal fracture spallation along core blade root." },
      { label: "Bond Coat Pore", conf: 0.78, x: 60, y: 50, w: 12, h: 12, severity: "Medium", desc: "Microscopic gas welding void within YSZ layer." }
    ]
  },
  {
    id: "part-2",
    name: "Solar Ingot Silicon Cell X-12",
    type: "High-Purity Silicon Wafer",
    imageBg: "from-zinc-950 to-zinc-900",
    imageUrl: siliconCellImg,
    rawIssues: [
      { label: "Micro Crack", conf: 0.91, x: 45, y: 20, w: 30, h: 3, severity: "High", desc: "Structural crystalline split from mechanical shear." },
      { label: "Silver Contamination", conf: 0.62, x: 15, y: 70, w: 10, h: 10, severity: "Minor", desc: "Slight soldering spill, high resistance threat." }
    ]
  },
  {
    id: "part-3",
    name: "Compressor Impeller Hub",
    type: "Nickel-Steel Radial Compressor",
    imageBg: "from-zinc-950 to-zinc-900",
    imageUrl: impellerHubImg,
    rawIssues: [
      { label: "Welding Pore", conf: 0.96, x: 30, y: 65, w: 8, h: 8, severity: "Medium", desc: "Structural porosity weld hazard detected near base." }
    ]
  }
];

// Audio conversion helper functions for Live Voice API
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function playPCM16Bit24kHz(audioCtx: AudioContext, base64Data: string, scheduledTimeRef: React.MutableRefObject<number>) {
  const arrayBuf = base64ToArrayBuffer(base64Data);
  const pcm16 = new Int16Array(arrayBuf);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768.0;
  }
  
  const buffer = audioCtx.createBuffer(1, float32.length, 24000);
  buffer.copyToChannel(float32, 0);
  
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  
  let startTime = scheduledTimeRef.current;
  const now = audioCtx.currentTime;
  if (startTime < now) {
    startTime = now + 0.05; // safe buffer
  }
  source.start(startTime);
  scheduledTimeRef.current = startTime + buffer.duration;
  
  return source;
}

export default function AIDemos() {
  const [activeTab, setActiveTab] = useState<'chat' | 'paintbox' | 'veo' | 'soundstage' | 'multimodal' | 'summarizer' | 'yolo'>('chat');

  // --- TAB 1: Chat State & Grounding configs ---
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am Karim Osman's Virtual AI Portfolio Advisor, powered by a customized Gemini model. You can ask me anything about Karim's professional career, MLOps solutions, RAG platform architectures, or check his availability for technical roles. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Advanced grounded parameters
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [mapsGrounding, setMapsGrounding] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [advisorRole, setAdvisorRole] = useState<'advisor' | 'interviewer' | 'architect'>('advisor');

  // Voice Call state (WebSocket Live API)
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scheduledTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const [isVoiceModelTalking, setIsVoiceModelTalking] = useState(false);

  const SUGGESTED_QUESTIONS = [
    "What did Karim build for Baker Hughes?",
    "Can you detail his LoRA LLM fine-tuning?",
    "Tell me about his technical metrics.",
    "Is he open to remote work or relocation?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const pcmToBase64 = (float32Array: Float32Array): string => {
    const buffer = floatTo16BitPCM(float32Array);
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const stopAllPlayback = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      scheduledTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsVoiceModelTalking(false);
  };

  const stopVoiceSession = () => {
    try {
      stopAllPlayback();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (audioProcessorRef.current) {
        audioProcessorRef.current.disconnect();
        audioProcessorRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      if (inputAudioCtxRef.current) {
        inputAudioCtxRef.current.close();
        inputAudioCtxRef.current = null;
      }
      if (outputAudioCtxRef.current) {
        outputAudioCtxRef.current.close();
        outputAudioCtxRef.current = null;
      }
    } catch (e) {
      console.error("Error stopping voice session gracefully:", e);
    }
    setIsVoiceActive(false);
  };

  const startVoiceSession = async () => {
    try {
      setVoiceError("");
      setIsVoiceActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error("Web Audio API is not supported in this browser.");
      }

      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      scheduledTimeRef.current = outputCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(inputCtx.destination);
      audioProcessorRef.current = processor;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const base64 = pcmToBase64(inputData);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            setIsVoiceModelTalking(true);
            const playSource = playPCM16Bit24kHz(outputCtx, msg.audio, scheduledTimeRef);
            activeSourcesRef.current.push(playSource);
            playSource.onended = () => {
              activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== playSource);
              if (activeSourcesRef.current.length === 0) {
                setIsVoiceModelTalking(false);
              }
            };
          }
          if (msg.interrupted) {
            stopAllPlayback();
          }
          if (msg.error) {
            setVoiceError(msg.error);
            stopVoiceSession();
          }
        } catch (err) {
          console.error("Error decoding audio stream:", err);
        }
      };

      ws.onclose = () => {
        stopVoiceSession();
      };

      ws.onerror = () => {
        setVoiceError("WebSocket connection aborted.");
        stopVoiceSession();
      };

    } catch (err: any) {
      console.error(err);
      setVoiceError(err.message || "Failed to start live speech.");
      setIsVoiceActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const handleSendChat = async (textToSend?: string) => {
    const queryText = textToSend || chatInput;
    if (!queryText.trim() || isChatLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/grounded-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          searchGrounding,
          mapsGrounding,
          thinkingMode,
          role: advisorRole
        })
      });
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setChatMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        sender: 'assistant',
        text: `Error calling virtual advisor: ${err.message}. Please check GEMINI_API_KEY.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        sender: 'assistant',
        text: "Hello! I am Karim's Virtual AI Portfolio Advisor. Ask me anything about his ML skills, production achievements, and availability. Let's find your next Senior AI Engineer!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // --- TAB 2: Summarizer / Chunk State ---
  const [inputText, setInputText] = useState(PRESEEDED_TEXTS.turbine);
  const [chunkSize, setChunkSize] = useState(250);
  const [chunkOverlap, setChunkOverlap] = useState(40);
  const [summaryStyle, setSummaryStyle] = useState('technical bullet-points');
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [textResults, setTextResults] = useState<{
    summary: string;
    chunks: Array<{ id: number; start: number; end: number; content: string }>;
    metadata: { originalLength: number; numChunks: number; chunkSize: number; chunkOverlap: number };
  } | null>(null);

  const handleLoadSample = (key: 'turbine' | 'mlops') => {
    setInputText(PRESEEDED_TEXTS[key]);
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    setIsProcessingText(true);
    setTextResults(null);

    try {
      const response = await fetch('/api/summarize-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          chunkSize,
          chunkOverlap,
          summaryStyle
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTextResults(data);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to analyze text: ${err.message}`);
    } finally {
      setIsProcessingText(false);
    }
  };

  // --- TAB 3: YOLO State ---
  const [selectedPartId, setSelectedPartId] = useState("part-1");
  const [confThreshold, setConfThreshold] = useState(0.70);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const selectedPart = YOLO_PARTS.find(p => p.id === selectedPartId) || YOLO_PARTS[0];

  const handleRunYOLO = () => {
    setIsScanning(true);
    setHasScanned(false);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setHasScanned(true);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const visibleIssues = selectedPart.rawIssues.filter(issue => issue.conf >= confThreshold);

  return (
    <motion.section
      id="interactive-ai-playground"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Sparkles size={11} className="text-indigo-600 dark:text-indigo-400" />
            <span>02 / Interactive Sandbox</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5 font-sans">
            Production Pipeline <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">Simulators</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Test and evaluate real-time pipelines, visual models, and cutting-edge Gemini voice &amp; video synthesis.
          </p>
        </div>

        {/* Tab Controls - Premium Minimal Slider style */}
        <div className="flex flex-wrap rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-1 select-none font-mono gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'chat' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Brain size={13} />
            <span className="whitespace-nowrap">AI Advisor</span>
          </button>
          <button
            onClick={() => setActiveTab('paintbox')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'paintbox' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Image size={13} />
            <span className="whitespace-nowrap">Paintbox</span>
          </button>
          <button
            onClick={() => setActiveTab('veo')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'veo' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Video size={13} />
            <span className="whitespace-nowrap">Cinematic</span>
          </button>
          <button
            onClick={() => setActiveTab('soundstage')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'soundstage' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Music size={13} />
            <span className="whitespace-nowrap">Soundstage</span>
          </button>
          <button
            onClick={() => setActiveTab('multimodal')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'multimodal' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Radio size={13} />
            <span className="whitespace-nowrap">Media</span>
          </button>
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'summarizer' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Layers size={13} />
            <span className="whitespace-nowrap">Chunker</span>
          </button>
          <button
            onClick={() => setActiveTab('yolo')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeTab === 'yolo' 
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 font-bold shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Eye size={13} />
            <span className="whitespace-nowrap">YOLO CV</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Card */}
      <div className="min-h-[580px] overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shadow-lg shadow-zinc-100/80 dark:shadow-none">
        
        {/* Editor Window Bar */}
        <div className="bg-zinc-50 dark:bg-zinc-950 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-zinc-350 dark:text-zinc-700 mx-2">|</span>
            <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 animate-fade-in">
              <Terminal size={12} className="text-indigo-600 dark:text-indigo-400" />
              {activeTab === 'chat' && 'portfolio_advisor_agent.py'}
              {activeTab === 'paintbox' && 'diffusion_paintbox_canvas.py'}
              {activeTab === 'veo' && 'veo_cinematic_renderer.py'}
              {activeTab === 'soundstage' && 'lyria_soundstage_deck.py'}
              {activeTab === 'multimodal' && 'multimodal_acoustic_transcribe.py'}
              {activeTab === 'summarizer' && 'rag_document_chunker.go'}
              {activeTab === 'yolo' && 'yolo_anomaly_detector.cpp'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
              COMPILER: LIVE
            </span>
          </div>
        </div>

        {/* TAB 1: ASK MY CV / ADVANCED ADVISOR */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 h-[540px]">
            {/* Thread Header Banner */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-5 py-2 flex flex-col md:flex-row gap-3 md:items-center justify-between">
              
              {/* Left grounding configuration tools */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Cpu size={13} className="text-indigo-600 shrink-0" />
                  <span className="font-mono font-bold text-[10px] text-zinc-550 mr-1.5">Model Tiers:</span>
                </div>
                <label className="flex items-center gap-1 cursor-pointer font-mono text-[10px]">
                  <input
                    type="checkbox"
                    checked={searchGrounding}
                    onChange={(e) => {
                      setSearchGrounding(e.target.checked);
                      if (e.target.checked) setMapsGrounding(false);
                    }}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <Search size={11} className="text-blue-500" />
                  <span>Google Search</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer font-mono text-[10px]">
                  <input
                    type="checkbox"
                    checked={mapsGrounding}
                    onChange={(e) => {
                      setMapsGrounding(e.target.checked);
                      if (e.target.checked) setSearchGrounding(false);
                    }}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <MapPin size={11} className="text-rose-500" />
                  <span>Google Maps</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer font-mono text-[10px]">
                  <input
                    type="checkbox"
                    checked={thinkingMode}
                    onChange={(e) => setThinkingMode(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <Sparkles size={11} className="text-purple-500" />
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">High Thinking</span>
                </label>
              </div>

              {/* Persona and Voice buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={advisorRole}
                  onChange={(e) => setAdvisorRole(e.target.value as any)}
                  className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono p-1 text-zinc-650"
                >
                  <option value="advisor">Profile Career Advisor</option>
                  <option value="interviewer">ML Technical Interviewer</option>
                  <option value="architect">Enterprise AI Architect</option>
                </select>

                <button
                  onClick={isVoiceActive ? stopVoiceSession : startVoiceSession}
                  className={`cursor-pointer text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 px-3 py-1.5 rounded transition font-bold shadow-xs ${
                    isVoiceActive 
                      ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isVoiceActive ? <PhoneOff size={11} /> : <Phone size={11} />}
                  {isVoiceActive ? "End Voice Call" : "Voice Session"}
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/10 dark:bg-zinc-950/10 relative">
              
              {/* Voice Pulse Overlay when Voice active */}
              <AnimatePresence>
                {isVoiceActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white"
                  >
                    <div className="relative mb-6">
                      <motion.div 
                        animate={{ scale: isVoiceModelTalking ? [1, 1.4, 1] : [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: isVoiceModelTalking ? 0.8 : 2.5 }}
                        className={`h-24 w-24 rounded-full flex items-center justify-center border-4 ${isVoiceModelTalking ? 'bg-indigo-600/30 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
                      >
                        {isVoiceModelTalking ? <Volume2 size={32} className="text-indigo-400 animate-pulse" /> : <Mic size={32} className="text-emerald-400" />}
                      </motion.div>
                      {isVoiceModelTalking && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold font-mono tracking-wide uppercase">
                      {isVoiceModelTalking ? "Advisor Speaking..." : "Speech Live Connection Active"}
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed font-light font-mono">
                      {isVoiceModelTalking ? "Karim's Virtual assistant is formulating and speaking real-time voice packets." : "Your microphone is hot. Talk conversationally about Karim's expertise (e.g. at Baker Hughes, Siena) to get responses."}
                    </p>

                    {voiceError && (
                      <div className="mt-4 text-[11px] font-mono text-rose-400 bg-rose-950/30 border border-rose-900/60 p-2 rounded max-w-xs">
                        {voiceError}
                      </div>
                    )}

                    <button
                      onClick={stopVoiceSession}
                      className="cursor-pointer mt-6 rounded bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold uppercase font-mono tracking-wider transition"
                    >
                      Disconnect Voice Stream
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    {msg.sender === 'assistant' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold font-mono">
                        AI
                      </div>
                    )}
                    
                    <div
                      className={`rounded px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white font-medium shadow-sm'
                          : 'bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line font-light">{msg.text}</p>
                      <div className={`mt-2 text-[10px] text-right ${msg.sender === 'user' ? 'text-indigo-200 dark:text-indigo-300' : 'text-zinc-400 dark:text-zinc-500 font-mono'}`}>
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-450 text-xs font-mono">
                        USR
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono animate-pulse">
                      AI
                    </div>
                    <div className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 rounded px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
                      <span className="flex gap-1 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                      <span className="font-mono text-[10px]">
                        {thinkingMode ? "Model is thinking deeply (High-Thinking Mode activated)..." : "Retrieving profile grounding vectors..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Chips Row */}
            <div className="px-5 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider mr-1.5">Direct Queries:</span>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  disabled={isChatLoading}
                  onClick={() => handleSendChat(q)}
                  className="cursor-pointer text-[10px] font-semibold rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-0.5 text-zinc-600 dark:text-zinc-355 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition disabled:opacity-50 shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about Karim's MLOps skills, French-speaking phone, relocated preference..."
                className="flex-1 rounded border border-zinc-250 dark:border-zinc-805 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/10"
                disabled={isChatLoading}
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || isChatLoading}
                className="cursor-pointer rounded bg-indigo-600 dark:bg-indigo-500 px-6 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PAINTBOX */}
        {activeTab === 'paintbox' && <AIPaintbox />}

        {/* TAB 3: VEO CINEMATIC */}
        {activeTab === 'veo' && <AICinematic />}

        {/* TAB 4: LYRIA SOUNDSTAGE */}
        {activeTab === 'soundstage' && <AISoundstage />}

        {/* TAB 5: MULTIMODAL ANALYZER */}
        {activeTab === 'multimodal' && <AIMediaAnalyzer />}

        {/* TAB 6: SUMMARIZER & CHUNKING */}
        {activeTab === 'summarizer' && (
          <div className="p-6 space-y-6 flex-1 flex flex-col lg:flex-row gap-6 h-[520px] overflow-y-auto bg-zinc-50/10 dark:bg-zinc-950/10">
            
            {/* Input Config Pane */}
            <div className="lg:w-[42%] space-y-4 shrink-0">
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. Raw Text Document</h4>
                  <div className="flex gap-2 text-[10px]">
                    <button onClick={() => handleLoadSample('turbine')} className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline">Sample: GE Blade</button>
                    <span className="text-zinc-350 dark:text-zinc-700">|</span>
                    <button onClick={() => handleLoadSample('mlops')} className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline">Sample: MLOps</button>
                  </div>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 rounded border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 p-3 text-xs text-zinc-705 dark:text-zinc-300 focus:border-indigo-500/35 focus:outline-none font-mono"
                />
              </div>

              {/* Slider Sliders */}
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sliders size={13} className="text-indigo-600 dark:text-indigo-400" /> 2. RAG Hyperparameters
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-450">
                      <span>Chunk Token Limit (Chars):</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-455 font-bold">{chunkSize}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 dark:accent-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-450">
                      <span>Chunk Overlap Boundary:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-455 font-bold">{chunkOverlap}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 dark:accent-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase">System Instruction Set (Style):</span>
                    <select
                      value={summaryStyle}
                      onChange={(e) => setSummaryStyle(e.target.value)}
                      className="w-full mt-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-indigo-500/30 font-mono"
                    >
                      <option value="professional">Professional Overview</option>
                      <option value="technical bullet-points">Technical Bullet-Points</option>
                      <option value="executive overview">Executive Summary</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleProcessText}
                  disabled={isProcessingText || !inputText.trim()}
                  className="cursor-pointer w-full rounded bg-indigo-600 dark:bg-indigo-500 py-3 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
                >
                  {isProcessingText ? (
                    <>
                      <RefreshCw className="animate-spin" size={13} /> Orchestrating pipeline...
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" /> Compile &amp; Run RAG Splitter
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Output Pane */}
            <div className="flex-1 flex flex-col min-h-[320px] max-h-[460px]">
              {textResults ? (
                <div className="space-y-4 flex flex-col flex-1 h-full overflow-y-auto pr-1">
                  
                  {/* Summary Block */}
                  <div className="rounded border border-indigo-100/50 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 p-4.5 space-y-2">
                    <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-indigo-600" /> Pipeline Output: LLM Summary
                      </span>
                      <span className="text-[10px] font-mono text-zinc-450 dark:text-zinc-555">Latency: 142ms</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed whitespace-pre-line font-light">
                      {textResults.summary}
                    </p>
                  </div>

                  {/* Chunks */}
                  <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4.5">
                    <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3 text-xs">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-display">
                        <Layers size={13} className="text-indigo-600" /> Chunk Segment Vectors ({textResults.metadata.numChunks})
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[190px] pr-2">
                      {textResults.chunks.map((chunk) => (
                        <div key={chunk.id} className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 hover:border-indigo-205 transition">
                          <div className="flex justify-between text-zinc-455 dark:text-zinc-500 font-mono text-[10px] mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">Chunk ID: {chunk.id}</span>
                            <span>Char Indices: [{chunk.start} - {chunk.end}]</span>
                          </div>
                          <p className="text-zinc-655 dark:text-zinc-300 font-mono text-[11px] leading-relaxed select-all">
                            {chunk.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 rounded border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col items-center justify-center text-center p-8 text-zinc-500 dark:text-zinc-400">
                  <FileText size={32} className="text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs font-bold text-zinc-650 dark:text-zinc-300 font-display">Pipeline Awaiting Compilation</p>
                  <p className="text-[11px] max-w-sm mt-1 leading-relaxed text-zinc-450 dark:text-zinc-500 font-light">
                    Adjust hyperparameters or load an industrial pre-seeded sample on the left, then trigger the compilation flow.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: YOLO VISION */}
        {activeTab === 'yolo' && (
          <div className="p-6 space-y-6 flex-1 flex flex-col lg:flex-row gap-6 h-[520px] overflow-y-auto bg-zinc-50/10 dark:bg-zinc-950/10">
            
            {/* Control Sidebar */}
            <div className="lg:w-76 space-y-4 shrink-0">
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3">
                <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. Target Component Sample</h4>
                
                <div className="grid gap-2 font-mono">
                  {YOLO_PARTS.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => {
                        setSelectedPartId(part.id);
                        setHasScanned(false);
                      }}
                      className={`cursor-pointer w-full text-left p-2.5 rounded border text-xs transition-all duration-200 ${
                        selectedPartId === part.id 
                          ? 'border-indigo-500 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs' 
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      <div>{part.name}</div>
                      <div className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">{part.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Threshold */}
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase">2. YOLO Threshold</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{(confThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.40"
                    max="0.95"
                    step="0.05"
                    value={confThreshold}
                    onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 dark:accent-indigo-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-455 dark:text-zinc-500 font-mono">
                    <span>0.40 (Sensitive)</span>
                    <span>0.95 (High Conf)</span>
                  </div>
                </div>

                <button
                  onClick={handleRunYOLO}
                  disabled={isScanning}
                  className="cursor-pointer w-full rounded bg-indigo-600 dark:bg-indigo-500 py-2.5 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center gap-1.5 disabled:opacity-50 font-mono"
                >
                  <Play size={12} fill="currentColor" /> Scan &amp; Detect Defects
                </button>
              </div>
            </div>

            {/* Stage View Area */}
            <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4.5">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5 mb-4 text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-display">
                  <Eye size={13} className="text-indigo-600" /> YOLO Optical Spectrogram Analyzer Overlay
                </span>
                <span className="font-mono text-[10px] text-zinc-550">{selectedPart.name}</span>
              </div>

              {/* The visual box */}
              <div className="relative flex-1 rounded overflow-hidden min-h-[220px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group">
                
                {/* Tech grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-15 bg-grid-mask pointer-events-none" />

                {/* Component Blueprint Scan Background */}
                <LazyImage
                  src={selectedPart.imageUrl}
                  alt={selectedPart.name}
                  className="absolute inset-0 w-full h-full"
                  imgClassName="opacity-60 dark:opacity-40 group-hover:opacity-75 transition-opacity duration-300 mix-blend-multiply dark:mix-blend-overlay"
                />

                {/* Simulated Glass Target Reticle (Architectural HUD feel) */}
                <div className="absolute inset-4 border border-indigo-500/10 rounded pointer-events-none flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/40" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500/40" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500/40" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500/40" />
                  
                  {/* Reticle circle */}
                  <div className="w-12 h-12 rounded-full border border-indigo-500/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500/20" />
                  </div>
                </div>

                {/* Sweep Bar */}
                {isScanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.9)] z-10"
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  />
                )}

                {/* Bounding boxes */}
                {hasScanned && !isScanning && (
                  <div className="absolute inset-0">
                    {visibleIssues.map((issue, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute border-2 border-rose-500 bg-rose-500/10 rounded"
                        style={{
                          left: `${issue.x}%`,
                          top: `${issue.y}%`,
                          width: `${issue.w}%`,
                          height: `${issue.h}%`,
                        }}
                      >
                        <span className="absolute -top-5 left-0 bg-rose-500 text-white font-mono text-[10px] font-bold px-1 py-0.5 rounded shadow-md whitespace-nowrap">
                          {issue.label} ({(issue.conf * 100).toFixed(0)}%)
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Loader overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-xs text-zinc-650 dark:text-zinc-350 gap-2.5">
                    <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={20} />
                    <span className="font-mono text-[11px] tracking-tight text-zinc-700 dark:text-zinc-300">Compiling TensorRT engine...</span>
                    <span className="font-mono text-[10px] text-zinc-505 dark:text-zinc-400">{scanProgress}%</span>
                  </div>
                )}

                {/* Inactive overlay */}
                {!isScanning && !hasScanned && (
                  <div className="absolute inset-0 bg-zinc-50/45 dark:bg-zinc-950/20 flex flex-col items-center justify-center text-xs text-zinc-500 dark:text-zinc-450 gap-2">
                    <Play size={18} className="text-indigo-600 dark:text-indigo-400 cursor-pointer animate-pulse" onClick={handleRunYOLO} />
                    <span className="font-light font-mono text-[10px] uppercase tracking-wide text-zinc-650 dark:text-zinc-400">Awaiting YOLO inference scan...</span>
                  </div>
                )}
              </div>

              {/* Detection anomalies log */}
              {hasScanned && !isScanning && (
                <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-2.5">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-450 flex items-center gap-1 font-mono">
                    <AlertTriangle size={12} className="text-yellow-600" /> Detection Logs: anomalies detected
                  </h5>
                  
                  {visibleIssues.length > 0 ? (
                    <div className="grid gap-2 text-xs">
                      {visibleIssues.map((issue, idx) => (
                        <div key={idx} className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{issue.label}</span>
                              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">conf: {(issue.conf * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-450 leading-relaxed font-light">{issue.desc}</p>
                          </div>
                          <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            issue.severity === 'High' 
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900' 
                              : 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900'
                          }`}>
                            {issue.severity} Severity
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-800 p-2.5 text-center text-[10px] text-emerald-850 dark:text-emerald-400 flex items-center justify-center gap-1.5 font-light">
                      <CheckCircle size={12} className="text-emerald-600 animate-pulse" />
                      <span>Defects not found above confidence parameters. Component certified healthy.</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </motion.section>
  );
}
