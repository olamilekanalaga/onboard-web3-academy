
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

      // Only use user agent detection, not screen size
      // This prevents desktop browsers from being detected as mobile
      return mobileRegex.test(userAgent.toLowerCase());
    };

    // Initial check
    setIsMobile(checkMobile());

    // Add resize listener (but only check user agent, not screen size)
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
