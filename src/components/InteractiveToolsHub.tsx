
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Zap, DollarSign, Lock, CheckCircle } from "lucide-react";
import { useCourseProgression } from "@/hooks/useCourseProgression";

const InteractiveToolsHub = () => {
  const { isDemoUnlocked } = useCourseProgression();
  const demoUnlocked = isDemoUnlocked();

  const tools = [
    {
      id: 'realistic-trading',
      title: 'Realistic Trading Demo',
      description: 'Practice trading with real market data and professional tools',
      icon: TrendingUp,
      color: 'bg-emerald-600',
      difficulty: 'Intermediate',
      estimatedTime: '30-45 min',
      unlocked: demoUnlocked,
      requiredCourses: ['Degen Trading', 'Advanced Trading']
    },
    {
      id: 'cross-chain',
      title: 'Cross-Chain Trading',
      description: 'Learn to trade across different blockchain networks',
      icon: BarChart3,
      color: 'bg-blue-600',
      difficulty: 'Advanced',
      estimatedTime: '20-30 min',
      unlocked: demoUnlocked,
      requiredCourses: ['Degen Trading', 'Advanced Trading']
    },
    {
      id: 'defi-strategies',
      title: 'DeFi Strategy Simulator',
      description: 'Experiment with yield farming and liquidity strategies',
      icon: Zap,
      color: 'bg-purple-600',
      difficulty: 'Beginner',
      estimatedTime: '15-20 min',
      unlocked: true,
      requiredCourses: ['DeFi Fundamentals']
    },
    {
      id: 'portfolio-optimizer',
      title: 'Portfolio Optimizer',
      description: 'Optimize your crypto portfolio allocation',
      icon: DollarSign,
      color: 'bg-orange-600',
      difficulty: 'Intermediate',
      estimatedTime: '25-35 min',
      unlocked: true,
      requiredCourses: ['Foundation']
    }
  ];

  const handleToolClick = (toolId: string, unlocked: boolean) => {
    if (!unlocked) return;
    
    switch (toolId) {
      case 'realistic-trading':
        window.location.href = '/demo?tool=realistic-trading';
        break;
      case 'cross-chain':
        window.location.href = '/demo?tool=cross-chain';
        break;
      case 'defi-strategies':
        window.location.href = '/demo?tool=defi-strategies';
        break;
      case 'portfolio-optimizer':
        window.location.href = '/demo?tool=portfolio-optimizer';
        break;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Interactive Trading Tools
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Practice your skills with real-world trading simulations and interactive tools. 
            Complete courses to unlock advanced demos.
          </p>
        </div>

        {/* Unlock Status Banner */}
        {!demoUnlocked && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Advanced Demos Locked</h3>
                <p className="text-amber-700">
                  Complete the "Degen Trading" and "Advanced Trading" courses to unlock professional trading demos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className={`group transition-all duration-300 border-0 shadow-lg ${
                  tool.unlocked 
                    ? 'hover:shadow-xl cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleToolClick(tool.id, tool.unlocked)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${tool.color} ${!tool.unlocked ? 'opacity-50' : ''}`}>
                      {tool.unlocked ? (
                        <IconComponent className="h-8 w-8 text-white" />
                      ) : (
                        <Lock className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {tool.unlocked && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={getDifficultyColor(tool.difficulty)}
                      >
                        {tool.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <CardTitle className={`text-xl transition-colors ${
                      tool.unlocked ? 'group-hover:text-emerald-600' : 'text-gray-500'
                    }`}>
                      {tool.title}
                      {!tool.unlocked && <Lock className="inline-block ml-2 h-4 w-4" />}
                    </CardTitle>
                    <CardDescription className={`mt-2 ${
                      tool.unlocked ? 'text-slate-600' : 'text-gray-400'
                    }`}>
                      {tool.unlocked ? tool.description : `Complete: ${tool.requiredCourses.join(', ')}`}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Estimated Time: {tool.estimatedTime}</span>
                    <span>Required: {tool.requiredCourses.join(', ')}</span>
                  </div>

                  <Button 
                    className={`w-full ${
                      tool.unlocked 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!tool.unlocked}
                  >
                    {tool.unlocked ? (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Launch Tool
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-slate-700">
              {tools.filter(t => t.unlocked).length} of {tools.length} tools unlocked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveToolsHub;
