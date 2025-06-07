
import { useState } from "react";
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Edit,
  Award,
  BookOpen,
  Clock,
  RotateCcw,
  TrendingUp,
  Target,
  Zap,
  Star,
  Trophy,
  Flame,
  Calendar,
  Download,
  Share2,
  ChevronRight,
  Crown,
  Gem,
  Shield,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobileUser } from "@/contexts/MobileUserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useCertificates } from "@/hooks/useCertificates";
import { useUserStats } from "@/hooks/useUserStats";
import { useToast } from "@/components/ui/use-toast";
import BottomNavigation from "./BottomNavigation";

const MobileProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { resetOnboarding } = useMobileUser();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: userProgress } = useUserProgress();
  const { data: certificates } = useCertificates();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { toast } = useToast();

  const menuItems = [
    { icon: Edit, label: "Edit Profile", action: "edit" },
    { icon: Bell, label: "Notifications", action: "notifications", toggle: true, enabled: true },
    { icon: Settings, label: "Settings", action: "settings" },
    { icon: HelpCircle, label: "Help & Support", action: "help" },
    { icon: RotateCcw, label: "Reset Onboarding", action: "reset", danger: true },
    { icon: LogOut, label: "Sign Out", action: "logout", danger: true }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return "Web3 Legend";
    if (level >= 15) return "Blockchain Master";
    if (level >= 10) return "DeFi Expert";
    if (level >= 5) return "Crypto Scholar";
    return "Web3 Explorer";
  };

  const getLevelIcon = (level: number) => {
    if (level >= 20) return Crown;
    if (level >= 15) return Gem;
    if (level >= 10) return Shield;
    if (level >= 5) return Star;
    return Target;
  };

  const handleMenuAction = async (action: string) => {
    switch (action) {
      case 'reset':
        if (confirm('Are you sure you want to reset the onboarding? This will show the splash screen again.')) {
          resetOnboarding();
        }
        break;
      case 'logout':
        if (confirm('Are you sure you want to sign out?')) {
          const { error } = await signOut();
          if (error) {
            toast({
              title: "Error",
              description: "Failed to sign out",
              variant: "destructive",
            });
          }
        }
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This feature is not implemented yet",
        });
        break;
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const LevelIcon = getLevelIcon(userStats?.level || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden pb-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Header */}
      <div className="relative z-10 px-6 pt-12 pb-8">
        <div className="text-center text-white">
          {/* Profile Avatar with Level Ring */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto relative">
              {/* Level Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1 animate-pulse">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {/* Level Badge */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                  <LevelIcon className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">{userStats?.level || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {profile?.full_name || 'Web3 Learner'}
            </h1>
            <p className="text-blue-200 mb-3">{user?.email}</p>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 px-4 py-2 text-sm font-semibold">
              {getLevelTitle(userStats?.level || 1)}
            </Badge>
          </div>

          {/* XP Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-200">Level Progress</span>
              <span className="text-sm font-medium text-white">{userStats?.xp || 0} XP</span>
            </div>
            <Progress
              value={userStats ? ((userStats.xp % 500) / 500) * 100 : 0}
              className="h-3 bg-white/20"
            />
            <p className="text-xs text-blue-200 mt-2">
              {userStats?.xpToNext || 500} XP to Level {(userStats?.level || 1) + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="relative z-10 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg"
            >
              Certificates
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{userStats?.completedCourses || 0}</div>
                  <div className="text-sm text-blue-200">Courses Completed</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{userStats?.currentStreak || 0}</div>
                  <div className="text-sm text-blue-200">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{userStats?.totalHours || 0}h</div>
                  <div className="text-sm text-blue-200">Hours Learned</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{userStats?.certificates || 0}</div>
                  <div className="text-sm text-blue-200">Certificates</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>This Week's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">+{userStats?.weeklyProgress.progressIncrease || 0}%</div>
                    <div className="text-xs text-blue-200">Learning Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userStats?.weeklyProgress.lessonsCompleted || 0}</div>
                    <div className="text-xs text-blue-200">Lessons Completed</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userStats?.weeklyProgress.coursesStarted || 0}</div>
                    <div className="text-xs text-blue-200">Courses Started</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userStats?.weeklyProgress.hoursLearned || 0}h</div>
                    <div className="text-xs text-blue-200">Hours This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6 space-y-6">
            <div className="grid gap-4">
              {userStats?.achievements.map((achievement, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-white">{achievement.title}</h3>
                          <Badge className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white border-0 text-xs`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-200 mb-2">{achievement.description}</p>
                        <p className="text-xs text-slate-400">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!userStats?.achievements || userStats.achievements.length === 0) && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Achievements Yet</h3>
                    <p className="text-blue-200">Complete courses and maintain streaks to unlock achievements!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="mt-6 space-y-6">
            <div className="grid gap-4">
              {certificates?.map((certificate, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{certificate.courses?.title}</h3>
                        <p className="text-sm text-blue-200 mb-2">{certificate.courses?.description}</p>
                        <p className="text-xs text-slate-400">
                          Issued {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!certificates || certificates.length === 0) && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-8 text-center">
                    <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Certificates Yet</h3>
                    <p className="text-blue-200">Complete courses to earn certificates and showcase your skills!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-0">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuAction(item.action)}
                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/10' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${item.danger ? 'text-red-400' : 'text-blue-200'}`} />
                      <span className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.toggle ? (
                      <Switch checked={item.enabled} />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* App Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Onboard v1.0.0</h3>
                <p className="text-sm text-blue-200 mb-4">Your Web3 Learning Companion</p>
                <p className="text-xs text-slate-400">© 2024 Onboard. All rights reserved.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileProfile;
