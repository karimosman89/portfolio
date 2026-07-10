import React, { useEffect, useState } from 'react';
import { Loader2, Calendar } from 'lucide-react';

interface CalendlyWidgetProps {
  url?: string;
}

export default function CalendlyWidget({ url = "https://calendly.com/karim-programmer2020" }: CalendlyWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if system / page is in dark mode
    const checkDarkMode = () => {
      const isHtmlDark = document.documentElement.classList.contains('dark');
      setIsDark(isHtmlDark);
    };

    checkDarkMode();

    // Set up MutationObserver to watch dark mode class changes on html
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Format the Calendly URL with themes to seamlessly blend into Karim's layout!
  const getThemedUrl = () => {
    if (!url) return "";
    const baseUrl = url.split('?')[0];
    
    // Indigo matches the brand's main accent
    const brandColor = "6366f1"; 
    const textColor = isDark ? "ffffff" : "09090b";
    const bgColor = isDark ? "09090b" : "ffffff";
    
    return `${baseUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=${bgColor}&text_color=${textColor}&primary_color=${brandColor}`;
  };

  useEffect(() => {
    // Load official Calendly Widget Script dynamically
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      setLoading(false);
    };

    // If already loaded or loads immediately
    if ((window as any).Calendly) {
      setLoading(false);
    }

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [url, isDark]);

  const themedUrl = getThemedUrl();

  return (
    <div className="relative w-full rounded-xl border border-zinc-200 dark:border-zinc-850 overflow-hidden bg-white dark:bg-zinc-950 p-1 min-h-[660px] flex flex-col justify-between">
      
      {/* Top micro-bar for branding integration */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-indigo-600 dark:text-indigo-400" />
          <span>Official Calendly Scheduler</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-450 font-bold">● Active In-Frame</span>
      </div>

      <div className="relative flex-1 min-h-[610px] w-full">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-400 space-y-3 z-10">
            <Loader2 size={24} className="animate-spin text-indigo-500" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Initializing Calendly Core API...</p>
          </div>
        )}
        
        {themedUrl && (
          <iframe
            src={themedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full min-h-[610px]"
            title="Calendly Scheduling Widget"
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
    </div>
  );
}
