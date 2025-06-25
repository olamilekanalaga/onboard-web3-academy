
import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

const MobileHeader = ({ 
  title, 
  showBackButton = false, 
  onBackClick, 
  showMenu = true, 
  onMenuClick 
}: MobileHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 mobile-header-safe pwa-header-safe">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={onBackClick} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <img 
              src="/academia mobile.png" 
              alt="Academia" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.log('Image failed to load:', target.src);
                target.style.display = 'none';
              }}
            />
          )}
          <h1 className="text-lg font-bold text-slate-900">
            {title || 'Academia'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
