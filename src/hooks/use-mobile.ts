import { useEffect, useState, useMemo } from "react"

// Device breakpoints
export const DEVICE_BREAKPOINTS = {
  mobile: 640,    // Under 640px
  tablet: 768,    // 641px - 768px
  laptop: 1024,   // 769px - 1024px
  desktop: 1280,  // 1025px - 1280px
  xl: 1536,       // 1281px - 1536px
}

// Device orientation
export type Orientation = 'portrait' | 'landscape';

// Touch detection
export function isTouchDevice() {
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );
}

/**
 * Extended mobile detection hook that provides:
 * - Current device type (mobile, tablet, laptop, desktop, xl)
 * - Device orientation (portrait, landscape)
 * - Touch capability detection
 * - Online/offline status
 */
export function useDevice() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  const [height, setHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  
  const [orientation, setOrientation] = useState<Orientation>(
    width > height ? 'landscape' : 'portrait'
  );
  
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  const [hasTouch, setHasTouch] = useState<boolean>(
    typeof window !== 'undefined' ? isTouchDevice() : false
  );
  
  // Calculate current device type
  const deviceType = useMemo(() => {
    if (width < DEVICE_BREAKPOINTS.mobile) return 'mobile';
    if (width < DEVICE_BREAKPOINTS.tablet) return 'tablet';
    if (width < DEVICE_BREAKPOINTS.laptop) return 'laptop';
    if (width < DEVICE_BREAKPOINTS.desktop) return 'desktop';
    return 'xl';
  }, [width]);
  
  // Calculate specific device flags
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop' || deviceType === 'xl';
  const isPortrait = orientation === 'portrait';
  const isLandscape = orientation === 'landscape';
  
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWidth(newWidth);
      setHeight(newHeight);
      setOrientation(newWidth > newHeight ? 'landscape' : 'portrait');
    };
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    handleResize();
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    width,
    height,
    orientation,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    hasTouch,
    isOnline,
  };
}

/**
 * Legacy hook for backward compatibility
 */
export function useIsMobile() {
  const { isMobile } = useDevice();
  return isMobile;
}
