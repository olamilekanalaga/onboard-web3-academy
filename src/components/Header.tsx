
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, User, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Onboard</h1>
              <p className="text-xs text-slate-500">Web3 Learning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Courses
            </a>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Progress
            </a>
            <a href="#" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Community
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-emerald-600 text-xs">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-4 w-4" />
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
