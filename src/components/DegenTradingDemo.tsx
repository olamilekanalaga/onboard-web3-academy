import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  AlertTriangle,
  BarChart3,
  Wallet,
  RefreshCw,
  Network,
  Coins,
  ArrowUpDown,
  Globe,
  Shield,
  Clock,
  Activity
} from "lucide-react";

interface Blockchain {
  id: string;
  name: string;
  symbol: string;
  color: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeToken: string;
  devnetFaucet: string;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  volatility: number;
  blockchain: string;
  contractAddress?: string;
  isDevnet: boolean;
}

interface Position {
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  blockchain: string;
  timestamp: number;
}

interface DevnetBalance {
  blockchain: string;
  balance: number;
  symbol: string;
}

const DegenTradingDemo: React.FC = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('ethereum');
  const [devnetBalances, setDevnetBalances] = useState<DevnetBalance[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTrading, setIsTrading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('trading');

  // Blockchain configurations
  const blockchains: Blockchain[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      color: 'bg-blue-600',
      rpcUrl: 'https://goerli.infura.io/v3/demo',
      explorerUrl: 'https://goerli.etherscan.io',
      nativeToken: 'ETH',
      devnetFaucet: 'https://goerlifaucet.com'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      color: 'bg-purple-600',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorerUrl: 'https://mumbai.polygonscan.com',
      nativeToken: 'MATIC',
      devnetFaucet: 'https://faucet.polygon.technology'
    },
    {
      id: 'bsc',
      name: 'BNB Smart Chain',
      symbol: 'BNB',
      color: 'bg-yellow-600',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      explorerUrl: 'https://testnet.bscscan.com',
      nativeToken: 'BNB',
      devnetFaucet: 'https://testnet.binance.org/faucet-smart'
    },
    {
      id: 'avalanche',
      name: 'Avalanche',
      symbol: 'AVAX',
      color: 'bg-red-600',
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
      explorerUrl: 'https://testnet.snowtrace.io',
      nativeToken: 'AVAX',
      devnetFaucet: 'https://faucet.avax-test.network'
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      symbol: 'ARB',
      color: 'bg-blue-500',
      rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
      explorerUrl: 'https://goerli.arbiscan.io',
      nativeToken: 'ETH',
      devnetFaucet: 'https://bridge.arbitrum.io'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400',
      rpcUrl: 'https://api.devnet.solana.com',
      explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
      nativeToken: 'SOL',
      devnetFaucet: 'https://solfaucet.com'
    }
  ];

  // Cross-chain crypto data with devnet tokens
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    // Ethereum Ecosystem
    {
      symbol: 'PEPE',
      name: 'Pepe (Ethereum)',
      price: 0.00000123,
      change24h: 45.67,
      volume: 2500000,
      marketCap: 520000000,
      volatility: 85,
      blockchain: 'ethereum',
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      isDevnet: true
    },
    {
      symbol: 'SHIB',
      name: 'Shiba Inu (Ethereum)',
      price: 0.0000087,
      change24h: -12.34,
      volume: 1800000,
      marketCap: 5100000000,
      volatility: 70,
      blockchain: 'ethereum',
      contractAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      isDevnet: true
    },
    // Polygon Ecosystem
    {
      symbol: 'MATIC-DOGE',
      name: 'Polygon Doge',
      price: 0.045,
      change24h: 15.23,
      volume: 890000,
      marketCap: 450000000,
      volatility: 75,
      blockchain: 'polygon',
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      isDevnet: true
    },
    // BSC Ecosystem
    {
      symbol: 'SAFEMOON',
      name: 'SafeMoon (BSC)',
      price: 0.00034,
      change24h: -8.45,
      volume: 1200000,
      marketCap: 890000000,
      volatility: 95,
      blockchain: 'bsc',
      contractAddress: '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
      isDevnet: true
    },
    // Avalanche Ecosystem
    {
      symbol: 'JOE',
      name: 'JoeToken (Avalanche)',
      price: 0.234,
      change24h: 12.67,
      volume: 560000,
      marketCap: 120000000,
      volatility: 80,
      blockchain: 'avalanche',
      contractAddress: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
      isDevnet: true
    },
    // Arbitrum Ecosystem
    {
      symbol: 'ARB-MEME',
      name: 'Arbitrum Meme',
      price: 0.0012,
      change24h: 34.56,
      volume: 340000,
      marketCap: 67000000,
      volatility: 88,
      blockchain: 'arbitrum',
      contractAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      isDevnet: true
    },
    // Solana Ecosystem
    {
      symbol: 'BONK',
      name: 'Bonk (Solana)',
      price: 0.0000089,
      change24h: -5.67,
      volume: 320000,
      marketCap: 580000000,
      volatility: 95,
      blockchain: 'solana',
      contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      isDevnet: true
    }
  ]);

  // Initialize devnet balances
  useEffect(() => {
    const initialBalances: DevnetBalance[] = blockchains.map(blockchain => ({
      blockchain: blockchain.id,
      balance: 1000, // Start with 1000 devnet tokens per chain
      symbol: blockchain.nativeToken
    }));
    setDevnetBalances(initialBalances);
  }, []);

  // Simulate price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prev => prev.map(crypto => {
        const volatilityFactor = crypto.volatility / 100;
        const randomChange = (Math.random() - 0.5) * 0.1 * volatilityFactor;
        const newPrice = crypto.price * (1 + randomChange);
        const newChange24h = crypto.change24h + (Math.random() - 0.5) * 5;

        return {
          ...crypto,
          price: Math.max(newPrice, crypto.price * 0.001), // Prevent negative prices
          change24h: Math.max(Math.min(newChange24h, 200), -90) // Cap changes
        };
      }));

      // Update positions PnL
      setPositions(prev => prev.map(position => {
        const currentCrypto = cryptoPrices.find(c => c.symbol === position.symbol && c.blockchain === position.blockchain);
        if (currentCrypto) {
          const currentPrice = currentCrypto.price;
          const pnl = (currentPrice - position.entryPrice) * position.amount;
          const pnlPercentage = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercentage
          };
        }
        return position;
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [cryptoPrices]);

  const executeTrade = () => {
    if (!selectedCrypto || !tradeAmount) return;

    const crypto = cryptoPrices.find(c => c.symbol === selectedCrypto);
    if (!crypto) return;

    const amount = parseFloat(tradeAmount);
    const totalCost = amount * crypto.price;

    setIsTrading(true);

    // Simulate network delay
    setTimeout(() => {
      if (tradeType === 'buy') {
        if (totalCost <= balance) {
          setBalance(prev => prev - totalCost);
          setPositions(prev => {
            const existingPosition = prev.find(p => p.symbol === selectedCrypto);
            if (existingPosition) {
              // Average down/up
              const totalAmount = existingPosition.amount + amount;
              const avgPrice = ((existingPosition.entryPrice * existingPosition.amount) + (crypto.price * amount)) / totalAmount;
              return prev.map(p =>
                p.symbol === selectedCrypto
                  ? { ...p, amount: totalAmount, entryPrice: avgPrice }
                  : p
              );
            } else {
              return [...prev, {
                symbol: selectedCrypto,
                amount,
                entryPrice: crypto.price,
                currentPrice: crypto.price,
                pnl: 0,
                pnlPercentage: 0
              }];
            }
          });
        }
      } else {
        // Sell logic
        const position = positions.find(p => p.symbol === selectedCrypto);
        if (position && amount <= position.amount) {
          const sellValue = amount * crypto.price;
          setBalance(prev => prev + sellValue);
          setPositions(prev =>
            prev.map(p =>
              p.symbol === selectedCrypto
                ? { ...p, amount: p.amount - amount }
                : p
            ).filter(p => p.amount > 0)
          );
        }
      }

      setTradeAmount('');
      setIsTrading(false);
    }, 1000);
  };

  const getTotalPortfolioValue = () => {
    const positionsValue = positions.reduce((total, position) => {
      return total + (position.amount * position.currentPrice);
    }, 0);
    return balance + positionsValue;
  };

  const getTotalPnL = () => {
    return positions.reduce((total, position) => total + position.pnl, 0);
  };

  const resetDemo = () => {
    setBalance(10000);
    setPositions([]);
    setTradeAmount('');
    setSelectedCrypto('');
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">🚀 Degen Trading Simulator</h2>
        <p className="text-muted-foreground">Practice high-risk, high-reward trading with meme coins</p>
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Demo Only - Not Real Money
        </Badge>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Cash Balance</span>
            </div>
            <div className="text-2xl font-bold text-foreground">${balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">Portfolio Value</span>
            </div>
            <div className="text-2xl font-bold text-foreground">${getTotalPortfolioValue().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${getTotalPnL().toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Meme Coin Market</span>
            <Badge variant="secondary" className="ml-auto">Live Prices</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cryptoPrices.map((crypto) => (
              <div
                key={crypto.symbol}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCrypto === crypto.symbol ? 'border-blue-500 bg-blue-50' : 'border-border hover:bg-muted'
                  }`}
                onClick={() => setSelectedCrypto(crypto.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold">{crypto.symbol}</div>
                    <div className="text-sm text-muted-foreground">{crypto.name}</div>
                    <Badge variant="outline" className="text-xs">
                      Vol: {crypto.volatility}%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${crypto.price.toFixed(8)}</div>
                    <div className={`text-sm flex items-center ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {crypto.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {crypto.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Execute Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={tradeType === 'buy' ? 'default' : 'outline'}
              onClick={() => setTradeType('buy')}
              className="w-full"
            >
              Buy
            </Button>
            <Button
              variant={tradeType === 'sell' ? 'default' : 'outline'}
              onClick={() => setTradeType('sell')}
              className="w-full"
            >
              Sell
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (tokens)</label>
            <Input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              placeholder="Enter amount to trade"
              disabled={!selectedCrypto}
            />
          </div>

          {selectedCrypto && tradeAmount && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <div>Selected: {selectedCrypto}</div>
                <div>Amount: {tradeAmount} tokens</div>
                <div>
                  Total: ${(parseFloat(tradeAmount) * (cryptoPrices.find(c => c.symbol === selectedCrypto)?.price || 0)).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={executeTrade}
            disabled={!selectedCrypto || !tradeAmount || isTrading}
            className="w-full"
          >
            {isTrading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCrypto || 'Token'}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Positions */}
      {positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positions.map((position, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{position.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {position.amount.toFixed(2)} tokens @ ${position.entryPrice.toFixed(8)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                      <div className={`text-sm ${position.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnlPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      <div className="text-center">
        <Button variant="outline" onClick={resetDemo}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Demo
        </Button>
      </div>
    </div>
  );
};

export default DegenTradingDemo;
