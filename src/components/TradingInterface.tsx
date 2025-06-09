
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Info,
  AlertTriangle,
  BookOpen,
  Zap
} from "lucide-react";

interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  chain: string;
}

interface Position {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

const TradingInterface = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [balance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  const [coins, setCoins] = useState<Coin[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67245.50,
      change24h: 2.45,
      marketCap: '1.32T',
      volume: '28.4B',
      chain: 'Bitcoin'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3842.75,
      change24h: -1.23,
      marketCap: '462B',
      volume: '12.5B',
      chain: 'Ethereum'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 178.92,
      change24h: 5.67,
      marketCap: '81.2B',
      volume: '3.2B',
      chain: 'Solana'
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      price: 0.387,
      change24h: 8.45,
      marketCap: '56.8B',
      volume: '2.1B',
      chain: 'Dogecoin'
    },
    {
      symbol: 'PEPE',
      name: 'Pepe',
      price: 0.00001234,
      change24h: 15.67,
      marketCap: '5.2B',
      volume: '890M',
      chain: 'Ethereum'
    },
    {
      symbol: 'SHIB',
      name: 'Shiba Inu',
      price: 0.000024,
      change24h: -3.21,
      marketCap: '14.1B',
      volume: '456M',
      chain: 'Ethereum'
    }
  ]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() - 0.5) * 0.02),
        change24h: coin.change24h + (Math.random() - 0.5) * 2
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedCoinData = coins.find(c => c.symbol === selectedCoin);
  const totalPortfolioValue = positions.reduce((total, pos) => total + (pos.currentPrice * pos.amount), 0);

  const executeTrade = () => {
    if (!amount || !selectedCoinData) return;

    const tradeAmount = parseFloat(amount);
    const newPosition: Position = {
      symbol: selectedCoin,
      amount: tradeType === 'buy' ? tradeAmount : -tradeAmount,
      avgPrice: selectedCoinData.price,
      currentPrice: selectedCoinData.price,
      pnl: 0
    };

    setPositions(prev => {
      const existing = prev.find(p => p.symbol === selectedCoin);
      if (existing) {
        const newAmount = existing.amount + newPosition.amount;
        if (newAmount === 0) {
          return prev.filter(p => p.symbol !== selectedCoin);
        }
        return prev.map(p => p.symbol === selectedCoin 
          ? { ...p, amount: newAmount }
          : p
        );
      }
      return [...prev, newPosition];
    });

    setAmount('');
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trading Simulator</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Wallet className="h-4 w-4 mr-2" />
            ${balance.toLocaleString()}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setShowTutorial(!showTutorial)}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Tutorial</span>
          </Button>
        </div>
      </div>

      {/* Tutorial */}
      {showTutorial && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How Trading Works</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• <strong>Market Orders:</strong> Buy/sell immediately at current market price</p>
                  <p>• <strong>Price Movements:</strong> Green = price up, Red = price down</p>
                  <p>• <strong>Profit/Loss:</strong> You make money when prices go up after buying</p>
                  <p>• <strong>Research:</strong> Always research before trading - this is just practice!</p>
                  <p>• <strong>Risk Management:</strong> Never invest more than you can afford to lose</p>
                </div>
                <div className="mt-3 p-2 bg-orange-100 rounded border-l-4 border-orange-400">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-xs text-orange-800">This is a simulator - no real money involved!</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coin List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {coins.map((coin) => (
                  <div
                    key={coin.symbol}
                    onClick={() => setSelectedCoin(coin.symbol)}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors border-b last:border-b-0 ${
                      selectedCoin === coin.symbol ? 'bg-primary/10 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{coin.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{coin.symbol}</div>
                          <div className="text-sm text-muted-foreground">{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.chain}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          ${coin.price < 1 ? coin.price.toFixed(8) : coin.price.toFixed(2)}
                        </div>
                        <div className={`flex items-center text-sm ${
                          coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {coin.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {coin.change24h.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vol: {coin.volume}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div>
          <Tabs defaultValue="trade" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trade" className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {selectedCoinData && (
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="font-semibold">{selectedCoinData.symbol}</div>
                      <div className="text-2xl font-bold">
                        ${selectedCoinData.price < 1 ? selectedCoinData.price.toFixed(8) : selectedCoinData.price.toFixed(2)}
                      </div>
                      <div className={`text-sm ${selectedCoinData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCoinData.change24h >= 0 ? '+' : ''}{selectedCoinData.change24h.toFixed(2)}%
                      </div>
                    </div>
                  )}

                  {/* Buy/Sell Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      className={tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      Buy
                    </Button>
                    <Button
                      variant={tradeType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      className={tradeType === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Sell
                    </Button>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="text-sm font-medium">Amount (USD)</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-1">
                    {[25, 50, 100, 500].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(value.toString())}
                        className="text-xs"
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>

                  {/* Execute Button */}
                  <Button
                    onClick={executeTrade}
                    disabled={!amount}
                    className={`w-full ${
                      tradeType === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground">Portfolio Value</div>
                    <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                  </div>
                  
                  {positions.length > 0 ? (
                    <div className="space-y-2">
                      {positions.map((position, index) => {
                        const currentPrice = coins.find(c => c.symbol === position.symbol)?.price || position.avgPrice;
                        const pnl = (currentPrice - position.avgPrice) * Math.abs(position.amount);
                        const pnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
                        
                        return (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">{position.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  {Math.abs(position.amount).toFixed(4)} {position.amount > 0 ? 'LONG' : 'SHORT'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                </div>
                                <div className={`text-sm ${pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No positions yet. Start trading to build your portfolio.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
