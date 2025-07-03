
import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Globe, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSelector from '@/components/LanguageSelector';
import NotificationCenter from '@/components/NotificationCenter';

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
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState<{code: string, name: string, flag: string} | null>(null);

  // Fetch user's country
  useEffect(() => {
    const fetchUserCountry = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('country_code, country_name')
          .eq('id', user.id)
          .single();

        if (data?.country_code) {
          // Get flag emoji
          const flagMap: Record<string, string> = {
            'NG': '🇳🇬', 'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪',
            'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱', 'AU': '🇦🇺',
            'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳', 'SG': '🇸🇬',
            'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'ZA': '🇿🇦', 'KE': '🇰🇪',
            'GH': '🇬🇭', 'EG': '🇪🇬', 'AE': '🇦🇪', 'SA': '🇸🇦', 'TR': '🇹🇷'
          };

          setUserCountry({
            code: data.country_code,
            name: data.country_name,
            flag: flagMap[data.country_code] || '🏳️'
          });
        }
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, [user]);

  const getDisplayName = (profile: any, user: any) => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) return profile.first_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
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
          {title && (
            <h1 className="text-lg font-bold text-slate-900">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notification Center - Mobile Optimized */}
          <div className="flex items-center">
            <NotificationCenter />
          </div>

          {/* Search Button */}
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5 text-slate-600" />
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-5 w-5 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getDisplayName(profile, user)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {userCountry && (
                      <p className="text-xs leading-none text-blue-600 flex items-center space-x-1 mt-1">
                        <span>{userCountry.flag}</span>
                        <span>{userCountry.name}</span>
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Change Country */}
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      // Clear country data to trigger popup
                      await supabase
                        .from('profiles')
                        .update({ country_code: null, country_name: null })
                        .eq('id', user?.id);

                      // Trigger popup by dispatching custom event
                      window.dispatchEvent(new CustomEvent('forceCountrySelection'));
                    } catch (error) {
                      console.error('Error resetting country selection:', error);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Change Country</span>
                </DropdownMenuItem>

                {/* Settings */}
                <DropdownMenuItem
                  onClick={() => navigate('/mobile/settings')}
                  className="cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
