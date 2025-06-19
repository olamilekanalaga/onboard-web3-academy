import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Droplets, Zap, TrendingUp, DollarSign, Wallet, Info, AlertTriangle,
  ArrowUpDown, BarChart3, PieChart, Target, Trophy, Star, Coins,
  RefreshCw, ExternalLink, Shield, Activity, Globe, Lightbulb
} from "lucide-react";

interface LiquidityPool {
  id: string;
  name: string;
  token0: string;
  token1: string;
  token0Amount: number;
  token1Amount: number;
  totalLiquidity: number;
  apy: number;
  volume24h: number;
  fees24h: number;
  userLiquidity: number;
  userShare: number;
  impermanentLoss: number;
  protocol: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface YieldFarm {
  id: string;
  name: string;
  stakingToken: string;
  rewardToken: string;
  apy: number;
  tvl: number;
  userStaked: number;
  pendingRewards: number;
  lockPeriod: number;
  protocol: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface LendingPool {
  id: string;
  asset: string;
  supplyApy: number;
  borrowApy: number;
  utilization: number;
  totalSupply: number;
  totalBorrow: number;
  userSupplied: number;
  userBorrowed: number;
  collateralFactor: number;
  protocol: string;
}

const DeFiSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('liquidity');
  const [userBalance, setUserBalance] = useState({
    ETH: 10,
    USDC: 25000,
    WBTC: 0.5,
    UNI: 1000,
    AAVE: 500,
    COMP: 200
  });
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(50000);
  const [defiExperience, setDefiExperience] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const [liquidityPools] = useState<LiquidityPool[]>([
    {
      id: 'eth-usdc',
      name: 'ETH/USDC',
      token0: 'ETH',
      token1: 'USDC',
      token0Amount: 15420,
      token1Amount: 52800000,
      totalLiquidity: 105600000,
      apy: 12.5,
      volume24h: 45000000,
      fees24h: 135000,
      userLiquidity: 0,
      userShare: 0,
      impermanentLoss: 0,
      protocol: 'Uniswap V3',
      riskLevel: 'Low'
    },
    {
      id: 'wbtc-eth',
      name: 'WBTC/ETH',
      token0: 'WBTC',
      token1: 'ETH',
      token0Amount: 890,
      token1Amount: 15200,
      totalLiquidity: 68400000,
      apy: 18.7,
      volume24h: 28000000,
      fees24h: 84000,
      userLiquidity: 0,
      userShare: 0,
      impermanentLoss: 0,
      protocol: 'Uniswap V3',
      riskLevel: 'Medium'
    },
    {
      id: 'uni-eth',
      name: 'UNI/ETH',
      token0: 'UNI',
      token1: 'ETH',
      token0Amount: 2800000,
      token1Amount: 8900,
      totalLiquidity: 34200000,
      apy: 25.3,
      volume24h: 12000000,
      fees24h: 36000,
      userLiquidity: 0,
      userShare: 0,
      impermanentLoss: 0,
      protocol: 'Uniswap V3',
      riskLevel: 'High'
    }
  ]);

  const [yieldFarms] = useState<YieldFarm[]>([
    {
      id: 'aave-staking',
      name: 'AAVE Staking',
      stakingToken: 'AAVE',
      rewardToken: 'AAVE',
      apy: 8.2,
      tvl: 1200000000,
      userStaked: 0,
      pendingRewards: 0,
      lockPeriod: 0,
      protocol: 'Aave',
      riskLevel: 'Low'
    },
    {
      id: 'comp-farming',
      name: 'COMP Liquidity Mining',
      stakingToken: 'COMP',
      rewardToken: 'COMP',
      apy: 15.6,
      tvl: 450000000,
      userStaked: 0,
      pendingRewards: 0,
      lockPeriod: 30,
      protocol: 'Compound',
      riskLevel: 'Medium'
    }
  ]);

  const [lendingPools] = useState<LendingPool[]>([
    {
      id: 'eth-lending',
      asset: 'ETH',
      supplyApy: 2.1,
      borrowApy: 3.8,
      utilization: 75,
      totalSupply: 2800000,
      totalBorrow: 2100000,
      userSupplied: 0,
      userBorrowed: 0,
      collateralFactor: 0.8,
      protocol: 'Aave'
    },
    {
      id: 'usdc-lending',
      asset: 'USDC',
      supplyApy: 4.2,
      borrowApy: 5.9,
      utilization: 85,
      totalSupply: 1200000000,
      totalBorrow: 1020000000,
      userSupplied: 0,
      userBorrowed: 0,
      collateralFactor: 0.85,
      protocol: 'Compound'
    }
  ]);

  const addLiquidity = (poolId: string, amount0: number, amount1: number) => {
    const pool = liquidityPools.find(p => p.id === poolId);
    if (!pool) return;

    // Calculate liquidity tokens to mint
    const ratio0 = amount0 / pool.token0Amount;
    const ratio1 = amount1 / pool.token1Amount;
    const liquidityToMint = Math.min(ratio0, ratio1) * pool.totalLiquidity;

    // Update user balance
    setUserBalance(prev => ({
      ...prev,
      [pool.token0]: prev[pool.token0 as keyof typeof prev] - amount0,
      [pool.token1]: prev[pool.token1 as keyof typeof prev] - amount1
    }));

    // Update pool
    pool.userLiquidity += liquidityToMint;
    pool.userShare = (pool.userLiquidity / pool.totalLiquidity) * 100;

    // Add achievement
    if (!achievements.includes('first-liquidity')) {
      setAchievements(prev => [...prev, 'first-liquidity']);
      setDefiExperience(prev => prev + 100);
    }
  };

  const stakeFarm = (farmId: string, amount: number) => {
    const farm = yieldFarms.find(f => f.id === farmId);
    if (!farm) return;

    setUserBalance(prev => ({
      ...prev,
      [farm.stakingToken]: prev[farm.stakingToken as keyof typeof prev] - amount
    }));

    farm.userStaked += amount;

    if (!achievements.includes('first-stake')) {
      setAchievements(prev => [...prev, 'first-stake']);
      setDefiExperience(prev => prev + 150);
    }
  };

  const supplyToLending = (poolId: string, amount: number) => {
    const pool = lendingPools.find(p => p.id === poolId);
    if (!pool) return;

    setUserBalance(prev => ({
      ...prev,
      [pool.asset]: prev[pool.asset as keyof typeof prev] - amount
    }));

    pool.userSupplied += amount;

    if (!achievements.includes('first-lending')) {
      setAchievements(prev => [...prev, 'first-lending']);
      setDefiExperience(prev => prev + 75);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DeFi Simulator
              </h1>
              <p className="text-muted-foreground text-lg">
                Learn DeFi protocols through hands-on simulation
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-3xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">DeFi XP: {defiExperience}</div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Alert className="border-purple-200 bg-purple-50">
              <Trophy className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Achievements Unlocked:</span>
                  {achievements.map((achievement, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-700">
                      {achievement.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Balance Overview */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {Object.entries(userBalance).map(([token, amount]) => (
                <div key={token} className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="font-semibold">{token}</div>
                  <div className="text-lg font-bold">{amount.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main DeFi Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="liquidity" className="flex items-center space-x-2">
              <Droplets className="w-4 h-4" />
              <span>Liquidity Pools</span>
            </TabsTrigger>
            <TabsTrigger value="farming" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Yield Farming</span>
            </TabsTrigger>
            <TabsTrigger value="lending" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Lending</span>
            </TabsTrigger>
          </TabsList>

          {/* Liquidity Pools */}
          <TabsContent value="liquidity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {liquidityPools.map((pool) => (
                <Card key={pool.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pool.name}</CardTitle>
                      <Badge className={getRiskColor(pool.riskLevel)}>
                        {pool.riskLevel} Risk
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{pool.protocol}</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">APY</div>
                        <div className="font-bold text-green-600">{pool.apy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">TVL</div>
                        <div className="font-bold">${(pool.totalLiquidity / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">24h Volume</div>
                        <div className="font-bold">${(pool.volume24h / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">24h Fees</div>
                        <div className="font-bold">${(pool.fees24h / 1000).toFixed(0)}K</div>
                      </div>
                    </div>

                    {pool.userLiquidity > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800">
                          Your Position: ${pool.userLiquidity.toFixed(2)} ({pool.userShare.toFixed(2)}%)
                        </div>
                        {pool.impermanentLoss !== 0 && (
                          <div className="text-xs text-orange-600">
                            Impermanent Loss: {pool.impermanentLoss.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder={`${pool.token0} amount`} type="number" />
                        <Input placeholder={`${pool.token1} amount`} type="number" />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => addLiquidity(pool.id, 1, 3000)}
                      >
                        <Droplets className="w-4 h-4 mr-2" />
                        Add Liquidity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Yield Farming */}
          <TabsContent value="farming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {yieldFarms.map((farm) => (
                <Card key={farm.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{farm.name}</CardTitle>
                      <Badge className={getRiskColor(farm.riskLevel)}>
                        {farm.riskLevel} Risk
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{farm.protocol}</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">APY</div>
                        <div className="font-bold text-green-600">{farm.apy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">TVL</div>
                        <div className="font-bold">${(farm.tvl / 1000000).toFixed(0)}M</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Lock Period</div>
                        <div className="font-bold">{farm.lockPeriod} days</div>
                      </div>
                    </div>

                    {farm.userStaked > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          Staked: {farm.userStaked} {farm.stakingToken}
                        </div>
                        <div className="text-sm text-green-600">
                          Pending Rewards: {farm.pendingRewards.toFixed(4)} {farm.rewardToken}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Input placeholder={`${farm.stakingToken} amount`} type="number" />
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => stakeFarm(farm.id, 100)}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Stake Tokens
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lending */}
          <TabsContent value="lending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lendingPools.map((pool) => (
                <Card key={pool.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="w-5 h-5 mr-2" />
                      {pool.asset} Lending
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">{pool.protocol}</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Supply APY</div>
                        <div className="font-bold text-green-600">{pool.supplyApy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Borrow APY</div>
                        <div className="font-bold text-red-600">{pool.borrowApy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Utilization</div>
                        <div className="font-bold">{pool.utilization}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Collateral Factor</div>
                        <div className="font-bold">{(pool.collateralFactor * 100)}%</div>
                      </div>
                    </div>

                    <Progress value={pool.utilization} className="h-2" />

                    {(pool.userSupplied > 0 || pool.userBorrowed > 0) && (
                      <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                        {pool.userSupplied > 0 && (
                          <div className="text-sm text-blue-800">
                            Supplied: {pool.userSupplied} {pool.asset}
                          </div>
                        )}
                        {pool.userBorrowed > 0 && (
                          <div className="text-sm text-red-800">
                            Borrowed: {pool.userBorrowed} {pool.asset}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => supplyToLending(pool.id, 1000)}
                      >
                        Supply
                      </Button>
                      <Button variant="outline">
                        Borrow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeFiSimulator;
