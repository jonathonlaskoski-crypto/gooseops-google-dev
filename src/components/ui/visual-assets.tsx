import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage as EnhancedOptimizedImage } from '@/components/ui/optimized-image';

// Re-export the enhanced optimized image
export { OptimizedImage } from '@/components/ui/optimized-image';

// Video Component with performance optimizations
interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
}

export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = 'metadata',
  onLoadStart,
  onCanPlay,
  onError
}) => {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn('w-full h-full object-cover', className)}
      poster={poster}
      autoPlay={isInView && autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      preload={isInView ? preload : 'none'}
      onLoadStart={onLoadStart}
      onCanPlay={onCanPlay}
      onError={onError}
      playsInline
    >
      {isInView && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

// Hero Background Component
interface HeroBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'image' | 'video';
  imageSrc?: string;
  videoSrc?: string;
  overlay?: boolean;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  children,
  className,
  variant = 'gradient',
  imageSrc,
  videoSrc,
  overlay = true
}) => {
  const baseClasses = 'relative min-h-[400px] flex items-center justify-center overflow-hidden';

  return (
    <div className={cn(baseClasses, className)}>
      {/* Background Layer */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      )}

      {variant === 'image' && imageSrc && (
        <EnhancedOptimizedImage
          src={imageSrc}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          lazyLoad={false}
          preset="banner"
        />
      )}

      {variant === 'video' && videoSrc && (
        <OptimizedVideo
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          controls={false}
          preload="auto"
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

// Professional Photo Placeholder Component
interface ProfessionalPhotoProps {
  type: 'executive' | 'team' | 'office' | 'field-work' | 'equipment' | 'facility';
  className?: string;
  alt?: string;
}

export const ProfessionalPhoto: React.FC<ProfessionalPhotoProps> = ({
  type,
  className,
  alt
}) => {
  // Professional placeholder images (in production, replace with actual high-res photos)
  const photoUrls = {
    executive: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    'field-work': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    equipment: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    facility: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=800&fit=crop'
  };

  return (
    <EnhancedOptimizedImage
      src={photoUrls[type]}
      alt={alt || `${type} professional photo`}
      className={cn('rounded-lg shadow-lg', className)}
      width={800}
      height={600}
      preset="full"
      lazyLoad={true}
    />
  );
};