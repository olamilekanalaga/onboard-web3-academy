
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
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import TradingDemo from "@/components/TradingDemo";

const Demo = () => {
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
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedDemo('')}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Demos</span>
            </Button>
          </div>

          {/* Demo Content */}
          {renderDemo()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Trading Demos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice your trading skills in a risk-free environment with our interactive simulators
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {demos.map((demo) => (
            <Card key={demo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${demo.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <demo.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{demo.title}</CardTitle>
                  <Badge className={demo.difficultyColor}>
                    {demo.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{demo.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What you'll practice:</h4>
                  <ul className="space-y-2">
                    {demo.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
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
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Learn by Doing
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our trading demos provide a safe environment to practice your skills without risking real money.
                Perfect for beginners learning the basics or advanced traders testing new strategies.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>Educational Focus</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span>Risk-Free Practice</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>Real Market Simulation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
