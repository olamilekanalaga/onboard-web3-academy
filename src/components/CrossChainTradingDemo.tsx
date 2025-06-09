
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  SiSolana
} from "react-icons/si";

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
      icon: Layers,
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
      icon: Network,
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
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A0Dd',
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Cross-Chain DEX</h1>
              <p className="text-sm text-muted-foreground">Trade across 6 blockchains</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Testnet
              </Badge>
              <Badge variant="outline">
                <Wallet className="h-3 w-3 mr-1" />
                ${getTotalPortfolioValue().toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Blockchain Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Network</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {blockchains.map((blockchain) => {
              const IconComponent = blockchain.icon;
              const balance = getBlockchainBalance(blockchain.id);
              return (
                <Button
                  key={blockchain.id}
                  variant={selectedBlockchain === blockchain.id ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col space-y-2 ${
                    selectedBlockchain === blockchain.id ? blockchain.color + ' text-white' : ''
                  }`}
                  onClick={() => setSelectedBlockchain(blockchain.id)}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{blockchain.symbol}</div>
                    <div className="text-xs opacity-80">${balance?.usdValue.toFixed(0) || '0'}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token List */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                Available Tokens on {getCurrentBlockchain()?.name}
              </h3>
            </div>
            <div className="space-y-2">
              {getFilteredTokens().map((token) => (
                <div
                  key={token.symbol}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedToken === token.symbol ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${token.price < 1 ? token.price.toFixed(8) : token.price.toFixed(4)}
                      </div>
                      <div className={`flex items-center text-sm ${
                        token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {token.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {token.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <div>
                      <div>Volume</div>
                      <div className="font-medium">${(token.volume / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div>Market Cap</div>
                      <div className="font-medium">${(token.marketCap / 1000000).toFixed(0)}M</div>
                    </div>
                    <div>
                      <div>Liquidity</div>
                      <div className="font-medium">${(token.liquidity / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Current Selection */}
            {selectedToken && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedToken}</div>
                    <div className="text-lg">
                      ${getFilteredTokens().find(t => t.symbol === selectedToken)?.price.toFixed(8)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      on {getCurrentBlockchain()?.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trade Form */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradeType === 'long' ? 'default' : 'outline'}
                    onClick={() => setTradeType('long')}
                    className={tradeType === 'long' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === 'short' ? 'default' : 'outline'}
                    onClick={() => setTradeType('short')}
                    className={tradeType === 'short' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    Sell
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (tokens)</label>
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={!selectedToken}
                  />
                </div>

                {selectedToken && tradeAmount && (
                  <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-bold">
                        ${(parseFloat(tradeAmount) * (getFilteredTokens().find(t => t.symbol === selectedToken)?.price || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Fee:</span>
                      <span>${getCurrentBlockchain()?.gasPrice}</span>
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
                    `${tradeType === 'long' ? 'Buy' : 'Sell'} ${selectedToken || 'Token'}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">${getTotalPortfolioValue().toFixed(2)}</div>
                  <div className={`text-sm ${getTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {getTotalPnL() >= 0 ? '+' : ''}${getTotalPnL().toFixed(2)} P&L
                  </div>
                </div>
                
                {positions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Active Positions</div>
                    {positions.slice(0, 3).map((position) => (
                      <div key={position.id} className="flex justify-between text-sm">
                        <span>{position.symbol}</span>
                        <span className={position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Faucet */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Test Tokens?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requestDevnetTokens(selectedBlockchain)}
                  className="w-full"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Get {getCurrentBlockchain()?.nativeToken}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainTradingDemo;
