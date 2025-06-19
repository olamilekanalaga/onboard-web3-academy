
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  transparent?: boolean;
}

const MobileHeader = ({
  title,
  showBackButton = false,
  onBackClick,
  showMenu = true,
  onMenuClick,
  transparent = false
}: MobileHeaderProps) => {
  return (
    <header className={`sticky top-0 z-50 px-4 py-3 ${
      transparent
        ? 'bg-transparent'
        : 'bg-white border-b border-slate-200'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={onBackClick} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          ) : (
            <img 
              src="/academia mobile.png" 
              alt="Academia" 
              className="h-8 w-auto"
            />
          )}
          {title && (
            <h1 className={`text-lg font-semibold truncate ${
              transparent ? 'text-white' : 'text-slate-900'
            }`}>{title}</h1>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-2">
          <Link to="/mobile/explore">
            <Button variant="ghost" size="sm" className="p-2" title="Search Courses">
              <Search className={`h-5 w-5 ${transparent ? 'text-white' : 'text-slate-600'}`} />
            </Button>
          </Link>
          {showMenu && (
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
              <Menu className={`h-5 w-5 ${transparent ? 'text-white' : 'text-slate-600'}`} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
