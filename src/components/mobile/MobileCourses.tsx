
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Star, Play, ChevronRight, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import MobileHeader from "./MobileHeader";
import BottomNavigation from "./BottomNavigation";

const MobileCourses = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Debug: Log courses data
  console.log('Courses data:', courses);
  console.log('Courses keys:', Object.keys(courses));
  console.log('Courses values:', Object.values(courses));

  const filteredCourses = Object.values(courses).filter(course => {
    if (filter === "all") return true;
    if (filter === "beginner") return course.level === "Beginner";
    if (filter === "intermediate") return course.level === "Intermediate";
    if (filter === "advanced") return course.level === "Advanced";
    return true;
  });

  console.log('Filtered courses:', filteredCourses);

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🏗️";
      case "defi": return "🏦";
      case "degen": return "⚡";
      case "advanced-trading": return "📈";
      case "development": return "⚡";
      default: return "📖";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileHeader title="All Courses" />
      
      {/* Filter Tabs */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: "all", label: "All Courses" },
            { key: "beginner", label: "Beginner" },
            { key: "intermediate", label: "Intermediate" },
            { key: "advanced", label: "Advanced" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap ${
                filter === tab.key 
                  ? "bg-emerald-600 text-white" 
                  : "text-slate-600"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="px-6 py-6 space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Courses Found</h3>
            <p className="text-slate-500">No courses match your current filter.</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/mobile/course/${course.id}`)}
          >
            <CardContent className="p-0">
              {/* Course Image */}
              <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-t-lg">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {getIconForCourse(course.id)}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {course.level}
                  </Badge>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{course.title}</h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs text-slate-600">{course.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{course.enrolled.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-600">{course.price}</span>
                </div>

                {/* Progress Bar */}
                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/mobile/course/${course.id}`);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {course.progress > 0 ? "Continue" : "Start Course"}
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileCourses;
