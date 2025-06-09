
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  ArrowUpDown,
  Zap,
  Globe,
  DollarSign,
  Target
} from "lucide-react";
import {
  SiEthereum,
  SiPolygon,
  SiBinance,
  SiSolana
} from "react-icons/si";

interface WalletInfo {
  address: string;
  balance: number;
  nativeTokenBalance: number;
  nativeTokenSymbol: string;
  explorerUrl: string;
}

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
  wallet: WalletInfo;
}

interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  balance: number;
  contractAddress: string;
  decimals: number;
}

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  token: string;
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  txHash: string;
  blockchain: string;
}

const CrossChainTradingDemo: React.FC = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('ethereum');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTrading, setIsTrading] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Generate realistic wallet addresses for each blockchain
  const generateWalletAddress = (blockchain: string): string => {
    switch (blockchain) {
      case 'ethereum':
      case 'polygon':
      case 'bsc':
      case 'avalanche':
      case 'arbitrum':
        return `0x${Math.random().toString(16).substr(2, 40)}`;
      case 'solana':
        return Array.from({length: 44}, () => 
          'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[Math.floor(Math.random() * 58)]
        ).join('');
      default:
        return '';
    }
  };

  const [blockchains] = useState<Blockchain[]>([
    {
      id: 'ethereum',
      name: 'Ethereum Sepolia',
      symbol: 'ETH',
      color: 'from-blue-500 to-blue-600',
      icon: SiEthereum,
      rpcUrl: 'https://sepolia.infura.io/v3/',
      explorerUrl: 'https://sepolia.etherscan.io',
      nativeToken: 'ETH',
      devnetFaucet: 'https://sepoliafaucet.com',
      gasPrice: 0.002,
      wallet: {
        address: generateWalletAddress('ethereum'),
        balance: 1250.75,
        nativeTokenBalance: 2.5,
        nativeTokenSymbol: 'ETH',
        explorerUrl: 'https://sepolia.etherscan.io'
      }
    },
    {
      id: 'polygon',
      name: 'Polygon Mumbai',
      symbol: 'MATIC',
      color: 'from-purple-500 to-purple-600',
      icon: SiPolygon,
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorerUrl: 'https://mumbai.polygonscan.com',
      nativeToken: 'MATIC',
      devnetFaucet: 'https://faucet.polygon.technology',
      gasPrice: 0.001,
      wallet: {
        address: generateWalletAddress('polygon'),
        balance: 890.25,
        nativeTokenBalance: 100.0,
        nativeTokenSymbol: 'MATIC',
        explorerUrl: 'https://mumbai.polygonscan.com'
      }
    },
    {
      id: 'bsc',
      name: 'BSC Testnet',
      symbol: 'BNB',
      color: 'from-yellow-500 to-yellow-600',
      icon: SiBinance,
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      explorerUrl: 'https://testnet.bscscan.com',
      nativeToken: 'BNB',
      devnetFaucet: 'https://testnet.binance.org/faucet-smart',
      gasPrice: 0.005,
      wallet: {
        address: generateWalletAddress('bsc'),
        balance: 567.80,
        nativeTokenBalance: 5.2,
        nativeTokenSymbol: 'BNB',
        explorerUrl: 'https://testnet.bscscan.com'
      }
    },
    {
      id: 'solana',
      name: 'Solana Devnet',
      symbol: 'SOL',
      color: 'from-gradient-to-r from-purple-400 to-pink-400',
      icon: SiSolana,
      rpcUrl: 'https://api.devnet.solana.com',
      explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
      nativeToken: 'SOL',
      devnetFaucet: 'https://solfaucet.com',
      gasPrice: 0.000005,
      wallet: {
        address: generateWalletAddress('solana'),
        balance: 1100.50,
        nativeTokenBalance: 50.0,
        nativeTokenSymbol: 'SOL',
        explorerUrl: 'https://explorer.solana.com/?cluster=devnet'
      }
    }
  ]);

  const [tokensData, setTokensData] = useState<Record<string, Token[]>>({
    ethereum: [
      {
        symbol: 'PEPE',
        name: 'Pepe',
        price: 0.00000123,
        change24h: 45.67,
        volume: 2500000,
        marketCap: 520000000,
        balance: 1000000,
        contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
        decimals: 18
      },
      {
        symbol: 'SHIB',
        name: 'Shiba Inu',
        price: 0.0000087,
        change24h: -12.34,
        volume: 1800000,
        marketCap: 5100000000,
        balance: 500000,
        contractAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        decimals: 18
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1.00,
        change24h: 0.01,
        volume: 5000000,
        marketCap: 25000000000,
        balance: 1000,
        contractAddress: '0xA0b86a33E6411c40c47F4C5dF7B26A02C8dc0663',
        decimals: 6
      }
    ],
    polygon: [
      {
        symbol: 'WMATIC',
        name: 'Wrapped MATIC',
        price: 0.85,
        change24h: 5.23,
        volume: 890000,
        marketCap: 450000000,
        balance: 200,
        contractAddress: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        decimals: 18
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1.00,
        change24h: -0.02,
        volume: 1200000,
        marketCap: 25000000000,
        balance: 800,
        contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        decimals: 6
      }
    ],
    bsc: [
      {
        symbol: 'CAKE',
        name: 'PancakeSwap Token',
        price: 1.85,
        change24h: 8.45,
        volume: 1200000,
        marketCap: 890000000,
        balance: 150,
        contractAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        decimals: 18
      },
      {
        symbol: 'BUSD',
        name: 'Binance USD',
        price: 1.00,
        change24h: 0.05,
        volume: 2000000,
        marketCap: 15000000000,
        balance: 600,
        contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        decimals: 18
      }
    ],
    solana: [
      {
        symbol: 'BONK',
        name: 'Bonk',
        price: 0.0000089,
        change24h: -5.67,
        volume: 320000,
        marketCap: 580000000,
        balance: 10000000,
        contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        decimals: 5
      },
      {
        symbol: 'RAY',
        name: 'Raydium',
        price: 0.234,
        change24h: 12.67,
        volume: 560000,
        marketCap: 120000000,
        balance: 85,
        contractAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        decimals: 6
      }
    ]
  });

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokensData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(blockchain => {
          updated[blockchain] = updated[blockchain].map(token => ({
            ...token,
            price: token.price * (1 + (Math.random() - 0.5) * 0.02),
            change24h: token.change24h + (Math.random() - 0.5) * 2
          }));
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentBlockchain = () => blockchains.find(b => b.id === selectedBlockchain);
  const getCurrentTokens = () => tokensData[selectedBlockchain] || [];
  const getSelectedToken = () => getCurrentTokens().find(t => t.symbol === selectedToken);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (address: string) => {
    const blockchain = getCurrentBlockchain();
    if (blockchain) {
      window.open(`${blockchain.explorerUrl}/address/${address}`, '_blank');
    }
  };

  const requestTestTokens = () => {
    const blockchain = getCurrentBlockchain();
    if (blockchain) {
      window.open(blockchain.devnetFaucet, '_blank');
    }
  };

  const executeTrade = () => {
    if (!selectedToken || !tradeAmount || parseFloat(tradeAmount) <= 0) return;

    const token = getSelectedToken();
    if (!token) return;

    setIsTrading(true);

    // Simulate trade execution
    setTimeout(() => {
      const amount = parseFloat(tradeAmount);
      const price = token.price;
      const total = amount * price;
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      const newTrade: Trade = {
        id: Date.now().toString(),
        type: tradeType,
        token: selectedToken,
        amount,
        price,
        total,
        timestamp: Date.now(),
        txHash,
        blockchain: selectedBlockchain
      };

      setTrades(prev => [newTrade, ...prev]);

      // Update token balance
      setTokensData(prev => ({
        ...prev,
        [selectedBlockchain]: prev[selectedBlockchain].map(t => 
          t.symbol === selectedToken 
            ? { 
                ...t, 
                balance: tradeType === 'buy' 
                  ? t.balance + amount 
                  : Math.max(0, t.balance - amount)
              }
            : t
        )
      }));

      setTradeAmount('');
      setIsTrading(false);
    }, 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const blockchain = getCurrentBlockchain();
  const tokens = getCurrentTokens();
  const selectedTokenData = getSelectedToken();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cross-Chain DEX
              </h1>
              <p className="text-muted-foreground">Trade across multiple blockchains</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                <Globe className="h-3 w-3 mr-1" />
                Testnet
              </Badge>
              <Badge variant="outline">
                Portfolio: ${(
                  Object.values(tokensData).flat().reduce((total, token) => 
                    total + (token.balance * token.price), 0
                  ) + blockchains.reduce((total, b) => total + b.wallet.balance, 0)
                ).toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Blockchain Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Blockchain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blockchains.map((chain) => {
              const IconComponent = chain.icon;
              return (
                <Button
                  key={chain.id}
                  variant={selectedBlockchain === chain.id ? "default" : "outline"}
                  className={`p-6 h-auto flex flex-col space-y-3 ${
                    selectedBlockchain === chain.id 
                      ? `bg-gradient-to-r ${chain.color} text-white border-0` 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setSelectedBlockchain(chain.id)}
                >
                  <IconComponent className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">{chain.symbol}</div>
                    <div className="text-sm opacity-75">{chain.name}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Info & Token List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Information */}
            {blockchain && (
              <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5" />
                    <span>{blockchain.name} Wallet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Wallet Address</div>
                      <div className="font-mono text-sm">{formatAddress(blockchain.wallet.address)}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(blockchain.wallet.address)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInExplorer(blockchain.wallet.address)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Native Balance</div>
                      <div className="text-lg font-semibold">
                        {blockchain.wallet.nativeTokenBalance} {blockchain.wallet.nativeTokenSymbol}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Portfolio Value</div>
                      <div className="text-lg font-semibold">${blockchain.wallet.balance.toFixed(2)}</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestTestTokens}
                    className="w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Test {blockchain.nativeToken}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Available Tokens */}
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Available Tokens on {blockchain?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedToken === token.symbol 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                            <div className="text-xs text-muted-foreground">
                              Balance: {token.balance.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Trade Form */}
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Trade {selectedToken || 'Select Token'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTokenData && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold">${selectedTokenData.price.toFixed(8)}</div>
                    <div className="text-sm text-muted-foreground">Current Price</div>
                  </div>
                )}

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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Amount ({selectedToken || 'Tokens'})
                  </label>
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={!selectedToken}
                    step="any"
                  />
                </div>

                {selectedTokenData && tradeAmount && parseFloat(tradeAmount) > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{parseFloat(tradeAmount).toLocaleString()} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">${selectedTokenData.price.toFixed(8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold">${(parseFloat(tradeAmount) * selectedTokenData.price).toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Fee:</span>
                      <span>${blockchain?.gasPrice}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={executeTrade}
                  disabled={!selectedToken || !tradeAmount || parseFloat(tradeAmount) <= 0 || isTrading}
                  className="w-full"
                >
                  {isTrading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedToken || 'Token'}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            {trades.length > 0 && (
              <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {trades.slice(0, 5).map((trade) => (
                      <div key={trade.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="text-sm">
                          <div className="font-medium">
                            {trade.type.toUpperCase()} {trade.amount} {trade.token}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(trade.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">${trade.total.toFixed(6)}</div>
                          <div className="text-xs text-muted-foreground">
                            @${trade.price.toFixed(8)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainTradingDemo;
