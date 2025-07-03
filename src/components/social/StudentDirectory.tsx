import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  Trophy, 
  Target, 
  BookOpen,
  MapPin,
  Link as LinkIcon,
  Twitter,
  MessageSquare,
  TrendingUp,
  Users,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  followers_count: number;
  following_count: number;
  total_reactions_received: number;
  is_following?: boolean;
  user_stats?: {
    total_xp: number;
    level: number;
    current_streak: number;
    completed_courses: string[];
  };
}

const StudentDirectory: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadStudents();
      loadFollowing();
    }
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_stats(total_xp, level, current_streak, completed_courses)
        `)
        .eq('is_public', true)
        .neq('user_id', user?.id) // Exclude current user
        .order('total_reactions_received', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;
      
      const followingSet = new Set(data?.map(f => f.following_id) || []);
      setFollowingUsers(followingSet);
    } catch (error) {
      console.error('Error loading following:', error);
    }
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStudents(filtered);
  };

  const handleFollow = async (studentUserId: string) => {
    if (!user) return;

    try {
      const isFollowing = followingUsers.has(studentUserId);

      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', studentUserId);

        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(studentUserId);
          return newSet;
        });
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: studentUserId
          });

        setFollowingUsers(prev => new Set(prev).add(studentUserId));
      }

      // Update follower counts
      loadStudents();
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const getProgressColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500';
    if (level >= 7) return 'bg-blue-500';
    if (level >= 4) return 'bg-green-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
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
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Directory</h2>
          <p className="text-gray-600">Connect with fellow learners and follow their progress</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{followingUsers.size}</p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {students.reduce((sum, s) => sum + (s.user_stats?.completed_courses?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Be the first to join the Academia community!'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const isFollowing = followingUsers.has(student.user_id);
            const stats = student.user_stats;
            
            return (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback className="text-lg">
                          {student.display_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {student.display_name}
                        </h3>
                        <p className="text-gray-600">@{student.username}</p>
                        
                        {stats && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`${getProgressColor(stats.level)} text-white`}
                            >
                              Level {stats.level}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {stats.total_xp} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFollow(student.user_id)}
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      className={isFollowing ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {student.bio}
                    </p>
                  )}

                  {/* Location & Links */}
                  <div className="space-y-2 mb-4">
                    {student.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{student.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      {student.website && (
                        <a 
                          href={student.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      )}
                      
                      {student.twitter_handle && (
                        <a 
                          href={`https://twitter.com/${student.twitter_handle}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {student.followers_count}
                      </p>
                      <p className="text-xs text-gray-600">Followers</p>
                    </div>
                    
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {stats?.completed_courses?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {stats?.current_streak || 0}
                      </p>
                      <p className="text-xs text-gray-600">Streak</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {stats && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress to Level {stats.level + 1}</span>
                        <span>{stats.total_xp} XP</span>
                      </div>
                      <Progress 
                        value={(stats.total_xp % 1000) / 10} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
