
import { useState } from "react";
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
      description: "Start your journey into Web3, wallets, tokens, and blockchain basics",
      modules: 8,
      duration: "2-3 weeks",
      level: "Beginner",
      progress: 25,
      color: "bg-blue-500",
      icon: BookOpen,
    },
    {
      id: "defi",
      title: "DeFi Mastery",
      description: "Master decentralized finance: lending, borrowing, AMMs, and yield strategies",
      modules: 12,
      duration: "3-4 weeks",
      level: "Intermediate",
      progress: 0,
      color: "bg-emerald-500",
      icon: Target,
    },
    {
      id: "development",
      title: "Smart Contracts & dApps",
      description: "Learn Solidity, deploy contracts, and build decentralized applications",
      modules: 15,
      duration: "4-6 weeks",
      level: "Advanced",
      progress: 0,
      color: "bg-purple-500",
      icon: Brain,
    },
    {
      id: "trading",
      title: "Crypto Trading",
      description: "DEXs vs CEXs, trading strategies, and safety best practices",
      modules: 10,
      duration: "2-3 weeks",
      level: "Intermediate",
      progress: 0,
      color: "bg-orange-500",
      icon: Award,
    },
  ];

  const currentCourse = learningTracks.find(track => track.id === selectedTrack) || learningTracks[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2">
                ✨ Start Your Web3 Journey
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Learn Web3 & Crypto the 
                <span className="text-emerald-400"> Right Way</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                A structured, beautiful learning platform that takes you from complete beginner to advanced Web3 builder. No fluff, just clear knowledge.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3">
                  <Users className="mr-2 h-5 w-5" />
                  View Courses
                </Button>
              </div>
            </div>
            <div className="lg:pl-12">
              <ProgressCard />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tracks Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Structured Learning Tracks
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Progressive paths designed to take you from beginner to expert, with hands-on practice and real-world applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {learningTracks.map((track) => (
              <CourseCard
                key={track.id}
                track={track}
                isSelected={selectedTrack === track.id}
                onClick={() => setSelectedTrack(track.id)}
              />
            ))}
          </div>

          {/* Featured Course Detail */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${currentCourse.color} rounded-xl`}>
                    <currentCourse.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">{currentCourse.title}</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      {currentCourse.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  {currentCourse.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.modules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">{currentCourse.progress}% complete</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="text-slate-900 font-medium">{currentCourse.progress}%</span>
                </div>
                <Progress value={currentCourse.progress} className="h-3" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                  Continue Learning
                </Button>
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  View Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">50+</div>
              <div className="text-slate-300">Structured Modules</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">200+</div>
              <div className="text-slate-300">Practice Tasks</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">15k+</div>
              <div className="text-slate-300">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-slate-300">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
