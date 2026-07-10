import React, { useState } from 'react';
import { Radio, Upload, RefreshCw, FileAudio, FileVideo, FileImage, Trash2, CheckCircle, Sparkles, AlertTriangle, Copy, Terminal } from 'lucide-react';

export default function AIMediaAnalyzer() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [resultText, setResultText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileMimeType(file.type);
    setErrorMsg("");
    setResultText("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setFileBase64(base64String);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the media file.");
    };
  };

  const triggerAnalyze = async () => {
    if (!fileBase64 || !fileMimeType) {
      setErrorMsg("Please upload a media file (Image, Video, or Audio).");
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg("");
    setResultText("");

    const isAudio = fileMimeType.startsWith("audio/");
    const defaultPrompt = isAudio 
      ? "Please transcribe this audio recording word-for-word, and capture any key technical details." 
      : "Please analyze this media content in detail, providing a professional technical breakdown.";

    try {
      const res = await fetch("/api/gemini/analyze-multimodal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: fileBase64,
          mimeType: fileMimeType,
          prompt: prompt || defaultPrompt
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResultText(data.text || "No results generated.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to analyze media file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFileBase64(null);
    setFileMimeType(null);
    setFileName("");
    setResultText("");
    setErrorMsg("");
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 overflow-y-auto">
      {/* Control Side */}
      <div className="lg:w-[42%] space-y-4 shrink-0">
        
        {/* Upload Box */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. Multimodal Source File</h4>
          {fileBase64 ? (
            <div className="flex items-center justify-between text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded">
              <div className="flex items-center gap-2 truncate max-w-[180px]">
                {fileMimeType?.startsWith("image/") && <FileImage size={15} className="text-blue-500 shrink-0" />}
                {fileMimeType?.startsWith("video/") && <FileVideo size={15} className="text-amber-500 shrink-0" />}
                {fileMimeType?.startsWith("audio/") && <FileAudio size={15} className="text-rose-500 shrink-0" />}
                <span className="font-mono truncate">{fileName}</span>
              </div>
              <button 
                onClick={clearFile}
                className="cursor-pointer text-[10px] font-mono text-rose-500 bg-zinc-50 dark:bg-zinc-950 border px-2 py-1 rounded hover:bg-zinc-100"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-6 border border-dashed border-zinc-250 dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded text-xs text-zinc-600 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition">
              <Upload size={22} className="text-zinc-400 dark:text-zinc-600" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Image, Audio, or Video asset</span>
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Supports JPG, PNG, MP4, WAV, MP3, M4A</span>
              <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Console params */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide font-mono">
            <Radio size={13} className="text-indigo-600" /> Media Query Console
          </h4>

          <div className="space-y-1.5 pt-1">
            <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">Analysis instructions (Prompt)</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={fileMimeType?.startsWith("audio/") ? "Please transcribe this audio recording word-for-word." : "Describe everything present in this media file, with specific focus on technical or operational anomalies."}
              className="w-full h-24 rounded border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 p-2.5 text-xs text-zinc-750 dark:text-zinc-350 focus:border-indigo-500/35 focus:outline-none animate-fade-in"
            />
          </div>

          <button
            onClick={triggerAnalyze}
            disabled={isAnalyzing || !fileBase64}
            className="cursor-pointer w-full rounded bg-indigo-600 py-3 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50 font-mono"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="animate-spin" size={13} /> Decompiling media tracks...
              </>
            ) : (
              <>
                <Sparkles size={13} fill="currentColor" /> Analyze Multimodal Media
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen Side (Terminal Style Board) */}
      <div className="flex-1 flex flex-col border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 min-h-[300px]">
        
        {/* Terminal Header */}
        <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs">
          <span className="font-mono text-[10px] text-zinc-550 dark:text-zinc-400 flex items-center gap-1">
            <Terminal size={12} className="text-indigo-600" /> media_spectrogram_output.log
          </span>
          {resultText && (
            <button 
              onClick={handleCopy}
              className="cursor-pointer text-[10px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-white dark:bg-zinc-900 border px-2 py-1 rounded hover:bg-zinc-50"
            >
              <Copy size={11} /> {isCopied ? "Copied" : "Copy Log"}
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[380px] bg-zinc-50/10 dark:bg-zinc-950/10">
          {resultText ? (
            <div className="text-zinc-700 dark:text-zinc-250 text-xs leading-relaxed whitespace-pre-line font-light font-sans text-left">
              {resultText}
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-center">
              <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
              <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-mono uppercase tracking-wide">Decompiling Media Structure</h4>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 max-w-xs leading-relaxed font-light">
                {fileMimeType?.startsWith("audio/") ? "Streaming raw audio frequency blocks into Whisper/Gemini speech model..." : "Synthesizing spatial visual lattices on deep learning tensor engines..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-zinc-400 dark:text-zinc-600 text-center">
              <Radio size={36} className="text-zinc-300 dark:text-zinc-700 mb-2" />
              <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-display">Acoustic &amp; Visual Board</h4>
              <p className="text-[11px] text-zinc-450 dark:text-zinc-500 max-w-xs mt-1 leading-relaxed font-light">
                Transcribe voice recordings or inspect images/video frames for defects. Load a multimodal source file on the left and submit instructions.
              </p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="m-4 text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-2.5 rounded text-left flex gap-1.5 items-start">
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-600" />
            <div>
              <span className="font-bold block mb-0.5">Analysis Aborted</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
