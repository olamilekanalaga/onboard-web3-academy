// Interactive tools and calculators for the crypto education platform

export interface InteractiveTool {
  id: string;
  name: string;
  description: string;
  category: 'calculator' | 'simulator' | 'analyzer' | 'tracker';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  unlockRequirement?: {
    course?: string;
    xp?: number;
    achievement?: string;
  };
  icon: string;
  features: string[];
  inputs: ToolInput[];
  outputs: ToolOutput[];
}

export interface ToolInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'slider' | 'toggle';
  required: boolean;
  defaultValue?: any;
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
}

export interface ToolOutput {
  id: string;
  label: string;
  type: 'number' | 'percentage' | 'currency' | 'text' | 'chart' | 'table';
  format?: string;
  description?: string;
}

export interface VirtualPortfolio {
  id: string;
  userId: string;
  name: string;
  startingBalance: number;
  currentBalance: number;
  holdings: PortfolioHolding[];
  transactions: PortfolioTransaction[];
  createdAt: Date;
  lastUpdated: Date;
  performance: {
    totalReturn: number;
    totalReturnPercentage: number;
    dayChange: number;
    dayChangePercentage: number;
    bestPerformer: string;
    worstPerformer: string;
  };
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  allocation: number;
  dayChange: number;
  dayChangePercentage: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

export interface PortfolioTransaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  timestamp: Date;
  notes?: string;
}

// Interactive tools definitions
export const interactiveTools: InteractiveTool[] = [
  {
    id: 'yield_calculator',
    name: 'DeFi Yield Calculator',
    description: 'Calculate potential returns from DeFi lending and staking',
    category: 'calculator',
    difficulty: 'intermediate',
    unlockRequirement: {
      course: 'intermediate'
    },
    icon: '📊',
    features: [
      'Compare yields across protocols',
      'Factor in impermanent loss',
      'Calculate compound interest',
      'Risk-adjusted returns'
    ],
    inputs: [
      {
        id: 'principal',
        label: 'Initial Investment',
        type: 'number',
        required: true,
        defaultValue: 1000,
        min: 1,
        placeholder: 'Enter amount in USD',
        helpText: 'The amount you plan to invest'
      },
      {
        id: 'apy',
        label: 'Annual Percentage Yield (APY)',
        type: 'slider',
        required: true,
        defaultValue: 10,
        min: 0,
        max: 100,
        step: 0.1,
        helpText: 'Expected annual yield percentage'
      },
      {
        id: 'duration',
        label: 'Investment Duration',
        type: 'select',
        required: true,
        defaultValue: '1year',
        options: [
          { value: '1month', label: '1 Month' },
          { value: '3months', label: '3 Months' },
          { value: '6months', label: '6 Months' },
          { value: '1year', label: '1 Year' },
          { value: '2years', label: '2 Years' }
        ],
        helpText: 'How long you plan to keep funds invested'
      },
      {
        id: 'compounding',
        label: 'Compounding Frequency',
        type: 'select',
        required: true,
        defaultValue: 'daily',
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }
        ],
        helpText: 'How often rewards are compounded'
      },
      {
        id: 'fees',
        label: 'Platform Fees (%)',
        type: 'number',
        required: false,
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 0.1,
        helpText: 'Annual platform or management fees'
      }
    ],
    outputs: [
      {
        id: 'finalAmount',
        label: 'Final Amount',
        type: 'currency',
        format: 'USD',
        description: 'Total value after investment period'
      },
      {
        id: 'totalReturn',
        label: 'Total Return',
        type: 'currency',
        format: 'USD',
        description: 'Profit earned from investment'
      },
      {
        id: 'returnPercentage',
        label: 'Return Percentage',
        type: 'percentage',
        description: 'Percentage return on investment'
      },
      {
        id: 'monthlyIncome',
        label: 'Monthly Income',
        type: 'currency',
        format: 'USD',
        description: 'Average monthly earnings'
      }
    ]
  },
  {
    id: 'impermanent_loss_calculator',
    name: 'Impermanent Loss Calculator',
    description: 'Calculate potential impermanent loss from liquidity provision',
    category: 'calculator',
    difficulty: 'advanced',
    unlockRequirement: {
      course: 'intermediate'
    },
    icon: '📉',
    features: [
      'Calculate IL for any price change',
      'Compare with holding strategy',
      'Factor in trading fees earned',
      'Multiple token pairs'
    ],
    inputs: [
      {
        id: 'token1Amount',
        label: 'Token 1 Amount',
        type: 'number',
        required: true,
        defaultValue: 1000,
        min: 0,
        placeholder: 'Amount of first token'
      },
      {
        id: 'token1Price',
        label: 'Token 1 Initial Price',
        type: 'number',
        required: true,
        defaultValue: 100,
        min: 0,
        placeholder: 'Initial price in USD'
      },
      {
        id: 'token2Amount',
        label: 'Token 2 Amount',
        type: 'number',
        required: true,
        defaultValue: 10,
        min: 0,
        placeholder: 'Amount of second token'
      },
      {
        id: 'token2Price',
        label: 'Token 2 Initial Price',
        type: 'number',
        required: true,
        defaultValue: 100,
        min: 0,
        placeholder: 'Initial price in USD'
      },
      {
        id: 'priceChange',
        label: 'Price Change (%)',
        type: 'slider',
        required: true,
        defaultValue: 0,
        min: -90,
        max: 500,
        step: 1,
        helpText: 'Price change of token 1 relative to token 2'
      },
      {
        id: 'tradingFees',
        label: 'Trading Fees Earned (%)',
        type: 'number',
        required: false,
        defaultValue: 0.3,
        min: 0,
        max: 10,
        step: 0.01,
        helpText: 'Fees earned from trading activity'
      }
    ],
    outputs: [
      {
        id: 'impermanentLoss',
        label: 'Impermanent Loss',
        type: 'percentage',
        description: 'Loss compared to holding tokens'
      },
      {
        id: 'lpValue',
        label: 'LP Position Value',
        type: 'currency',
        format: 'USD',
        description: 'Current value of LP position'
      },
      {
        id: 'holdValue',
        label: 'Hold Strategy Value',
        type: 'currency',
        format: 'USD',
        description: 'Value if tokens were held separately'
      },
      {
        id: 'netResult',
        label: 'Net Result',
        type: 'currency',
        format: 'USD',
        description: 'LP value including fees minus hold value'
      }
    ]
  },
  {
    id: 'gas_tracker',
    name: 'Gas Fee Tracker',
    description: 'Real-time gas fees across multiple networks',
    category: 'tracker',
    difficulty: 'beginner',
    icon: '⛽',
    features: [
      'Real-time gas prices',
      'Multiple networks',
      'Transaction cost estimates',
      'Historical gas trends'
    ],
    inputs: [
      {
        id: 'network',
        label: 'Blockchain Network',
        type: 'select',
        required: true,
        defaultValue: 'ethereum',
        options: [
          { value: 'ethereum', label: 'Ethereum' },
          { value: 'polygon', label: 'Polygon' },
          { value: 'bsc', label: 'Binance Smart Chain' },
          { value: 'arbitrum', label: 'Arbitrum' },
          { value: 'optimism', label: 'Optimism' }
        ]
      },
      {
        id: 'transactionType',
        label: 'Transaction Type',
        type: 'select',
        required: true,
        defaultValue: 'transfer',
        options: [
          { value: 'transfer', label: 'Token Transfer' },
          { value: 'swap', label: 'DEX Swap' },
          { value: 'approve', label: 'Token Approval' },
          { value: 'stake', label: 'Staking' },
          { value: 'nft', label: 'NFT Transaction' }
        ]
      }
    ],
    outputs: [
      {
        id: 'currentGas',
        label: 'Current Gas Price',
        type: 'text',
        description: 'Current gas price in Gwei'
      },
      {
        id: 'estimatedCost',
        label: 'Estimated Cost',
        type: 'currency',
        format: 'USD',
        description: 'Estimated transaction cost'
      },
      {
        id: 'gasChart',
        label: 'Gas Price Trend',
        type: 'chart',
        description: '24-hour gas price history'
      }
    ]
  },
  {
    id: 'portfolio_analyzer',
    name: 'Portfolio Risk Analyzer',
    description: 'Analyze portfolio risk and diversification',
    category: 'analyzer',
    difficulty: 'advanced',
    unlockRequirement: {
      xp: 1000
    },
    icon: '📈',
    features: [
      'Risk assessment',
      'Diversification analysis',
      'Correlation matrix',
      'Rebalancing suggestions'
    ],
    inputs: [
      {
        id: 'holdings',
        label: 'Portfolio Holdings',
        type: 'text',
        required: true,
        placeholder: 'Enter holdings as JSON or CSV',
        helpText: 'Upload or enter your portfolio data'
      },
      {
        id: 'riskTolerance',
        label: 'Risk Tolerance',
        type: 'select',
        required: true,
        defaultValue: 'moderate',
        options: [
          { value: 'conservative', label: 'Conservative' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'aggressive', label: 'Aggressive' }
        ]
      },
      {
        id: 'timeHorizon',
        label: 'Investment Time Horizon',
        type: 'select',
        required: true,
        defaultValue: '1-3years',
        options: [
          { value: 'short', label: '< 1 Year' },
          { value: '1-3years', label: '1-3 Years' },
          { value: '3-5years', label: '3-5 Years' },
          { value: 'long', label: '5+ Years' }
        ]
      }
    ],
    outputs: [
      {
        id: 'riskScore',
        label: 'Risk Score',
        type: 'number',
        description: 'Overall portfolio risk rating (1-10)'
      },
      {
        id: 'diversificationScore',
        label: 'Diversification Score',
        type: 'percentage',
        description: 'How well diversified your portfolio is'
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        type: 'table',
        description: 'Suggested portfolio improvements'
      },
      {
        id: 'allocationChart',
        label: 'Asset Allocation',
        type: 'chart',
        description: 'Visual breakdown of portfolio allocation'
      }
    ]
  },
  {
    id: 'defi_simulator',
    name: 'DeFi Protocol Simulator',
    description: 'Practice DeFi interactions in a safe environment',
    category: 'simulator',
    difficulty: 'intermediate',
    unlockRequirement: {
      course: 'beginner'
    },
    icon: '🎮',
    features: [
      'Risk-free practice',
      'Real protocol interfaces',
      'Virtual funds',
      'Learning scenarios'
    ],
    inputs: [
      {
        id: 'protocol',
        label: 'DeFi Protocol',
        type: 'select',
        required: true,
        defaultValue: 'uniswap',
        options: [
          { value: 'uniswap', label: 'Uniswap V3' },
          { value: 'aave', label: 'Aave' },
          { value: 'compound', label: 'Compound' },
          { value: 'curve', label: 'Curve Finance' }
        ]
      },
      {
        id: 'scenario',
        label: 'Learning Scenario',
        type: 'select',
        required: true,
        defaultValue: 'basic_swap',
        options: [
          { value: 'basic_swap', label: 'Basic Token Swap' },
          { value: 'provide_liquidity', label: 'Provide Liquidity' },
          { value: 'lending', label: 'Lending Assets' },
          { value: 'borrowing', label: 'Borrowing Assets' }
        ]
      },
      {
        id: 'virtualBalance',
        label: 'Virtual Balance',
        type: 'number',
        required: true,
        defaultValue: 10000,
        min: 1000,
        max: 100000,
        helpText: 'Starting balance for simulation'
      }
    ],
    outputs: [
      {
        id: 'simulationResult',
        label: 'Simulation Result',
        type: 'text',
        description: 'Outcome of the DeFi interaction'
      },
      {
        id: 'learningPoints',
        label: 'Key Learning Points',
        type: 'text',
        description: 'Important concepts demonstrated'
      },
      {
        id: 'nextSteps',
        label: 'Next Steps',
        type: 'text',
        description: 'Suggested next learning activities'
      }
    ]
  }
];

// Virtual portfolio templates
export const portfolioTemplates = [
  {
    id: 'conservative',
    name: 'Conservative Portfolio',
    description: 'Low-risk portfolio focused on established cryptocurrencies',
    allocation: [
      { symbol: 'BTC', percentage: 60, name: 'Bitcoin' },
      { symbol: 'ETH', percentage: 30, name: 'Ethereum' },
      { symbol: 'USDC', percentage: 10, name: 'USD Coin' }
    ],
    riskLevel: 'Low',
    expectedReturn: '8-15%'
  },
  {
    id: 'balanced',
    name: 'Balanced Portfolio',
    description: 'Moderate risk with mix of established and emerging cryptocurrencies',
    allocation: [
      { symbol: 'BTC', percentage: 40, name: 'Bitcoin' },
      { symbol: 'ETH', percentage: 35, name: 'Ethereum' },
      { symbol: 'SOL', percentage: 10, name: 'Solana' },
      { symbol: 'MATIC', percentage: 10, name: 'Polygon' },
      { symbol: 'USDC', percentage: 5, name: 'USD Coin' }
    ],
    riskLevel: 'Medium',
    expectedReturn: '15-30%'
  },
  {
    id: 'aggressive',
    name: 'Aggressive Portfolio',
    description: 'High-risk, high-reward portfolio with emerging cryptocurrencies',
    allocation: [
      { symbol: 'ETH', percentage: 30, name: 'Ethereum' },
      { symbol: 'SOL', percentage: 20, name: 'Solana' },
      { symbol: 'AVAX', percentage: 15, name: 'Avalanche' },
      { symbol: 'MATIC', percentage: 15, name: 'Polygon' },
      { symbol: 'LINK', percentage: 10, name: 'Chainlink' },
      { symbol: 'UNI', percentage: 10, name: 'Uniswap' }
    ],
    riskLevel: 'High',
    expectedReturn: '30-100%'
  }
];
