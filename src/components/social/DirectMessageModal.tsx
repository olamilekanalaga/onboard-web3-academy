import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageCircle, MoreVertical, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  sender_profile?: {
    username: string;
    display_name: string;
    profile_picture: string;
  };
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientAvatar
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteConversationDialog, setShowDeleteConversationDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages when modal opens
  useEffect(() => {
    if (isOpen && user && recipientId) {
      loadMessages();
      
      // Set up real-time subscription for new messages
      const subscription = supabase
        .channel(`dm_${user.id}_${recipientId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'direct_messages',
            filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id}))`
          },
          (payload) => {
            console.log('New message received via real-time:', payload);
            // Reload messages when new one arrives
            loadMessages();
          }
        )
        .subscribe();

      console.log('Real-time subscription set up for:', `dm_${user.id}_${recipientId}`);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isOpen, user, recipientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user || !recipientId) return;

    setLoading(true);
    try {
      console.log('Loading messages between:', user.id, 'and', recipientId);

      // Get messages between current user and recipient
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(username, display_name, profile_picture)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        // If table doesn't exist, create some sample messages
        setMessages([]);
        return;
      }

      console.log('Loaded messages:', data?.length || 0);
      setMessages(data || []);

    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !recipientId || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      console.log('Sending message:', {
        sender: user.id,
        recipient: recipientId,
        content: newMessage.trim()
      });

      // Try to insert into direct_messages table
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: newMessage.trim(), // Required NOT NULL column
          content: newMessage.trim(), // Additional content column
          message_type: 'text'
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        setSending(false);
        return;
      }

      console.log('✅ Message sent successfully');
      setNewMessage('');

      // Reload messages to show the new message immediately
      await loadMessages();

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
          user_id: recipientId,
          type: 'message',
          title: 'New Message',
          message: `${senderName} sent you a message`,
          data: {
            sender_id: user.id,
            message_preview: newMessage.trim().substring(0, 50)
          }
        });

      // Reload messages to get the new one
      loadMessages();

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id); // Only allow deleting own messages

      if (error) {
        console.error('Error deleting message:', error);
        return;
      }

      console.log('✅ Message deleted successfully');
      // Reload messages to reflect the deletion
      await loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const deleteConversation = async () => {
    if (!user || !recipientId) return;

    try {
      // Delete all messages between current user and recipient
      const { error: messagesError } = await supabase
        .from('direct_messages')
        .delete()
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return;
      }

      // Delete the conversation entry from conversations table
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${recipientId}),and(user1_id.eq.${recipientId},user2_id.eq.${user.id})`);

      if (conversationError) {
        console.error('Error deleting conversation entry:', conversationError);
        // Don't return here - messages are already deleted
      }

      console.log('✅ Conversation and messages deleted successfully');
      setMessages([]);

      // Trigger a refresh of the conversation list by emitting a custom event
      window.dispatchEvent(new CustomEvent('conversationDeleted', {
        detail: { userId: recipientId }
      }));

      onClose(); // Close the modal after deleting conversation
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteDialog(true);
  };

  const handleLongPressStart = (messageId: string) => {
    const timer = setTimeout(() => {
      handleDeleteMessage(messageId);
    }, 800); // 800ms long press
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const confirmDeleteMessage = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      setMessageToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const confirmDeleteConversation = async () => {
    await deleteConversation();
    setShowDeleteConversationDialog(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4 overflow-hidden">
      <Card className="w-full max-w-2xl h-[95vh] md:h-[80vh] max-h-[700px] flex flex-col shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b p-4 md:p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 md:w-12 md:h-12">
                <AvatarImage src={recipientAvatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {recipientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">{recipientName}</CardTitle>
                <p className="text-sm text-gray-500">Direct Message</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 md:h-8 md:w-8 p-0 hover:bg-gray-100 touch-manipulation"
                  >
                    <MoreVertical className="h-5 w-5 md:h-4 md:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConversationDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 py-3 px-4 text-base md:text-sm md:py-2 md:px-3"
                  >
                    <Trash2 className="h-5 w-5 md:h-4 md:w-4 mr-3 md:mr-2" />
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 md:h-8 md:w-8 p-0 hover:bg-gray-100 touch-manipulation">
                <X className="h-6 w-6 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 bg-gray-50 min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                <p className="font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
                <p className="text-xs mt-2 text-gray-400 md:hidden">
                  Tip: Long press your messages to delete them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={recipientAvatar} />
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {recipientName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="relative group">
                          <div
                            className={`rounded-2xl px-4 py-2 shadow-sm ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                            onTouchStart={isOwnMessage ? () => handleLongPressStart(message.id) : undefined}
                            onTouchEnd={isOwnMessage ? handleLongPressEnd : undefined}
                            onTouchCancel={isOwnMessage ? handleLongPressEnd : undefined}
                            onMouseDown={isOwnMessage ? () => handleLongPressStart(message.id) : undefined}
                            onMouseUp={isOwnMessage ? handleLongPressEnd : undefined}
                            onMouseLeave={isOwnMessage ? handleLongPressEnd : undefined}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          {isOwnMessage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMessage(message.id)}
                              className={`absolute -top-2 ${isOwnMessage ? '-left-10 md:-left-8' : '-right-10 md:-right-8'} opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 group-active:opacity-100 transition-opacity h-8 w-8 md:h-6 md:w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full touch-manipulation`}
                            >
                              <Trash2 className="h-4 w-4 md:h-3 md:w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex space-x-3">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${recipientName}...`}
                disabled={sending}
                className="flex-1 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full px-4 py-2"
                autoFocus
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                size="sm"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Message Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Conversation Dialog */}
      <AlertDialog open={showDeleteConversationDialog} onOpenChange={setShowDeleteConversationDialog}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-lg">
              <AlertTriangle className="h-6 w-6 md:h-5 md:w-5 text-red-600" />
              <span>Delete Entire Conversation</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this entire conversation with {recipientName}?
              This will permanently delete all messages between you and this user. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteConversation}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm bg-red-600 hover:bg-red-700"
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DirectMessageModal;
