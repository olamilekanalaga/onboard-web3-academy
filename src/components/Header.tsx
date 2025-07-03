
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, BookOpen, Menu, ChevronDown, Trophy, Zap, LogOut, Settings, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "./ThemeToggle";
import SearchPopup from "./SearchPopup";
import LanguageSelector from "./LanguageSelector";
import NotificationCenter from "./NotificationCenter";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<{code: string, name: string, flag: string} | null>(null);
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-b border-emerald-800 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* Desktop Logo */}
            <img
              src="/academia web display.png"
              alt="Academia"
              className="hidden md:block h-20 w-auto object-contain"
              onError={(e) => {
                console.error("Failed to load web logo image");
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Mobile Logo */}
            <img
              src="/academia mobile.png"
              alt="Academia"
              className="block md:hidden h-16 w-auto object-contain"
              onError={(e) => {
                console.error("Failed to load mobile logo image");
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation - Only show for authenticated users */}
          {user && (
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-white hover:text-emerald-100 transition-colors font-medium"
                  onMouseEnter={() => setExploreDropdownOpen(true)}
                  onMouseLeave={() => setExploreDropdownOpen(false)}
                >
                  <span>Explore</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {exploreDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-4"
                    onMouseEnter={() => setExploreDropdownOpen(true)}
                    onMouseLeave={() => setExploreDropdownOpen(false)}
                  >
                    <Link to="/course/foundation" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-500">⭐</span>
                        <div>
                          <div className="font-medium">Crypto Foundation</div>
                          <div className="text-xs text-slate-500">Start here • 2 weeks</div>
                        </div>
                      </div>
                    </Link>
                    <Link to="/course/defi" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-500">🏦</span>
                        <div>
                          <div className="font-medium">DeFi Mastery</div>
                          <div className="text-xs text-slate-500">Yield farming, liquidity • 3 weeks</div>
                        </div>
                      </div>
                    </Link>
                    <Link to="/course/degen" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">🚀</span>
                        <div>
                          <div className="font-medium">Degen Trading</div>
                          <div className="text-xs text-slate-500">Memecoins, leverage, airdrops • 2 weeks</div>
                        </div>
                      </div>
                    </Link>
                    <Link to="/course/advanced-trading" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500">📈</span>
                        <div>
                          <div className="font-medium">Advanced Trading</div>
                          <div className="text-xs text-slate-500">Technical analysis, derivatives • 3 weeks</div>
                        </div>
                      </div>
                    </Link>
                    <Link to="/course/development" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-500">⚡</span>
                        <div>
                          <div className="font-medium">Smart Contract Development</div>
                          <div className="text-xs text-slate-500">Solidity, dApps • 4 weeks</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/gamification" className="flex items-center space-x-1 text-white hover:text-emerald-100 transition-colors font-medium">
                <Trophy className="h-4 w-4" />
                <span>Gamification</span>
              </Link>
              <Link to="/demo" className="text-white hover:text-emerald-100 transition-colors font-medium">
                Demo
              </Link>
              <Link to="/profile" className="text-white hover:text-emerald-100 transition-colors font-medium">
                Profile
              </Link>
              <Link to="/settings" className="text-white hover:text-emerald-100 transition-colors font-medium">
                Settings
              </Link>
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* Authenticated User Actions */
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white hover:text-emerald-100 hover:bg-emerald-500"
                  title="Search Courses"
                  onClick={() => setSearchPopupOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-emerald-100 hover:bg-emerald-500 px-3 py-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-emerald-600 text-sm font-medium">
                          {getUserInitials(profile, user)}
                        </span>
                      </div>
                      <span className="hidden sm:inline text-sm">{getDisplayName(profile, user)}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{getDisplayName(profile, user)}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {userCountry && (
                        <p className="text-xs text-blue-600 flex items-center space-x-1 mt-1">
                          <span>{userCountry.flag}</span>
                          <span>{userCountry.name}</span>
                        </p>
                      )}
                    </div>

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center space-x-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>{t('nav.settings')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Language Selector in Dropdown */}
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-gray-500 mb-2">{t('profile.language')}</p>
                      <LanguageSelector variant="dropdown" />
                    </div>

                    <DropdownMenuSeparator />

                    {/* Theme Toggle in Dropdown */}
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-sm">{t('profile.theme') || 'Theme'}</span>
                      <ThemeToggle />
                    </div>

                    <DropdownMenuSeparator />

                    {/* Show country selection popup without reload */}
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

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              /* Unauthenticated User Actions */
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white hover:text-emerald-100 hover:bg-emerald-500"
                  title="Search Courses"
                  onClick={() => setSearchPopupOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:text-emerald-100 hover:bg-emerald-500 font-medium">
                    Log In
                  </Button>
                </Link>
              </div>
            )}

            {!user && (
              <Link to="/auth">
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-2 font-semibold shadow-sm">
                  Join for Free
                </Button>
              </Link>
            )}

            {user && (
              <>
                {/* Notification Center */}
                <NotificationCenter />

                <Link to="/social">
                  <Button variant="ghost" className="text-white hover:text-emerald-100 hover:bg-emerald-500 px-3 py-2 font-medium">
                    {t('nav.community')}
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 font-semibold shadow-sm">
                    {t('nav.courses')}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 text-white hover:text-emerald-100 hover:bg-emerald-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-emerald-800 py-4 space-y-4 bg-emerald-600">
            {/* Language Selector for Mobile */}
            <LanguageSelector variant="mobile" />

            {user && (
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/courses"
                  className="text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.courses')}
                </Link>
                <Link
                  to="/social"
                  className="text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.community')}
                </Link>
                <Link
                  to="/gamification"
                  className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Gamification</span>
                </Link>
                <Link
                  to="/demo"
                  className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="h-4 w-4" />
                  <span>Demo</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors px-2 py-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            )}
            <div className="flex flex-col space-y-3 px-2 pt-2 border-t border-emerald-800">
              <Button
                variant="ghost"
                className="justify-start p-2 text-white hover:text-emerald-100 hover:bg-emerald-500 w-full"
                onClick={() => {
                  setSearchPopupOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Courses
              </Button>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-emerald-600 text-xs font-medium">
                        {getUserInitials(profile, user)}
                      </span>
                    </div>
                    <span className="text-sm text-white">{getDisplayName(profile, user)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start p-2 text-white hover:text-red-200 hover:bg-red-500"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start p-2 w-full text-white hover:text-emerald-100 hover:bg-emerald-500">
                    <User className="h-4 w-4 mr-2" />
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Popup */}
      <SearchPopup
        isOpen={searchPopupOpen}
        onClose={() => setSearchPopupOpen(false)}
      />
    </header>
  );
};

export default Header;
