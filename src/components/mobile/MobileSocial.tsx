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
  MessageCircle,
  Star
} from 'lucide-react';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import PWALayout from './PWALayout';
import PWAContentWrapper from './PWAContentWrapper';
import { formatDistanceToNow } from 'date-fns';

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
  user_email: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'feed') {
        await loadProgressFeed();
      } else if (activeTab === 'students') {
        await loadStudents();
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressFeed = async () => {
    try {
      // Get feed items from users you follow + your own posts
      const { data: followingData } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user?.id);

      const followingIds = followingData?.map(f => f.following_id) || [];
      const userIds = [user?.id, ...followingIds];

      const { data, error } = await supabase
        .from('progress_feed')
        .select(`
          *,
          user_profile:user_profiles!inner(username, display_name, avatar_url),
          user_reactions:progress_reactions(reaction_type, user_id)
        `)
        .in('user_id', userIds)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setProgressItems(data || []);
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
        .limit(50);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
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
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={item.user_profile?.avatar_url} />
                          <AvatarFallback className="text-sm">
                            {item.user_profile?.display_name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm">
                            {item.user_profile?.display_name || 'Student'}
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
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="ml-1 text-xs">0</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <ThumbsUp className="w-4 h-4 text-blue-500" />
                            <span className="ml-1 text-xs">0</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="ml-1 text-xs">0</span>
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
                    student.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <Card key={student.user_id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={student.user_avatar} />
                              <AvatarFallback className="text-sm">
                                {student.user_name?.charAt(0).toUpperCase() || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm truncate">
                                {student.user_name || `Student ${student.user_id.slice(-4)}`}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <span>{student.total_xp || 0} XP</span>
                                <span>•</span>
                                <span>{student.completed_courses || 0} courses</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                <Users className="w-3 h-3" />
                                <span>{student.follower_count || 0} followers</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                              <UserPlus className="w-3 h-3 mr-1" />
                              Follow
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs px-2 py-1">
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
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Direct Messages</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Start conversations with other students you follow
                </p>
                <Button onClick={() => setActiveTab('students')} size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Find Students to Chat With
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PWAContentWrapper>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileSocial;
