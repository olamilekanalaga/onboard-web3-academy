// Course Quiz Questions - Comprehensive tests for each course
// Questions are based on actual course content to ensure understanding

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'written' | 'short-answer';
  options?: string[]; // Only for multiple choice
  correctAnswer?: number; // Only for multiple choice
  sampleAnswer?: string; // For written questions - example of good answer
  keyPoints?: string[]; // Points that should be covered in written answers
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  timeLimit?: number; // In minutes, for written questions
}

// Foundation Course Quiz - Comprehensive Blockchain & Crypto Fundamentals
export const foundationQuiz: QuizQuestion[] = [
  {
    id: 'foundation-1',
    question: 'What is a blockchain?',
    type: 'multiple-choice',
    options: [
      'A type of cryptocurrency',
      'A distributed ledger that records transactions across multiple computers',
      'A mining software',
      'A digital wallet'
    ],
    correctAnswer: 1,
    explanation: 'A blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography.',
    difficulty: 'easy',
    points: 10,
    category: 'Blockchain Fundamentals'
  },
  {
    id: 'foundation-2',
    question: 'Which of these is NOT a key characteristic of blockchain technology?',
    type: 'multiple-choice',
    options: [
      'Decentralized - no single point of control',
      'Transparent - all transactions are visible',
      'Centralized - controlled by one authority',
      'Immutable - data cannot be easily altered'
    ],
    correctAnswer: 2,
    explanation: 'Blockchain is specifically designed to be decentralized, not centralized. Decentralization is one of its core features that eliminates single points of failure.',
    difficulty: 'easy',
    points: 10,
    category: 'Blockchain Fundamentals'
  },
  {
    id: 'foundation-3',
    question: 'What is the main difference between Bitcoin and Ethereum?',
    type: 'multiple-choice',
    options: [
      'Bitcoin is faster than Ethereum',
      'Bitcoin is for digital payments, Ethereum is a platform for smart contracts and dApps',
      'Bitcoin uses proof-of-stake, Ethereum uses proof-of-work',
      'Bitcoin is newer than Ethereum'
    ],
    correctAnswer: 1,
    explanation: 'Bitcoin was designed primarily as digital money and store of value, while Ethereum is a programmable blockchain platform that enables smart contracts and decentralized applications.',
    difficulty: 'medium',
    points: 15,
    category: 'Cryptocurrency Types'
  },
  {
    id: 'foundation-4',
    question: 'What is a private key in cryptocurrency?',
    type: 'multiple-choice',
    options: [
      'A password for your exchange account',
      'A secret number that allows you to control your cryptocurrency',
      'Your public wallet address',
      'A backup phrase that anyone can see'
    ],
    correctAnswer: 1,
    explanation: 'A private key is a secret cryptographic key that gives you control over your cryptocurrency. It must be kept secure as anyone with access to it can control your funds.',
    difficulty: 'medium',
    points: 15,
    category: 'Wallet Security'
  },
  {
    id: 'foundation-5',
    question: 'What is the difference between a hot wallet and a cold wallet?',
    type: 'multiple-choice',
    options: [
      'Hot wallets are more expensive than cold wallets',
      'Hot wallets are connected to the internet, cold wallets are offline',
      'Hot wallets store Bitcoin, cold wallets store altcoins',
      'There is no difference'
    ],
    correctAnswer: 1,
    explanation: 'Hot wallets are connected to the internet for convenience but are less secure, while cold wallets are offline storage solutions that provide better security for long-term storage.',
    difficulty: 'medium',
    points: 15,
    category: 'Wallet Types'
  },
  {
    id: 'foundation-6',
    question: 'Which of these cryptocurrencies is known as "digital gold"?',
    type: 'multiple-choice',
    options: [
      'Ethereum (ETH)',
      'Bitcoin (BTC)',
      'Litecoin (LTC)',
      'Cardano (ADA)'
    ],
    correctAnswer: 1,
    explanation: 'Bitcoin is often referred to as "digital gold" because it serves as a store of value and has a limited supply of 21 million coins, similar to how gold is a scarce precious metal.',
    difficulty: 'easy',
    points: 10,
    category: 'Cryptocurrency Types'
  },
  {
    id: 'foundation-7',
    question: 'What is a seed phrase (recovery phrase)?',
    type: 'multiple-choice',
    options: [
      'A password for your cryptocurrency exchange',
      'A backup method to restore access to your wallet',
      'A way to mine new cryptocurrency',
      'A type of smart contract'
    ],
    correctAnswer: 1,
    explanation: 'A seed phrase is a series of words (usually 12 or 24) that can be used to restore access to your cryptocurrency wallet if you lose your device or forget your password.',
    difficulty: 'medium',
    points: 15,
    category: 'Wallet Security'
  },
  {
    id: 'foundation-8',
    question: 'Which blockchain platform is primarily known for smart contracts and DeFi applications?',
    type: 'multiple-choice',
    options: [
      'Bitcoin',
      'Litecoin',
      'Ethereum',
      'Dogecoin'
    ],
    correctAnswer: 2,
    explanation: 'Ethereum is the leading platform for smart contracts and decentralized finance (DeFi) applications, enabling programmable money and decentralized applications.',
    difficulty: 'easy',
    points: 10,
    category: 'Blockchain Platforms'
  },
  {
    id: 'foundation-9',
    question: 'What is the most important security rule when managing cryptocurrency?',
    type: 'multiple-choice',
    options: [
      'Always use the same password for everything',
      'Share your private keys with trusted friends',
      'Never share your private keys or seed phrase with anyone',
      'Store everything on exchanges for safety'
    ],
    correctAnswer: 2,
    explanation: 'The golden rule of crypto security is to never share your private keys or seed phrase with anyone. These give complete control over your funds and should be kept absolutely secret.',
    difficulty: 'easy',
    points: 10,
    category: 'Security Best Practices'
  },
  {
    id: 'foundation-10',
    question: 'What advantage do cryptocurrencies have over traditional banking?',
    type: 'multiple-choice',
    options: [
      'They are completely risk-free',
      'They provide 24/7 global accessibility and lower fees for international transfers',
      'They are backed by government guarantees',
      'They never change in value'
    ],
    correctAnswer: 1,
    explanation: 'Cryptocurrencies operate 24/7 globally and typically have lower fees for international transfers compared to traditional banking, though they do come with their own risks like volatility.',
    difficulty: 'medium',
    points: 15,
    category: 'Crypto Advantages'
  },

  // WRITTEN QUESTIONS - Deep Understanding Assessment
  {
    id: 'foundation-written-1',
    question: 'Explain the concept of decentralization in blockchain technology. How does it differ from traditional centralized systems, and what are the main benefits and challenges of decentralization?',
    type: 'written',
    sampleAnswer: 'Decentralization in blockchain means that no single entity controls the network. Instead, control is distributed among many participants (nodes). Unlike traditional systems where banks or governments have central authority, blockchain networks operate through consensus mechanisms. Benefits include: no single point of failure, censorship resistance, global accessibility, and transparency. Challenges include: slower transaction speeds, higher energy consumption, governance difficulties, and potential for network splits.',
    keyPoints: [
      'Definition of decentralization',
      'Comparison with centralized systems',
      'Benefits: no single point of failure, censorship resistance',
      'Challenges: scalability, governance',
      'Real-world examples'
    ],
    explanation: 'This question tests deep understanding of blockchain\'s core principle and ability to analyze trade-offs.',
    difficulty: 'hard',
    points: 25,
    category: 'Blockchain Fundamentals',
    timeLimit: 10
  },

  {
    id: 'foundation-written-2',
    question: 'Compare and contrast Bitcoin and Ethereum. Discuss their different purposes, consensus mechanisms, and use cases. How do these differences affect their adoption and value propositions?',
    type: 'written',
    sampleAnswer: 'Bitcoin is primarily digital money and store of value, using Proof of Work consensus. Ethereum is a programmable blockchain platform enabling smart contracts and dApps, transitioning to Proof of Stake. Bitcoin focuses on security and scarcity (21M cap), while Ethereum prioritizes programmability and innovation. Bitcoin adoption is driven by institutional investment and inflation hedging. Ethereum adoption comes from DeFi, NFTs, and Web3 applications. Both serve different market needs.',
    keyPoints: [
      'Bitcoin: digital gold, store of value, PoW',
      'Ethereum: smart contracts, dApps, PoS transition',
      'Different use cases and target markets',
      'Adoption drivers for each',
      'Value propositions comparison'
    ],
    explanation: 'This assesses understanding of the two most important cryptocurrencies and their distinct roles.',
    difficulty: 'hard',
    points: 30,
    category: 'Cryptocurrency Types',
    timeLimit: 12
  },

  {
    id: 'foundation-written-3',
    question: 'Describe a comprehensive cryptocurrency security strategy. What are the different types of wallets, and how should someone protect their private keys and seed phrases? Include both technical and behavioral security measures.',
    type: 'written',
    sampleAnswer: 'A comprehensive security strategy includes: 1) Hardware wallets for large amounts (cold storage), 2) Hot wallets for daily use with small amounts, 3) Never sharing private keys/seed phrases, 4) Using strong passwords and 2FA, 5) Regular security audits, 6) Backup seed phrases in multiple secure locations, 7) Being cautious of phishing attempts, 8) Verifying addresses before transactions, 9) Using reputable exchanges, 10) Keeping software updated.',
    keyPoints: [
      'Hot vs cold wallet usage',
      'Private key protection',
      'Seed phrase backup strategies',
      'Phishing and scam awareness',
      'Multi-layered security approach'
    ],
    explanation: 'Security is crucial in crypto - this tests practical knowledge of protecting digital assets.',
    difficulty: 'medium',
    points: 20,
    category: 'Wallet Security',
    timeLimit: 8
  }
];

// DeFi Fundamentals Quiz - Comprehensive DeFi Knowledge Assessment
export const defiQuiz: QuizQuestion[] = [
  {
    id: 'defi-1',
    question: 'What does DeFi stand for?',
    type: 'multiple-choice',
    options: [
      'Digital Finance',
      'Decentralized Finance',
      'Distributed Finance',
      'Derivative Finance'
    ],
    correctAnswer: 1,
    explanation: 'DeFi stands for Decentralized Finance, which refers to financial services built on blockchain technology without traditional intermediaries.',
    difficulty: 'easy',
    points: 10,
    category: 'DeFi Basics'
  },
  {
    id: 'defi-2',
    question: 'What is a smart contract?',
    type: 'multiple-choice',
    options: [
      'A legal document stored digitally',
      'A self-executing contract with terms directly written into code',
      'A contract between smart people',
      'A mobile app for trading'
    ],
    correctAnswer: 1,
    explanation: 'A smart contract is a self-executing contract with the terms of the agreement directly written into lines of code, eliminating the need for intermediaries.',
    difficulty: 'medium',
    points: 15,
    category: 'Smart Contracts'
  },
  {
    id: 'defi-3',
    question: 'Which protocol is primarily used for lending and borrowing in DeFi?',
    type: 'multiple-choice',
    options: [
      'Uniswap',
      'Aave',
      'OpenSea',
      'MetaMask'
    ],
    correctAnswer: 1,
    explanation: 'Aave is one of the leading decentralized lending protocols that allows users to lend and borrow cryptocurrencies.',
    difficulty: 'medium',
    points: 15,
    category: 'DeFi Protocols'
  },
  {
    id: 'defi-4',
    question: 'What is the constant product formula used by Uniswap?',
    type: 'multiple-choice',
    options: [
      'x + y = k',
      'x * y = k',
      'x - y = k',
      'x / y = k'
    ],
    correctAnswer: 1,
    explanation: 'Uniswap uses the constant product formula x * y = k, where x and y are the quantities of two tokens in a pool, and k remains constant.',
    difficulty: 'hard',
    points: 20,
    category: 'AMM'
  },
  {
    id: 'defi-5',
    question: 'What is yield farming?',
    type: 'multiple-choice',
    options: [
      'Growing crops using blockchain technology',
      'Earning rewards by providing liquidity to DeFi protocols',
      'Mining cryptocurrency',
      'Buying and holding tokens'
    ],
    correctAnswer: 1,
    explanation: 'Yield farming involves providing liquidity to DeFi protocols in exchange for rewards, typically in the form of additional tokens or fees.',
    difficulty: 'medium',
    points: 15,
    category: 'Yield Farming'
  },
  {
    id: 'defi-6',
    question: 'What is impermanent loss?',
    type: 'multiple-choice',
    options: [
      'Losing your private keys',
      'The temporary decrease in value when providing liquidity compared to holding assets',
      'A permanent loss of funds',
      'Transaction fees'
    ],
    correctAnswer: 1,
    explanation: 'Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes, resulting in less value than if you had simply held the tokens.',
    difficulty: 'hard',
    points: 20,
    category: 'Liquidity Risks'
  },
  {
    id: 'defi-7',
    question: 'What is a governance token?',
    type: 'multiple-choice',
    options: [
      'A token that controls government policies',
      'A token that gives holders voting rights in protocol decisions',
      'A token used only for trading',
      'A token that represents ownership of a company'
    ],
    correctAnswer: 1,
    explanation: 'Governance tokens give holders the right to vote on protocol changes, parameter adjustments, and other important decisions in DeFi protocols.',
    difficulty: 'medium',
    points: 15,
    category: 'Governance'
  },

  // WRITTEN QUESTIONS - Deep DeFi Understanding
  {
    id: 'defi-written-1',
    question: 'Explain how Automated Market Makers (AMMs) work and compare them to traditional order book exchanges. Discuss the advantages and disadvantages of each system, including concepts like slippage, liquidity provision, and price discovery.',
    type: 'written',
    sampleAnswer: 'AMMs use mathematical formulas (like x*y=k) to determine prices automatically, while order books match buyers and sellers at specific prices. AMM advantages: 24/7 liquidity, anyone can provide liquidity, no need for market makers. Disadvantages: slippage on large trades, impermanent loss for LPs. Order books offer better price discovery and lower slippage for large trades but require active market making and can have liquidity gaps.',
    keyPoints: [
      'AMM formula explanation (x*y=k)',
      'Liquidity pools vs order matching',
      'Slippage comparison',
      'Liquidity provision differences',
      'Price discovery mechanisms'
    ],
    explanation: 'This tests deep understanding of core DeFi infrastructure and trade-offs.',
    difficulty: 'hard',
    points: 30,
    category: 'AMM Deep Dive',
    timeLimit: 15
  },

  {
    id: 'defi-written-2',
    question: 'Design a comprehensive yield farming strategy. Explain the different types of yields available in DeFi, associated risks, and how you would manage a portfolio across multiple protocols. Include risk management techniques and exit strategies.',
    type: 'written',
    sampleAnswer: 'A comprehensive strategy includes: 1) Stablecoin lending (low risk, 3-8% APY), 2) LP farming on major pairs (medium risk, 10-50% APY), 3) Governance token staking (medium risk), 4) New protocol farming (high risk, high reward). Risk management: diversify across protocols, monitor smart contract audits, set stop-losses, keep emergency funds. Exit strategies: gradual position reduction, profit-taking schedules, market condition triggers.',
    keyPoints: [
      'Different yield sources (lending, LP, staking, farming)',
      'Risk assessment framework',
      'Portfolio allocation strategy',
      'Risk management techniques',
      'Exit strategy planning'
    ],
    explanation: 'This assesses practical DeFi strategy development and risk management skills.',
    difficulty: 'hard',
    points: 35,
    category: 'Yield Strategy',
    timeLimit: 18
  },

  {
    id: 'defi-written-3',
    question: 'Analyze the risks in DeFi and explain how they differ from traditional finance risks. Cover smart contract risks, oracle failures, governance attacks, and regulatory risks. How would you mitigate these risks as a DeFi user?',
    type: 'written',
    sampleAnswer: 'DeFi risks include: Smart contract bugs (code vulnerabilities), Oracle failures (price feed manipulation), Governance attacks (token concentration), Regulatory uncertainty (changing laws), Liquidity risks (bank runs), Bridge risks (cross-chain). Mitigation: use audited protocols, diversify across platforms, monitor governance proposals, keep updated on regulations, maintain emergency funds, understand protocol mechanics before investing.',
    keyPoints: [
      'Smart contract and technical risks',
      'Oracle and price feed risks',
      'Governance and centralization risks',
      'Regulatory and compliance risks',
      'Risk mitigation strategies'
    ],
    explanation: 'This tests comprehensive understanding of DeFi risk landscape and practical risk management.',
    difficulty: 'hard',
    points: 25,
    category: 'Risk Management',
    timeLimit: 12
  }
];

// Degen Trading Quiz - Comprehensive High-Risk Trading Assessment
export const degenQuiz: QuizQuestion[] = [
  {
    id: 'degen-1',
    question: 'What is the most important rule in degen trading?',
    type: 'multiple-choice',
    options: [
      'Always use maximum leverage',
      'Never do your own research',
      'Only invest what you can afford to lose',
      'Follow every influencer recommendation'
    ],
    correctAnswer: 2,
    explanation: 'The golden rule of degen trading is to only invest what you can afford to lose completely, as these trades are extremely high-risk.',
    difficulty: 'easy',
    points: 10,
    category: 'Risk Management'
  },
  {
    id: 'degen-2',
    question: 'What does "aping in" mean?',
    options: [
      'Buying cryptocurrency related to apes',
      'Investing quickly without much research',
      'Using automated trading bots',
      'Copying other traders'
    ],
    correctAnswer: 1,
    explanation: '"Aping in" means investing in a project quickly and often impulsively, usually with minimal research, driven by FOMO or hype.',
    difficulty: 'easy',
    points: 10,
    category: 'Trading Slang'
  },
  {
    id: 'degen-3',
    question: 'What is a rug pull?',
    options: [
      'A profitable trading strategy',
      'When developers abandon a project and steal investor funds',
      'A type of technical analysis',
      'A market correction'
    ],
    correctAnswer: 1,
    explanation: 'A rug pull is a scam where developers abandon a project and run away with investor funds, often by removing liquidity or selling their tokens.',
    difficulty: 'medium',
    points: 15,
    category: 'Scam Awareness'
  },
  {
    id: 'degen-4',
    question: 'What should you check before investing in a new token?',
    options: [
      'Only the price chart',
      'Contract audit, team background, tokenomics, and liquidity',
      'Just the social media hype',
      'Only the website design'
    ],
    correctAnswer: 1,
    explanation: 'Before investing, always check the smart contract audit, team background, tokenomics, liquidity levels, and other fundamental factors.',
    difficulty: 'medium',
    points: 15,
    category: 'Due Diligence'
  },
  {
    id: 'degen-5',
    question: 'What is slippage in trading?',
    options: [
      'The difference between expected and actual trade execution price',
      'A trading fee',
      'A type of chart pattern',
      'Market volatility'
    ],
    correctAnswer: 0,
    explanation: 'Slippage is the difference between the expected price of a trade and the actual price at which it executes, often due to market movement or low liquidity.',
    difficulty: 'medium',
    points: 15,
    category: 'Trading Mechanics'
  }
];

// Advanced Trading Quiz
export const advancedTradingQuiz: QuizQuestion[] = [
  {
    id: 'advanced-1',
    question: 'What is a support level in technical analysis?',
    options: [
      'A price level where buying interest is strong enough to prevent further decline',
      'The highest price a token has reached',
      'A trading strategy',
      'A type of order'
    ],
    correctAnswer: 0,
    explanation: 'A support level is a price point where an asset tends to find buying interest, preventing the price from falling further.',
    difficulty: 'medium',
    points: 15,
    category: 'Technical Analysis'
  },
  {
    id: 'advanced-2',
    question: 'What is the RSI indicator used for?',
    options: [
      'Measuring trading volume',
      'Identifying overbought and oversold conditions',
      'Calculating profit margins',
      'Setting stop losses'
    ],
    correctAnswer: 1,
    explanation: 'The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of price changes to identify overbought and oversold conditions.',
    difficulty: 'hard',
    points: 20,
    category: 'Technical Indicators'
  },
  {
    id: 'advanced-3',
    question: 'What is a stop-loss order?',
    options: [
      'An order to buy at a specific price',
      'An order to sell when price reaches a predetermined level to limit losses',
      'An order to cancel all trades',
      'An order to increase position size'
    ],
    correctAnswer: 1,
    explanation: 'A stop-loss order is designed to limit an investor\'s loss on a position by automatically selling when the price reaches a predetermined level.',
    difficulty: 'medium',
    points: 15,
    category: 'Risk Management'
  }
];

// Development Course Quiz
export const developmentQuiz: QuizQuestion[] = [
  {
    id: 'dev-1',
    question: 'What programming language is primarily used for Ethereum smart contracts?',
    options: [
      'JavaScript',
      'Python',
      'Solidity',
      'Java'
    ],
    correctAnswer: 2,
    explanation: 'Solidity is the primary programming language for writing smart contracts on the Ethereum blockchain.',
    difficulty: 'easy',
    points: 10,
    category: 'Smart Contract Development'
  },
  {
    id: 'dev-2',
    question: 'What is gas in Ethereum?',
    options: [
      'A type of cryptocurrency',
      'The computational fee required to execute transactions and smart contracts',
      'A development tool',
      'A consensus mechanism'
    ],
    correctAnswer: 1,
    explanation: 'Gas is the fee required to conduct transactions or execute smart contracts on the Ethereum network, paid in ETH.',
    difficulty: 'medium',
    points: 15,
    category: 'Ethereum Basics'
  },
  {
    id: 'dev-3',
    question: 'What is Web3.js?',
    options: [
      'A new version of the internet',
      'A JavaScript library for interacting with Ethereum blockchain',
      'A web browser',
      'A cryptocurrency exchange'
    ],
    correctAnswer: 1,
    explanation: 'Web3.js is a JavaScript library that allows developers to interact with the Ethereum blockchain from web applications.',
    difficulty: 'medium',
    points: 15,
    category: 'Development Tools'
  }
];

// Import comprehensive quizzes for all courses
import { allCourseQuizzes } from './allCourseQuizzes';

// Export all quizzes - combining existing and new comprehensive quizzes
export const courseQuizzes = {
  foundation: foundationQuiz,
  'defi-fundamentals': defiQuiz,
  degen: allCourseQuizzes.degen,
  'advanced-trading': allCourseQuizzes['advanced-trading'],
  development: allCourseQuizzes.development,
  'nft-creation': allCourseQuizzes['nft-creation'],
  'content-creation': allCourseQuizzes['content-creation'],
  'web3-security': allCourseQuizzes['web3-security'],
  'dao-governance': allCourseQuizzes['dao-governance'],
  'web3-gaming': allCourseQuizzes['web3-gaming'],
  'crypto-tax': allCourseQuizzes['crypto-tax'],
  'web3-social': allCourseQuizzes['web3-social'],
};

// Quiz configuration
export const quizConfig = {
  passingScore: 70, // 70% required to pass
  timeLimit: 300, // 5 minutes in seconds
  maxRetakes: 3, // Maximum number of retakes allowed
  xpMultiplier: 2, // XP earned = points * multiplier
  bonusXP: {
    perfect: 200, // Bonus for 100% score
    excellent: 100, // Bonus for 90%+ score
  }
};

// Helper function to get quiz for a course
export const getQuizForCourse = (courseId: string): QuizQuestion[] => {
  return courseQuizzes[courseId as keyof typeof courseQuizzes] || [];
};

// Helper function to calculate XP earned
export const calculateQuizXP = (score: number, totalPoints: number): number => {
  if (score < quizConfig.passingScore) return 0;
  
  let xp = Math.floor((score / 100) * totalPoints * quizConfig.xpMultiplier);
  
  if (score === 100) {
    xp += quizConfig.bonusXP.perfect;
  } else if (score >= 90) {
    xp += quizConfig.bonusXP.excellent;
  }
  
  return xp;
};
