import React from 'react';
import { cn } from '@/lib/utils';

interface PWALayoutProps {
  children: React.ReactNode;
  className?: string;
  hasHeader?: boolean;
  hasBottomNav?: boolean;
  scrollable?: boolean;
}

/**
 * PWALayout component provides consistent safe area handling for mobile PWA
 * Automatically handles top and bottom safe areas based on props
 */
const PWALayout: React.FC<PWALayoutProps> = ({
  children,
  className = '',
  hasHeader = true,
  hasBottomNav = true,
  scrollable = true
}) => {
  const layoutClasses = cn(
    'min-h-screen bg-background',
    {
      // Apply full safe area when both header and bottom nav are present
      'content-safe-full pwa-content-safe': hasHeader && hasBottomNav,
      // Apply only top safe area when only header is present
      'content-safe-top': hasHeader && !hasBottomNav,
      // Apply only bottom safe area when only bottom nav is present
      'content-safe-bottom': !hasHeader && hasBottomNav,
      // Apply basic safe areas when neither is present
      'pt-safe pb-safe pl-safe pr-safe': !hasHeader && !hasBottomNav,
      // Add scrollable behavior
      'scrollable-content': scrollable,
    },
    className
  );

  return (
    <div className={layoutClasses}>
      {children}
    </div>
  );
};

export default PWALayout;
