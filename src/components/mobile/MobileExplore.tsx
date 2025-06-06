
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, TrendingUp, Clock, Star, Users, Target, Code, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BottomNavigation from "./BottomNavigation";
import { courses } from "@/data/courses";

const MobileExplore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get real course data - only show the modern courses we want to feature
  const featuredCourseIds = ["foundation", "defi", "degen", "advanced-trading", "development"];
  const courseList = Object.values(courses).filter(course => featuredCourseIds.includes(course.id));

  // Create categories from actual course data
  const categories = [
    { name: "All", key: "all", icon: "🎯", count: courseList.length },
    { name: "Foundation", key: "fundamentals", icon: "🎓", count: courseList.filter(c => c.category === "fundamentals").length },
    { name: "DeFi", key: "defi", icon: "💰", count: courseList.filter(c => c.category === "defi").length },
    { name: "Trading", key: "trading", icon: "📈", count: courseList.filter(c => c.category === "trading").length },
    { name: "Development", key: "development", icon: "💻", count: courseList.filter(c => c.category === "development").length },
    { name: "Security", key: "security", icon: "🔒", count: courseList.filter(c => c.category === "security").length }
  ];

  // Filter and sort courses based on search and category
  const filteredCourses = courseList
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by difficulty level (1 = easiest first)
      return a.difficulty - b.difficulty;
    });

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🎓";
      case "defi": return "💰";
      case "degen": return "🚀";
      case "advanced-trading": return "📈";
      case "development": return "💻";
      default: return "📚";
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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Explore Courses</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-slate-100 rounded-lg border-0"
          />
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
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {selectedCategory === "all" ? "All Courses" : `${categories.find(c => c.key === selectedCategory)?.name} Courses`}
          </h2>
          <span className="text-sm text-slate-600">{filteredCourses.length} courses</span>
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course, index) => (
            <Card key={course.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                    {getIconForCourse(course.id)}
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
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/mobile/course/${course.id}`)}
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
};

export default MobileExplore;
