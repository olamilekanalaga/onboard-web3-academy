
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useProfile } from "@/hooks/useProfile";
import { useUserSettings, useUpdateUserSettings } from "@/hooks/useUserSettings";
import { useAppUsageTracking } from "@/hooks/useAppUsageTracking";
import { getUserInitials } from "@/utils/userDisplay";
import { supabase } from "@/integrations/supabase/client";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BottomNavigation from "./BottomNavigation";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import MobileHeader from "./MobileHeader";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";

const MobileProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProgress, isLoading } = useCourseProgressionDB();
  const { data: profile } = useProfile();
  const { data: settings } = useUserSettings();

  // Track app usage for streaks
  useAppUsageTracking();
  const updateSettingsMutation = useUpdateUserSettings();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);

  const currentStreak = 7;

  // Load social stats
  useEffect(() => {
    if (user) {
      loadSocialStats();
    }
  }, [user]);

  const loadSocialStats = async () => {
    try {
      // Get follower count from social_follows table
      const { count: followers } = await supabase
        .from('social_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user?.id);

      // Get following count from social_follows table
      const { count: following } = await supabase
        .from('social_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user?.id);

      setFollowerCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Error loading social stats:', error);
    }
  };

  const loadFollowersList = async () => {
    try {
      const { data: followersData, error } = await supabase
        .from('social_follows')
        .select(`
          follower_id,
          follower:profiles!social_follows_follower_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('following_id', user?.id);

      if (error) {
        console.error('Error loading followers list:', error);
        return;
      }

      setFollowersList(followersData || []);
    } catch (error) {
      console.error('Error loading followers list:', error);
    }
  };

  const loadFollowingList = async () => {
    try {
      const { data: followingData, error } = await supabase
        .from('social_follows')
        .select(`
          following_id,
          following:profiles!social_follows_following_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('follower_id', user?.id);

      if (error) {
        console.error('Error loading following list:', error);
        return;
      }

      setFollowingList(followingData || []);
    } catch (error) {
      console.error('Error loading following list:', error);
    }
  };

  const handleFollowersClick = async () => {
    await loadFollowersList();
    setShowFollowersModal(true);
  };

  const handleFollowingClick = async () => {
    await loadFollowingList();
    setShowFollowingModal(true);
  };

  interface ProfileSection {
    icon: React.ComponentType<any>;
    label: string;
    action: string;
    danger?: boolean;
    toggle?: boolean;
    enabled?: boolean;
    onToggle?: (enabled: boolean) => void;
  }

  const updateSettings = (updates: any) => {
    updateSettingsMutation.mutate(updates);
  };

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
      <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
        <MobileHeader title="Profile" />
        <PWAContentWrapper>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading profile...</p>
            </div>
          </div>
        </PWAContentWrapper>
        <BottomNavigation />
      </PWALayout>
    );
  }

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
      <MobileHeader title="Profile" />

      <PWAContentWrapper padding="none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 pt-4 pb-8">
        <div className="text-center text-white">
          <div className="mb-4">
            <ProfilePictureUpload
              currentAvatarUrl={profile?.avatar_url}
              userInitials={getUserInitials(profile, user)}
              size="md"
            />
          </div>
          <h1 className="text-xl font-bold">{profile?.full_name || profile?.username || 'User'}</h1>
          <p className="text-blue-100 text-sm">@{profile?.username || 'user'}</p>
          
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
        <div className="grid grid-cols-2 gap-3 mb-4">
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
              <div className="text-lg font-bold text-slate-900">{userProgress?.completedCourses?.length || 0}</div>
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

        {/* Social Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow rounded-lg border border-gray-200"
            onClick={handleFollowersClick}
          >
            <div className="p-4 text-center">
              <User className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{followerCount}</div>
              <div className="text-xs text-slate-500">Followers</div>
            </div>
          </div>

          <div
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow rounded-lg border border-gray-200"
            onClick={handleFollowingClick}
          >
            <div className="p-4 text-center">
              <User className="h-6 w-6 text-pink-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-900">{followingCount}</div>
              <div className="text-xs text-slate-500">Following</div>
            </div>
          </div>
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
                {section.action === "notifications" ? (
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-5 w-5 text-slate-500" />
                      <span className="font-medium text-slate-900">{section.label}</span>
                    </div>
                    <Switch
                      checked={settings?.email_notifications || false}
                      onCheckedChange={(checked) => updateSettings({ email_notifications: checked })}
                    />
                  </div>
                ) : (
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
                    
                    {!section.danger && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  </button>
                )}
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

      </PWAContentWrapper>

      <BottomNavigation />

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Followers ({followerCount})</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {followersList.length > 0 ? (
              <div className="space-y-3">
                {followersList.map((follower) => (
                  <div key={follower.follower_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={follower.follower?.avatar_url} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {(follower.follower?.full_name || follower.follower?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {follower.follower?.full_name || follower.follower?.username || 'Unknown User'}
                      </p>
                      {follower.follower?.username && (
                        <p className="text-sm text-gray-500">@{follower.follower.username}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No followers yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Following ({followingCount})</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {followingList.length > 0 ? (
              <div className="space-y-3">
                {followingList.map((following) => (
                  <div key={following.following_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={following.following?.avatar_url} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {(following.following?.full_name || following.following?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {following.following?.full_name || following.following?.username || 'Unknown User'}
                      </p>
                      {following.following?.username && (
                        <p className="text-sm text-gray-500">@{following.following.username}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Not following anyone yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PWALayout>
  );
};

export default MobileProfile;
