import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Gamepad2, 
  Lock, 
  Zap,
  DollarSign,
  Percent,
  Clock,
  AlertTriangle
} from "lucide-react";
import { InteractiveTool, interactiveTools } from "@/data/interactiveTools";

interface InteractiveToolsHubProps {
  userXP: number;
  completedCourses: string[];
  onToolSelect: (toolId: string) => void;
}

interface ToolCalculatorProps {
  tool: InteractiveTool;
}

const YieldCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(1000);
  const [apy, setApy] = useState([10]);
  const [duration, setDuration] = useState('1year');
  const [compounding, setCompounding] = useState('daily');
  const [fees, setFees] = useState(0);
  
  const calculateYield = () => {
    const periods = {
      'daily': 365,
      'weekly': 52,
      'monthly': 12
    }[compounding] || 365;
    
    const years = {
      '1month': 1/12,
      '3months': 0.25,
      '6months': 0.5,
      '1year': 1,
      '2years': 2
    }[duration] || 1;
    
    const rate = (apy[0] - fees) / 100;
    const finalAmount = principal * Math.pow(1 + rate / periods, periods * years);
    const totalReturn = finalAmount - principal;
    const returnPercentage = (totalReturn / principal) * 100;
    const monthlyIncome = totalReturn / (years * 12);
    
    return {
      finalAmount: finalAmount.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercentage: returnPercentage.toFixed(2),
      monthlyIncome: monthlyIncome.toFixed(2)
    };
  };
  
  const results = calculateYield();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="principal">Initial Investment ($)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Annual Percentage Yield: {apy[0]}%</Label>
            <Slider
              value={apy}
              onValueChange={setApy}
              max={100}
              step={0.1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Investment Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="compounding">Compounding Frequency</Label>
            <Select value={compounding} onValueChange={setCompounding}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="fees">Platform Fees (%)</Label>
            <Input
              id="fees"
              type="number"
              value={fees}
              onChange={(e) => setFees(Number(e.target.value))}
              step="0.1"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">Final Amount</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                ${results.finalAmount}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Total Return</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                ${results.totalReturn}
              </div>
              <div className="text-sm text-blue-600">
                {results.returnPercentage}% return
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Monthly Income</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                ${results.monthlyIncome}
              </div>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-1">Important Notes:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Calculations assume constant APY (actual yields vary)</li>
                  <li>• Does not account for impermanent loss in LP positions</li>
                  <li>• Consider smart contract and platform risks</li>
                  <li>• Past performance doesn't guarantee future results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard: React.FC<{ tool: InteractiveTool; isLocked: boolean; onClick: () => void }> = ({ 
  tool, 
  isLocked, 
  onClick 
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'calculator': return Calculator;
      case 'simulator': return Gamepad2;
      case 'analyzer': return BarChart3;
      case 'tracker': return TrendingUp;
      default: return Calculator;
    }
  };
  
  const Icon = getCategoryIcon(tool.category);
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isLocked ? 'opacity-50' : 'hover:scale-105'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${
            isLocked ? 'bg-gray-200' : 'bg-blue-100'
          }`}>
            {isLocked ? (
              <Lock className="w-6 h-6 text-gray-500" />
            ) : (
              <Icon className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <Badge 
            variant={tool.difficulty === 'beginner' ? 'default' : 
                    tool.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
          >
            {tool.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg">{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {tool.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {tool.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.features.length - 3} more
              </Badge>
            )}
          </div>
          
          {isLocked && tool.unlockRequirement && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Unlock requirement:</span>
              </div>
              <div className="mt-1">
                {tool.unlockRequirement.course && `Complete ${tool.unlockRequirement.course} course`}
                {tool.unlockRequirement.xp && `Reach ${tool.unlockRequirement.xp} XP`}
                {tool.unlockRequirement.achievement && `Earn ${tool.unlockRequirement.achievement} achievement`}
              </div>
            </div>
          )}
          
          <Button 
            className="w-full" 
            disabled={isLocked}
            variant={isLocked ? "outline" : "default"}
          >
            {isLocked ? 'Locked' : 'Use Tool'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const InteractiveToolsHub: React.FC<InteractiveToolsHubProps> = ({
  userXP,
  completedCourses,
  onToolSelect
}) => {
  const [selectedTool, setSelectedTool] = useState<InteractiveTool | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  const isToolUnlocked = (tool: InteractiveTool): boolean => {
    if (!tool.unlockRequirement) return true;
    
    if (tool.unlockRequirement.course) {
      return completedCourses.includes(tool.unlockRequirement.course);
    }
    
    if (tool.unlockRequirement.xp) {
      return userXP >= tool.unlockRequirement.xp;
    }
    
    return true;
  };
  
  const filteredTools = interactiveTools.filter(tool => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return isToolUnlocked(tool);
    if (filter === 'locked') return !isToolUnlocked(tool);
    return tool.category === filter;
  });
  
  const categories = ['all', 'unlocked', 'locked', 'calculator', 'simulator', 'analyzer', 'tracker'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interactive Tools</h2>
          <p className="text-gray-600">Practice and analyze with hands-on tools</p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{userXP} XP</span>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {selectedTool ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTool(null)}
            >
              ← Back to Tools
            </Button>
            <h3 className="text-xl font-bold">{selectedTool.name}</h3>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{selectedTool.name}</CardTitle>
              <CardDescription>{selectedTool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTool.id === 'yield_calculator' && <YieldCalculator />}
              {selectedTool.id !== 'yield_calculator' && (
                <div className="text-center py-8 text-gray-500">
                  Tool implementation coming soon...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isLocked={!isToolUnlocked(tool)}
              onClick={() => {
                setSelectedTool(tool);
                onToolSelect(tool.id);
              }}
            />
          ))}
        </div>
      )}
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-600">Try adjusting your filter or complete more courses to unlock tools.</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveToolsHub;
