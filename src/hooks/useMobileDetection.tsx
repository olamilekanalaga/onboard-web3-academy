
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }

      const userAgent = navigator.userAgent || navigator.vendor || '';
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isSmallScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Combine user agent, screen size, and touch capability for better detection
      // Also check if we're accessing a mobile route (for development/testing)
      const isMobileRoute = window.location.pathname.startsWith('/mobile/');

      return mobileRegex.test(userAgent.toLowerCase()) || (isSmallScreen && isTouchDevice) || isMobileRoute;
    };

    // Initial check
    setIsMobile(checkMobile());

    // Add resize listener
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
