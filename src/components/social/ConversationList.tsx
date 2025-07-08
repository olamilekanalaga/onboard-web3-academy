import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_full_name: string;
  other_user_avatar: string;
  last_message_content: string;
  last_message_at: string;
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, userAvatar?: string) => void;
  selectedUserId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedUserId
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Set up real-time subscription for conversation changes
      const conversationSubscription = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
            filter: `or(user1_id.eq.${user.id},user2_id.eq.${user.id})`
          },
          (payload) => {
            console.log('Conversation change detected:', payload);
            loadConversations();
          }
        )
        .subscribe();

      // Also listen for direct message changes to update conversation list
      const messageSubscription = supabase
        .channel('direct_messages_for_conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'direct_messages',
            filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
          },
          (payload) => {
            console.log('Message change detected, refreshing conversations:', payload);
            loadConversations();
          }
        )
        .subscribe();

      // Listen for custom conversation deletion events
      const handleConversationDeleted = () => {
        console.log('Conversation deleted event received, refreshing list');
        loadConversations();
      };

      window.addEventListener('conversationDeleted', handleConversationDeleted);

      return () => {
        conversationSubscription.unsubscribe();
        messageSubscription.unsubscribe();
        window.removeEventListener('conversationDeleted', handleConversationDeleted);
      };
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      console.log('Loading conversations for user:', user.id);

      // Get latest messages for each conversation directly from direct_messages (simplified)
      const { data: messages, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        setConversations([]);
      } else {
        console.log('Loaded messages for conversations:', messages?.length || 0);

        if (!messages || messages.length === 0) {
          setConversations([]);
          return;
        }

        // Group messages by conversation (other user)
        const conversationMap = new Map();
        const userIds = new Set();

        messages.forEach(message => {
          const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
          userIds.add(otherUserId);

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              id: `${user.id}-${otherUserId}`,
              other_user_id: otherUserId,
              other_user_name: 'Loading...', // Will be updated below
              other_user_full_name: 'Loading...',
              other_user_avatar: '',
              last_message_content: message.message,
              last_message_at: message.created_at
            });
          }
        });

        // Get profile data for all other users
        if (userIds.size > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', Array.from(userIds));

          if (profileError) {
            console.error('Error fetching profiles:', profileError);
          }

          if (profiles) {
            profiles.forEach(profile => {
              const conversation = conversationMap.get(profile.id);
              if (conversation) {
                const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
                conversation.other_user_name = fullName;
                conversation.other_user_full_name = fullName;
                conversation.other_user_avatar = profile.avatar_url || '';
              }
            });
          }
        }

        const transformedConversations = Array.from(conversationMap.values());
        console.log('Transformed conversations:', transformedConversations);
        setConversations(transformedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user_full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-sm">
                Start a conversation by messaging someone from the social feed or students list.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(
                    conversation.other_user_id,
                    conversation.other_user_name || conversation.other_user_full_name || 'User',
                    conversation.other_user_avatar
                  )}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedUserId === conversation.other_user_id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.other_user_avatar} />
                      <AvatarFallback>
                        {(conversation.other_user_name || conversation.other_user_full_name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {conversation.other_user_name || conversation.other_user_full_name || 'User'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message_content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
