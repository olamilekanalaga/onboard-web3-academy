// Modern, up-to-date course content designed for short attention spans
// Each lesson is 5-10 minutes with interactive elements

export interface ModernLesson {
  id: string;
  title: string;
  duration: string; // Always 5-10 minutes
  type: 'video' | 'interactive' | 'quiz' | 'practice';
  content: {
    hook: string; // Attention-grabbing opening
    keyPoints: string[]; // 3-5 main points
    realExample: string; // Current, relevant example
    actionStep: string; // What they can do right now
  };
  engagement: {
    polls?: string[];
    quickQuiz?: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };
    practiceTask?: string;
  };
  xpReward: number;
  prerequisites?: string[];
}

export interface ModernModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  lessons: ModernLesson[];
  capstoneProject?: {
    title: string;
    description: string;
    deliverables: string[];
    xpReward: number;
  };
}

// Foundation Level - Updated for 2024
export const foundationCourse: ModernModule[] = [
  {
    id: 'money-evolution',
    title: 'The Evolution of Money',
    description: 'Understand why crypto exists by learning how money evolved',
    estimatedTime: '3 days',
    lessons: [
      {
        id: 'money-problems',
        title: 'Why Traditional Money is Broken',
        duration: '7 min',
        type: 'video',
        content: {
          hook: "💸 Your $100 today is worth $85 compared to 2020. Here's why crypto was invented...",
          keyPoints: [
            "Inflation erodes purchasing power (US inflation hit 9.1% in 2022)",
            "Banks control your money (can freeze accounts, limit transfers)",
            "International transfers are slow and expensive ($25+ fees, 3-5 days)",
            "2 billion people worldwide are unbanked"
          ],
          realExample: "In 2022, Canadian truckers had bank accounts frozen during protests. Bitcoin donations couldn't be stopped.",
          actionStep: "Check your bank's international transfer fees right now"
        },
        engagement: {
          quickQuiz: {
            question: "What percentage of the world's population is unbanked?",
            options: ["5%", "15%", "25%", "35%"],
            correct: 2,
            explanation: "About 1.7 billion adults worldwide lack access to basic banking services"
          }
        },
        xpReward: 25
      },
      {
        id: 'bitcoin-solution',
        title: 'How Bitcoin Solves These Problems',
        duration: '8 min',
        type: 'interactive',
        content: {
          hook: "🚀 Bitcoin just hit $73,000 in March 2024. But price isn't the real story...",
          keyPoints: [
            "Fixed supply of 21 million (no inflation possible)",
            "No central authority can freeze or control it",
            "Send money anywhere in 10 minutes for $1-5",
            "Works 24/7, no bank holidays or restrictions"
          ],
          realExample: "El Salvador made Bitcoin legal tender in 2021. Citizens can now receive remittances instantly instead of waiting days.",
          actionStep: "Download a Bitcoin price app and set up price alerts"
        },
        engagement: {
          practiceTask: "Use a Bitcoin fee calculator to compare sending $500 via Bitcoin vs. Western Union"
        },
        xpReward: 30
      },
      {
        id: 'blockchain-simple',
        title: 'Blockchain in 5 Minutes',
        duration: '5 min',
        type: 'interactive',
        content: {
          hook: "🔗 Imagine a notebook that everyone can see but no one can erase...",
          keyPoints: [
            "Blockchain = shared digital ledger that can't be changed",
            "Every transaction is verified by thousands of computers",
            "No single point of failure or control",
            "Transparent - anyone can verify the history"
          ],
          realExample: "You can see every Bitcoin transaction ever made at blockchain.info - including the first pizza purchase for 10,000 BTC!",
          actionStep: "Visit blockchain.info and explore the latest Bitcoin block"
        },
        engagement: {
          polls: [
            "What's the coolest thing about blockchain to you?",
            "Which industry do you think blockchain will disrupt most?"
          ]
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Essentials',
    description: 'Master the basics of digital currencies and wallets',
    estimatedTime: '4 days',
    lessons: [
      {
        id: 'wallet-security',
        title: 'Your Crypto Wallet: Digital Fort Knox',
        duration: '9 min',
        type: 'practice',
        content: {
          hook: "🔐 $3.8 billion in crypto was stolen in 2022. Here's how to protect yours...",
          keyPoints: [
            "Wallets store keys, not coins (coins live on blockchain)",
            "Seed phrase = master key to all your crypto",
            "Hot wallets (online) vs Cold wallets (offline)",
            "Never share your seed phrase with anyone, ever"
          ],
          realExample: "In 2024, a user lost $1M by entering their seed phrase on a fake MetaMask website. The real site is metamask.io",
          actionStep: "Download MetaMask and write down your seed phrase on paper (not digital)"
        },
        engagement: {
          practiceTask: "Set up a practice wallet with $10 and send it to a friend"
        },
        xpReward: 35
      },
      {
        id: 'first-transaction',
        title: 'Your First Crypto Transaction',
        duration: '6 min',
        type: 'practice',
        content: {
          hook: "💫 Ready to join the 420 million crypto users worldwide?",
          keyPoints: [
            "Always double-check wallet addresses (they're like bank account numbers)",
            "Start with small amounts to practice",
            "Transactions are irreversible - no 'undo' button",
            "Gas fees vary by network and time of day"
          ],
          realExample: "Ethereum gas fees can range from $1 to $100+ depending on network congestion. Use ethgasstation.info to check current rates.",
          actionStep: "Send $5 worth of crypto to yourself to practice"
        },
        engagement: {
          quickQuiz: {
            question: "What happens if you send crypto to the wrong address?",
            options: ["You can cancel it", "The bank will reverse it", "It's lost forever", "You get it back in 24 hours"],
            correct: 2,
            explanation: "Crypto transactions are irreversible. Always double-check addresses!"
          }
        },
        xpReward: 40
      }
    ],
    capstoneProject: {
      title: "Create Your Crypto Foundation",
      description: "Set up your first wallet and make your first transaction",
      deliverables: [
        "Set up a secure wallet with proper seed phrase backup",
        "Complete your first crypto transaction",
        "Join a crypto community (Discord/Telegram)",
        "Create a simple crypto tracking spreadsheet"
      ],
      xpReward: 100
    }
  }
];

// Beginner Level - Current Market Focus
export const beginnerCourse: ModernModule[] = [
  {
    id: 'crypto-landscape-2024',
    title: 'Crypto Landscape 2024',
    description: 'Navigate today\'s crypto ecosystem like a pro',
    estimatedTime: '5 days',
    lessons: [
      {
        id: 'top-cryptos-2024',
        title: 'Top 10 Cryptos You Need to Know',
        duration: '8 min',
        type: 'video',
        content: {
          hook: "🏆 Bitcoin ETFs launched in 2024, but which cryptos are actually being used?",
          keyPoints: [
            "Bitcoin (BTC): Digital gold, store of value, institutional adoption",
            "Ethereum (ETH): Smart contracts, DeFi, NFTs, most developers",
            "Solana (SOL): Fast, cheap transactions, growing ecosystem",
            "BNB: Binance ecosystem, largest crypto exchange"
          ],
          realExample: "Solana processed 65 billion transactions in 2023 vs Ethereum's 400 million, but Ethereum has $60B+ in DeFi vs Solana's $1B",
          actionStep: "Check current market caps on CoinMarketCap and note the top 5"
        },
        engagement: {
          polls: ["Which crypto do you think has the most potential?"]
        },
        xpReward: 30
      },
      {
        id: 'exchanges-2024',
        title: 'Best Crypto Exchanges Right Now',
        duration: '7 min',
        type: 'interactive',
        content: {
          hook: "🏪 FTX collapsed in 2022. Here's where to safely buy crypto in 2024...",
          keyPoints: [
            "Coinbase: Best for beginners, US-regulated, insurance",
            "Binance: Lowest fees, most coins, global leader",
            "Kraken: Strong security, good for advanced users",
            "DEXs like Uniswap: No KYC, but higher complexity"
          ],
          realExample: "After FTX's collapse, Coinbase saw $2B in deposits as users fled to regulated exchanges",
          actionStep: "Compare fees for buying $100 of Bitcoin on 3 different exchanges"
        },
        engagement: {
          practiceTask: "Create accounts on 2 exchanges and compare their interfaces"
        },
        xpReward: 35
      }
    ]
  }
];

// Interactive engagement features for modern learners
export const engagementFeatures = {
  microLearning: {
    maxLessonTime: '10 minutes',
    keyPointsLimit: 5,
    immediateApplication: true
  },
  
  realTimeRelevance: {
    currentPrices: true,
    latestNews: true,
    trendingTopics: true,
    marketUpdates: true
  },
  
  socialLearning: {
    peerDiscussion: true,
    sharedProgress: true,
    groupChallenges: true,
    mentorAccess: true
  },
  
  gamification: {
    instantXP: true,
    streakBonuses: true,
    achievementUnlocks: true,
    leaderboards: true
  }
};

// Content update schedule to keep material current
export const contentUpdateSchedule = {
  priceData: 'Real-time',
  marketExamples: 'Weekly',
  regulatoryUpdates: 'Monthly',
  technologyUpdates: 'Quarterly',
  courseStructure: 'Bi-annually'
};
