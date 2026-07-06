import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholderColor?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  placeholderColor = 'bg-zinc-100 dark:bg-zinc-800',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px', // start loading slightly before coming into viewport
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred Placeholder Effect */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 w-full h-full animate-pulse transition-opacity duration-500 ease-out ${placeholderColor}`}
          style={{ backdropFilter: 'blur(10px)' }}
        />
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${imgClassName} ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.02]'
        }`}
        {...props}
      />
    </div>
  );
}
