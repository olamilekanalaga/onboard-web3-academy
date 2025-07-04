import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Heart,
  Trophy,
  Target,
  ThumbsUp,
  Flame,
  Zap,
  Bell,
  Send,
  BookOpen,
  Star,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import StudentProfile from '@/components/social/StudentProfile';
import DirectMessageModal from '@/components/social/DirectMessageModal';
import ConversationList from '@/components/social/ConversationList';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ProgressItem {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string;
  course_id?: string;
  xp_earned: number;
  reactions_count: number;
  created_at: string;
  user_email?: string;
  user_reactions?: Array<{
    reaction_type: string;
    user_id: string;
  }>;
}

interface StudentStats {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  completed_courses: string[];
}

const Social: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('feed');
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [students, setStudents] = useState<StudentStats[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<ProgressItem[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{
    id: string;
    name: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Auto-refresh recent completions every 30 seconds
  useEffect(() => {
    if (user && activeTab === 'students') {
      const interval = setInterval(() => {
        console.log('Auto-refreshing recent completions...');
        loadData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      // Load progress from ALL users (not just followed users)
      const { data: followingData } = await supabase
        .from('social_follows')
        .select('following_id')
        .eq('follower_id', user?.id);

      const followingIds = followingData?.map(f => f.following_id) || [];

      // Load progress items from ALL users with user info
      const { data: progressData } = await supabase
        .from('social_progress')
        .select(`
          *,
          social_reactions(reaction_type, user_id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50); // Show more users

      if (progressData) {
        const enrichedProgress = progressData.map(item => ({
          ...item,
          user_email: item.user_email || 'Student',
          user_name: item.user_name || 'Academia Student',
          user_avatar: item.user_avatar,
          user_reactions: item.social_reactions || []
        }));

        setProgressItems(enrichedProgress);
      }

      // Load all students with stats and user info
      const { data: studentsData } = await supabase
        .from('user_profiles_view')
        .select('*')
        .neq('user_id', user?.id)
        .order('total_xp', { ascending: false })
        .limit(100); // Show more students

      setStudents(studentsData || []);

      // Load recent course completions (last 30 days) - increased from 7 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentData } = await supabase
        .from('social_progress')
        .select('*')
        .eq('activity_type', 'course_completed')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50); // Increased from 10 to 50

      setRecentCompletions(recentData || []);

      // Load who you're following
      setFollowing(new Set(followingIds));

      // Load notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setNotifications(notificationsData || []);

    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (progressId: string, reactionType: string) => {
    if (!user) {
      console.log('❌ No user logged in for reaction');
      return;
    }

    console.log('🎯 REACTION CLICKED:', { progressId, reactionType, userId: user.id });

    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('social_reactions')
        .select('id')
        .eq('progress_id', progressId)
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid 406 error

      if (existingReaction) {
        // Remove reaction
        console.log('🗑️ Removing existing reaction');
        await supabase
          .from('social_reactions')
          .delete()
          .eq('progress_id', progressId)
          .eq('user_id', user.id);
      } else {
        // Add reaction
        console.log('➕ Adding new reaction');
        const { data, error } = await supabase
          .from('social_reactions')
          .insert({
            progress_id: progressId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) {
          console.error('❌ Error inserting reaction:', error);
          return;
        }
        console.log('✅ Reaction inserted:', data);
      }

      // Update reactions count
      const { data: reactionCount } = await supabase
        .from('social_reactions')
        .select('id')
        .eq('progress_id', progressId);

      await supabase
        .from('social_progress')
        .update({ reactions_count: reactionCount?.length || 0 })
        .eq('id', progressId);

      // Create notification for reaction (only when adding, not removing)
      if (!existingReaction) {
        const progressItem = progressItems.find(item => item.id === progressId);
        if (progressItem && progressItem.user_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: progressItem.user_id,
              type: 'reaction',
              title: 'New Reaction',
              message: `${user.email} reacted to your progress: "${progressItem.title}"`,
              data: {
                progress_id: progressId,
                reaction_type: reactionType,
                reactor_id: user.id
              }
            });
        }
      }

      // Reload data to show updated reactions
      console.log('🔄 Reloading data to show updated reactions');
      await loadData();
      console.log('✅ Reaction process completed successfully');
    } catch (error) {
      console.error('❌ Error handling reaction:', error);
    }
  };

  const handleFollow = async (studentUserId: string) => {
    if (!user) return;

    try {
      const isFollowing = following.has(studentUserId);

      if (isFollowing) {
        // Unfollow
        await supabase
          .from('social_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', studentUserId);

        setFollowing(prev => {
          const newSet = new Set(prev);
          newSet.delete(studentUserId);
          return newSet;
        });
      } else {
        // Follow
        await supabase
          .from('social_follows')
          .insert({
            follower_id: user.id,
            following_id: studentUserId
          });

        setFollowing(prev => new Set(prev).add(studentUserId));

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: studentUserId,
            type: 'follow',
            title: 'New Follower',
            message: `${user.email} started following you!`,
            data: { follower_id: user.id }
          });
      }
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  // If viewing a student profile, show that instead
  if (selectedStudentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <StudentProfile
            studentId={selectedStudentId}
            onBack={() => setSelectedStudentId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('social.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            {t('social.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{t('social.progress_feed')}</span>
            </TabsTrigger>

            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t('social.students')}</span>
            </TabsTrigger>

            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>{t('social.messages')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Progress Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : progressItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No progress updates yet</h3>
                  <p className="text-gray-600 mb-4">
                    Follow other students to see their achievements, or complete some courses to share your progress!
                  </p>
                  <Button onClick={() => setActiveTab('students')}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Students to Follow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {progressItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={item.user_avatar} />
                          <AvatarFallback>
                            {item.user_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => setSelectedStudentId(item.user_id)}
                            >
                              {item.user_name || 'Academia Student'}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 rounded-lg bg-green-500">
                            {item.activity_type === 'course_completed' && <Trophy className="w-5 h-5 text-white" />}
                            {item.activity_type === 'quiz_passed' && <Target className="w-5 h-5 text-white" />}
                            {item.activity_type === 'chapter_completed' && <BookOpen className="w-5 h-5 text-white" />}
                          </div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        </div>

                        {item.description && (
                          <p className="text-gray-700 ml-11">{item.description}</p>
                        )}

                        {item.xp_earned > 0 && (
                          <Badge variant="secondary" className="ml-11 mt-2">
                            +{item.xp_earned} XP
                          </Badge>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(item.id, 'thumbs_up')}
                              className={`flex items-center space-x-1 ${
                                item.user_reactions?.some(r => r.user_id === user?.id && r.reaction_type === 'thumbs_up')
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-600'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">{item.reactions_count}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(item.id, 'heart')}
                              className={`${
                                item.user_reactions?.some(r => r.user_id === user?.id && r.reaction_type === 'heart')
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-gray-600'
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(item.id, 'fire')}
                              className={`${
                                item.user_reactions?.some(r => r.user_id === user?.id && r.reaction_type === 'fire')
                                  ? 'text-orange-600 bg-orange-50'
                                  : 'text-gray-600'
                              }`}
                            >
                              <Flame className="w-4 h-4" />
                            </Button>

                            <span className="text-xs text-gray-500 ml-2">
                              {item.reactions_count > 0 && `${item.reactions_count} reactions`}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setChatRecipient({
                                id: item.user_id,
                                name: item.user_name || `User ${item.user_id.slice(-4)}`,
                                avatar: item.user_avatar
                              });
                              setShowChatModal(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Recent Completions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>{t('social.recent_completions')}</span>
                  <Badge variant="secondary">{recentCompletions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentCompletions.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No recent completions this week</p>
                ) : (
                  <div className="space-y-3">
                    {recentCompletions.map((completion) => (
                      <div key={completion.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div
                          className="flex items-center space-x-3 flex-1"
                          onClick={() => setSelectedStudentId(completion.user_id)}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={completion.user_avatar} />
                            <AvatarFallback>
                              {completion.user_name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {completion.user_name || 'Academia Student'}
                            </p>
                            <p className="text-sm text-gray-600">{completion.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">+{completion.xp_earned} XP</Badge>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleFollow(completion.user_id);
                            }}
                            variant={following.has(completion.user_id) ? "outline" : "default"}
                            size="sm"
                          >
                            {following.has(completion.user_id) ? 'Following' : 'Follow'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <Card key={student.user_id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6" onClick={() => setSelectedStudentId(student.user_id)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={student.user_avatar} />
                            <AvatarFallback className="text-lg">
                              {student.user_name?.charAt(0).toUpperCase() || 'S'}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {student.user_name || `Student ${student.user_id.slice(-4)}`}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {student.user_email || 'Academia Student'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                Level {student.level}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {student.total_xp} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleFollow(student.user_id);
                            }}
                            variant={following.has(student.user_id) ? "outline" : "default"}
                            size="sm"
                          >
                            {following.has(student.user_id) ? t('social.following') : t('social.follow')}
                          </Button>

                          {student.user_id !== user?.id && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                setChatRecipient({
                                  id: student.user_id,
                                  name: student.user_name || `Student ${student.user_id.slice(-4)}`,
                                  avatar: student.user_avatar
                                });
                                setShowChatModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Message</span>
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {student.completed_courses?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Courses</p>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {student.current_streak || 0}
                          </p>
                          <p className="text-xs text-gray-600">Streak</p>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {Math.floor(student.total_xp / 100)}
                          </p>
                          <p className="text-xs text-gray-600">Achievements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <ConversationList
              onSelectConversation={(userId, userName, userAvatar) => {
                setChatRecipient({
                  id: userId,
                  name: userName,
                  avatar: userAvatar
                });
                setShowChatModal(true);
              }}
              selectedUserId={chatRecipient?.id}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Direct Message Modal */}
      {chatRecipient && (
        <DirectMessageModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setChatRecipient(null);
          }}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          recipientAvatar={chatRecipient.avatar}
        />
      )}
    </div>
  );
};

export default Social;
