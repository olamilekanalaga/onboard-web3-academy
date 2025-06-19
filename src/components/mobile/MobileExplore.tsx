import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocialVerification } from "@/contexts/SocialVerificationContext";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { Search, Filter, TrendingUp, Clock, Star, Users, Target, Code, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BottomNavigation from "./BottomNavigation";
import SocialVerification from "../SocialVerification";
import MobileHeader from "./MobileHeader";

const MobileExplore = () => {
  const navigate = useNavigate();
  const { isVerified, setVerified } = useSocialVerification();
  // Try database first, fallback to localStorage
  const dbHook = useCourseProgressionDB();
  const localHook = useCourseProgression();

  // Use database hook if loading is complete and no error, otherwise use localStorage hook
  const useDB = !dbHook.isLoading && dbHook.userProgress;
  const { isCourseUnlocked, courseProgression } = useDB ? dbHook : localHook;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSocialVerification, setShowSocialVerification] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Convert course progression data to display format
  const courseList = Object.values(courseProgression).map(course => ({
    id: course.id,
    title: course.title || course.id,
    description: `Learn ${course.title} with ${course.xpReward} XP reward`,
    level: course.level || 'Beginner',
    category: course.category || 'fundamentals',
    duration: course.estimatedTime || '2-4 weeks',
    totalXP: course.xpReward,
    difficulty: course.difficulty || 1,
    skills: [`${course.title} Fundamentals`, 'Practical Skills', 'Real Applications']
  }));

  // Create categories from progression data
  const categories = [
    { name: "All", key: "all", icon: "📖", count: courseList.length },
    { name: "Foundation", key: "fundamentals", icon: "🏗️", count: courseList.filter(c => c.category === "fundamentals").length },
    { name: "DeFi", key: "defi", icon: "🏦", count: courseList.filter(c => c.category === "defi").length },
    { name: "Trading", key: "trading", icon: "💹", count: courseList.filter(c => c.category === "trading").length },
    { name: "Development", key: "development", icon: "⚡", count: courseList.filter(c => c.category === "development").length },
    { name: "Security", key: "security", icon: "🛡️", count: courseList.filter(c => c.category === "security").length }
  ];

  // Enhanced filter and sort courses based on search and category
  const filteredCourses = courseList
    .filter(course => {
      // Enhanced search - includes title, description, category, and level
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return selectedCategory === "all" || course.category === selectedCategory;

      const matchesSearch =
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower) ||
        course.level.toLowerCase().includes(searchLower);

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by difficulty level (1 = easiest first), then by title
      if (a.difficulty !== b.difficulty) {
        return a.difficulty - b.difficulty;
      }
      return a.title.localeCompare(b.title);
    });

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🏗️";
      case "defi": return "🏦";
      case "degen": return "⚡";
      case "advanced-trading": return "💹";
      case "development": return "🔧";
      default: return "📖";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "foundation": return "bg-emerald-100 text-emerald-700";
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-orange-100 text-orange-700";
      case "expert": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleCourseNavigation = (courseId: string, courseName: string) => {
    if (isVerified) {
      // User is already verified, navigate directly
      navigate(`/mobile/course/${courseId}`);
    } else {
      // Show social verification modal
      setSelectedCourse(courseName);
      setShowSocialVerification(true);
    }
  };

  const handleSocialVerificationComplete = () => {
    setVerified(true);
    setShowSocialVerification(false);
    // Navigate to the selected course
    const courseId = courseList.find(c => c.title === selectedCourse)?.id || "foundation";
    navigate(`/mobile/course/${courseId}`);
  };

  const handleSocialVerificationCancel = () => {
    setShowSocialVerification(false);
    setSelectedCourse("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileHeader title="Courses" />

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">All Courses</h1>

        {/* Enhanced Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search courses, topics, or difficulty levels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-slate-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Button */}
        <Button variant="outline" size="sm" className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category, index) => (
            <Card
              key={index}
              className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedCategory === category.key ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-slate-700 mb-1">{category.name}</p>
                <p className="text-xs text-slate-500">{category.count} courses</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="px-6 py-6 content-safe-bottom">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {selectedCategory === "all" ? "All Courses" : `${categories.find(c => c.key === selectedCategory)?.name} Courses`}
          </h2>
          <span className="text-sm text-slate-600">{filteredCourses.length} courses</span>
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course, index) => {
            const unlocked = isCourseUnlocked(course.id);
            return (
              <Card key={course.id} className={`border-0 shadow-sm ${!unlocked ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl relative ${unlocked
                      ? 'bg-gradient-to-br from-emerald-500 to-blue-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                      {unlocked ? getIconForCourse(course.id) : <Lock className="h-8 w-8 text-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getDifficultyColor(course.level)}`}
                        >
                          {course.level}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{course.description}</p>

                      <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </div>
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {course.totalXP || 1000} XP
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {course.skills?.slice(0, 2).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {course.skills && course.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className={unlocked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
                          onClick={() => unlocked && handleCourseNavigation(course.id, course.title)}
                          disabled={!unlocked}
                        >
                          {unlocked ? "Start Learning" : "Locked"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      <BottomNavigation />
      
      {/* Social Verification Modal */}
      {showSocialVerification && (
        <SocialVerification
          courseName={selectedCourse}
          onComplete={handleSocialVerificationComplete}
          onCancel={handleSocialVerificationCancel}
        />
      )}
    </div>
  );
};

export default MobileExplore;
