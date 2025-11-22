import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect if a component is currently visible in the viewport
 * to implement lazy loading and optimize rendering
 */
export function useIntersectionObserver(
  options = {
    threshold: 0.1,
    rootMargin: '0px',
  }
) {
  const [isVisible, setIsVisible] = useState(false);
  const [wasEverVisible, setWasEverVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true);
      setWasEverVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        if (visible && !wasEverVisible) {
          setWasEverVisible(true);
        }
      },
      options
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin, wasEverVisible]);
  
  return { ref, isVisible, wasEverVisible };
}

/**
 * Hook to debounce rapid function calls (e.g. scroll, resize, input)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook to throttle function calls to a maximum frequency
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);
  
  const throttledFunc = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;
      
      lastArgs.current = args;
      
      if (timeSinceLastCall >= delay) {
        // If enough time has passed, execute immediately
        func(...args);
        lastCall.current = now;
      } else {
        // Otherwise, schedule execution after the delay
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        
        timeoutId.current = setTimeout(() => {
          if (lastArgs.current) {
            func(...lastArgs.current);
            lastCall.current = Date.now();
            timeoutId.current = null;
          }
        }, delay - timeSinceLastCall);
      }
    },
    [func, delay]
  );
  
  return throttledFunc;
}

/**
 * Hook to detect if the device is a mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  return isMobile;
}

/**
 * Hook to track network speed and adjust optimizations accordingly
 */
export function useNetworkSpeed() {
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  
  useEffect(() => {
    // Try to use Network Information API if available
    if ('connection' in navigator && 'effectiveType' in (navigator as any).connection) {
      const connection = (navigator as any).connection;
      
      const updateNetworkSpeed = () => {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setNetworkSpeed('slow');
        } else if (effectiveType === '3g') {
          setNetworkSpeed('medium');
        } else if (effectiveType === '4g') {
          setNetworkSpeed('fast');
        }
      };
      
      updateNetworkSpeed();
      connection.addEventListener('change', updateNetworkSpeed);
      
      return () => {
        connection.removeEventListener('change', updateNetworkSpeed);
      };
    } else {
      // Fallback: Simple speed test
      const startTime = Date.now();
      const imageUrl = 'https://www.google.com/images/phd/px.gif';
      
      const image = new Image();
      image.onload = () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration < 75) {
          setNetworkSpeed('fast');
        } else if (duration < 300) {
          setNetworkSpeed('medium');
        } else {
          setNetworkSpeed('slow');
        }
      };
      
      image.onerror = () => {
        // If image fails to load, assume medium speed
        setNetworkSpeed('medium');
      };
      
      image.src = `${imageUrl}?t=${startTime}`;
    }
  }, []);
  
  return networkSpeed;
}

/**
 * Hook to lazy load images with fade-in effect
 */
export function useLazyImage(src: string, placeholder: string) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
  }, [src]);
  
  return { imageSrc, imageLoaded };
}

/**
 * Hook to automatically optimize media based on network conditions
 */
export function useAdaptiveMedia() {
  const networkSpeed = useNetworkSpeed();
  
  const getOptimalImageQuality = useCallback(() => {
    switch (networkSpeed) {
      case 'slow':
        return 0.4; // 40% quality for slow connections
      case 'medium':
        return 0.6; // 60% quality for medium connections
      case 'fast':
        return 0.8; // 80% quality for fast connections
      default:
        return 0.6; // Default to medium quality
    }
  }, [networkSpeed]);
  
  const optimizeImageSource = useCallback(
    (originalSrc: string, width?: number, height?: number): string => {
      // For real CDN-based image optimization, you would use a service like Cloudinary
      // For now, we'll just simulate optimization by adding query parameters
      
      // Extract base URL and query params
      const [baseUrl, existingQuery] = originalSrc.split('?');
      const params = new URLSearchParams(existingQuery || '');
      
      // Add optimization parameters based on network speed
      params.set('quality', String(Math.floor(getOptimalImageQuality() * 100)));
      
      if (width) {
        params.set('width', String(width));
      }
      
      if (height) {
        params.set('height', String(height));
      }
      
      // Build optimized URL
      return `${baseUrl}?${params.toString()}`;
    },
    [getOptimalImageQuality]
  );
  
  return {
    networkSpeed,
    getOptimalImageQuality,
    optimizeImageSource,
  };
}
