import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  AlertTriangle,
  BarChart3,
  Zap,
  Trophy,
  Play,
  Pause
} from "lucide-react";

interface TradingDemoProps {
  courseType: 'degen' | 'advanced-trading';
}

interface Position {
  id: string;
  asset: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercentage: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  volatility: number;
}

const TradingDemo: React.FC<TradingDemoProps> = ({ courseType }) => {
  const [balance, setBalance] = useState(courseType === 'degen' ? 10000 : 100000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [tradeSize, setTradeSize] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [totalPnL, setTotalPnL] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  // Mock market data - in real app this would come from API
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({
    BTC: { symbol: 'BTC', price: 67500, change24h: 2.5, volume: 28000000000, volatility: 0.04 },
    ETH: { symbol: 'ETH', price: 3800, change24h: 1.8, volume: 15000000000, volatility: 0.05 },
    SOL: { symbol: 'SOL', price: 180, change24h: -0.5, volume: 2500000000, volatility: 0.08 },
    PEPE: { symbol: 'PEPE', price: 0.000012, change24h: 15.2, volume: 800000000, volatility: 0.25 },
    SHIB: { symbol: 'SHIB', price: 0.000025, change24h: 8.7, volume: 600000000, volatility: 0.20 },
    DOGE: { symbol: 'DOGE', price: 0.18, change24h: 5.3, volume: 1200000000, volatility: 0.12 }
  });

  const availableAssets = courseType === 'degen' 
    ? ['BTC', 'ETH', 'PEPE', 'SHIB', 'DOGE', 'SOL']
    : ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC'];

  const maxLeverage = courseType === 'degen' ? 100 : 10;

  // Simulate price movements
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const volatility = updated[symbol].volatility;
          const randomChange = (Math.random() - 0.5) * volatility * 2;
          updated[symbol].price *= (1 + randomChange);
          updated[symbol].change24h += randomChange * 100;
        });
        return updated;
      });

      // Update position PnL
      setPositions(prev => prev.map(position => {
        const currentPrice = marketData[position.asset]?.price || position.currentPrice;
        const priceDiff = currentPrice - position.entryPrice;
        const pnl = position.type === 'long' 
          ? (priceDiff / position.entryPrice) * position.size * position.leverage
          : -(priceDiff / position.entryPrice) * position.size * position.leverage;
        const pnlPercentage = (pnl / position.size) * 100;

        return {
          ...position,
          currentPrice,
          pnl,
          pnlPercentage
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, marketData]);

  // Calculate total PnL
  useEffect(() => {
    const total = positions.reduce((sum, position) => sum + position.pnl, 0);
    setTotalPnL(total);
  }, [positions]);

  const openPosition = (type: 'long' | 'short') => {
    const size = parseFloat(tradeSize);
    if (!size || size <= 0 || size > balance) {
      alert('Invalid trade size');
      return;
    }

    const asset = marketData[selectedAsset];
    if (!asset) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      asset: selectedAsset,
      type,
      size,
      entryPrice: asset.price,
      currentPrice: asset.price,
      leverage,
      pnl: 0,
      pnlPercentage: 0
    };

    setPositions(prev => [...prev, newPosition]);
    setBalance(prev => prev - size);
    setTradeSize('');

    // Add to trade history
    setTradeHistory(prev => [...prev, {
      timestamp: new Date(),
      action: 'OPEN',
      asset: selectedAsset,
      type,
      size,
      price: asset.price,
      leverage
    }]);
  };

  const closePosition = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    setBalance(prev => prev + position.size + position.pnl);
    setPositions(prev => prev.filter(p => p.id !== positionId));

    // Add to trade history
    setTradeHistory(prev => [...prev, {
      timestamp: new Date(),
      action: 'CLOSE',
      asset: position.asset,
      type: position.type,
      size: position.size,
      price: position.currentPrice,
      pnl: position.pnl,
      pnlPercentage: position.pnlPercentage
    }]);
  };

  const resetDemo = () => {
    setBalance(courseType === 'degen' ? 10000 : 100000);
    setPositions([]);
    setTotalPnL(0);
    setTradeHistory([]);
    setIsSimulationRunning(false);
  };

  const getAssetColor = (change: number) => {
    return change >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>{courseType === 'degen' ? 'Degen Trading Simulator' : 'Professional Trading Simulator'}</span>
          </CardTitle>
          <CardDescription>
            Practice {courseType === 'degen' ? 'high-risk memecoin and leverage' : 'professional technical analysis'} trading with virtual funds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${balance.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Available Balance</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getPnLColor(totalPnL)}`}>
                ${totalPnL.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total P&L</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{positions.length}</div>
              <div className="text-sm text-gray-600">Open Positions</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{tradeHistory.length}</div>
              <div className="text-sm text-gray-600">Total Trades</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Market Data</span>
              <Button
                onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                variant={isSimulationRunning ? "destructive" : "default"}
                size="sm"
              >
                {isSimulationRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isSimulationRunning ? 'Pause' : 'Start'} Simulation
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableAssets.map(symbol => {
                const data = marketData[symbol];
                if (!data) return null;
                
                return (
                  <div 
                    key={symbol}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAsset === symbol ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAsset(symbol)}
                  >
                    <div>
                      <div className="font-semibold">{symbol}</div>
                      <div className="text-sm text-gray-600">${data.price.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getAssetColor(data.change24h)}`}>
                        {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Vol: {(data.volatility * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Open Position</CardTitle>
            <CardDescription>Selected: {selectedAsset} - ${marketData[selectedAsset]?.price.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Position Size ($)</label>
              <Input
                type="number"
                value={tradeSize}
                onChange={(e) => setTradeSize(e.target.value)}
                placeholder="Enter amount"
                max={balance}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Leverage: {leverage}x</label>
              <input
                type="range"
                min="1"
                max={maxLeverage}
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1x</span>
                <span>{maxLeverage}x</span>
              </div>
            </div>

            {courseType === 'degen' && leverage > 10 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High leverage ({leverage}x) = High risk! You can lose your entire position quickly.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => openPosition('long')}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!tradeSize || parseFloat(tradeSize) <= 0}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Long
              </Button>
              <Button
                onClick={() => openPosition('short')}
                className="bg-red-600 hover:bg-red-700"
                disabled={!tradeSize || parseFloat(tradeSize) <= 0}
              >
                <TrendingDown className="w-4 h-4 mr-1" />
                Short
              </Button>
            </div>

            <Button
              onClick={resetDemo}
              variant="outline"
              className="w-full"
            >
              Reset Demo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      {positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positions.map(position => (
                <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={position.type === 'long' ? 'default' : 'destructive'}>
                      {position.type.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-semibold">{position.asset}</div>
                      <div className="text-sm text-gray-600">
                        ${position.size.toLocaleString()} • {position.leverage}x
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getPnLColor(position.pnl)}`}>
                      ${position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                    </div>
                    <div className="text-sm text-gray-600">
                      Entry: ${position.entryPrice.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    onClick={() => closePosition(position.id)}
                    size="sm"
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Performance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold">
                {((balance + totalPnL) / (courseType === 'degen' ? 10000 : 100000) * 100 - 100).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Total Return</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold">
                {tradeHistory.filter(t => t.action === 'CLOSE' && t.pnl > 0).length}
              </div>
              <div className="text-sm text-gray-600">Winning Trades</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold">
                {tradeHistory.filter(t => t.action === 'CLOSE').length > 0 
                  ? (tradeHistory.filter(t => t.action === 'CLOSE' && t.pnl > 0).length / 
                     tradeHistory.filter(t => t.action === 'CLOSE').length * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingDemo;
