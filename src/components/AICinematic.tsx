import React, { useState, useEffect, useRef } from 'react';
import { Video, Play, RefreshCw, Upload, Download, Trash2, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';

export default function AICinematic() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const REASSURANCE_MESSAGES = [
    "Allocating state-of-the-art H100 GPU cluster nodes...",
    "Initializing latent optical motion field matrices...",
    "Synthesizing high-fidelity frame transition vectors...",
    "Interpreting spatial prompts & volumetric temporal consistency...",
    "Injecting noise schedules in temporal latent layers...",
    "Refining micro-structures and high-frequency details...",
    "Compiling high-definition MP4 stream sequences..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload an image file as the starting frame.");
        return;
      }
      setUploadName(file.name);
      setUploadedMimeType(file.type);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        setUploadedImage(base64String);
        setErrorMsg("");
      };
    }
  };

  const clearUploaded = () => {
    setUploadedImage(null);
    setUploadedMimeType(null);
    setUploadName("");
  };

  const triggerGenerate = async () => {
    if (!prompt.trim() && !uploadedImage) {
      setErrorMsg("Please enter a text prompt or select a starting image reference.");
      return;
    }
    setIsGenerating(true);
    setErrorMsg("");
    setVideoUrl(null);
    setProgressMessage(REASSURANCE_MESSAGES[0]);

    // Alternate reassurance messages
    let msgIndex = 0;
    const msgTimer = setInterval(() => {
      msgIndex = (msgIndex + 1) % REASSURANCE_MESSAGES.length;
      setProgressMessage(REASSURANCE_MESSAGES[msgIndex]);
    }, 4500);

    try {
      // Step 1: Start Operation
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "Continuity video from starting frame.",
          aspectRatio,
          imageBytes: uploadedImage,
          mimeType: uploadedMimeType
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const opName = data.operationName;
      if (!opName) throw new Error("No operation name received from generator.");

      // Step 2: Poll status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName: opName })
          });
          const pollData = await pollRes.json();
          if (pollData.error) throw new Error(pollData.error);

          if (pollData.done) {
            // Stop polling
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            clearInterval(msgTimer);
            setProgressMessage("Downloading and preparing video playback streams...");

            // Step 3: Download
            const dlRes = await fetch("/api/video-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationName: opName })
            });

            if (!dlRes.ok) throw new Error("Failed to download finalized video stream.");

            const blob = await dlRes.blob();
            const localUrl = URL.createObjectURL(blob);
            setVideoUrl(localUrl);
            setIsGenerating(false);
          }
        } catch (pollErr: any) {
          console.error(pollErr);
          setErrorMsg(`Polling failure: ${pollErr.message}`);
          stopPollingAndLoading(msgTimer);
        }
      }, 5000); // Poll every 5 seconds

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initialize video generation.");
      stopPollingAndLoading(msgTimer);
    }
  };

  const stopPollingAndLoading = (timerToClear: NodeJS.Timeout) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    clearInterval(timerToClear);
    setIsGenerating(false);
  };

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 overflow-y-auto">
      {/* Settings Side */}
      <div className="lg:w-[42%] space-y-4 shrink-0">
        
        {/* Start Frame Upload */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. Starting Video Frame (Optional)</h4>
          {uploadedImage ? (
            <div className="flex items-center justify-between text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded">
              <div className="flex items-center gap-2 truncate max-w-[180px]">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span className="font-mono truncate">{uploadName}</span>
              </div>
              <button 
                onClick={clearUploaded}
                className="cursor-pointer text-[10px] font-mono text-rose-500 bg-zinc-50 dark:bg-zinc-950 border px-2 py-1 rounded hover:bg-zinc-100"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center justify-center gap-2 py-3 border border-dashed border-zinc-250 dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded text-xs text-zinc-600 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition">
              <Upload size={14} />
              <span>Upload starting reference frame</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Configurations */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide font-mono">
            <Video size={13} className="text-indigo-600" /> Cinematic Parameters
          </h4>

          <div className="space-y-3.5 text-xs">
            {/* Aspect Ratio */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">Aspect Ratio Presets</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] transition ${
                    aspectRatio === '16:9'
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850"
                  }`}
                >
                  Landscape (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] transition ${
                    aspectRatio === '9:16'
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850"
                  }`}
                >
                  Portrait (9:16)
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">Cinematic Motion Prompt</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A high-tech manufacturing arm laser welding high-precision rotor blades with brilliant sparks cascading down, cinematic lighting, 4k detail..."
                className="w-full h-24 rounded border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 p-2.5 text-xs text-zinc-750 dark:text-zinc-350 focus:border-indigo-500/35 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={triggerGenerate}
            disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
            className="cursor-pointer w-full rounded bg-indigo-600 py-3 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50 font-mono"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={13} /> Generating frames...
              </>
            ) : (
              <>
                <Sparkles size={13} fill="currentColor" /> Render Veo Clip
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen Side */}
      <div className="flex-1 flex flex-col border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-950/40 items-center justify-center p-6 min-h-[300px]">
        {videoUrl ? (
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className={`rounded overflow-hidden border border-zinc-250 dark:border-zinc-800 bg-black shadow-lg max-w-full ${aspectRatio === '16:9' ? 'aspect-video w-[500px]' : 'w-[260px] h-[460px]'}`}>
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center">
              <a 
                href={videoUrl} 
                download={`veo_cinematic_${Date.now()}.mp4`}
                className="cursor-pointer text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 flex items-center gap-1.5 shadow"
              >
                <Download size={13} /> Download Video MP4
              </a>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-3.5 max-w-sm text-center">
            <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
            <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-mono uppercase tracking-wide animate-pulse">Veo Tensor Synthesis Engine</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed font-light">
              {progressMessage}
            </p>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded overflow-hidden mt-1">
              <div className="bg-indigo-600 h-full w-2/3 rounded animate-infinite-loading" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-600 text-center">
            <Video size={36} className="text-zinc-300 dark:text-zinc-700 mb-2" />
            <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-display">Cinematic Video Stage</h4>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 max-w-xs mt-1 leading-relaxed font-light">
              Render rich high-fidelity video loops directly using Veo models. Generation is a multi-step background queue process. Set values to launch.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-2.5 rounded max-w-md text-left flex gap-1.5 items-start">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Execution Interrupted</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
