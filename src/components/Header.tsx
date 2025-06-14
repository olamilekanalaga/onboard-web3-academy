import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, BookOpen, Menu, ChevronDown, Trophy, Zap, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    const {
      error
    } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
      navigate("/");
    }
  };
  return <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 bg-blue-200">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Standard web size */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/academia web display.png" alt="Academia" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation - Only show for authenticated users */}
          {user && <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative">
                <button className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors" onMouseEnter={() => setExploreDropdownOpen(true)} onMouseLeave={() => setExploreDropdownOpen(false)}>
                  <span>Explore</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {exploreDropdownOpen && <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-4" onMouseEnter={() => setExploreDropdownOpen(true)} onMouseLeave={() => setExploreDropdownOpen(false)}>
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
                  </div>}
              </div>
              <Link to="/gamification" className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors">
                <Trophy className="h-4 w-4" />
                <span>Gamification</span>
              </Link>
              <Link to="/demo" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Demo
              </Link>
              <Link to="/profile" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Profile
              </Link>
              <Link to="/settings" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Settings
              </Link>
            </nav>}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (/* Authenticated User Actions */
          <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="p-2">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(profile, user)}
                    </span>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="text-slate-700 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </div>) : (/* Unauthenticated User Actions */
          <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="p-2">
                  <Search className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="ghost" className="text-slate-700 hover:text-emerald-600">
                    Log In
                  </Button>
                </Link>
              </div>)}

            {!user && <Link to="/auth">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2">
                  Join for Free
                </Button>
              </Link>}

            {user && <Link to="/courses">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2">
                  My Courses
                </Button>
              </Link>}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="lg:hidden border-t border-slate-200 py-4 space-y-4">
            {user && <nav className="flex flex-col space-y-3">
                <Link to="/courses" className="text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                  All Courses
                </Link>
                <Link to="/gamification" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                  <Trophy className="h-4 w-4" />
                  <span>Gamification</span>
                </Link>
                <Link to="/demo" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                  <Zap className="h-4 w-4" />
                  <span>Demo</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>}
            <div className="flex flex-col space-y-3 px-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" className="justify-start p-2">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {user ? <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {getUserInitials(profile, user)}
                      </span>
                    </div>
                    <span className="text-sm text-slate-700">{getDisplayName(profile, user)}</span>
                  </div>
                  <Button variant="ghost" className="justify-start p-2 text-red-600 hover:text-red-700" onClick={() => {
              handleSignOut();
              setMobileMenuOpen(false);
            }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div> : <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start p-2 w-full">
                    <User className="h-4 w-4 mr-2" />
                    Log In
                  </Button>
                </Link>}
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;
