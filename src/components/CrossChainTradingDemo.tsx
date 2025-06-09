
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Network,
  Coins,
  ArrowUpDown,
  Globe,
  Shield,
  Clock,
  Activity,
  Wallet,
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Layers
} from "lucide-react";
// Import blockchain icons from react-icons
import {
  SiEthereum,
  SiPolygon,
  SiBinance,
  SiSolana,
  SiOptimism
} from "react-icons/si";
import { FaBitcoin } from "react-icons/fa";

interface Blockchain {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon: React.ComponentType<any>;
  rpcUrl: string;
  explorerUrl: string;
  nativeToken: string;
  devnetFaucet: string;
  gasPrice: number;
}

interface CrossChainToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  volatility: number;
  blockchain: string;
  contractAddress: string;
  isDevnet: boolean;
  liquidity: number;
}

interface Position {
  id: string;
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  blockchain: string;
  timestamp: number;
  type: 'long' | 'short';
}

interface DevnetBalance {
  blockchain: string;
  balance: number;
  symbol: string;
  usdValue: number;
}

const CrossChainTradingDemo: React.FC = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('ethereum');
  const [devnetBalances, setDevnetBalances] = useState<DevnetBalance[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [isTrading, setIsTrading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('trading');

  // Enhanced blockchain configurations
  const blockchains: Blockchain[] = [
    {
      id: 'ethereum',
      name: 'Ethereum Goerli',
      symbol: 'ETH',
      color: 'bg-blue-600',
      icon: SiEthereum,
      rpcUrl: 'https://goerli.infura.io/v3/demo',
      explorerUrl: 'https://goerli.etherscan.io',
      nativeToken: 'ETH',
      devnetFaucet: 'https://goerlifaucet.com',
      gasPrice: 20
    },
    {
      id: 'polygon',
      name: 'Polygon Mumbai',
      symbol: 'MATIC',
      color: 'bg-purple-600',
      icon: SiPolygon,
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorerUrl: 'https://mumbai.polygonscan.com',
      nativeToken: 'MATIC',
      devnetFaucet: 'https://faucet.polygon.technology',
      gasPrice: 1
    },
    {
      id: 'bsc',
      name: 'BSC Testnet',
      symbol: 'BNB',
      color: 'bg-yellow-500',
      icon: SiBinance,
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      explorerUrl: 'https://testnet.bscscan.com',
      nativeToken: 'BNB',
      devnetFaucet: 'https://testnet.binance.org/faucet-smart',
      gasPrice: 5
    },
    {
      id: 'avalanche',
      name: 'Avalanche Fuji',
      symbol: 'AVAX',
      color: 'bg-red-500',
      icon: Layers, // Using Lucide Layers icon instead of SiOptimism for Avalanche
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
      explorerUrl: 'https://testnet.snowtrace.io',
      nativeToken: 'AVAX',
      devnetFaucet: 'https://faucet.avax-test.network',
      gasPrice: 25
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum Goerli',
      symbol: 'ARB',
      color: 'bg-blue-400',
      icon: Network, // Using Lucide Network icon instead of SiArbitrum
      rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
      explorerUrl: 'https://goerli.arbiscan.io',
      nativeToken: 'ETH',
      devnetFaucet: 'https://bridge.arbitrum.io',
      gasPrice: 0.1
    },
    {
      id: 'solana',
      name: 'Solana Devnet',
      symbol: 'SOL',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400',
      icon: SiSolana,
      rpcUrl: 'https://api.devnet.solana.com',
      explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
      nativeToken: 'SOL',
      devnetFaucet: 'https://solfaucet.com',
      gasPrice: 0.000005
    }
  ];

  // Cross-chain tokens with enhanced data
  const [crossChainTokens, setCrossChainTokens] = useState<CrossChainToken[]>([
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
      isDevnet: true,
      liquidity: 1200000
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
      isDevnet: true,
      liquidity: 3400000
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
      isDevnet: true,
      liquidity: 890000
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
      isDevnet: true,
      liquidity: 560000
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
      isDevnet: true,
      liquidity: 340000
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
      isDevnet: true,
      liquidity: 120000
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
      isDevnet: true,
      liquidity: 780000
    }
  ]);

  // Initialize devnet balances
  useEffect(() => {
    const initialBalances: DevnetBalance[] = blockchains.map(blockchain => ({
      blockchain: blockchain.id,
      balance: 1000,
      symbol: blockchain.nativeToken,
      usdValue: 1000 * (blockchain.id === 'ethereum' ? 1800 : blockchain.id === 'solana' ? 20 : 100)
    }));
    setDevnetBalances(initialBalances);
  }, []);

  // Simulate real-time price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setCrossChainTokens(prev => prev.map(token => {
        const volatilityFactor = token.volatility / 100;
        const randomChange = (Math.random() - 0.5) * 0.1 * volatilityFactor;
        const newPrice = token.price * (1 + randomChange);
        const newChange24h = token.change24h + (Math.random() - 0.5) * 5;

        return {
          ...token,
          price: Math.max(newPrice, token.price * 0.001),
          change24h: Math.max(Math.min(newChange24h, 200), -90)
        };
      }));

      // Update positions PnL
      setPositions(prev => prev.map(position => {
        const currentToken = crossChainTokens.find(t =>
          t.symbol === position.symbol && t.blockchain === position.blockchain
        );
        if (currentToken) {
          const currentPrice = currentToken.price;
          const multiplier = position.type === 'long' ? 1 : -1;
          const pnl = (currentPrice - position.entryPrice) * position.amount * multiplier;
          const pnlPercentage = ((currentPrice - position.entryPrice) / position.entryPrice) * 100 * multiplier;

          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercentage
          };
        }
        return position;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [crossChainTokens]);

  const getFilteredTokens = () => {
    return crossChainTokens.filter(token => token.blockchain === selectedBlockchain);
  };

  const getCurrentBlockchain = () => {
    return blockchains.find(b => b.id === selectedBlockchain);
  };

  const getBlockchainBalance = (blockchainId: string) => {
    return devnetBalances.find(b => b.blockchain === blockchainId);
  };

  const executeTrade = async () => {
    if (!selectedToken || !tradeAmount) return;

    const token = crossChainTokens.find(t => t.symbol === selectedToken && t.blockchain === selectedBlockchain);
    if (!token) return;

    setIsTrading(true);

    // Simulate network delay
    setTimeout(() => {
      const amount = parseFloat(tradeAmount);
      const totalCost = amount * token.price;
      const currentBalance = getBlockchainBalance(selectedBlockchain);

      if (currentBalance && totalCost <= currentBalance.usdValue) {
        // Create new position
        const newPosition: Position = {
          id: Date.now().toString(),
          symbol: selectedToken,
          amount,
          entryPrice: token.price,
          currentPrice: token.price,
          pnl: 0,
          pnlPercentage: 0,
          blockchain: selectedBlockchain,
          timestamp: Date.now(),
          type: tradeType
        };

        setPositions(prev => [...prev, newPosition]);

        // Update balance
        setDevnetBalances(prev => prev.map(balance =>
          balance.blockchain === selectedBlockchain
            ? { ...balance, usdValue: balance.usdValue - totalCost }
            : balance
        ));
      }

      setTradeAmount('');
      setIsTrading(false);
    }, 1500);
  };

  const requestDevnetTokens = async (blockchainId: string) => {
    const blockchain = blockchains.find(b => b.id === blockchainId);
    if (blockchain) {
      // Simulate faucet request
      setTimeout(() => {
        setDevnetBalances(prev => prev.map(balance =>
          balance.blockchain === blockchainId
            ? {
              ...balance,
              balance: balance.balance + 100,
              usdValue: balance.usdValue + (100 * (blockchainId === 'ethereum' ? 1800 : 100))
            }
            : balance
        ));
      }, 2000);

      // Open faucet in new tab
      window.open(blockchain.devnetFaucet, '_blank');
    }
  };

  const getTotalPortfolioValue = () => {
    const balancesValue = devnetBalances.reduce((total, balance) => total + balance.usdValue, 0);
    const positionsValue = positions.reduce((total, position) => total + position.pnl, 0);
    return balancesValue + positionsValue;
  };

  const getTotalPnL = () => {
    return positions.reduce((total, position) => total + position.pnl, 0);
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🌐 Cross-Chain Trading Simulator
        </h2>
        <p className="text-muted-foreground">
          Trade across multiple blockchains with real devnet tokens
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Testnet Only
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            6 Blockchains
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Real-time Prices
          </Badge>
        </div>
      </div>

      {/* Main Trading Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="faucets">Devnet Faucets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-6">
          {/* Blockchain Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Select Blockchain</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {blockchains.map((blockchain) => {
                  const IconComponent = blockchain.icon;
                  return (
                    <Button
                      key={blockchain.id}
                      variant={selectedBlockchain === blockchain.id ? "default" : "outline"}
                      className={`h-20 flex flex-col space-y-2 ${selectedBlockchain === blockchain.id ? blockchain.color + ' text-white' : ''
                        }`}
                      onClick={() => setSelectedBlockchain(blockchain.id)}
                    >
                      <IconComponent className="text-2xl w-6 h-6" />
                      <span className="text-xs">{blockchain.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Blockchain Info */}
          {getCurrentBlockchain() && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${getCurrentBlockchain()?.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {getCurrentBlockchain()?.icon && React.createElement(getCurrentBlockchain()!.icon, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h3 className="font-bold">{getCurrentBlockchain()?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Gas: {getCurrentBlockchain()?.gasPrice} {getCurrentBlockchain()?.nativeToken}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {getBlockchainBalance(selectedBlockchain)?.balance.toFixed(2)} {getCurrentBlockchain()?.nativeToken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${getBlockchainBalance(selectedBlockchain)?.usdValue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Available Tokens on {getCurrentBlockchain()?.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getFilteredTokens().map((token) => (
                  <div
                    key={token.symbol}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedToken === token.symbol ? 'border-blue-500 bg-blue-50' : 'border-border hover:bg-muted'
                      }`}
                    onClick={() => setSelectedToken(token.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                        <Badge variant="outline" className="text-xs">
                          Liquidity: ${(token.liquidity / 1000).toFixed(0)}K
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${token.price.toFixed(8)}</div>
                        <div className={`text-sm flex items-center ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {token.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {token.change24h.toFixed(2)}%
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
                  variant={tradeType === 'long' ? 'default' : 'outline'}
                  onClick={() => setTradeType('long')}
                  className="w-full"
                >
                  Long (Buy)
                </Button>
                <Button
                  variant={tradeType === 'short' ? 'default' : 'outline'}
                  onClick={() => setTradeType('short')}
                  className="w-full"
                >
                  Short (Sell)
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (tokens)</label>
                <Input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount to trade"
                  disabled={!selectedToken}
                />
              </div>

              {selectedToken && tradeAmount && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div>Selected: {selectedToken} on {getCurrentBlockchain()?.name}</div>
                    <div>Amount: {tradeAmount} tokens</div>
                    <div>
                      Total: ${(parseFloat(tradeAmount) * (getFilteredTokens().find(t => t.symbol === selectedToken)?.price || 0)).toFixed(2)}
                    </div>
                    <div>Position: {tradeType === 'long' ? 'Long (Bullish)' : 'Short (Bearish)'}</div>
                  </div>
                </div>
              )}

              <Button
                onClick={executeTrade}
                disabled={!selectedToken || !tradeAmount || isTrading}
                className="w-full"
              >
                {isTrading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Open ${tradeType === 'long' ? 'Long' : 'Short'} Position`
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Total Portfolio</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${getTotalPortfolioValue().toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">Total P&L</span>
                </div>
                <div className={`text-2xl font-bold ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${getTotalPnL().toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Active Positions</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{positions.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Blockchain Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devnetBalances.map((balance) => {
                  const blockchain = blockchains.find(b => b.id === balance.blockchain);
                  return (
                    <div key={balance.blockchain} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${blockchain?.color} rounded-full flex items-center justify-center text-white`}>
                          {blockchain?.icon}
                        </div>
                        <div>
                          <div className="font-medium">{blockchain?.name}</div>
                          <div className="text-sm text-muted-foreground">{balance.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{balance.balance.toFixed(2)} {balance.symbol}</div>
                        <div className="text-sm text-muted-foreground">${balance.usdValue.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Positions */}
          {positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {positions.map((position) => {
                    const blockchain = blockchains.find(b => b.id === position.blockchain);
                    return (
                      <div key={position.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${blockchain?.color} rounded-full flex items-center justify-center text-white text-sm`}>
                              {blockchain?.icon}
                            </div>
                            <div>
                              <div className="font-bold">{position.symbol}</div>
                              <div className="text-sm text-muted-foreground">
                                {position.amount.toFixed(2)} tokens • {position.type.toUpperCase()}
                              </div>
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Faucets Tab */}
        <TabsContent value="faucets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Devnet Token Faucets</span>
              </CardTitle>
              <CardDescription>
                Get free testnet tokens to practice trading. These are not real tokens and have no monetary value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockchains.map((blockchain) => (
                  <div key={blockchain.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${blockchain.color} rounded-full flex items-center justify-center text-white text-xl`}>
                          {React.createElement(blockchain.icon, { className: "w-6 h-6" })}
                        </div>
                        <div>
                          <h3 className="font-bold">{blockchain.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Get {blockchain.nativeToken} testnet tokens
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(blockchain.explorerUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Explorer
                        </Button>
                        <Button
                          onClick={() => requestDevnetTokens(blockchain.id)}
                          className={blockchain.color}
                        >
                          <Coins className="h-4 w-4 mr-2" />
                          Get Tokens
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Total Trades</span>
                </div>
                <div className="text-2xl font-bold">{positions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Win Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {positions.length > 0 ? ((positions.filter(p => p.pnl > 0).length / positions.length) * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Total P&L</span>
                </div>
                <div className={`text-2xl font-bold ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${getTotalPnL().toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Active Positions</span>
                </div>
                <div className="text-2xl font-bold">{positions.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-bold">{positions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profitable Trades:</span>
                    <span className="font-bold text-green-600">
                      {positions.filter(p => p.pnl > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Losing Trades:</span>
                    <span className="font-bold text-red-600">
                      {positions.filter(p => p.pnl < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-bold">
                      {positions.length > 0 ?
                        ((positions.filter(p => p.pnl > 0).length / positions.length) * 100).toFixed(1) + '%'
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blockchain Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockchains.map((blockchain) => {
                    const chainPositions = positions.filter(p => p.blockchain === blockchain.id);
                    const percentage = positions.length > 0 ? (chainPositions.length / positions.length) * 100 : 0;
                    return (
                      <div key={blockchain.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{blockchain.name}</span>
                          <span>{chainPositions.length} positions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${blockchain.color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossChainTradingDemo;
