import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Search,
  Heart,
  ThumbsUp,
  Flame,
  Trophy,
  Target,
  BookOpen,
  UserPlus,
  UserMinus,
  MessageCircle,
  Star
} from 'lucide-react';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import PWALayout from './PWALayout';
import PWAContentWrapper from './PWAContentWrapper';
import StudentProfile from '@/components/social/StudentProfile';
import { formatDistanceToNow } from 'date-fns';
import DirectMessageModal from '../social/DirectMessageModal';
import ConversationList from '../social/ConversationList';

interface ProgressItem {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string;
  xp_earned: number;
  created_at: string;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  user_reactions?: Array<{
    reaction_type: string;
    user_id: string;
  }>;
}

interface Student {
  user_id: string;
  user_name: string;
  user_avatar: string;
  total_xp: number;
  completed_courses: number;
  follower_count: number;
}

const MobileSocial = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('feed');
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<any[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{id: string, name: string, avatar?: string} | null>(null);

  const handleReaction = async (progressId: string, reactionType: string) => {
    if (!user) {
      console.log('❌ No user logged in for reaction');
      return;
    }

    console.log('🎯 MOBILE REACTION CLICKED:', { progressId, reactionType, userId: user.id });

    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('social_reactions')
        .select('id')
        .eq('progress_id', progressId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();

      if (existingReaction) {
        // Remove reaction
        console.log('🗑️ Removing existing reaction');
        await supabase
          .from('social_reactions')
          .delete()
          .eq('progress_id', progressId)
          .eq('user_id', user.id)
          .eq('reaction_type', reactionType);
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', user.id)
            .single();

          const senderName = profile?.display_name || profile?.username || 'Someone';

          await supabase
            .from('notifications')
            .insert({
              user_id: progressItem.user_id,
              type: 'reaction',
              title: 'New Reaction',
              message: `${senderName} reacted to your progress: "${progressItem.title}"`,
              data: {
                progress_id: progressId,
                reaction_type: reactionType,
                reactor_id: user.id
              }
            });
        }
      }

      // Reload data to show updated reactions
      console.log('🔄 Reloading mobile data to show updated reactions');
      await loadData();
      console.log('✅ Mobile reaction process completed successfully');
    } catch (error) {
      console.error('❌ Error handling mobile reaction:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  // Auto-refresh recent completions every 30 seconds when on students tab
  useEffect(() => {
    if (user && activeTab === 'students') {
      const interval = setInterval(() => {
        console.log('Auto-refreshing mobile recent completions...');
        loadRecentCompletions();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'feed') {
        await loadProgressFeed();
      } else if (activeTab === 'students') {
        await loadStudents();
        await loadRecentCompletions();
      }
      await loadFollowing();
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressFeed = async () => {
    try {
      console.log('Loading progress feed for mobile...');

      // Load progress from ALL users (not just followed users)
      const { data: followingData } = await supabase
        .from('social_follows')
        .select('following_id')
        .eq('follower_id', user?.id);

      const followingIds = followingData?.map(f => f.following_id) || [];

      // Load progress items from ALL users with user info
      const { data: progressData, error: progressError } = await supabase
        .from('social_progress')
        .select(`
          *,
          social_reactions(reaction_type, user_id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50); // Show more users

      if (progressError) {
        console.error('Progress feed query error:', progressError);
        // Try fallback query without social_reactions
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('social_progress')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fallbackError) {
          console.error('Fallback progress feed error:', fallbackError);
          setProgressItems([]);
        } else {
          console.log('Fallback progress feed loaded:', fallbackData?.length || 0, 'items');
          setProgressItems(fallbackData || []);
        }
      } else if (progressData) {
        // Get unique user IDs from progress data
        const userIds = [...new Set(progressData.map(item => item.user_id))];

        // Fetch user profiles for these users
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds);

        // Create a map of user profiles for quick lookup
        const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);

        const enrichedProgress = progressData.map(item => {
          const profile = profilesMap.get(item.user_id);
          return {
            ...item,
            user_name: profile?.full_name || item.user_name || 'Academia Student',
            user_avatar: profile?.avatar_url || item.user_avatar,
            user_reactions: item.social_reactions || []
          };
        });

        // Filter to show only unique users (latest activity per user)
        const uniqueProgress = enrichedProgress.reduce((acc, current) => {
          const existingIndex = acc.findIndex(item => item.user_id === current.user_id);
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            // Keep the more recent activity
            if (new Date(current.created_at) > new Date(acc[existingIndex].created_at)) {
              acc[existingIndex] = current;
            }
          }
          return acc;
        }, [] as typeof enrichedProgress);

        console.log('Mobile progress feed loaded:', uniqueProgress.length, 'unique users');
        setProgressItems(uniqueProgress);
      } else {
        console.log('No progress data returned');
        setProgressItems([]);
      }
    } catch (error) {
      console.error('Error loading progress feed:', error);
      setProgressItems([]);
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_view')
        .select('*')
        .neq('user_id', user?.id)
        .order('total_xp', { ascending: false })
        .limit(100); // Show more students

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const loadRecentCompletions = async () => {
    try {
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

      if (recentData && recentData.length > 0) {
        // Get unique user IDs from recent completions
        const recentUserIds = [...new Set(recentData.map(item => item.user_id))];

        // Fetch user profiles for these users
        const { data: recentProfilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', recentUserIds);

        // Create a map of user profiles for quick lookup
        const recentProfilesMap = new Map(recentProfilesData?.map(profile => [profile.id, profile]) || []);

        const enrichedRecentData = recentData.map(item => {
          const profile = recentProfilesMap.get(item.user_id);
          return {
            ...item,
            user_name: profile?.full_name || item.user_name || 'Academia Student',
            user_avatar: profile?.avatar_url || item.user_avatar
          };
        });

        setRecentCompletions(enrichedRecentData);
      } else {
        setRecentCompletions([]);
      }
    } catch (error) {
      console.error('Error loading recent completions:', error);
      setRecentCompletions([]);
    }
  };

  const loadFollowing = async () => {
    try {
      // Load who you're following - same as desktop
      const { data: followingData } = await supabase
        .from('social_follows')
        .select('following_id')
        .eq('follower_id', user?.id);

      const followingIds = followingData?.map(f => f.following_id) || [];
      setFollowing(new Set(followingIds));
    } catch (error) {
      console.error('Error loading following:', error);
      setFollowing(new Set());
    }
  };

  const handleFollow = async (studentUserId: string) => {
    if (!user) return;

    try {
      const isFollowing = following.has(studentUserId);

      if (isFollowing) {
        // Unfollow - same as desktop
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
        // Follow - same as desktop
        await supabase
          .from('social_follows')
          .insert({
            follower_id: user.id,
            following_id: studentUserId
          });

        setFollowing(prev => new Set(prev).add(studentUserId));

        // Create notification - use username instead of email
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single();

        const displayName = profile?.full_name || profile?.username || 'Someone';

        await supabase
          .from('notifications')
          .insert({
            user_id: studentUserId,
            type: 'follow',
            title: 'New Follower',
            message: `${displayName} just followed you!`,
            data: { follower_id: user.id }
          });

        // Check if this is a follow-back (if the student was already following the current user)
        const { data: existingFollow } = await supabase
          .from('social_follows')
          .select('id')
          .eq('follower_id', studentUserId)
          .eq('following_id', user.id)
          .maybeSingle();

        if (existingFollow) {
          // This is a follow-back, notify the current user
          const { data: studentProfile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', studentUserId)
            .single();

          const studentDisplayName = studentProfile?.full_name || studentProfile?.username || 'Someone';

          await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              type: 'follow',
              title: 'Follow Back',
              message: `${studentDisplayName} followed you back!`,
              data: { follower_id: studentUserId }
            });
        }
      }

      // Reload students to update follower counts
      await loadStudents();
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedStudentId(userId);
    setShowStudentProfile(true);
  };

  const handleCloseStudentProfile = () => {
    setShowStudentProfile(false);
    setSelectedStudentId(null);
  };

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
      <MobileHeader />

      <PWAContentWrapper padding="md">
        {/* Mobile Social Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Social</h1>
          <p className="text-slate-600 text-sm">Connect with fellow students and track progress</p>
        </div>

        {/* Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed" className="flex items-center space-x-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Feed</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-1 text-xs">
              <Users className="w-3 h-3" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-1 text-xs">
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Progress Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            {/* Recent Course Completions Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Course Completions</h3>
              <Button variant="ghost" size="sm" onClick={loadRecentCompletions}>
                <TrendingUp className="w-4 h-4" />
                <span className="ml-1 text-xs">Refresh</span>
              </Button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : progressItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No progress updates yet</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Follow other students to see their achievements, or complete some courses to share your progress!
                  </p>
                  <Button onClick={() => setActiveTab('students')} size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Students
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {progressItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <Avatar
                          className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                          onClick={() => handleUserClick(item.user_id)}
                        >
                          <AvatarImage src={item.user_avatar} />
                          <AvatarFallback className="text-sm">
                            {item.user_name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium text-slate-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => handleUserClick(item.user_id)}
                          >
                            {item.user_name || 'Student'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{item.xp_earned} XP
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-slate-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => handleReaction(item.id, 'heart')}
                          >
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="ml-1 text-xs">{item.user_reactions?.filter(r => r.reaction_type === 'heart').length || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => handleReaction(item.id, 'thumbs_up')}
                          >
                            <ThumbsUp className="w-4 h-4 text-blue-500" />
                            <span className="ml-1 text-xs">{item.user_reactions?.filter(r => r.reaction_type === 'thumbs_up').length || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => handleReaction(item.id, 'fire')}
                          >
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="ml-1 text-xs">{item.user_reactions?.filter(r => r.reaction_type === 'fire').length || 0}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MessageCircle className="w-4 h-4 text-slate-500" />
                          <span className="ml-1 text-xs">0</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {/* Recent Course Completions */}
            {recentCompletions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Course Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCompletions.slice(0, 3).map((completion, index) => (
                      <div key={completion.id} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={completion.user_avatar} />
                          <AvatarFallback className="text-xs">
                            {completion.user_name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {completion.user_name || 'Student'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            Completed {completion.title}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{completion.xp_earned} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {students
                  .filter(student =>
                    !searchQuery ||
                    student.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <Card key={student.user_id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleUserClick(student.user_id)}
                          >
                            <Avatar className="w-12 h-12 flex-shrink-0">
                              <AvatarImage src={student.user_avatar} />
                              <AvatarFallback className="text-sm">
                                {student.user_name?.charAt(0).toUpperCase() || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm truncate hover:text-blue-600 transition-colors">
                                {student.user_name || `Student ${student.user_id.slice(-4)}`}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-slate-500 truncate">
                                <span className="truncate">{student.total_xp || 0} XP</span>
                                <span>•</span>
                                <span className="truncate">{student.completed_courses?.length || 0} courses</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1 truncate">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{student.follower_count || 0} followers</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant={following.has(student.user_id) ? "outline" : "default"}
                              className={`text-xs px-3 py-1 whitespace-nowrap ${
                                following.has(student.user_id)
                                  ? "text-red-600 border-red-200 hover:bg-red-50"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollow(student.user_id);
                              }}
                            >
                              {following.has(student.user_id) ? (
                                <>
                                  <UserMinus className="w-3 h-3 mr-1" />
                                  Unfollow
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  Follow
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs px-3 py-1 whitespace-nowrap"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatRecipient({
                                  id: student.user_id,
                                  name: student.user_name,
                                  avatar: student.user_avatar
                                });
                                setShowChatModal(true);
                              }}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
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
      </PWAContentWrapper>

      <BottomNavigation />

      {/* Student Profile Modal */}
      {showStudentProfile && selectedStudentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Student Profile</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseStudentProfile}>
                ✕
              </Button>
            </div>
            <div className="p-4">
              <StudentProfile
                studentId={selectedStudentId}
                onClose={handleCloseStudentProfile}
              />
            </div>
          </div>
        </div>
      )}

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
    </PWALayout>
  );
};

export default MobileSocial;
