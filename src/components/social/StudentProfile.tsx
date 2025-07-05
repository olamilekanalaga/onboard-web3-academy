import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Users, 
  UserPlus,
  UserMinus,
  Heart,
  Trophy,
  Target,
  BookOpen,
  Star,
  Flame,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import DirectMessageModal from './DirectMessageModal';

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

interface StudentData {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  completed_courses: string[];
  user_email?: string;
  user_name?: string;
  user_avatar?: string;
}

interface ProgressItem {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  course_id?: string;
  xp_earned: number;
  reactions_count: number;
  created_at: string;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [studentProgress, setStudentProgress] = useState<ProgressItem[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      // Load student data with user info from the view
      const { data: userData } = await supabase
        .from('user_profiles_view')
        .select('*')
        .eq('user_id', studentId)
        .single();

      if (userData) {
        setStudentData(userData);
      }

      // Load student progress
      const { data: progressData } = await supabase
        .from('social_progress')
        .select('*')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false })
        .limit(10);

      setStudentProgress(progressData || []);

      // Check if current user is following this student
      const { data: followData } = await supabase
        .from('social_follows')
        .select('id')
        .eq('follower_id', user?.id)
        .eq('following_id', studentId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

      setIsFollowing(!!followData);

      // Get follower/following counts
      const { data: followersData } = await supabase
        .from('social_follows')
        .select('id')
        .eq('following_id', studentId);

      const { data: followingData } = await supabase
        .from('social_follows')
        .select('id')
        .eq('follower_id', studentId);

      setFollowerCount(followersData?.length || 0);
      setFollowingCount(followingData?.length || 0);

    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('social_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', studentId);

        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        // Follow
        await supabase
          .from('social_follows')
          .insert({
            follower_id: user.id,
            following_id: studentId
          });

        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);

        // Create notification with username instead of email
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single();

        const displayName = profile?.full_name || profile?.username || 'Someone';

        await supabase
          .from('notifications')
          .insert({
            user_id: studentId,
            type: 'follow',
            title: 'New Follower',
            message: `${displayName} just followed you!`,
            data: { follower_id: user.id }
          });

        // Check if this is a follow-back (if the student was already following the current user)
        const { data: existingFollow } = await supabase
          .from('social_follows')
          .select('id')
          .eq('follower_id', studentId)
          .eq('following_id', user.id)
          .maybeSingle();

        if (existingFollow) {
          // This is a follow-back, notify the current user
          const { data: studentProfile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', studentId)
            .single();

          const studentDisplayName = studentProfile?.full_name || studentProfile?.username || 'Someone';

          await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              type: 'follow',
              title: 'Follow Back',
              message: `${studentDisplayName} followed you back!`,
              data: { follower_id: studentId }
            });
        }
      }
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'course_completed': return Trophy;
      case 'quiz_passed': return Target;
      case 'chapter_completed': return BookOpen;
      case 'achievement_unlocked': return Star;
      case 'streak_milestone': return Flame;
      default: return Award;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'course_completed': return 'bg-green-500';
      case 'quiz_passed': return 'bg-blue-500';
      case 'chapter_completed': return 'bg-purple-500';
      case 'achievement_unlocked': return 'bg-yellow-500';
      case 'streak_milestone': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
            <p className="text-gray-600">This student profile could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('social.back_to_students')}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-16 h-16 md:w-24 md:h-24">
                <AvatarImage src={studentData.user_avatar} />
                <AvatarFallback className="text-lg md:text-2xl">
                  {studentData.user_name?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                  {studentData.user_name || `Student ${studentData.user_id.slice(-4)}`}
                </h1>
                <p className="text-gray-600 mb-4">
                  @{studentData.user_name?.toLowerCase().replace(/\s+/g, '') || 'student'}
                </p>
                
                <div className="flex items-center space-x-6 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{followerCount}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{followingCount}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{studentData.completed_courses?.length || 0}</p>
                    <p className="text-sm text-gray-600">Courses</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Level {studentData.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {studentData.total_xp} XP
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {studentData.current_streak} day streak
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-col space-y-2 md:space-y-3 w-full md:w-auto">
              {studentId !== user?.id && (
                <>
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={`w-full md:w-auto text-sm ${isFollowing ? "text-red-600 border-red-200 hover:bg-red-50" : ""}`}
                    size="sm"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Opening chat with:', studentData.user_name);
                      setShowChatModal(true);
                    }}
                    className="w-full md:w-auto text-sm"
                    size="sm"
                  >
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('social.recent_activity')}</CardTitle>
        </CardHeader>
        <CardContent>
          {studentProgress.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {studentProgress.map((item) => {
                const ActivityIcon = getActivityIcon(item.activity_type);
                
                return (
                  <div key={item.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg ${getActivityColor(item.activity_type)}`}>
                      <ActivityIcon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                        {item.xp_earned > 0 && (
                          <Badge variant="secondary">+{item.xp_earned} XP</Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{item.reactions_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direct Message Modal */}
      {studentData && (
        <DirectMessageModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          recipientId={studentId}
          recipientName={studentData.user_name || `Student ${studentId.slice(-4)}`}
          recipientAvatar={studentData.user_avatar}
        />
      )}
    </div>
  );
};

export default StudentProfile;
