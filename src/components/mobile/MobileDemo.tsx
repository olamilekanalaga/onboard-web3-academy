
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Play,
  BookOpen,
  ArrowLeft,
  Activity,
  Globe,
  Shield,
  Lock,
  AlertTriangle
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import RealisticTradingDemo from "@/components/RealisticTradingDemo";
import { useCourseProgression } from "@/hooks/useCourseProgression";

const MobileDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('');
  const { isDemoUnlocked, isCourseCompleted } = useCourseProgression();

  const demosUnlocked = isDemoUnlocked();
  const degenCompleted = isCourseCompleted('degen');
  const advancedTradingCompleted = isCourseCompleted('advanced-trading');

  const demos = [
    {
      id: 'realistic',
      title: 'Professional Trading Platform',
      description: 'Experience a realistic trading environment with live order books and professional tools',
      icon: BarChart3,
      color: 'from-blue-600 to-indigo-600',
      features: [
        'Real-time order book simulation',
        'Professional trading interface',
        'Portfolio management & P&L tracking',
        'Market & limit order execution',
        'Live price feeds with spreads'
      ],
      difficulty: 'Professional',
      difficultyColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'crosschain',
      title: 'Cross-Chain Trading Simulator',
      description: 'Trade across multiple blockchains with real devnet tokens',
      icon: Zap,
      color: 'from-purple-500 to-blue-600',
      features: [
        'Cross-chain trading across 6 blockchains',
        'Real devnet tokens and faucets',
        'Live price feeds and volatility',
        'Portfolio management across chains',
        'Gas fee simulation'
      ],
      difficulty: 'Advanced',
      difficultyColor: 'bg-purple-100 text-purple-700'
    }
  ];

  const renderDemo = () => {
    switch (selectedDemo) {
      case 'realistic':
        return <RealisticTradingDemo />;
      case 'crosschain':
        return <CrossChainTradingDemo />;
      default:
        return null;
    }
  };

  if (selectedDemo && demosUnlocked) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-background border-b border-border z-40 p-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedDemo('')}
            className="flex items-center space-x-2 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Demos</span>
          </Button>
        </div>

        {/* Demo Content */}
        <div className="p-4">
          {renderDemo()}
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40 p-4">
        <h1 className="text-2xl font-bold text-foreground">Trading Simulators</h1>
        <p className="text-sm text-muted-foreground">
          Practice trading with professional-grade simulators
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Lock Status Alert */}
        {!demosUnlocked && (
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <p className="font-semibold text-sm">Demos are Locked</p>
                <p className="text-xs">Complete these courses to unlock:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant={degenCompleted ? "default" : "secondary"} className={`text-xs ${degenCompleted ? "bg-emerald-100 text-emerald-700" : ""}`}>
                    {degenCompleted ? "✓" : "○"} Degen Trading
                  </Badge>
                  <Badge variant={advancedTradingCompleted ? "default" : "secondary"} className={`text-xs ${advancedTradingCompleted ? "bg-emerald-100 text-emerald-700" : ""}`}>
                    {advancedTradingCompleted ? "✓" : "○"} Advanced Trading
                  </Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Cards */}
        <div className="space-y-4">
          {demos.map((demo) => (
            <Card key={demo.id} className={`overflow-hidden ${!demosUnlocked ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center mb-3 ${!demosUnlocked ? 'opacity-50' : ''}`}>
                  {demosUnlocked ? (
                    <demo.icon className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{demo.title}</CardTitle>
                  <Badge className={demo.difficultyColor}>
                    {demo.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{demo.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 text-sm">
                    {demosUnlocked ? "What you'll experience:" : "Unlock by completing:"}
                  </h4>
                  {demosUnlocked ? (
                    <ul className="space-y-1">
                      {demo.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Degen Trading Mastery</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Advanced Trading Strategies</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => demosUnlocked && setSelectedDemo(demo.id)}
                  disabled={!demosUnlocked}
                  className={`w-full ${
                    demosUnlocked 
                      ? `bg-gradient-to-r ${demo.color} hover:opacity-90 text-white`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {demosUnlocked ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Launch Simulator
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Locked
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Learn Through Simulation
              </h3>
              <p className="text-muted-foreground text-sm">
                Practice with professional-grade simulators in a completely safe environment.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  <span>Safe Environment</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3 text-emerald-600" />
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3 text-emerald-600" />
                  <span>Professional Tools</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileDemo;
