
export interface DegenLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz' | 'practice';
  content: {
    description: string;
    keyPoints: string[];
    practicalExample: string;
    warning?: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  xpReward: number;
}

export interface DegenModule {
  id: string;
  title: string;
  description: string;
  chapters: DegenLesson[];
}

export const degenCourse: DegenModule[] = [
  {
    id: 'degen-mindset',
    title: 'The Degen Mindset & Psychology',
    description: 'Understanding the psychology behind high-risk trading and developing the right mindset',
    chapters: [
      {
        id: 'degen-intro',
        title: 'What Does "Degen" Really Mean?',
        duration: '15 min',
        type: 'video',
        content: {
          description: 'Understand the true meaning of being a "degen" trader and the culture behind it.',
          keyPoints: [
            'Origin of "degen" in crypto culture',
            'High-risk, high-reward mentality',
            'FOMO and YOLO psychology',
            'Community-driven trading decisions',
            'Meme culture influence on trading'
          ],
          practicalExample: 'GameStop squeeze of 2021 - WSB community vs. traditional finance',
          warning: 'Degen trading can lead to significant losses. Never risk more than you can afford to lose.'
        },
        quiz: {
          question: 'What is the most important rule for degen trading?',
          options: [
            'Always buy the dip',
            'Follow the crowd blindly',
            'Never risk more than you can afford to lose',
            'Only trade meme coins'
          ],
          correct: 2,
          explanation: 'Risk management is crucial in high-risk trading strategies.'
        },
        xpReward: 50
      },
      {
        id: 'risk-psychology',
        title: 'Psychology of High-Risk Trading',
        duration: '20 min',
        type: 'interactive',
        content: {
          description: 'Master the mental game of high-risk trading and emotional control.',
          keyPoints: [
            'FOMO (Fear of Missing Out) psychology',
            'Dopamine addiction in trading',
            'Confirmation bias in research',
            'Herd mentality effects',
            'Dealing with massive gains and losses'
          ],
          practicalExample: 'LUNA/UST collapse - how emotions drove irrational decisions',
          warning: 'Emotional trading leads to poor decisions. Develop a systematic approach.'
        },
        xpReward: 60
      },
      {
        id: 'bankroll-management',
        title: 'Degen Bankroll Management',
        duration: '25 min',
        type: 'practice',
        content: {
          description: 'Learn how to manage your funds for sustainable degen trading.',
          keyPoints: [
            'The 1-5% rule for high-risk trades',
            'Separate "degen money" from savings',
            'Position sizing for different risk levels',
            'When to take profits vs. let it ride',
            'Recovery strategies after big losses'
          ],
          practicalExample: 'Portfolio allocation: 70% safe, 20% medium risk, 10% degen plays',
          warning: 'Never use borrowed money or essential funds for degen trading.'
        },
        xpReward: 75
      }
    ]
  },
  {
    id: 'memecoin-mastery',
    title: 'Memecoin & Altcoin Analysis',
    description: 'Deep dive into analyzing and trading memecoins and low-cap altcoins',
    chapters: [
      {
        id: 'memecoin-fundamentals',
        title: 'Memecoin Fundamentals',
        duration: '30 min',
        type: 'video',
        content: {
          description: 'Understanding what drives memecoin prices and community dynamics.',
          keyPoints: [
            'Community strength and engagement',
            'Meme virality potential',
            'Tokenomics and supply structure',
            'Developer activity and roadmap',
            'Celebrity and influencer endorsements'
          ],
          practicalExample: 'DOGE vs. SHIB - comparing community growth and adoption',
          warning: 'Most memecoins are highly speculative and can lose 90%+ of their value.'
        },
        quiz: {
          question: 'What is the most important factor for memecoin success?',
          options: [
            'Advanced technology',
            'Low supply',
            'Strong community engagement',
            'High price'
          ],
          correct: 2,
          explanation: 'Community engagement drives adoption and price action in memecoins.'
        },
        xpReward: 80
      },
      {
        id: 'social-sentiment',
        title: 'Social Sentiment Analysis',
        duration: '35 min',
        type: 'interactive',
        content: {
          description: 'Learn to analyze social media sentiment and community signals.',
          keyPoints: [
            'Twitter/X sentiment tracking tools',
            'Reddit community analysis',
            'Discord and Telegram signals',
            'Influencer impact measurement',
            'Bot detection and fake hype'
          ],
          practicalExample: 'Using LunarCrush and CoinBrain for sentiment analysis',
          warning: 'Fake social signals are common. Always verify community authenticity.'
        },
        xpReward: 90
      },
      {
        id: 'low-cap-gems',
        title: 'Finding Low-Cap Gems',
        duration: '40 min',
        type: 'practice',
        content: {
          description: 'Strategies for discovering undervalued projects before they pump.',
          keyPoints: [
            'DexScreener and DexTools analysis',
            'Contract verification and audit checks',
            'Liquidity pool analysis',
            'Early holder distribution',
            'Developer background research'
          ],
          practicalExample: 'Case study: How to identify a 100x potential project',
          warning: 'Many low-cap projects are scams. Always do thorough due diligence.'
        },
        xpReward: 100
      }
    ]
  },
  {
    id: 'defi-degen',
    title: 'DeFi Degen Strategies',
    description: 'Advanced DeFi strategies for maximum yield and risk',
    chapters: [
      {
        id: 'yield-farming-extreme',
        title: 'Extreme Yield Farming',
        duration: '45 min',
        type: 'practice',
        content: {
          description: 'High-risk, high-reward yield farming strategies and protocols.',
          keyPoints: [
            'APY vs. APR understanding',
            'Impermanent loss in volatile pairs',
            'New protocol farming strategies',
            'Token emission schedules',
            'Exit strategy planning'
          ],
          practicalExample: 'Ohm forks and (3,3) game theory during 2021 DeFi summer',
          warning: 'High APY often comes with high smart contract and token risk.'
        },
        xpReward: 120
      },
      {
        id: 'leverage-protocols',
        title: 'Leverage and Margin Trading',
        duration: '50 min',
        type: 'interactive',
        content: {
          description: 'Using leverage responsibly in DeFi protocols for amplified gains.',
          keyPoints: [
            'Different leverage protocols (Aave, Compound, GMX)',
            'Liquidation mechanics and safety margins',
            'Leveraged yield farming strategies',
            'Cross-margin vs. isolated margin',
            'Hedging leveraged positions'
          ],
          practicalExample: 'GMX trading during high volatility periods',
          warning: 'Leverage amplifies both gains and losses. Can lead to total loss.'
        },
        xpReward: 140
      },
      {
        id: 'protocol-tokens',
        title: 'Protocol Token Strategies',
        duration: '35 min',
        type: 'video',
        content: {
          description: 'Understanding and trading protocol governance tokens.',
          keyPoints: [
            'Governance token value accrual',
            'Tokenomics analysis',
            'Proposal and voting strategies',
            'Airdrops and protocol incentives',
            'Token unlock schedules'
          ],
          practicalExample: 'UNI governance token distribution and price impact',
          warning: 'Governance tokens can be heavily manipulated around key votes.'
        },
        xpReward: 110
      }
    ]
  },
  {
    id: 'technical-analysis-degen',
    title: 'Degen Technical Analysis',
    description: 'Advanced charting and technical analysis for volatile assets',
    chapters: [
      {
        id: 'volatility-trading',
        title: 'Trading High Volatility Assets',
        duration: '40 min',
        type: 'practice',
        content: {
          description: 'Special techniques for analyzing and trading extremely volatile cryptocurrencies.',
          keyPoints: [
            'Bollinger Bands in high volatility',
            'Volume profile analysis',
            'Support and resistance in trending markets',
            'Breakout patterns in crypto',
            'Stop-loss strategies for volatile assets'
          ],
          practicalExample: 'Trading PEPE during its 2023 parabolic run',
          warning: 'Traditional TA patterns may not work in extreme volatility.'
        },
        xpReward: 130
      },
      {
        id: 'onchain-analysis',
        title: 'On-Chain Analysis for Degens',
        duration: '55 min',
        type: 'interactive',
        content: {
          description: 'Using blockchain data to make informed trading decisions.',
          keyPoints: [
            'Whale wallet tracking',
            'Exchange flow analysis',
            'Token holder distribution',
            'Smart money movements',
            'MEV and front-running detection'
          ],
          practicalExample: 'Tracking smart money wallets during NFT mints',
          warning: 'On-chain data can be manipulated by sophisticated actors.'
        },
        xpReward: 150
      },
      {
        id: 'market-structure',
        title: 'Crypto Market Structure',
        duration: '45 min',
        type: 'video',
        content: {
          description: 'Understanding how crypto markets operate differently from traditional markets.',
          keyPoints: [
            '24/7 trading implications',
            'Regional market differences',
            'CEX vs. DEX price discovery',
            'Market maker strategies',
            'Funding rates and perpetuals'
          ],
          practicalExample: 'Kimchi premium during Korean crypto boom',
          warning: 'Crypto markets are less regulated and more prone to manipulation.'
        },
        xpReward: 120
      }
    ]
  },
  {
    id: 'advanced-strategies',
    title: 'Advanced Degen Strategies',
    description: 'Sophisticated trading strategies for experienced degens',
    chapters: [
      {
        id: 'arbitrage-opportunities',
        title: 'Cross-Exchange Arbitrage',
        duration: '50 min',
        type: 'practice',
        content: {
          description: 'Finding and exploiting price differences across exchanges and chains.',
          keyPoints: [
            'CEX-DEX arbitrage opportunities',
            'Cross-chain arbitrage strategies',
            'Flash loan arbitrage',
            'Triangular arbitrage',
            'Automated arbitrage bots'
          ],
          practicalExample: 'FTX collapse arbitrage opportunities between exchanges',
          warning: 'Arbitrage requires significant capital and technical expertise.'
        },
        xpReward: 160
      },
      {
        id: 'mev-strategies',
        title: 'MEV and Front-Running',
        duration: '60 min',
        type: 'interactive',
        content: {
          description: 'Understanding and potentially exploiting Maximum Extractable Value.',
          keyPoints: [
            'MEV basics and types',
            'Sandwich attacks mechanics',
            'Front-running detection',
            'Private mempools usage',
            'MEV protection strategies'
          ],
          practicalExample: 'Uniswap V3 sandwich attacks and protection',
          warning: 'MEV strategies may be considered market manipulation in some jurisdictions.'
        },
        xpReward: 180
      },
      {
        id: 'derivatives-degen',
        title: 'Crypto Derivatives and Perpetuals',
        duration: '55 min',
        type: 'practice',
        content: {
          description: 'Advanced derivatives trading for maximum leverage and profit.',
          keyPoints: [
            'Perpetual futures mechanics',
            'Options strategies in crypto',
            'Funding rate arbitrage',
            'Basis trading strategies',
            'Structured products'
          ],
          practicalExample: 'Using options to hedge during high volatility events',
          warning: 'Derivatives are complex instruments with high risk of total loss.'
        },
        xpReward: 170
      }
    ]
  },
  {
    id: 'risk-management-advanced',
    title: 'Advanced Risk Management',
    description: 'Sophisticated risk management techniques for degen trading',
    chapters: [
      {
        id: 'portfolio-theory',
        title: 'Degen Portfolio Theory',
        duration: '40 min',
        type: 'video',
        content: {
          description: 'Applying modern portfolio theory to high-risk crypto trading.',
          keyPoints: [
            'Correlation analysis in crypto',
            'Risk-adjusted returns measurement',
            'Sharpe ratio in volatile markets',
            'Portfolio rebalancing strategies',
            'Black swan event preparation'
          ],
          practicalExample: 'Portfolio performance during the 2022 bear market',
          warning: 'Past performance does not guarantee future results.'
        },
        xpReward: 140
      },
      {
        id: 'scenario-planning',
        title: 'Scenario Planning and Stress Testing',
        duration: '45 min',
        type: 'interactive',
        content: {
          description: 'Preparing for different market scenarios and extreme events.',
          keyPoints: [
            'Bull market vs. bear market strategies',
            'Regulatory scenario planning',
            'Exchange failure preparations',
            'Stablecoin depeg scenarios',
            'Network outage contingencies'
          ],
          practicalExample: 'Preparing for potential Bitcoin ETF approval/rejection',
          warning: 'Always have exit strategies and backup plans.'
        },
        xpReward: 150
      },
      {
        id: 'psychological-edge',
        title: 'Maintaining Psychological Edge',
        duration: '35 min',
        type: 'practice',
        content: {
          description: 'Advanced psychological techniques for consistent performance.',
          keyPoints: [
            'Meditation and mindfulness for traders',
            'Journal keeping and reflection',
            'Dealing with winning and losing streaks',
            'Building confidence without overconfidence',
            'Community vs. solo trading balance'
          ],
          practicalExample: 'Professional trader daily routines and mental health',
          warning: 'Trading can be addictive and harmful to mental health.'
        },
        xpReward: 130
      }
    ]
  }
];

export const degenCourseMetadata = {
  id: 'degen',
  title: 'Degen Trading Mastery',
  description: 'Master the art of high-risk, high-reward cryptocurrency trading with advanced strategies, risk management, and psychological techniques.',
  level: 'Intermediate',
  category: 'trading',
  difficulty: 3,
  estimatedTime: '4-6 weeks',
  totalXP: 2000,
  prerequisites: ['DeFi Fundamentals'],
  outcomes: [
    'Master memecoin and altcoin analysis',
    'Understand advanced DeFi strategies',
    'Implement sophisticated risk management',
    'Develop psychological trading edge',
    'Navigate high-volatility markets confidently'
  ],
  warnings: [
    'This course covers high-risk trading strategies',
    'Never risk more than you can afford to lose',
    'Past performance does not guarantee future results',
    'Some strategies may not be suitable for all investors',
    'Always do your own research (DYOR)'
  ]
};
