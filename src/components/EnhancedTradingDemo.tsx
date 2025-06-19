import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, Info, AlertTriangle,
  BookOpen, Zap, Target, Trophy, Star, Play, Pause, RotateCcw,
  LineChart, BarChart3, PieChart, Activity, Globe, Shield,
  Lightbulb, CheckCircle, XCircle, ArrowRight, ArrowUp, ArrowDown
} from "lucide-react";

interface TradingScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  objectives: string[];
  initialBalance: number;
  targetProfit: number;
  marketCondition: 'Bull' | 'Bear' | 'Sideways' | 'Volatile';
  coins: string[];
  tips: string[];
  completed: boolean;
  score?: number;
}

interface MarketEvent {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'medium' | 'high';
  affectedCoins: string[];
  priceChange: number;
  timestamp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const EnhancedTradingDemo: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const scenarios: TradingScenario[] = [
    {
      id: 'bull-market',
      title: 'Bull Market Mastery',
      description: 'Navigate a strong upward market trend and maximize your gains',
      difficulty: 'Beginner',
      duration: '10 minutes',
      objectives: [
        'Achieve 20% portfolio growth',
        'Make at least 5 profitable trades',
        'Identify and ride the trend'
      ],
      initialBalance: 10000,
      targetProfit: 2000,
      marketCondition: 'Bull',
      coins: ['BTC', 'ETH', 'SOL'],
      tips: [
        'Buy the dips in an uptrend',
        'Take profits gradually',
        'Watch for trend reversal signals'
      ],
      completed: false
    },
    {
      id: 'bear-market',
      title: 'Bear Market Survival',
      description: 'Protect your capital and find opportunities in a declining market',
      difficulty: 'Intermediate',
      duration: '15 minutes',
      objectives: [
        'Minimize losses to under 5%',
        'Execute successful short trades',
        'Preserve capital for recovery'
      ],
      initialBalance: 10000,
      targetProfit: -500,
      marketCondition: 'Bear',
      coins: ['BTC', 'ETH', 'DOGE'],
      tips: [
        'Consider short selling',
        'Use stop losses religiously',
        'Cash is a position in bear markets'
      ],
      completed: false
    },
    {
      id: 'defi-yield',
      title: 'DeFi Yield Farming',
      description: 'Learn to provide liquidity and earn yield in DeFi protocols',
      difficulty: 'Advanced',
      duration: '20 minutes',
      objectives: [
        'Provide liquidity to 3 different pools',
        'Earn 15% APY on your capital',
        'Understand impermanent loss'
      ],
      initialBalance: 15000,
      targetProfit: 2250,
      marketCondition: 'Sideways',
      coins: ['ETH', 'USDC', 'UNI', 'AAVE'],
      tips: [
        'Diversify across multiple pools',
        'Monitor impermanent loss',
        'Compound your rewards'
      ],
      completed: false
    },
    {
      id: 'meme-volatility',
      title: 'Meme Coin Madness',
      description: 'Navigate extreme volatility in meme coin markets',
      difficulty: 'Advanced',
      duration: '12 minutes',
      objectives: [
        'Survive 50%+ price swings',
        'Time entries and exits perfectly',
        'Manage risk with position sizing'
      ],
      initialBalance: 5000,
      targetProfit: 2500,
      marketCondition: 'Volatile',
      coins: ['DOGE', 'SHIB', 'PEPE', 'BONK'],
      tips: [
        'Use small position sizes',
        'Set tight stop losses',
        'Take profits quickly'
      ],
      completed: false
    }
  ];

  const tutorialSteps = [
    {
      title: "Welcome to Advanced Trading",
      content: "This simulator teaches real trading strategies through interactive scenarios.",
      action: "Let's start with the basics"
    },
    {
      title: "Choose Your Challenge",
      content: "Each scenario teaches different market conditions and strategies.",
      action: "Pick a scenario that matches your skill level"
    },
    {
      title: "Learn by Doing",
      content: "Make real trading decisions and see immediate results with detailed explanations.",
      action: "Start your first scenario"
    }
  ];

  const generateMarketEvent = (): MarketEvent => {
    const events = [
      {
        title: "Federal Reserve Rate Decision",
        description: "Fed announces interest rate changes affecting crypto markets",
        impact: Math.random() > 0.5 ? 'negative' : 'positive' as 'positive' | 'negative',
        severity: 'high' as 'high',
        affectedCoins: ['BTC', 'ETH'],
        priceChange: (Math.random() - 0.5) * 0.15
      },
      {
        title: "Major Exchange Listing",
        description: "Popular altcoin gets listed on major exchange",
        impact: 'positive' as 'positive',
        severity: 'medium' as 'medium',
        affectedCoins: ['SOL', 'DOGE'],
        priceChange: Math.random() * 0.2 + 0.05
      },
      {
        title: "Whale Movement Alert",
        description: "Large wallet transfers detected, market reacts",
        impact: 'negative' as 'negative',
        severity: 'low' as 'low',
        affectedCoins: ['BTC'],
        priceChange: -Math.random() * 0.08
      }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...event
    };
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance of market event
          setMarketEvents(prev => [generateMarketEvent(), ...prev.slice(0, 4)]);
        }
      }, 5000 / gameSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, gameSpeed]);

  const startScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenarioId);
      setBalance(scenario.initialBalance);
      setPortfolio({});
      setMarketEvents([]);
      setIsPlaying(true);
      setShowTutorial(false);
    }
  };

  const resetScenario = () => {
    setIsPlaying(false);
    setCurrentScenario('');
    setBalance(10000);
    setPortfolio({});
    setMarketEvents([]);
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Professional Trading Academy
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Master real-world trading strategies through immersive scenarios
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorialSteps.map((step, index) => (
                  <Card key={index} className={`border-2 transition-all ${
                    currentStep === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > index ? <CheckCircle className="w-6 h-6" /> : <span>{index + 1}</span>}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
                      {currentStep === index && (
                        <Button 
                          onClick={() => setCurrentStep(Math.min(currentStep + 1, tutorialSteps.length - 1))}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {step.action}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {currentStep >= tutorialSteps.length - 1 && (
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => setShowTutorial(false)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Trading Scenarios
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Ready to put your skills to the test? Choose your first scenario!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Trading Scenarios</h1>
            <p className="text-muted-foreground text-lg">
              Choose your challenge and master different market conditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${
                  scenario.difficulty === 'Beginner' ? 'from-green-400 to-green-600' :
                  scenario.difficulty === 'Intermediate' ? 'from-yellow-400 to-orange-600' :
                  'from-red-400 to-red-600'
                }`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={
                      scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      scenario.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {scenario.difficulty}
                    </Badge>
                    <Badge variant="outline">{scenario.duration}</Badge>
                  </div>
                  <CardTitle className="text-xl">{scenario.title}</CardTitle>
                  <p className="text-muted-foreground">{scenario.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Objectives
                    </h4>
                    <ul className="space-y-1">
                      {scenario.objectives.map((objective, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mr-2" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Market: </span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.marketCondition}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => startScenario(scenario.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Scenario gameplay interface would continue here...
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Trading Scenario Active</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={resetScenario}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Scenario: {scenarios.find(s => s.id === currentScenario)?.title} - 
            Balance: ${balance.toLocaleString()}
          </AlertDescription>
        </Alert>
        
        {/* Rest of the trading interface would be implemented here */}
      </div>
    </div>
  );
};

export default EnhancedTradingDemo;
