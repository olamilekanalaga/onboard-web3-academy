
import { Home, User, Zap, Trophy, BookOpen, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/mobile/home",
      isActive: location.pathname === "/mobile/home"
    },
    {
      icon: BookOpen,
      label: "Courses",
      path: "/mobile/explore",
      isActive: location.pathname === "/mobile/explore"
    },
    {
      icon: Zap,
      label: "Demo",
      path: "/demo",
      isActive: location.pathname === "/demo"
    },
    {
      icon: Trophy,
      label: "Rewards",
      path: "/mobile/gamification",
      isActive: location.pathname === "/mobile/gamification"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/mobile/settings",
      isActive: location.pathname === "/mobile/settings"
    },
    {
      icon: User,
      label: "Profile",
      path: "/mobile/profile",
      isActive: location.pathname === "/mobile/profile"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 md:hidden bottom-nav-safe shadow-lg">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${item.isActive
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <item.icon className={`h-4 w-4 ${item.isActive ? 'text-blue-600' : ''}`} />
            <span className={`text-xs font-medium ${item.isActive ? 'text-blue-600' : ''}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
