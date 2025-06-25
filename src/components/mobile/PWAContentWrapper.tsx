import React from 'react';
import { cn } from '@/lib/utils';

interface PWAContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
}

/**
 * PWAContentWrapper provides consistent content spacing and scrolling behavior
 * for mobile PWA content areas
 */
const PWAContentWrapper: React.FC<PWAContentWrapperProps> = ({
  children,
  className = '',
  padding = 'md',
  scrollable = true
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const wrapperClasses = cn(
    'w-full',
    paddingClasses[padding],
    {
      'scrollable-content overflow-y-auto -webkit-overflow-scrolling-touch': scrollable,
      'overflow-hidden': !scrollable,
    },
    className
  );

  return (
    <div className={wrapperClasses}>
      {children}
    </div>
  );
};

export default PWAContentWrapper;
