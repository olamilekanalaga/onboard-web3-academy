
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseProgressionSimple } from "@/hooks/useCourseProgressionSimple";
import { useCourse } from "@/hooks/useCourses";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Clock, Target, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MobileCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateLessonProgress, getCourseProgress } = useCourseProgressionSimple();
  const { data: course, isLoading, error } = useCourse(courseId || '');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Get completed status from progression system
  const courseProgress = getCourseProgress(courseId || '');
  const isCompleted = courseProgress?.completed || false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/mobile/explore")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson = lessons[selectedLessonIndex];

  const markLessonComplete = () => {
    if (currentLesson && courseId) {
      updateLessonProgress(courseId, currentLesson.id);
    }
  };

  const progressPercentage = courseProgress?.progressPercentage || 0;

  const getIconForCourse = (category: string) => {
    switch (category?.toLowerCase()) {
      case "foundation": return "🎓";
      case "defi": return "💰";
      case "trading": return "📈";
      case "development": return "💻";
      case "nft": return "🎨";
      default: return "📚";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-orange-100 text-orange-700";
      case "expert": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Format content for mobile
  const formatContent = (content: string) => {
    if (!content) return [];
    
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        if (paragraph.startsWith('##')) {
          return (
            <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3">
              {paragraph.replace(/^##\s*/, '')}
            </h3>
          );
        }

        if (paragraph.startsWith('###')) {
          return (
            <h4 key={index} className="text-base font-semibold text-slate-800 mt-4 mb-2">
              {paragraph.replace(/^###\s*/, '')}
            </h4>
          );
        }

        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

        if (paragraph.includes('•') || paragraph.includes('-')) {
          const lines = paragraph.split('\n').filter(line => line.trim());
          const isBulletList = lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-'));

          if (isBulletList) {
            return (
              <ul key={index} className="space-y-2 my-4 ml-4">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex} className="flex items-start space-x-2 text-slate-700 text-sm">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/^[•-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
                      }}
                    />
                  </li>
                ))}
              </ul>
            );
          }
        }

        return (
          <p
            key={index}
            className="text-slate-700 text-sm leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mobile/explore")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900 truncate">{course.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`text-xs ${getDifficultyColor(course.difficulty_level || 'beginner')}`}>
                {course.difficulty_level || 'Beginner'}
              </Badge>
              <span className="text-xs text-slate-600">
                {course.estimated_duration ? `${course.estimated_duration} min` : 'Self-paced'}
              </span>
            </div>
          </div>
          <div className="text-2xl">
            {getIconForCourse(course.category || '')}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Lesson Navigation */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Lessons</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-48 overflow-y-auto">
              {lessons.map((lesson, lessonIndex) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonIndex(lessonIndex)}
                  className={`w-full text-left p-3 border-l-4 transition-all ${
                    selectedLessonIndex === lessonIndex
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-slate-400" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm">{lesson.title}</div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration ? `${lesson.duration} min` : '10 min'}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {lessons.length === 0 && (
                <div className="p-4 text-center text-slate-500">
                  <p>No lessons available yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        {currentLesson && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentLesson.title}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{currentLesson.duration ? `${currentLesson.duration} min` : '10 min'}</span>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="prose max-w-none">
                    {currentLesson.content ? (
                      formatContent(currentLesson.content)
                    ) : (
                      <p className="text-slate-600">Lesson content will be available soon.</p>
                    )}
                  </div>

                  {/* Video if available */}
                  {currentLesson.video_url && (
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">📹 Video Lesson</h4>
                        <p className="text-blue-800 text-sm">
                          Watch the video to enhance your learning experience!
                        </p>
                      </div>
                      <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-slate-400" />
                        <span className="ml-2 text-slate-600">Video player will be integrated here</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-3">
                      <Star className="h-5 w-5 text-green-600 mt-0.5" />
                      <h4 className="font-semibold text-green-900 text-sm">Key Takeaways</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2 text-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Complete understanding of {currentLesson.title}</span>
                      </li>
                      <li className="flex items-start space-x-2 text-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Practical knowledge gained</span>
                      </li>
                      <li className="flex items-start space-x-2 text-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Ready to apply concepts</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t mt-6">
                {!isCompleted && (
                  <Button
                    onClick={markLessonComplete}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedLessonIndex < lessons.length - 1) {
                      setSelectedLessonIndex(selectedLessonIndex + 1);
                    }
                  }}
                  disabled={selectedLessonIndex >= lessons.length - 1}
                  className="w-full"
                >
                  Next Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {lessons.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Course Content Coming Soon</h3>
              <p className="text-slate-600">This course is being prepared. Check back soon for lessons!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MobileCourse;
