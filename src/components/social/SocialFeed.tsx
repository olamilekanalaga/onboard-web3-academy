import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ThumbsUp, 
  Heart, 
  Flame, 
  Zap, 
  Rocket, 
  Brain,
  MessageCircle,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Trophy,
  Target,
  BookOpen,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import DirectMessageModal from './DirectMessageModal';

interface ProgressFeedItem {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string;
  course_id?: string;
  metadata: any;
  reactions_count: number;
  comments_count: number;
  created_at: string;
  user_profile: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  user_reactions?: Array<{
    reaction_type: string;
    user_id: string;
  }>;
}

const reactionEmojis = {
  thumbs_up: { icon: ThumbsUp, emoji: '👍', label: 'Like' },
  heart: { icon: Heart, emoji: '❤️', label: 'Love' },
  fire: { icon: Flame, emoji: '🔥', label: 'Fire' },
  clap: { icon: Zap, emoji: '👏', label: 'Clap' },
  rocket: { icon: Rocket, emoji: '🚀', label: 'Rocket' },
  brain: { icon: Brain, emoji: '🧠', label: 'Smart' }
};

const activityIcons = {
  course_completed: Trophy,
  quiz_passed: Target,
  chapter_completed: BookOpen,
  achievement_unlocked: Star,
  streak_milestone: Flame,
  level_up: Rocket
};

const SocialFeed: React.FC = () => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<ProgressFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{id: string, name: string, avatar?: string} | null>(null);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      console.log('🔄 Loading social feed...');

      // For now, let's load all user progress to show activity
      // Later we can add following functionality
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          profiles!inner(id, username, display_name, profile_picture)
        `)
        .eq('progress_percentage', 100)
        .order('updated_at', { ascending: false })
        .limit(20);

      console.log('Raw progress data:', data);

      if (error) {
        console.error('Error loading user progress:', error);
        setFeedItems([]);
      } else {
        console.log('Loaded progress items:', data?.length || 0);

        // Transform progress data to feed format
        const transformedData = (data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          activity_type: 'course_completed',
          title: `Completed ${item.course_id?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
          description: `Just finished the ${item.course_id} course with ${item.progress_percentage}% completion!`,
          course_id: item.course_id,
          metadata: { progress: item.progress_percentage },
          reactions_count: 0,
          comments_count: 0,
          created_at: item.updated_at,
          user_profile: {
            username: item.profiles?.username || item.profiles?.display_name || 'Unknown User',
            display_name: item.profiles?.display_name || item.profiles?.username || 'Unknown User',
            avatar_url: item.profiles?.profile_picture
          },
          user_reactions: []
        }));

        setFeedItems(transformedData);
        console.log('Transformed feed items:', transformedData);

        // Load reactions for each feed item
        if (transformedData.length > 0) {
          loadReactions(transformedData.map(item => item.id));
        }
      }
    } catch (error) {
      console.error('Error loading feed:', error);
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load reactions for feed items
  const loadReactions = async (feedIds: string[]) => {
    try {
      console.log('Loading reactions for feed items:', feedIds);

      // Create a simple reactions table structure if it doesn't exist
      // For now, we'll simulate reactions with local state
      // In production, you'd create a proper reactions table

      // For demo purposes, let's add some sample reactions
      const sampleReactions = feedIds.map(id => ({
        id: `reaction_${id}`,
        progress_id: id,
        user_id: user?.id,
        reaction_type: 'thumbs_up',
        created_at: new Date().toISOString()
      }));

      console.log('Sample reactions:', sampleReactions);

      // Update feed items with empty reactions for now
      setFeedItems(prev => prev.map(item => ({
        ...item,
        user_reactions: [],
        reactions_count: 0
      })));

    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (feedId: string, reactionType: string) => {
    if (!user) {
      console.log('No user logged in for reaction');
      return;
    }

    try {
      console.log('🎯 Handling reaction:', { feedId, reactionType, userId: user.id });

      // Update local state immediately for better UX
      let actionTaken = '';
      setFeedItems(prev => prev.map(item => {
        if (item.id === feedId) {
          const userReactions = item.user_reactions || [];
          const existingReaction = userReactions.find(r => r.user_id === user.id && r.reaction_type === reactionType);

          if (existingReaction) {
            // Remove reaction
            actionTaken = 'removed';
            const newReactions = userReactions.filter(r => !(r.user_id === user.id && r.reaction_type === reactionType));
            return {
              ...item,
              user_reactions: newReactions,
              reactions_count: Math.max(0, (item.reactions_count || 0) - 1)
            };
          } else {
            // Add reaction
            actionTaken = 'added';
            const newReaction = {
              reaction_type: reactionType,
              user_id: user.id,
              created_at: new Date().toISOString()
            };
            return {
              ...item,
              user_reactions: [...userReactions, newReaction],
              reactions_count: (item.reactions_count || 0) + 1
            };
          }
        }
        return item;
      }));

      // Show success feedback
      console.log(`✅ Reaction ${reactionType} ${actionTaken} successfully!`);

    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const toggleComments = (feedId: string) => {
    setShowComments(prev => ({
      ...prev,
      [feedId]: !prev[feedId]
    }));
  };

  const handleComment = async (feedId: string) => {
    if (!user || !newComment[feedId]?.trim()) return;

    try {
      await supabase
        .from('progress_comments')
        .insert({
          progress_feed_id: feedId,
          user_id: user.id,
          content: newComment[feedId].trim()
        });

      setNewComment(prev => ({ ...prev, [feedId]: '' }));
      loadFeed(); // Reload to update comment counts
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'course_completed': return 'bg-green-500';
      case 'quiz_passed': return 'bg-blue-500';
      case 'chapter_completed': return 'bg-purple-500';
      case 'achievement_unlocked': return 'bg-yellow-500';
      case 'streak_milestone': return 'bg-orange-500';
      case 'level_up': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Progress Feed</h2>
        <p className="text-gray-600">See what your fellow students are achieving!</p>
      </div>

      {feedItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600">
              Follow other students to see their progress, or complete some courses to share your achievements!
            </p>
          </CardContent>
        </Card>
      ) : (
        feedItems.map((item) => {
          const ActivityIcon = activityIcons[item.activity_type as keyof typeof activityIcons] || BookOpen;
          const userReactions = item.user_reactions || [];
          const userHasReacted = (reactionType: string) => 
            userReactions.some(r => r.user_id === user?.id && r.reaction_type === reactionType);

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.user_profile.avatar_url} />
                    <AvatarFallback>
                      {item.user_profile.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {item.user_profile.display_name}
                      </span>
                      <span className="text-gray-500">@{item.user_profile.username}</span>
                      <div className={`w-2 h-2 rounded-full ${getActivityColor(item.activity_type)}`}></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getActivityColor(item.activity_type)}`}>
                      <ActivityIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-700 ml-11">{item.description}</p>
                  )}

                  {item.course_id && (
                    <Badge variant="secondary" className="ml-11 mt-2">
                      {item.course_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                </div>

                {/* Reactions and Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      {Object.entries(reactionEmojis).map(([type, { icon: Icon, emoji, label }]) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReaction(item.id, type)}
                          className={`flex items-center space-x-1 ${
                            userHasReacted(type) ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                          }`}
                        >
                          <span className="text-sm">{emoji}</span>
                          <span className="text-xs">
                            {userReactions.filter(r => r.reaction_type === type).length || ''}
                          </span>
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(item.id)}
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{item.comments_count}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setChatRecipient({
                            id: item.user_id,
                            name: item.user_profile?.display_name || item.user_profile?.username || 'User',
                            avatar: item.user_profile?.avatar_url
                          });
                          setShowChatModal(true);
                        }}
                        className="flex items-center space-x-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Message</span>
                      </Button>
                    </div>
                  </div>

                  {/* Comment Section */}
                  {showComments[item.id] && (
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user?.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Textarea
                            placeholder="Write a comment..."
                            value={newComment[item.id] || ''}
                            onChange={(e) => setNewComment(prev => ({
                              ...prev,
                              [item.id]: e.target.value
                            }))}
                            className="min-h-[60px] resize-none"
                          />
                          <Button
                            onClick={() => handleComment(item.id)}
                            disabled={!newComment[item.id]?.trim()}
                            size="sm"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
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
    </div>
  );
};

export default SocialFeed;
