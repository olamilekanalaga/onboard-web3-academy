import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  Trophy, 
  Star,
  UserPlus,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import PWALayout from './PWALayout';
import PWAContentWrapper from './PWAContentWrapper';

const MobileSocial = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');

  // Mock data - replace with real data from your social system
  const mockStudents = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      country: '🇺🇸',
      level: 5,
      xp: 2500,
      coursesCompleted: 3,
      followers: 45,
      following: 32,
      isFollowing: false
    },
    {
      id: '2', 
      name: 'Ahmed Hassan',
      avatar: '👨‍🎓',
      country: '🇪🇬',
      level: 7,
      xp: 3200,
      coursesCompleted: 5,
      followers: 67,
      following: 28,
      isFollowing: true
    },
    {
      id: '3',
      name: 'Maria Santos',
      avatar: '👩‍🚀',
      country: '🇧🇷',
      level: 4,
      xp: 1800,
      coursesCompleted: 2,
      followers: 23,
      following: 41,
      isFollowing: false
    }
  ];

  const mockActivities = [
    {
      id: '1',
      user: 'Sarah Chen',
      avatar: '👩‍💻',
      action: 'completed',
      target: 'DeFi Fundamentals',
      time: '2 hours ago',
      likes: 12,
      comments: 3
    },
    {
      id: '2',
      user: 'Ahmed Hassan', 
      avatar: '👨‍🎓',
      action: 'earned',
      target: '500 XRP',
      time: '4 hours ago',
      likes: 8,
      comments: 1
    },
    {
      id: '3',
      user: 'Maria Santos',
      avatar: '👩‍🚀',
      action: 'started following',
      target: 'you',
      time: '1 day ago',
      likes: 5,
      comments: 0
    }
  ];

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
      <MobileHeader title="Social" />
      
      <PWAContentWrapper padding="none">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Activity Feed */}
            <TabsContent value="feed" className="space-y-4 mt-4">
              <div className="space-y-3">
                {mockActivities.map((activity) => (
                  <Card key={activity.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                          {activity.avatar}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{activity.user}</span>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {activity.action} <span className="font-medium">{activity.target}</span>
                          </p>
                          
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Heart className="w-4 h-4 mr-1" />
                              {activity.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {activity.comments}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Students List */}
            <TabsContent value="students" className="space-y-4 mt-4">
              <div className="space-y-3">
                {mockStudents.map((student) => (
                  <Card key={student.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-lg">
                            {student.avatar}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-sm">{student.name}</h3>
                              <span className="text-lg">{student.country}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                Level {student.level}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {student.xp} XP
                              </span>
                              <span className="text-xs text-gray-500">
                                {student.coursesCompleted} courses
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {student.followers} followers
                              </span>
                              <span className="text-xs text-gray-500">
                                {student.following} following
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            variant={student.isFollowing ? "outline" : "default"}
                            className="text-xs"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            {student.isFollowing ? 'Following' : 'Follow'}
                          </Button>
                          
                          <Button size="sm" variant="outline" className="text-xs">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start conversations with fellow students to share knowledge and experiences.
                </p>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Find Students
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PWAContentWrapper>
      
      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileSocial;
