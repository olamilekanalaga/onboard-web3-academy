import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  BookOpen, 
  Clock, 
  Target, 
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Flame
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface CourseReminder {
  id: string;
  course_id: string;
  reminder_type: string;
  title: string;
  message: string;
  action_url: string;
  scheduled_for: string;
}

interface UnfinishedCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
  nextChapter?: string;
  quizPending?: boolean;
}

const CourseReminderPopup: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<CourseReminder[]>([]);
  const [unfinishedCourses, setUnfinishedCourses] = useState<UnfinishedCourse[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);

  useEffect(() => {
    if (user) {
      loadReminders();
      checkUnfinishedCourses();
    }
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('course_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .eq('is_dismissed', false)
        .lte('scheduled_for', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setReminders(data);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const checkUnfinishedCourses = async () => {
    if (!user) return;

    // Mock data for unfinished courses - replace with actual course progress logic
    const mockUnfinishedCourses: UnfinishedCourse[] = [
      {
        id: 'foundation',
        title: 'Foundation Course',
        description: 'Learn the basics of blockchain and cryptocurrency',
        progress: 65,
        lastAccessed: '2 days ago',
        nextChapter: 'Chapter 4: Smart Contracts',
        quizPending: false
      },
      {
        id: 'defi-fundamentals',
        title: 'DeFi Fundamentals',
        description: 'Understanding Decentralized Finance',
        progress: 30,
        lastAccessed: '1 week ago',
        nextChapter: 'Chapter 2: Liquidity Pools',
        quizPending: true
      }
    ];

    // Filter courses with progress > 0 and < 100
    const unfinished = mockUnfinishedCourses.filter(course => 
      course.progress > 0 && course.progress < 100
    );

    if (unfinished.length > 0) {
      setUnfinishedCourses(unfinished);
      
      // Create reminder if none exists
      if (reminders.length === 0) {
        setShowPopup(true);
      }
    }
  };

  const dismissReminder = async (reminderId?: string) => {
    if (reminderId) {
      try {
        await supabase
          .from('course_reminders')
          .update({ is_dismissed: true })
          .eq('id', reminderId);
      } catch (error) {
        console.error('Error dismissing reminder:', error);
      }
    }
    
    if (currentReminderIndex < reminders.length - 1) {
      setCurrentReminderIndex(prev => prev + 1);
    } else {
      setShowPopup(false);
    }
  };

  const markAsRead = async (reminderId: string) => {
    try {
      await supabase
        .from('course_reminders')
        .update({ is_read: true })
        .eq('id', reminderId);
    } catch (error) {
      console.error('Error marking reminder as read:', error);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'unfinished_course':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case 'quiz_pending':
        return <Target className="w-6 h-6 text-orange-600" />;
      case 'streak_break':
        return <Flame className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  if (!showPopup) return null;

  const currentReminder = reminders[currentReminderIndex];
  const hasReminders = reminders.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasReminders ? getReminderIcon(currentReminder.reminder_type) : <BookOpen className="w-6 h-6 text-blue-600" />}
              <CardTitle className="text-lg">
                {hasReminders ? 'Course Reminder' : 'Continue Learning'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPopup(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {hasReminders ? (
            // Show specific reminder
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {currentReminder.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentReminder.message}
              </p>
              
              <div className="flex space-x-2">
                <Link
                  to={currentReminder.action_url}
                  className="flex-1"
                >
                  <Button
                    className="w-full"
                    onClick={() => {
                      markAsRead(currentReminder.id);
                      setShowPopup(false);
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => dismissReminder(currentReminder.id)}
                >
                  Later
                </Button>
              </div>

              {reminders.length > 1 && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    {currentReminderIndex + 1} of {reminders.length} reminders
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Show unfinished courses
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                You have unfinished courses
              </h3>
              <p className="text-gray-600 mb-4">
                Continue where you left off and keep your learning momentum going!
              </p>

              <div className="space-y-3">
                {unfinishedCourses.slice(0, 2).map((course) => (
                  <div key={course.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <Badge variant="secondary">{course.progress}%</Badge>
                    </div>
                    
                    <Progress value={course.progress} className="mb-2" />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last accessed: {course.lastAccessed}</span>
                      {course.quizPending && (
                        <Badge variant="destructive" className="text-xs">
                          Quiz Pending
                        </Badge>
                      )}
                    </div>

                    {course.nextChapter && (
                      <p className="text-xs text-blue-600 mt-1">
                        Next: {course.nextChapter}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-4">
                <Link to="/courses" className="flex-1">
                  <Button
                    className="w-full"
                    onClick={() => setShowPopup(false)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Courses
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowPopup(false)}
                >
                  Later
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseReminderPopup;
