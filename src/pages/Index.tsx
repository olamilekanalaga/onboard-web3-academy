
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, PlayCircle, Users, Award, Target, Brain } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import ProgressCard from "@/components/ProgressCard";
import Header from "@/components/Header";

const Index = () => {
  const [selectedTrack, setSelectedTrack] = useState("foundations");

  const learningTracks = [
    {
      id: "foundations",
      title: "Web3 Foundations",
      description: "Complete beginner's guide to Web3, blockchain, and crypto fundamentals",
      modules: 8,
      duration: "4-6 weeks",
      level: "Beginner",
      progress: 25,
      color: "bg-blue-500",
      icon: BookOpen,
    },
    {
      id: "defi",
      title: "DeFi Mastery",
      description: "Master decentralized finance: lending, borrowing, trading, and yield strategies",
      modules: 12,
      duration: "6-8 weeks",
      level: "Intermediate",
      progress: 0,
      color: "bg-emerald-500",
      icon: Target,
    },
    {
      id: "degen-trading",
      title: "Degen Trading Mastery",
      description: "High-risk, high-reward trading strategies in volatile crypto markets",
      modules: 10,
      duration: "4-5 weeks",
      level: "Advanced",
      progress: 0,
      color: "bg-red-500",
      icon: Award,
    },
    {
      id: "development",
      title: "Smart Contracts & dApps",
      description: "Learn Solidity, deploy contracts, and build decentralized applications",
      modules: 15,
      duration: "8-10 weeks",
      level: "Advanced",
      progress: 0,
      color: "bg-purple-500",
      icon: Brain,
    },
  ];

  const currentCourse = learningTracks.find(track => track.id === selectedTrack) || learningTracks[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section - Improved mobile spacing */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-1 md:py-2 text-sm">
                ✨ Start Your Web3 Journey
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Learn Web3 & Crypto the 
                <span className="text-emerald-400"> Right Way</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                A structured, beautiful learning platform that takes you from complete beginner to advanced Web3 builder. No fluff, just clear knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <Link to="/course/foundations">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
                    <PlayCircle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Start Learning
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
                  <Users className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  View Courses
                </Button>
              </div>
            </div>
            <div className="lg:pl-12 mt-8 lg:mt-0">
              <ProgressCard />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tracks Section - Better mobile layout */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
              Structured Learning Tracks
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Progressive paths designed to take you from beginner to expert, with hands-on practice and real-world applications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {learningTracks.map((track) => (
              <CourseCard
                key={track.id}
                track={track}
                isSelected={selectedTrack === track.id}
                onClick={() => setSelectedTrack(track.id)}
              />
            ))}
          </div>

          {/* Featured Course Detail - Improved mobile spacing */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 md:p-3 ${currentCourse.color} rounded-xl`}>
                    <currentCourse.icon className="h-5 md:h-6 w-5 md:w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-slate-900">{currentCourse.title}</CardTitle>
                    <CardDescription className="text-slate-600 mt-1 text-sm md:text-base">
                      {currentCourse.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 self-start md:self-center">
                  {currentCourse.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 md:h-5 w-4 md:w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.modules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 md:h-5 w-4 md:w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.progress}% complete</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="text-slate-900 font-medium">{currentCourse.progress}%</span>
                </div>
                <Progress value={currentCourse.progress} className="h-2 md:h-3" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                <Link to={`/course/${currentCourse.id}`} className="flex-1">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                    Continue Learning
                  </Button>
                </Link>
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  View Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section - Improved mobile layout */}
      <section className="bg-slate-900 text-white py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="space-y-1 md:space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">50+</div>
              <div className="text-sm md:text-base text-slate-300">Structured Modules</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">200+</div>
              <div className="text-sm md:text-base text-slate-300">Practice Tasks</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">15k+</div>
              <div className="text-sm md:text-base text-slate-300">Active Learners</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-sm md:text-base text-slate-300">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
