
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  Clock,
  Activity,
  Target,
  DollarSign,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Volume2,
  Zap
} from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  spread: number;
  lastUpdate: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'cancelled';
  pnl?: number;
}

interface Position {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

const RealisticTradingDemo: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [balance] = useState(10000);
  const [isTrading, setIsTrading] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState('trade');

  // Market data state
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({
    'BTC/USDT': {
      symbol: 'BTC/USDT',
      price: 67245.50,
      change24h: 2.45,
      high24h: 68420.00,
      low24h: 65890.30,
      volume: 2847392.45,
      spread: 0.05,
      lastUpdate: Date.now()
    },
    'ETH/USDT': {
      symbol: 'ETH/USDT',
      price: 3842.75,
      change24h: -1.23,
      high24h: 3890.50,
      low24h: 3795.20,
      volume: 1245673.89,
      spread: 0.03,
      lastUpdate: Date.now()
    },
    'SOL/USDT': {
      symbol: 'SOL/USDT',
      price: 178.92,
      change24h: 5.67,
      high24h: 185.45,
      low24h: 172.30,
      volume: 845392.12,
      spread: 0.02,
      lastUpdate: Date.now()
    }
  });

  // Order book state
  const [orderBook, setOrderBook] = useState<{
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  }>({
    bids: [],
    asks: []
  });

  // Generate realistic order book
  const generateOrderBook = (basePrice: number, spread: number) => {
    const midPrice = basePrice;
    const spreadAmount = midPrice * (spread / 100);
    
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate bids (buy orders)
    for (let i = 0; i < 10; i++) {
      const price = midPrice - spreadAmount/2 - (i * 0.1);
      const amount = Math.random() * 5 + 0.1;
      bids.push({
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(4)),
        total: parseFloat((price * amount).toFixed(2))
      });
    }
    
    // Generate asks (sell orders)
    for (let i = 0; i < 10; i++) {
      const price = midPrice + spreadAmount/2 + (i * 0.1);
      const amount = Math.random() * 5 + 0.1;
      asks.push({
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(4)),
        total: parseFloat((price * amount).toFixed(2))
      });
    }
    
    return { bids, asks };
  };

  // Update market data and order book
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const current = updated[symbol];
          const volatility = 0.002; // 0.2% volatility
          const change = (Math.random() - 0.5) * volatility;
          
          updated[symbol] = {
            ...current,
            price: current.price * (1 + change),
            change24h: current.change24h + (Math.random() - 0.5) * 0.5,
            volume: current.volume + Math.random() * 1000,
            lastUpdate: Date.now()
          };
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Update order book when selected pair changes
  useEffect(() => {
    if (marketData[selectedPair]) {
      const newOrderBook = generateOrderBook(
        marketData[selectedPair].price,
        marketData[selectedPair].spread
      );
      setOrderBook(newOrderBook);
    }
  }, [selectedPair, marketData]);

  // Update positions PnL
  useEffect(() => {
    setPositions(prev => prev.map(position => {
      const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
      const pnl = (currentPrice - position.avgPrice) * position.amount;
      const pnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
      
      return {
        ...position,
        currentPrice,
        pnl,
        pnlPercent
      };
    }));
  }, [marketData]);

  const executeTrade = async () => {
    if (!amount || (orderType === 'limit' && !price)) return;
    
    setIsTrading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const currentMarket = marketData[selectedPair];
      const tradePrice = orderType === 'market' 
        ? (tradeType === 'buy' ? orderBook.asks[0]?.price : orderBook.bids[0]?.price) || currentMarket.price
        : parseFloat(price);
      
      const newTrade: Trade = {
        id: Date.now().toString(),
        symbol: selectedPair,
        type: tradeType,
        amount: parseFloat(amount),
        price: tradePrice,
        timestamp: Date.now(),
        status: 'completed'
      };
      
      setTrades(prev => [newTrade, ...prev]);
      
      // Update positions
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === selectedPair);
        if (existing) {
          const newAmount = tradeType === 'buy' 
            ? existing.amount + newTrade.amount
            : existing.amount - newTrade.amount;
          
          if (newAmount <= 0) {
            return prev.filter(p => p.symbol !== selectedPair);
          }
          
          const newAvgPrice = tradeType === 'buy'
            ? ((existing.avgPrice * existing.amount) + (tradePrice * newTrade.amount)) / newAmount
            : existing.avgPrice;
          
          return prev.map(p => p.symbol === selectedPair 
            ? { ...p, amount: newAmount, avgPrice: newAvgPrice }
            : p
          );
        } else if (tradeType === 'buy') {
          return [...prev, {
            symbol: selectedPair,
            amount: newTrade.amount,
            avgPrice: tradePrice,
            currentPrice: tradePrice,
            pnl: 0,
            pnlPercent: 0
          }];
        }
        return prev;
      });
      
      setAmount('');
      setPrice('');
      setIsTrading(false);
    }, 800);
  };

  const currentMarket = marketData[selectedPair];
  const totalPortfolioValue = positions.reduce((total, pos) => total + (pos.currentPrice * pos.amount), 0);
  const totalPnL = positions.reduce((total, pos) => total + pos.pnl, 0);

  return (
    <div className="space-y-4 p-4">
      {/* Header with Market Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Professional Trading</h2>
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center space-x-1">
            {isLive ? <Activity className="h-3 w-3" /> : <PauseCircle className="h-3 w-3" />}
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
          {isLive ? 'Pause' : 'Resume'}
        </Button>
      </div>

      {/* Market Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(marketData).map(pair => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentMarket && (
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${currentMarket.price.toLocaleString()}
                  </div>
                  <div className={`text-sm flex items-center ${
                    currentMarket.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentMarket.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {currentMarket.change24h.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>24h High: ${currentMarket.high24h.toLocaleString()}</div>
                  <div>24h Low: ${currentMarket.low24h.toLocaleString()}</div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Volume: {(currentMarket.volume / 1000).toFixed(0)}K</div>
                  <div>Spread: {currentMarket.spread.toFixed(3)}%</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trade" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Place Order</span>
                    <Badge variant="outline">Balance: ${balance.toLocaleString()}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Type Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={orderType === 'market' ? 'default' : 'outline'}
                      onClick={() => setOrderType('market')}
                      size="sm"
                    >
                      Market
                    </Button>
                    <Button
                      variant={orderType === 'limit' ? 'default' : 'outline'}
                      onClick={() => setOrderType('limit')}
                      size="sm"
                    >
                      Limit
                    </Button>
                  </div>

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

                  {/* Price Input (for limit orders) */}
                  {orderType === 'limit' && (
                    <div>
                      <label className="text-sm font-medium">Price (USDT)</label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  )}

                  {/* Amount Input */}
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.0001"
                    />
                  </div>

                  {/* Total */}
                  {amount && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-semibold">
                        ${((parseFloat(amount) || 0) * (
                          orderType === 'market' 
                            ? currentMarket?.price || 0
                            : parseFloat(price) || 0
                        )).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Execute Button */}
                  <Button
                    onClick={executeTrade}
                    disabled={!amount || isTrading || (orderType === 'limit' && !price)}
                    className={`w-full ${
                      tradeType === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isTrading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedPair.split('/')[0]}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Value</div>
                        <div className="font-bold text-lg">${totalPortfolioValue.toFixed(2)}</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Total P&L</div>
                        <div className={`font-bold text-lg ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {positions.length > 0 ? (
                      <div className="space-y-2">
                        {positions.map((position, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">{position.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  {position.amount.toFixed(4)} @ ${position.avgPrice.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-semibold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                                </div>
                                <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No positions yet. Start trading to build your portfolio.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trading History</CardTitle>
                </CardHeader>
                <CardContent>
                  {trades.length > 0 ? (
                    <div className="space-y-2">
                      {trades.slice(0, 10).map((trade) => (
                        <div key={trade.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                                  {trade.type.toUpperCase()}
                                </Badge>
                                <span className="font-semibold">{trade.symbol}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {trade.amount.toFixed(4)} @ ${trade.price.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${(trade.amount * trade.price).toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(trade.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No trades yet. Execute your first trade to see history.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Book */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Order Book - {selectedPair}</span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Asks (Sell Orders) */}
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">Asks (Sell)</h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
                      <div>Price</div>
                      <div>Amount</div>
                      <div>Total</div>
                    </div>
                    {orderBook.asks.slice(0, 8).reverse().map((ask, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-50 cursor-pointer">
                        <div className="text-red-600 font-mono">{ask.price.toFixed(2)}</div>
                        <div className="font-mono">{ask.amount.toFixed(4)}</div>
                        <div className="font-mono">{ask.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Bids (Buy)</h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
                      <div>Price</div>
                      <div>Amount</div>
                      <div>Total</div>
                    </div>
                    {orderBook.bids.slice(0, 8).map((bid, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-50 cursor-pointer">
                        <div className="text-green-600 font-mono">{bid.price.toFixed(2)}</div>
                        <div className="font-mono">{bid.amount.toFixed(4)}</div>
                        <div className="font-mono">{bid.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spread Info */}
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>Spread:</span>
                  <span className="font-mono">
                    ${((orderBook.asks[0]?.price || 0) - (orderBook.bids[0]?.price || 0)).toFixed(2)}
                    ({currentMarket?.spread.toFixed(3)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealisticTradingDemo;
