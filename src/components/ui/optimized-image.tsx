import React, { useState, useEffect, memo } from 'react';
import { useIntersectionObserver, useAdaptiveMedia } from '@/hooks/usePerformanceOptimizations';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  lazyLoad?: boolean;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: number;
  preset?: 'avatar' | 'thumbnail' | 'banner' | 'full';
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  lazyLoad = true,
  fallbackSrc,
  className = '',
  containerClassName = '',
  aspectRatio,
  preset,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, isVisible, wasEverVisible } = useIntersectionObserver();
  const { optimizeImageSource } = useAdaptiveMedia();
  
  // Determine actual width and height based on preset
  const resolvePresetDimensions = () => {
    if (!preset) return { presetWidth: width, presetHeight: height };
    
    switch (preset) {
      case 'avatar':
        return { presetWidth: 48, presetHeight: 48 };
      case 'thumbnail':
        return { presetWidth: 150, presetHeight: 150 };
      case 'banner':
        return { presetWidth: 800, presetHeight: 250 };
      case 'full':
        return { presetWidth: undefined, presetHeight: undefined };
      default:
        return { presetWidth: width, presetHeight: height };
    }
  };
  
  const { presetWidth, presetHeight } = resolvePresetDimensions();
  
  // Determine the source to use based on visibility and loading state
  const imageSrc = (() => {
    if (error && fallbackSrc) return fallbackSrc;
    if (!wasEverVisible || !isVisible) return placeholderSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    return optimizeImageSource(src, presetWidth, presetHeight);
  })();
  
  // Handle load and error events
  const handleLoad = () => {
    setLoaded(true);
  };
  
  const handleError = () => {
    setError(true);
  };
  
  // Reset states when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);
  
  // Calculate aspect ratio styles
  const aspectRatioStyle = aspectRatio 
    ? { paddingBottom: `${(1 / aspectRatio) * 100}%` }
    : {};
  
  return (
    <div 
      ref={ref}
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio && 'w-full',
        containerClassName
      )}
      style={aspectRatio ? aspectRatioStyle : {}}
    >
      {(wasEverVisible || !lazyLoad) && (
        <img
          src={imageSrc}
          alt={alt}
          width={presetWidth}
          height={presetHeight}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            aspectRatio && 'absolute inset-0 h-full w-full object-cover',
            className
          )}
          loading={lazyLoad ? "lazy" : "eager"}
          {...props}
        />
      )}
    </div>
  );
});
