import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, RefreshCw, Upload, Download, Trash2, CheckCircle, Sparkles, AlertTriangle, Disc, Volume2 } from 'lucide-react';

export default function AISoundstage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<'clip' | 'pro'>('clip');
  const [isComposing, setIsComposing] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload an image file.");
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

  const triggerCompose = async () => {
    if (!prompt.trim() && !uploadedImage) {
      setErrorMsg("Please type a music prompt or select an image to inspire the piece.");
      return;
    }
    setIsComposing(true);
    setErrorMsg("");
    setMusicUrl(null);
    setLyrics("");
    setIsPlaying(false);

    try {
      const res = await fetch("/api/gemini/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "Generate a short atmospheric melody inspired by technology.",
          model,
          imageBytes: uploadedImage,
          mimeType: uploadedMimeType
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.audio) {
        setMusicUrl(data.audio);
        setLyrics(data.lyrics || "Ambient Instrumental track - Lyrics not compiled.");
      } else {
        setErrorMsg("The music generation completed but returned empty audio streams.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to compose music track.");
    } finally {
      setIsComposing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [musicUrl]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 overflow-y-auto">
      {/* Settings Side */}
      <div className="lg:w-[42%] space-y-4 shrink-0">
        
        {/* Upload Box */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. Graphic Inspiration (Optional)</h4>
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
              <span>Load design image as motif</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Composition Console */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide font-mono">
            <Music size={13} className="text-indigo-600" /> Aura Sound Console
          </h4>

          <div className="space-y-3.5 text-xs">
            {/* Model Length Selection */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">Track Length Preset</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setModel('clip')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] transition ${
                    model === 'clip'
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850"
                  }`}
                >
                  30s Clip (Lyria Clip)
                </button>
                <button
                  type="button"
                  onClick={() => setModel('pro')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] transition ${
                    model === 'pro'
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-850"
                  }`}
                >
                  Full Track (Lyria Pro)
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">Musical Motif Prompt</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A warm lo-fi hip hop beat with smooth synthesizer, acoustic guitar accents, cozy evening rain vibe, 90 bpm..."
                className="w-full h-24 rounded border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 p-2.5 text-xs text-zinc-750 dark:text-zinc-350 focus:border-indigo-500/35 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={triggerCompose}
            disabled={isComposing || (!prompt.trim() && !uploadedImage)}
            className="cursor-pointer w-full rounded bg-indigo-600 py-3 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50 font-mono"
          >
            {isComposing ? (
              <>
                <RefreshCw className="animate-spin" size={13} /> Orchestrating melodies...
              </>
            ) : (
              <>
                <Sparkles size={13} fill="currentColor" /> Compose Music Motif
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output / Vintage Record stage */}
      <div className="flex-1 flex flex-col border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-950/40 items-center justify-center p-6 min-h-[300px]">
        {musicUrl ? (
          <div className="w-full max-w-md space-y-6 flex flex-col items-center">
            
            {/* Spinning Disc visualizer */}
            <div className="relative">
              <Disc 
                size={160} 
                className={`text-zinc-800 dark:text-zinc-200 ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '8s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border-4 border-indigo-600 dark:border-indigo-400 flex items-center justify-center shadow" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3 w-full">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-white font-mono">Lyria Aura Orchestration Finished</h4>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="cursor-pointer h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg transition"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
                <a
                  href={musicUrl}
                  download={`lyria_composed_${Date.now()}.wav`}
                  className="cursor-pointer h-10 px-4 rounded bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border hover:bg-zinc-50 flex items-center gap-1.5 text-xs font-bold font-mono transition shadow-xs"
                >
                  <Download size={13} /> Export WAV
                </a>
              </div>
              <audio ref={audioRef} src={musicUrl} className="hidden" />
            </div>

            {/* Lyrics sheet */}
            {lyrics && (
              <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded p-4 text-left shadow-inner max-h-[140px] overflow-y-auto">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider block border-b border-zinc-100 dark:border-zinc-900 pb-1 mb-2">Compiled Lyrics / Vocal Sheet</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed italic font-serif">
                  {lyrics}
                </p>
              </div>
            )}
          </div>
        ) : isComposing ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Disc className="animate-spin text-indigo-600 dark:text-indigo-400" size={48} />
            <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-mono uppercase tracking-wide">Orchestrating Harmony Tracks</h4>
            <p className="text-[10px] text-zinc-455 dark:text-zinc-500 max-w-xs leading-relaxed font-light">
              Connecting Lyria Synthesizer streams on the server. Generating base64-encoded wave packets with vocals.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-600 text-center">
            <Music size={36} className="text-zinc-300 dark:text-zinc-700 mb-2" />
            <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-display">Aura Studio Deck</h4>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 max-w-xs mt-1 leading-relaxed font-light">
              Compose professional soundtrack and music assets using Google Lyria clip and track generation. Select parameters on the left to activate deck.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 text-xs font-mono text-rose-600 bg-rose-50 border border-rose-105 p-2.5 rounded max-w-md text-left flex gap-1.5 items-start">
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-600" />
            <div>
              <span className="font-bold block mb-0.5">Composition Fault</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
