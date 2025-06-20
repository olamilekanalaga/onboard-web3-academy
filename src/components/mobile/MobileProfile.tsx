import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useProfile } from "@/hooks/useProfile";
import { useUserSettings } from "@/hooks/useUserSettings";
import { 
  User, 
  Settings, 
  Trophy, 
  BookOpen, 
  Clock, 
  Target,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "./BottomNavigation";

const MobileProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProgress, isLoading } = useCourseProgressionDB();
  const { profile } = useProfile();
  const { settings, updateSettings } = useUserSettings();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const currentStreak = 7;

  interface ProfileSection {
    icon: React.ComponentType<any>;
    label: string;
    action: string;
    danger?: boolean;
    toggle?: boolean;
    enabled?: boolean;
    onToggle?: (enabled: boolean) => void;
  }

  const profileSections: ProfileSection[] = [
    {
      icon: User,
      label: "Personal Information",
      action: "personal",
    },
    {
      icon: Bell,
      label: "Notifications",
      action: "notifications",
      toggle: true,
      enabled: settings?.email_notifications || false,
      onToggle: (enabled: boolean) => updateSettings({ email_notifications: enabled })
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      action: "privacy",
    },
    {
      icon: Palette,
      label: "Appearance",
      action: "appearance",
    },
    {
      icon: Globe,
      label: "Language & Region",
      action: "language",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: "help",
    },
    {
      icon: LogOut,
      label: "Sign Out",
      action: "signout",
      danger: true,
    },
  ];

  const handleSectionClick = (action: string) => {
    if (action === "signout") {
      signOut();
      navigate("/mobile/auth");
    } else if (action === "settings") {
      navigate("/mobile/settings");
    } else {
      setActiveSection(activeSection === action ? null : action);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 pt-12 pb-8">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold">{profile?.full_name || profile?.username || 'User'}</h1>
          <p className="text-blue-100 text-sm">{profile?.email}</p>
          
          {/* Level Badge */}
          <div className="flex items-center justify-center mt-3">
            <Badge className="bg-yellow-500 text-yellow-900 font-medium">
              Level {userProgress.currentLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{userProgress.totalXP}</div>
              <div className="text-xs text-slate-500">Total XP</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{userProgress.completedCourses.length}</div>
              <div className="text-xs text-slate-500">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{userProgress.unlockedCourses.length}</div>
              <div className="text-xs text-slate-500">Unlocked</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{currentStreak}</div>
              <div className="text-xs text-slate-500">Day Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="px-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {profileSections.map((section, index) => (
              <div key={section.action}>
                <button
                  onClick={() => handleSectionClick(section.action)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                    section.danger 
                      ? 'hover:bg-red-50 text-red-600' 
                      : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className={`h-5 w-5 ${section.danger ? 'text-red-500' : 'text-slate-500'}`} />
                    <span className="font-medium">{section.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {section.action === "notifications" && (
                      <Switch
                        checked={settings?.email_notifications || false}
                        onCheckedChange={(checked) => updateSettings({ email_notifications: checked })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {!section.danger && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>
                {index < profileSections.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {userProgress.completedCourses.length > 0 ? (
              <div className="space-y-3">
                {userProgress.completedCourses.slice(0, 3).map((courseId) => (
                  <div key={courseId} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm capitalize">
                        {courseId.replace('-', ' ')} Course
                      </div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No completed courses yet</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate("/mobile/explore")}
                >
                  Start Learning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileProfile;
