
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, BookOpen, Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Onboard</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <button 
                className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors"
                onMouseEnter={() => setExploreDropdownOpen(true)}
                onMouseLeave={() => setExploreDropdownOpen(false)}
              >
                <span>Explore</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {exploreDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-4"
                  onMouseEnter={() => setExploreDropdownOpen(true)}
                  onMouseLeave={() => setExploreDropdownOpen(false)}
                >
                  <Link to="/courses/foundations" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Web3 Foundations
                  </Link>
                  <Link to="/courses/defi" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    DeFi Mastery
                  </Link>
                  <Link to="/courses/development" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Smart Contracts & dApps
                  </Link>
                  <Link to="/courses/trading" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Crypto Trading
                  </Link>
                  <Link to="/courses/daos" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    DAOs & Governance
                  </Link>
                  <Link to="/courses/security" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Security & Privacy
                  </Link>
                </div>
              )}
            </div>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              For Students
            </a>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              For Enterprise
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="text-slate-700 hover:text-emerald-600">
                Log In
              </Button>
            </div>
            
            <Link to="/courses">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2">
                Join for Free
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/courses" 
                className="text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Courses
              </Link>
              <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1">
                For Students
              </a>
              <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1">
                For Enterprise
              </a>
            </nav>
            <div className="flex flex-col space-y-3 px-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" className="justify-start p-2">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" className="justify-start p-2">
                Log In
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
