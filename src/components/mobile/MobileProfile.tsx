
import { User, Settings, Bell, HelpCircle, LogOut, Edit, Award, BookOpen, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useMobileUser } from "@/contexts/MobileUserContext";
import BottomNavigation from "./BottomNavigation";

const MobileProfile = () => {
  const { resetOnboarding } = useMobileUser();

  const userStats = [
    { label: "Courses Completed", value: "8", icon: BookOpen },
    { label: "Hours Learned", value: "45", icon: Clock },
    { label: "Certificates Earned", value: "5", icon: Award },
    { label: "Current Streak", value: "12", icon: "🔥" }
  ];

  const menuItems = [
    { icon: Edit, label: "Edit Profile", action: "edit" },
    { icon: Bell, label: "Notifications", action: "notifications", toggle: true, enabled: true },
    { icon: Settings, label: "Settings", action: "settings" },
    { icon: HelpCircle, label: "Help & Support", action: "help" },
    { icon: RotateCcw, label: "Reset Onboarding", action: "reset", danger: true },
    { icon: LogOut, label: "Sign Out", action: "logout", danger: true }
  ];

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'reset':
        if (confirm('Are you sure you want to reset the onboarding? This will show the splash screen again.')) {
          resetOnboarding();
        }
        break;
      case 'logout':
        // Handle logout
        break;
      default:
        // Handle other actions
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 pt-12 pb-8">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">John Doe</h1>
          <p className="text-blue-100 mb-2">john.doe@email.com</p>
          <Badge className="bg-white/20 text-white border-white/30">
            Level 8 - Web3 Explorer
          </Badge>
        </div>
      </div>

      {/* User Stats */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          {userStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  {typeof stat.icon === 'string' ? (
                    <span className="text-2xl">{stat.icon}</span>
                  ) : (
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Next Level</h3>
                <p className="text-sm text-slate-600">150 XP to Level 9</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">750 / 900 XP</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Account</h2>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuAction(item.action)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${item.danger ? 'text-red-600' : 'text-slate-600'}`} />
                  <span className={`font-medium ${item.danger ? 'text-red-600' : 'text-slate-900'}`}>
                    {item.label}
                  </span>
                </div>
                {item.toggle ? (
                  <Switch checked={item.enabled} />
                ) : (
                  <div className="text-slate-400">›</div>
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <div className="px-6 py-6">
        <div className="text-center text-slate-500">
          <p className="text-sm mb-2">Onboard v1.0.0</p>
          <p className="text-xs">© 2024 Onboard. All rights reserved.</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileProfile;
