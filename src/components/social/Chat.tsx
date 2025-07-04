import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Hash, 
  Users, 
  Settings, 
  Plus,
  Search,
  MoreVertical,
  Smile
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  room_type: string;
  course_id?: string;
  members_count: number;
  last_message_at?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_profile: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      joinRoom(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
      
      // Auto-select first room
      if (data && data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0]);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      console.log('Loading messages for room:', roomId);

      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          profiles!inner(username, display_name, profile_picture)
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
        return;
      }

      // Transform data to match expected format
      const transformedMessages = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        user_id: msg.sender_id,
        created_at: msg.created_at,
        user_profile: {
          username: msg.profiles?.username || 'Unknown',
          display_name: msg.profiles?.display_name || msg.profiles?.username || 'Unknown',
          avatar_url: msg.profiles?.profile_picture
        }
      }));

      setMessages(transformedMessages);
      console.log('Loaded messages:', transformedMessages.length);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return;

    try {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from('chat_room_members')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (!existingMember) {
        // Join the room
        await supabase
          .from('chat_room_members')
          .insert({
            room_id: roomId,
            user_id: user.id,
            role: 'member'
          });
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedRoom || !newMessage.trim()) return;

    try {
      console.log('Sending message:', {
        content: newMessage.trim(),
        sender: user.id,
        recipient: selectedRoom.id
      });

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedRoom.id, // In DM context, room ID is the other user's ID
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setNewMessage('');
      loadMessages(selectedRoom.id); // Reload messages

      // Create notification for recipient
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', user.id)
        .single();

      const senderName = profile?.display_name || profile?.username || 'Someone';

      await supabase
        .from('notifications')
        .insert({
          user_id: selectedRoom.id,
          type: 'message',
          title: 'New Message',
          message: `${senderName} sent you a message`,
          data: {
            sender_id: user.id,
            message_preview: newMessage.trim().substring(0, 50)
          }
        });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRoomIcon = (roomType: string) => {
    switch (roomType) {
      case 'general': return Hash;
      case 'course_specific': return Hash;
      case 'study_group': return Users;
      default: return Hash;
    }
  };

  const getRoomColor = (roomType: string) => {
    switch (roomType) {
      case 'general': return 'text-blue-600';
      case 'course_specific': return 'text-green-600';
      case 'study_group': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
        <div className="w-1/3 border-r animate-pulse">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 animate-pulse">
          <div className="h-full bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar - Room List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Chat Rooms</h3>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search rooms..."
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2">
            {rooms.map((room) => {
              const RoomIcon = getRoomIcon(room.room_type);
              const isSelected = selectedRoom?.id === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                    isSelected 
                      ? 'bg-blue-100 border border-blue-200' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RoomIcon className={`w-5 h-5 ${getRoomColor(room.room_type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {room.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {room.members_count} members
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getRoomColor(selectedRoom.room_type)} bg-opacity-10`}>
                    {React.createElement(getRoomIcon(selectedRoom.room_type), {
                      className: `w-5 h-5 ${getRoomColor(selectedRoom.room_type)}`
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                    <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {selectedRoom.members_count} members
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.user_id === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.user_profile.avatar_url} />
                            <AvatarFallback>
                              {message.user_profile.display_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`${isOwnMessage ? 'text-right' : ''}`}>
                          {!isOwnMessage && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {message.user_profile.display_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          )}
                          
                          <div className={`p-3 rounded-lg ${
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          
                          {isOwnMessage && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-3">
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder={`Message #${selectedRoom.name.toLowerCase()}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat room</h3>
              <p className="text-gray-600">Choose a room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
