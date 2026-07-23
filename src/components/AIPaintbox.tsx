import React, { useState } from 'react';
import { Image as ImageIcon, Upload, RefreshCw, Download, Sliders, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import LazyImage from './LazyImage';

interface AIPaintboxProps {
  onImageUsedAsRef?: (base64: string) => void;
}

export default function AIPaintbox({ onImageUsedAsRef }: AIPaintboxProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<'pro' | 'flash'>('pro');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [size, setSize] = useState<'512px' | '1K' | '2K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerGenerate = async () => {
    if (!prompt.trim() && !uploadedImage) {
      setErrorMsg("Please enter a prompt or upload an image to edit.");
      return;
    }
    setIsGenerating(true);
    setErrorMsg("");
    setResultImage(null);

    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "Refining and style editing this image.",
          model,
          aspectRatio,
          size,
          editingImage: uploadedImage,
          mimeType: uploadedMimeType
        })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.image) {
        setResultImage(data.image);
      } else {
        setErrorMsg("No image was returned by the generator model.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to compile image generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearUploaded = () => {
    setUploadedImage(null);
    setUploadedMimeType(null);
    setUploadName("");
    setErrorMsg("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 overflow-y-auto">
      {/* Control Pane */}
      <div className="lg:w-[42%] space-y-4 shrink-0">
        
        {/* Upload Box */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded border border-dashed p-5 text-center transition ${
            isDragging 
              ? "border-indigo-500 bg-indigo-50/10" 
              : uploadedImage 
                ? "border-indigo-500/50 bg-indigo-500/5" 
                : "border-zinc-250 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20"
          }`}
        >
          {uploadedImage ? (
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle size={15} className="text-emerald-500" />
                <span className="font-mono truncate max-w-[150px]">{uploadName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Reference Loaded</span>
              </div>
              <button 
                onClick={clearUploaded}
                className="cursor-pointer text-rose-500 hover:text-rose-600 font-mono text-[10px] flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
              <Upload size={22} className="text-zinc-400 dark:text-zinc-600" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Image Reference / Editing Canvas</span>
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Drag &amp; drop or click to upload</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          )}
        </div>

        {/* Hyperparameters */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4">
          <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Sliders size={13} className="text-indigo-600 dark:text-indigo-400" /> Paintbox Settings
          </h4>

          <div className="space-y-3.5 text-xs">
            {/* Model Selection */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">1. Image Quality Tier</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setModel('pro')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] font-semibold transition ${
                    model === 'pro'
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-550 dark:text-zinc-455 hover:border-zinc-300"
                  }`}
                >
                  Pro Image (gemini-3.1-pro)
                </button>
                <button
                  type="button"
                  disabled={!!uploadedImage}
                  onClick={() => setModel('flash')}
                  className={`cursor-pointer p-2 rounded text-center border font-mono text-[11px] font-semibold transition ${
                    uploadedImage 
                      ? "opacity-40 cursor-not-allowed border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 text-zinc-300" 
                      : model === 'flash'
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-550 dark:text-zinc-455 hover:border-zinc-300"
                  }`}
                >
                  Flash Image
                </button>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">2. Aspect Ratio</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(['1:1', '3:4', '4:3', '9:16', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`cursor-pointer px-2.5 py-1.5 rounded border text-[11px] font-mono transition ${
                      aspectRatio === ratio
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">3. Target Resolution</span>
              <div className="flex gap-1.5 mt-1">
                {(['512px', '1K', '2K'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`cursor-pointer px-3 py-1.5 rounded border text-[11px] font-mono transition ${
                      size === s
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-wider">4. Creation Prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={uploadedImage ? "Type instructions to edit this image (e.g., 'can you add a futuristic digital overlay next to the rotor blade')" : "Describe the image you want to create (e.g., 'A modern glowing server bay with neural connections in high-tech digital painting style')"}
              className="w-full h-20 rounded border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 p-2.5 text-xs text-zinc-750 dark:text-zinc-300 focus:border-indigo-500/35 focus:outline-none"
            />
          </div>

          <button
            onClick={triggerGenerate}
            disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
            className="cursor-pointer w-full rounded bg-indigo-600 dark:bg-indigo-500 py-3 text-center text-xs font-bold text-white uppercase tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center gap-1.5 disabled:opacity-50 font-mono"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={13} /> Compiling paint vectors...
              </>
            ) : (
              <>
                <Sparkles size={13} fill="currentColor" /> {uploadedImage ? "Execute Image Edit" : "Synthesize Painting"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display Frame */}
      <div className="flex-1 flex flex-col min-h-[300px] border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-950/40 items-center justify-center p-6 text-center">
        {resultImage ? (
          <div className="space-y-4 max-w-full">
            <div className="rounded overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md max-h-[350px] flex justify-center items-center bg-white dark:bg-zinc-900">
              <LazyImage 
                src={resultImage} 
                alt="AI Generated" 
                className="max-h-[350px] w-auto"
                imgClassName="max-h-[350px] w-auto object-contain"
              />
            </div>
            <div className="flex gap-2 justify-center font-mono">
              <a 
                href={resultImage} 
                download={`paintbox_${Date.now()}.png`}
                className="cursor-pointer text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-1.5 shadow"
              >
                <Download size={13} /> Download PNG
              </a>
              {onImageUsedAsRef && (
                <button
                  onClick={() => onImageUsedAsRef(resultImage.split(",")[1])}
                  className="cursor-pointer text-xs font-semibold rounded bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition"
                >
                  Use for Edit Reference
                </button>
              )}
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
            <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-mono uppercase tracking-wide">Synthesizing Latent Diffusion Frame</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 max-w-xs leading-relaxed font-light">
              We are connecting to Gemini Image Engine on the server. Generating fine-grained details in {aspectRatio} format.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-600">
            <ImageIcon size={36} className="text-zinc-300 dark:text-zinc-700 mb-2" />
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-display">Aesthetic Paintbox Canvas</h4>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 max-w-sm mt-1 leading-relaxed font-light">
              Generate pixel-perfect professional graphics or edit pre-existing turbine sheets. Set options on the left to activate the compiler.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-2.5 rounded max-w-md">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
