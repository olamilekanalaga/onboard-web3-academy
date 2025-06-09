
import { Home, User, Search, Zap, Trophy } from "lucide-react";
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
      icon: Search,
      label: "Explore",
      path: "/mobile/explore",
      isActive: location.pathname === "/mobile/explore"
    },
    {
      icon: Trophy,
      label: "Rewards",
      path: "/mobile/gamification",
      isActive: location.pathname === "/mobile/gamification"
    },
    {
      icon: Zap,
      label: "Demo",
      path: "/demo",
      isActive: location.pathname === "/demo"
    },
    {
      icon: User,
      label: "Profile",
      path: "/mobile/profile",
      isActive: location.pathname === "/mobile/profile"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${item.isActive
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <item.icon className={`h-5 w-5 ${item.isActive ? 'text-blue-600' : ''}`} />
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
