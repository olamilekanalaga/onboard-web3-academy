
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Play,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import TradingDemo from "@/components/TradingDemo";

const MobileDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  const demos = [
    {
      id: 'crosschain',
      title: 'Cross-Chain Trading Simulator',
      description: 'Trade across multiple blockchains with real devnet tokens - Ethereum, Polygon, BSC, Avalanche, Arbitrum & Solana',
      icon: Zap,
      color: 'from-purple-500 to-blue-600',
      features: [
        'Cross-chain trading across 6 blockchains',
        'Real devnet tokens and faucets',
        'Live price feeds and volatility',
        'Portfolio management across chains',
        'Gas fee simulation',
        'Testnet environment safety'
      ],
      difficulty: 'Advanced',
      difficultyColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'basic',
      title: 'Basic Trading Demo',
      description: 'Learn fundamental trading concepts with major cryptocurrencies',
      icon: BarChart3,
      color: 'from-blue-500 to-emerald-600',
      features: [
        'Major cryptocurrency pairs',
        'Basic order types',
        'Chart reading practice',
        'Risk management basics',
        'Portfolio fundamentals'
      ],
      difficulty: 'Beginner',
      difficultyColor: 'bg-green-100 text-green-700'
    }
  ];

  const renderDemo = () => {
    switch (selectedDemo) {
      case 'crosschain':
        return <CrossChainTradingDemo />;
      case 'basic':
        return <TradingDemo courseType="degen" />;
      default:
        return null;
    }
  };

  if (selectedDemo) {
    return (
      <div className="min-h-screen bg-background pb-20">
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
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40 p-4">
        <h1 className="text-2xl font-bold text-foreground">Trading Demos</h1>
        <p className="text-sm text-muted-foreground">
          Practice trading in a risk-free environment
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Demo Cards */}
        <div className="space-y-4">
          {demos.map((demo) => (
            <Card key={demo.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center mb-3`}>
                  <demo.icon className="h-6 w-6 text-white" />
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
                  <h4 className="font-semibold text-foreground mb-2 text-sm">What you'll practice:</h4>
                  <ul className="space-y-1">
                    {demo.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => setSelectedDemo(demo.id)}
                  className={`w-full bg-gradient-to-r ${demo.color} hover:opacity-90 text-white`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
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
                Learn by Doing
              </h3>
              <p className="text-muted-foreground text-sm">
                Our trading demos provide a safe environment to practice your skills without risking real money.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 text-emerald-600" />
                  <span>Educational</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3 text-emerald-600" />
                  <span>Risk-Free</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>Real Simulation</span>
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
