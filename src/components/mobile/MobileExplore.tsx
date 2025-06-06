
import { Search, Filter, TrendingUp, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BottomNavigation from "./BottomNavigation";

const MobileExplore = () => {
  const categories = [
    { name: "Web3 Basics", icon: "🎓", count: 12 },
    { name: "DeFi", icon: "💰", count: 8 },
    { name: "Smart Contracts", icon: "📄", count: 15 },
    { name: "Trading", icon: "📈", count: 6 },
    { name: "Security", icon: "🔒", count: 9 },
    { name: "DAOs", icon: "🏛️", count: 5 }
  ];

  const popularCourses = [
    {
      title: "Bitcoin Fundamentals",
      instructor: "Alex Chen",
      rating: 4.8,
      students: "2.1k",
      duration: "4h",
      level: "Beginner",
      price: "Free"
    },
    {
      title: "Ethereum Development",
      instructor: "Sarah Kim",
      rating: 4.9,
      students: "1.5k",
      duration: "12h",
      level: "Advanced",
      price: "$49"
    },
    {
      title: "DeFi Yield Strategies",
      instructor: "Mark Wilson",
      rating: 4.7,
      students: "3.2k",
      duration: "6h",
      level: "Intermediate",
      price: "$29"
    }
  ];

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
            <Card key={index} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-slate-700 mb-1">{category.name}</p>
                <p className="text-xs text-slate-500">{category.count} courses</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Courses */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Popular Courses</h2>
          <Button variant="ghost" size="sm">See All</Button>
        </div>
        
        <div className="space-y-4">
          {popularCourses.map((course, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-600">by {course.instructor}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {course.level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">{course.price}</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Enroll
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileExplore;
