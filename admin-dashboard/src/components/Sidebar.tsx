import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Globe,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  TrendingUp,
  Award,
  MessageSquare,
  Bell,
  Shield,
  Download
} from "lucide-react";
// import { motion, AnimatePresence } from 'framer-motion'; // Temporarily disabled
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Simulate getting unread notification count
  useEffect(() => {
    const updateNotificationCount = () => {
      // In a real app, this would come from your notification system
      // For now, we'll simulate it
      const stored = localStorage.getItem('unreadNotifications');
      setUnreadNotifications(stored ? parseInt(stored) : 3);
    };

    updateNotificationCount();

    // Listen for notification updates
    const handleStorageChange = () => updateNotificationCount();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const { signOut, user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      badge: null,
      description: 'Dashboard overview and key metrics'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'Live',
      description: 'Comprehensive platform analytics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      badge: null,
      description: 'Manage and monitor users'
    },
    {
      id: 'geographic',
      label: 'Geographic',
      icon: Globe,
      badge: null,
      description: 'Global user distribution'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications.toString() : null,
      description: 'Real-time notifications and alerts'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      description: 'Configure dashboard and system settings'
    }
  ];

  const bottomItems = [
    // Removed duplicate settings - already in main navigation
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavItem: React.FC<{
    item: typeof navigationItems[0];
    isActive: boolean;
    onClick: () => void;
  }> = ({ item, isActive, onClick }) => (
    <div
      className="relative"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`
          w-full justify-start h-12 px-3 mb-1 relative overflow-hidden
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
          ${collapsed ? 'px-3' : 'px-4'}
        `}
        onClick={onClick}
      >
        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
        
        {!collapsed && (
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "secondary" : "default"}
                className={`ml-2 ${isActive ? 'bg-white/20 text-white' : ''}`}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
        )}
      </Button>

      {/* Tooltip for collapsed state */}
      {collapsed && hoveredItem === item.id && (
        <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
          <div className="font-medium">{item.label}</div>
          <div className="text-xs text-gray-300 mt-1">{item.description}</div>
          {item.badge && (
            <Badge variant="secondary" className="mt-1">
              {item.badge}
            </Badge>
          )}
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="bg-white border-r border-gray-200 flex flex-col h-screen shadow-sm transition-all duration-300"
      style={{ width: collapsed ? 80 : 280 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img
                src="/academia-mobile.png"
                alt="Academia Logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <div>
                <h2 className="font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-600">Academia</p>
              </div>
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-100"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>

        {/* Bottom Navigation removed - no duplicate settings */}
      </div>

      {/* User Profile & Sign Out */}
      <div className="border-t border-gray-200 p-3">
        {!collapsed && (
          <div className="mb-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
            collapsed ? 'px-3' : 'px-4'
          }`}
          onClick={handleSignOut}
        >
          <LogOut className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
          {!collapsed && (
            <span className="font-medium">Sign Out</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
