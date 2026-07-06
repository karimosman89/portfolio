import { useEffect } from 'react';

interface SEOMetadataProps {
  activeTheme: string;
  isDark: boolean;
}

const themeDescriptions: Record<string, string> = {
  'ai-dark': 'Explore the dark slate styled portfolio of Karim Osman, featuring 3D animated neural overlays and highly precise metric dashboards.',
  'aurora': 'Witness the vibrant northern lights theme displaying state-of-the-art MLOps benchmarks, YOLO CV engines, and custom-tuned generative models.',
  'cyber-blue': 'Step into the neon-blue cyberspace layout mapping quantitative metrics, microservices uptime, and scalable RAG orchestration.',
  'glass-purple': 'Experience the futuristic glassmorphism purple aesthetic framing AI pipelines, neural sandbox simulations, and live voice synthesis.',
  'emerald-ai': 'Dive into the high-tech terminal dark emerald design housing deep learning defect classification frameworks and multi-agent system benchmarks.',
  'neon-gradient': 'View the energetic, high-contrast futuristic neon-orange gradient workspace showcasing robust production-grade engineering deliverables.'
};

export default function SEOMetadata({ activeTheme, isDark }: SEOMetadataProps) {
  useEffect(() => {
    // Dynamically update document title based on theme
    const formattedTheme = activeTheme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    document.title = `Karim Osman | Senior AI Engineer [${formattedTheme} Mode]`;

    // Dynamically update meta description tag
    const description = themeDescriptions[activeTheme] || themeDescriptions['ai-dark'];
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', description);
    } else {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      descMeta.setAttribute('content', description);
      document.head.appendChild(descMeta);
    }

    // Dynamically update Open Graph description
    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', description);
    }

    // Dynamically update Twitter description
    const twDescMeta = document.querySelector('meta[name="twitter:description"]');
    if (twDescMeta) {
      twDescMeta.setAttribute('content', description);
    }

    // Dynamically update theme-color based on mode
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const color = isDark ? '#09090b' : '#fafbfc';
      themeColorMeta.setAttribute('content', color);
    }
  }, [activeTheme, isDark]);

  return null;
}
