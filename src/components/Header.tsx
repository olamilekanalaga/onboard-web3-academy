
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, BookOpen, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-emerald-600 p-1.5 md:p-2 rounded-lg">
              <BookOpen className="h-4 md:h-6 w-4 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900">Onboard</h1>
              <p className="text-xs text-slate-500 hidden md:block">Web3 Learning</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Courses
            </Link>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Progress
            </a>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Community
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-emerald-600 text-xs flex items-center justify-center">
                  2
                </Badge>
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-4 w-4" />
              </Button>
            </div>
            
            <Link to="/course/foundations">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 md:px-4 py-1.5 md:py-2">
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-slate-700 hover:text-emerald-600 transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors px-2">
                Progress
              </a>
              <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors px-2">
                Community
              </a>
            </nav>
            <div className="flex items-center space-x-3 px-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="h-4 w-4" />
                <span className="ml-2 text-sm">Search</span>
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-4 w-4" />
                <span className="ml-2 text-sm">Profile</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
