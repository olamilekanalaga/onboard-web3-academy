
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, BookOpen, Clock } from "lucide-react";
import Header from "@/components/Header";

const Course = () => {
  const { courseId } = useParams();
  const [completedModules, setCompletedModules] = useState([1, 2]);

  const courseData = {
    foundations: {
      title: "Web3 Foundations",
      description: "Start your journey into Web3, wallets, tokens, and blockchain basics",
      modules: [
        { id: 1, title: "What is Web3?", duration: "15 min", content: "Web3 represents the third generation of the internet, built on blockchain technology..." },
        { id: 2, title: "Setting up MetaMask", duration: "20 min", content: "MetaMask is your gateway to Web3. Learn how to install and secure your wallet..." },
        { id: 3, title: "Understanding Tokens", duration: "25 min", content: "Tokens are digital assets that represent value on blockchain networks..." },
        { id: 4, title: "DeFi Basics", duration: "30 min", content: "Decentralized Finance (DeFi) allows you to lend, borrow, and trade without banks..." },
        { id: 5, title: "Layer 1 vs Layer 2", duration: "20 min", content: "Understanding the difference between base blockchains and scaling solutions..." },
      ]
    },
    defi: {
      title: "DeFi Mastery",
      description: "Master decentralized finance: lending, borrowing, AMMs, and yield strategies",
      modules: [
        { id: 1, title: "Introduction to DeFi", duration: "20 min", content: "Decentralized Finance is revolutionizing traditional banking..." },
        { id: 2, title: "Lending Protocols", duration: "25 min", content: "Learn how to lend your crypto assets to earn yield..." },
        { id: 3, title: "Automated Market Makers", duration: "30 min", content: "AMMs enable decentralized trading without order books..." },
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData] || courseData.foundations;
  const [selectedModule, setSelectedModule] = useState(course.modules[0]);

  const isModuleCompleted = (moduleId: number) => completedModules.includes(moduleId);
  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 1) return true;
    return completedModules.includes(moduleId - 1);
  };

  const markModuleComplete = () => {
    if (!completedModules.includes(selectedModule.id)) {
      setCompletedModules([...completedModules, selectedModule.id]);
    }
  };

  const progressPercentage = (completedModules.length / course.modules.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Back Button and Course Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
            <p className="text-slate-600 mb-4">{course.description}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>{completedModules.length} completed</span>
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-slate-900 font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Module List - Mobile: Stack on top, Desktop: Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {course.modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      disabled={!isModuleUnlocked(module.id)}
                      className={`w-full text-left p-4 border-l-4 transition-all ${
                        selectedModule.id === module.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-transparent hover:bg-slate-50'
                      } ${
                        !isModuleUnlocked(module.id) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isModuleCompleted(module.id) ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          ) : isModuleUnlocked(module.id) ? (
                            <PlayCircle className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Lock className="h-5 w-5 text-slate-300" />
                          )}
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{module.title}</div>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedModule.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedModule.duration}</span>
                    </CardDescription>
                  </div>
                  {isModuleCompleted(selectedModule.id) && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Module Content */}
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed text-base">
                    {selectedModule.content}
                  </p>
                  
                  {/* Placeholder for rich content */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 my-6">
                    <h4 className="font-semibold text-slate-900 mb-2">Interactive Example</h4>
                    <p className="text-slate-600 text-sm">
                      This would contain interactive elements, code examples, or embedded videos specific to this module.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {!isModuleCompleted(selectedModule.id) && (
                    <Button 
                      onClick={markModuleComplete}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                  
                  {selectedModule.id < course.modules.length && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const nextModule = course.modules.find(m => m.id === selectedModule.id + 1);
                        if (nextModule && isModuleUnlocked(nextModule.id)) {
                          setSelectedModule(nextModule);
                        }
                      }}
                      disabled={!isModuleUnlocked(selectedModule.id + 1)}
                    >
                      Next Module
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
