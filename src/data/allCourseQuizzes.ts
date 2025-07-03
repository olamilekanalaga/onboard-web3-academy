// COMPREHENSIVE QUIZZES FOR ALL 11 COURSES
// This file contains all the comprehensive quizzes with both multiple choice and written questions

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'written' | 'short-answer';
  options?: string[]; // Only for multiple choice
  correctAnswer?: number; // Only for multiple choice
  sampleAnswer?: string; // For written questions
  keyPoints?: string[]; // Points that should be covered in written answers
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  timeLimit?: number; // In minutes, for written questions
}

// 3. DEGEN TRADING QUIZ - Comprehensive High-Risk Trading
export const degenQuizComprehensive: QuizQuestion[] = [
  {
    id: 'degen-1',
    question: 'What is the most important rule in degen trading?',
    type: 'multiple-choice',
    options: [
      'Always use maximum leverage',
      'Never do your own research',
      'Only invest what you can afford to lose completely',
      'Follow every influencer recommendation'
    ],
    correctAnswer: 2,
    explanation: 'The golden rule of degen trading is to only risk money you can afford to lose entirely, as these trades are extremely high-risk.',
    difficulty: 'easy',
    points: 10,
    category: 'Risk Management'
  },
  {
    id: 'degen-2',
    question: 'What does "aping in" mean in crypto trading?',
    type: 'multiple-choice',
    options: [
      'Buying cryptocurrency related to apes',
      'Investing quickly without much research due to FOMO',
      'Using automated trading bots',
      'Copying other traders exactly'
    ],
    correctAnswer: 1,
    explanation: '"Aping in" means investing in a project quickly and impulsively, usually with minimal research, driven by FOMO or hype.',
    difficulty: 'easy',
    points: 10,
    category: 'Trading Psychology'
  },
  {
    id: 'degen-3',
    question: 'What is a rug pull?',
    type: 'multiple-choice',
    options: [
      'A profitable trading strategy',
      'When developers abandon a project and steal investor funds',
      'A type of technical analysis pattern',
      'A normal market correction'
    ],
    correctAnswer: 1,
    explanation: 'A rug pull is a scam where developers abandon a project and run away with investor funds, often by removing liquidity or selling their tokens.',
    difficulty: 'medium',
    points: 15,
    category: 'Scam Awareness'
  },
  {
    id: 'degen-4',
    question: 'What is slippage in trading?',
    type: 'multiple-choice',
    options: [
      'The profit you make from a trade',
      'The difference between expected and actual execution price',
      'The time it takes to execute a trade',
      'The fee charged by exchanges'
    ],
    correctAnswer: 1,
    explanation: 'Slippage is the difference between the expected price of a trade and the actual price at which it executes, often due to market volatility or low liquidity.',
    difficulty: 'medium',
    points: 15,
    category: 'Trading Mechanics'
  },
  {
    id: 'degen-5',
    question: 'What should you check before investing in a new altcoin?',
    type: 'multiple-choice',
    options: [
      'Only the price chart and social media hype',
      'Contract audit, team background, tokenomics, and liquidity',
      'Just the website design and whitepaper',
      'Only influencer recommendations'
    ],
    correctAnswer: 1,
    explanation: 'Before investing, always check smart contract audits, team background, tokenomics, liquidity levels, and other fundamental factors.',
    difficulty: 'medium',
    points: 15,
    category: 'Due Diligence'
  },
  {
    id: 'degen-6',
    question: 'What is a meme coin?',
    type: 'multiple-choice',
    options: [
      'A coin with serious utility and technology',
      'A cryptocurrency created as a joke or based on internet memes',
      'A stablecoin pegged to the dollar',
      'A coin used only for payments'
    ],
    correctAnswer: 1,
    explanation: 'Meme coins are cryptocurrencies created as jokes or based on internet memes, often with little to no utility but can gain value through community hype.',
    difficulty: 'easy',
    points: 10,
    category: 'Crypto Types'
  },

  // WRITTEN QUESTIONS - Deep Degen Trading Understanding
  {
    id: 'degen-written-1',
    question: 'Develop a comprehensive risk management strategy for high-risk altcoin trading. Include position sizing, stop-loss strategies, portfolio allocation, and psychological factors that affect degen trading decisions.',
    type: 'written',
    sampleAnswer: 'Risk management for degen trading: 1) Never risk more than 5-10% of portfolio per trade, 2) Set strict stop-losses at 20-30% down, 3) Take profits at 2x, 3x, 5x levels, 4) Diversify across 10+ positions, 5) Avoid FOMO and emotional decisions, 6) Set daily/weekly loss limits, 7) Keep detailed trading journal, 8) Use only "fun money" not needed for living expenses.',
    keyPoints: [
      'Position sizing rules (max 5-10% per trade)',
      'Stop-loss and take-profit strategies',
      'Portfolio diversification approach',
      'Emotional control and FOMO management',
      'Record keeping and analysis'
    ],
    explanation: 'This tests practical risk management skills essential for surviving high-risk trading.',
    difficulty: 'hard',
    points: 30,
    category: 'Risk Management Strategy',
    timeLimit: 15
  },

  {
    id: 'degen-written-2',
    question: 'Analyze the anatomy of a typical crypto scam (rug pull, exit scam, or pump and dump). Explain the warning signs investors should watch for and how to conduct proper due diligence before investing in new projects.',
    type: 'written',
    sampleAnswer: 'Crypto scam anatomy: 1) Anonymous team or fake profiles, 2) Unrealistic promises (1000x returns), 3) No working product or vague roadmap, 4) Heavy marketing focus over development, 5) Locked liquidity for short periods, 6) Large team token allocations. Due diligence: verify team identities, check contract audits, analyze tokenomics, test product functionality, review GitHub activity, check community sentiment, verify partnerships.',
    keyPoints: [
      'Common scam patterns and red flags',
      'Team verification and background checks',
      'Technical due diligence (contracts, audits)',
      'Tokenomics analysis',
      'Community and social proof verification'
    ],
    explanation: 'This assesses ability to identify and avoid common crypto scams through proper research.',
    difficulty: 'hard',
    points: 25,
    category: 'Scam Prevention',
    timeLimit: 12
  }
];

// 4. NFT CREATION QUIZ - Comprehensive NFT Knowledge
export const nftCreationQuiz: QuizQuestion[] = [
  {
    id: 'nft-1',
    question: 'What does NFT stand for?',
    type: 'multiple-choice',
    options: [
      'New Financial Token',
      'Non-Fungible Token',
      'Network File Transfer',
      'Next Future Technology'
    ],
    correctAnswer: 1,
    explanation: 'NFT stands for Non-Fungible Token, meaning each token is unique and cannot be replaced with something else.',
    difficulty: 'easy',
    points: 10,
    category: 'NFT Basics'
  },
  {
    id: 'nft-2',
    question: 'Which blockchain is most commonly used for NFTs?',
    type: 'multiple-choice',
    options: [
      'Bitcoin',
      'Ethereum',
      'Litecoin',
      'Dogecoin'
    ],
    correctAnswer: 1,
    explanation: 'Ethereum is the most popular blockchain for NFTs due to its smart contract capabilities and established ecosystem.',
    difficulty: 'easy',
    points: 10,
    category: 'Blockchain Platforms'
  },
  {
    id: 'nft-3',
    question: 'What is the most popular NFT marketplace?',
    type: 'multiple-choice',
    options: [
      'Amazon',
      'eBay',
      'OpenSea',
      'Etsy'
    ],
    correctAnswer: 2,
    explanation: 'OpenSea is currently the largest and most popular NFT marketplace for buying, selling, and trading NFTs.',
    difficulty: 'easy',
    points: 10,
    category: 'NFT Marketplaces'
  },
  {
    id: 'nft-4',
    question: 'What is minting an NFT?',
    type: 'multiple-choice',
    options: [
      'Buying an existing NFT',
      'Creating a new NFT on the blockchain',
      'Selling an NFT',
      'Copying an NFT'
    ],
    correctAnswer: 1,
    explanation: 'Minting an NFT means creating a new, unique token on the blockchain that represents ownership of a digital asset.',
    difficulty: 'medium',
    points: 15,
    category: 'NFT Creation'
  },
  {
    id: 'nft-5',
    question: 'What are gas fees in NFT transactions?',
    type: 'multiple-choice',
    options: [
      'The cost of the NFT artwork',
      'Transaction fees paid to blockchain miners/validators',
      'Marketplace commission fees',
      'Artist royalty fees'
    ],
    correctAnswer: 1,
    explanation: 'Gas fees are transaction costs paid to miners or validators for processing blockchain transactions, including NFT minting and transfers.',
    difficulty: 'medium',
    points: 15,
    category: 'Blockchain Fees'
  },

  // WRITTEN QUESTIONS
  {
    id: 'nft-written-1',
    question: 'Design a comprehensive NFT project launch strategy. Include artwork creation, smart contract development, community building, marketing, and post-launch sustainability plans.',
    type: 'written',
    sampleAnswer: 'NFT project strategy: 1) Unique art concept with strong narrative, 2) Professional smart contract with royalties and utilities, 3) Build Discord/Twitter community pre-launch, 4) Collaborate with influencers and other projects, 5) Fair mint pricing and whitelist system, 6) Post-launch: regular updates, holder benefits, roadmap execution, 7) Long-term: expand to gaming, metaverse, or physical products.',
    keyPoints: [
      'Unique artistic vision and concept',
      'Technical implementation (smart contracts)',
      'Community building and engagement',
      'Marketing and launch strategy',
      'Long-term sustainability and utility'
    ],
    explanation: 'This tests comprehensive understanding of successful NFT project development.',
    difficulty: 'hard',
    points: 30,
    category: 'Project Strategy',
    timeLimit: 18
  }
];

// 5. CONTENT CREATION QUIZ - Web3 Content Strategy
export const contentCreationQuiz: QuizQuestion[] = [
  {
    id: 'content-1',
    question: 'What is the most important factor for Web3 content success?',
    type: 'multiple-choice',
    options: [
      'Having expensive equipment',
      'Providing educational value and building trust',
      'Posting frequently without strategy',
      'Only focusing on price predictions'
    ],
    correctAnswer: 1,
    explanation: 'In Web3, trust and educational value are paramount due to the technical complexity and scam prevalence in the space.',
    difficulty: 'medium',
    points: 15,
    category: 'Content Strategy'
  },
  {
    id: 'content-2',
    question: 'Which platform is best for long-form crypto education content?',
    type: 'multiple-choice',
    options: [
      'TikTok only',
      'YouTube and Medium',
      'Instagram Stories only',
      'Twitter threads only'
    ],
    correctAnswer: 1,
    explanation: 'YouTube and Medium are ideal for long-form educational content that can properly explain complex Web3 concepts.',
    difficulty: 'easy',
    points: 10,
    category: 'Platform Strategy'
  },

  // WRITTEN QUESTION
  {
    id: 'content-written-1',
    question: 'Create a comprehensive Web3 content strategy for building an audience and monetizing through the creator economy. Include platform selection, content types, audience building, and revenue streams.',
    type: 'written',
    sampleAnswer: 'Web3 content strategy: 1) Multi-platform approach (YouTube for education, Twitter for news, Discord for community), 2) Content mix: tutorials, market analysis, project reviews, beginner guides, 3) Build trust through transparency and accuracy, 4) Revenue: sponsorships, affiliate marketing, NFT sales, token launches, courses, consulting, 5) Engage with community, collaborate with other creators, attend events.',
    keyPoints: [
      'Multi-platform content distribution',
      'Educational and valuable content types',
      'Trust building and community engagement',
      'Diverse monetization strategies',
      'Long-term brand building'
    ],
    explanation: 'This tests understanding of building a sustainable Web3 content business.',
    difficulty: 'hard',
    points: 25,
    category: 'Creator Economy',
    timeLimit: 15
  }
];

// 6. ADVANCED TRADING QUIZ - Professional Trading Strategies
export const advancedTradingQuiz: QuizQuestion[] = [
  {
    id: 'trading-1',
    question: 'What is technical analysis?',
    type: 'multiple-choice',
    options: [
      'Analyzing the technology behind a cryptocurrency',
      'Using price charts and indicators to predict future price movements',
      'Reading news and social media sentiment',
      'Analyzing the development team'
    ],
    correctAnswer: 1,
    explanation: 'Technical analysis involves studying price charts, patterns, and indicators to predict future price movements.',
    difficulty: 'easy',
    points: 10,
    category: 'Trading Fundamentals'
  },
  {
    id: 'trading-2',
    question: 'What is a support level?',
    type: 'multiple-choice',
    options: [
      'A price level where buying pressure typically increases',
      'A price level where selling pressure increases',
      'The highest price ever reached',
      'The current market price'
    ],
    correctAnswer: 0,
    explanation: 'A support level is a price point where buying pressure typically increases, preventing the price from falling further.',
    difficulty: 'medium',
    points: 15,
    category: 'Technical Analysis'
  },
  {
    id: 'trading-3',
    question: 'What is leverage in trading?',
    type: 'multiple-choice',
    options: [
      'Using borrowed money to increase position size',
      'A type of cryptocurrency',
      'A trading strategy',
      'A market indicator'
    ],
    correctAnswer: 0,
    explanation: 'Leverage allows traders to control larger positions with smaller amounts of capital by borrowing money.',
    difficulty: 'medium',
    points: 15,
    category: 'Risk Management'
  },

  // WRITTEN QUESTION
  {
    id: 'trading-written-1',
    question: 'Develop a comprehensive trading plan including risk management, position sizing, entry/exit strategies, and psychological factors. Explain how you would backtest and optimize this strategy.',
    type: 'written',
    sampleAnswer: 'Trading plan: 1) Risk max 2% per trade, 2) Use 2:1 risk/reward ratio minimum, 3) Combine technical indicators (RSI, MACD, support/resistance), 4) Set stop-losses before entering, 5) Take partial profits at targets, 6) Keep trading journal, 7) Backtest on historical data, 8) Paper trade before live implementation, 9) Manage emotions through position sizing, 10) Regular strategy review and optimization.',
    keyPoints: [
      'Risk management rules and position sizing',
      'Entry and exit criteria',
      'Technical analysis methodology',
      'Backtesting and optimization process',
      'Psychological and emotional control'
    ],
    explanation: 'This tests ability to create a systematic, professional trading approach.',
    difficulty: 'hard',
    points: 30,
    category: 'Trading Strategy',
    timeLimit: 20
  }
];

// 7. BLOCKCHAIN DEVELOPMENT QUIZ - Smart Contract & dApp Development
export const developmentQuiz: QuizQuestion[] = [
  {
    id: 'dev-1',
    question: 'What programming language is primarily used for Ethereum smart contracts?',
    type: 'multiple-choice',
    options: [
      'JavaScript',
      'Python',
      'Solidity',
      'Java'
    ],
    correctAnswer: 2,
    explanation: 'Solidity is the primary programming language for writing smart contracts on Ethereum.',
    difficulty: 'easy',
    points: 10,
    category: 'Programming Languages'
  },
  {
    id: 'dev-2',
    question: 'What is a smart contract?',
    type: 'multiple-choice',
    options: [
      'A legal document stored digitally',
      'Self-executing code with terms directly written into the blockchain',
      'A mobile app for trading',
      'A type of cryptocurrency'
    ],
    correctAnswer: 1,
    explanation: 'A smart contract is self-executing code with terms directly written into the blockchain, eliminating need for intermediaries.',
    difficulty: 'medium',
    points: 15,
    category: 'Smart Contracts'
  },
  {
    id: 'dev-3',
    question: 'What is a dApp?',
    type: 'multiple-choice',
    options: [
      'A mobile application',
      'A decentralized application running on blockchain',
      'A trading platform',
      'A type of cryptocurrency'
    ],
    correctAnswer: 1,
    explanation: 'A dApp (decentralized application) is an application that runs on a blockchain network rather than centralized servers.',
    difficulty: 'medium',
    points: 15,
    category: 'dApp Development'
  },

  // WRITTEN QUESTION
  {
    id: 'dev-written-1',
    question: 'Design the architecture for a complete DeFi lending protocol. Include smart contract structure, security considerations, user interface design, and deployment strategy.',
    type: 'written',
    sampleAnswer: 'DeFi lending protocol architecture: 1) Core contracts: LendingPool, InterestRateModel, PriceOracle, 2) Security: Multi-sig governance, time locks, audit by multiple firms, 3) Frontend: React/Next.js with Web3 integration, 4) Testing: Comprehensive unit tests, integration tests, mainnet fork testing, 5) Deployment: Testnet first, gradual mainnet rollout, 6) Monitoring: Real-time alerts, dashboard for key metrics.',
    keyPoints: [
      'Smart contract architecture and design',
      'Security best practices and auditing',
      'Frontend development and Web3 integration',
      'Testing and deployment strategies',
      'Monitoring and maintenance'
    ],
    explanation: 'This tests comprehensive blockchain development skills from concept to production.',
    difficulty: 'hard',
    points: 35,
    category: 'Full Stack Development',
    timeLimit: 25
  }
];

// 8. WEB3 SECURITY QUIZ - Blockchain Security & Best Practices
export const web3SecurityQuiz: QuizQuestion[] = [
  {
    id: 'security-1',
    question: 'What is the most common type of smart contract vulnerability?',
    type: 'multiple-choice',
    options: [
      'Reentrancy attacks',
      'Slow transaction speed',
      'High gas fees',
      'User interface bugs'
    ],
    correctAnswer: 0,
    explanation: 'Reentrancy attacks are among the most common and dangerous smart contract vulnerabilities, allowing attackers to drain funds.',
    difficulty: 'medium',
    points: 15,
    category: 'Smart Contract Security'
  },
  {
    id: 'security-2',
    question: 'What is a multi-signature wallet?',
    type: 'multiple-choice',
    options: [
      'A wallet that supports multiple cryptocurrencies',
      'A wallet requiring multiple private keys to authorize transactions',
      'A wallet with multiple user interfaces',
      'A wallet that can be used on multiple devices'
    ],
    correctAnswer: 1,
    explanation: 'A multi-signature wallet requires multiple private keys to authorize transactions, providing enhanced security.',
    difficulty: 'medium',
    points: 15,
    category: 'Wallet Security'
  },

  // WRITTEN QUESTION
  {
    id: 'security-written-1',
    question: 'Create a comprehensive Web3 security framework for a DeFi protocol. Include smart contract security, operational security, user protection, and incident response procedures.',
    type: 'written',
    sampleAnswer: 'Web3 security framework: 1) Smart contracts: Multiple audits, formal verification, bug bounties, time locks, 2) Operational: Multi-sig governance, hardware security modules, secure key management, 3) User protection: Educational resources, phishing protection, transaction simulation, 4) Incident response: Emergency pause mechanisms, communication plans, recovery procedures, insurance coverage.',
    keyPoints: [
      'Smart contract security measures',
      'Operational security protocols',
      'User education and protection',
      'Incident response and recovery',
      'Continuous monitoring and updates'
    ],
    explanation: 'This tests comprehensive understanding of Web3 security across all layers.',
    difficulty: 'hard',
    points: 30,
    category: 'Security Framework',
    timeLimit: 18
  }
];

// 9. DAO GOVERNANCE QUIZ - Decentralized Autonomous Organizations
export const daoGovernanceQuiz: QuizQuestion[] = [
  {
    id: 'dao-1',
    question: 'What does DAO stand for?',
    type: 'multiple-choice',
    options: [
      'Digital Asset Organization',
      'Decentralized Autonomous Organization',
      'Distributed Application Operation',
      'Data Analysis Organization'
    ],
    correctAnswer: 1,
    explanation: 'DAO stands for Decentralized Autonomous Organization - an organization governed by smart contracts and token holders.',
    difficulty: 'easy',
    points: 10,
    category: 'DAO Basics'
  },
  {
    id: 'dao-2',
    question: 'How do DAO members typically make decisions?',
    type: 'multiple-choice',
    options: [
      'Through a CEO and board of directors',
      'Through token-based voting on proposals',
      'Through random selection',
      'Through external consultants'
    ],
    correctAnswer: 1,
    explanation: 'DAO members make decisions through token-based voting, where governance tokens represent voting power on proposals.',
    difficulty: 'medium',
    points: 15,
    category: 'Governance Mechanisms'
  },

  // WRITTEN QUESTION
  {
    id: 'dao-written-1',
    question: 'Design a governance framework for a new DAO. Include token distribution, voting mechanisms, proposal processes, and conflict resolution. Address potential governance attacks and centralization risks.',
    type: 'written',
    sampleAnswer: 'DAO governance framework: 1) Token distribution: Fair launch, community allocation, team vesting, 2) Voting: Quadratic voting, minimum quorum, time-locked proposals, 3) Proposals: Community discussion, formal submission, implementation delay, 4) Conflict resolution: Arbitration mechanisms, appeals process, 5) Security: Prevent governance attacks through voting delays, token distribution limits, multi-sig execution.',
    keyPoints: [
      'Token economics and distribution',
      'Voting mechanisms and quorum requirements',
      'Proposal lifecycle and implementation',
      'Conflict resolution procedures',
      'Security against governance attacks'
    ],
    explanation: 'This tests understanding of designing effective and secure DAO governance systems.',
    difficulty: 'hard',
    points: 30,
    category: 'Governance Design',
    timeLimit: 20
  }
];

// 10. WEB3 GAMING QUIZ - Blockchain Gaming & Play-to-Earn
export const web3GamingQuiz: QuizQuestion[] = [
  {
    id: 'gaming-1',
    question: 'What is Play-to-Earn (P2E) gaming?',
    type: 'multiple-choice',
    options: [
      'Playing games to earn traditional money',
      'Playing blockchain games to earn cryptocurrency and NFTs',
      'Playing games to earn experience points',
      'Playing games to earn achievements'
    ],
    correctAnswer: 1,
    explanation: 'Play-to-Earn gaming allows players to earn cryptocurrency tokens and NFTs through gameplay in blockchain-based games.',
    difficulty: 'easy',
    points: 10,
    category: 'Gaming Models'
  },
  {
    id: 'gaming-2',
    question: 'What are gaming NFTs typically used for?',
    type: 'multiple-choice',
    options: [
      'Only for display purposes',
      'In-game items, characters, and assets that players truly own',
      'Just for trading on marketplaces',
      'Only for game developers'
    ],
    correctAnswer: 1,
    explanation: 'Gaming NFTs represent in-game items, characters, and assets that players truly own and can trade or use across compatible games.',
    difficulty: 'medium',
    points: 15,
    category: 'Gaming NFTs'
  },

  // WRITTEN QUESTION
  {
    id: 'gaming-written-1',
    question: 'Design a sustainable Play-to-Earn game economy. Include token mechanics, NFT integration, player incentives, and long-term sustainability measures to prevent economic collapse.',
    type: 'written',
    sampleAnswer: 'P2E game economy: 1) Dual token system: governance token + utility token, 2) NFT assets: characters, items, land with varying rarities, 3) Earning mechanisms: PvP rewards, quest completion, staking, breeding, 4) Sustainability: Token burning mechanisms, skill-based rewards, regular content updates, 5) Balance: Prevent inflation through sinks, limit earning rates, encourage long-term engagement over quick profits.',
    keyPoints: [
      'Token economics and dual-token systems',
      'NFT integration and utility',
      'Player earning mechanisms',
      'Economic sustainability measures',
      'Long-term engagement strategies'
    ],
    explanation: 'This tests understanding of creating balanced and sustainable blockchain game economies.',
    difficulty: 'hard',
    points: 30,
    category: 'Game Economics',
    timeLimit: 18
  }
];

// 11. CRYPTO TAX QUIZ - Cryptocurrency Taxation & Compliance
export const cryptoTaxQuiz: QuizQuestion[] = [
  {
    id: 'tax-1',
    question: 'In most countries, how are cryptocurrency gains typically taxed?',
    type: 'multiple-choice',
    options: [
      'They are not taxed at all',
      'As capital gains when sold or exchanged',
      'Only as income tax',
      'Only when converted to fiat currency'
    ],
    correctAnswer: 1,
    explanation: 'In most countries, cryptocurrency gains are taxed as capital gains when sold, exchanged, or used to purchase goods/services.',
    difficulty: 'medium',
    points: 15,
    category: 'Tax Fundamentals'
  },
  {
    id: 'tax-2',
    question: 'What is a taxable event in cryptocurrency?',
    type: 'multiple-choice',
    options: [
      'Only buying cryptocurrency',
      'Selling, trading, or using crypto for purchases',
      'Only holding cryptocurrency',
      'Only mining cryptocurrency'
    ],
    correctAnswer: 1,
    explanation: 'Taxable events include selling crypto for fiat, trading one crypto for another, using crypto for purchases, and receiving crypto as income.',
    difficulty: 'medium',
    points: 15,
    category: 'Taxable Events'
  },

  // WRITTEN QUESTION
  {
    id: 'tax-written-1',
    question: 'Create a comprehensive cryptocurrency tax strategy for a DeFi investor. Include record-keeping, tax optimization techniques, and compliance considerations across different jurisdictions.',
    type: 'written',
    sampleAnswer: 'Crypto tax strategy: 1) Record keeping: Track all transactions, costs basis, dates, purposes, 2) Tax optimization: FIFO/LIFO methods, tax-loss harvesting, long-term holding, 3) DeFi considerations: LP tokens, yield farming, governance tokens, 4) Compliance: Regular reporting, professional consultation, jurisdiction-specific rules, 5) Tools: Use crypto tax software, maintain detailed spreadsheets, save all transaction records.',
    keyPoints: [
      'Comprehensive record-keeping systems',
      'Tax optimization strategies',
      'DeFi-specific tax considerations',
      'Multi-jurisdiction compliance',
      'Professional consultation and tools'
    ],
    explanation: 'This tests practical knowledge of managing cryptocurrency tax obligations effectively.',
    difficulty: 'hard',
    points: 25,
    category: 'Tax Strategy',
    timeLimit: 15
  }
];

// 12. WEB3 SOCIAL QUIZ - Decentralized Social Media & Community
export const web3SocialQuiz: QuizQuestion[] = [
  {
    id: 'social-1',
    question: 'What is the main advantage of decentralized social media?',
    type: 'multiple-choice',
    options: [
      'Faster loading times',
      'User ownership of data and resistance to censorship',
      'Better graphics and design',
      'Lower internet costs'
    ],
    correctAnswer: 1,
    explanation: 'Decentralized social media gives users ownership of their data and provides resistance to censorship and platform control.',
    difficulty: 'medium',
    points: 15,
    category: 'Decentralized Social'
  },
  {
    id: 'social-2',
    question: 'What are social tokens?',
    type: 'multiple-choice',
    options: [
      'Tokens used only for social media advertising',
      'Cryptocurrency tokens that represent social capital or community membership',
      'Tokens that can only be used on Facebook',
      'Government-issued social security tokens'
    ],
    correctAnswer: 1,
    explanation: 'Social tokens are cryptocurrency tokens that represent social capital, community membership, or creator economy participation.',
    difficulty: 'medium',
    points: 15,
    category: 'Social Tokens'
  },

  // WRITTEN QUESTION
  {
    id: 'social-written-1',
    question: 'Design a Web3 social platform that addresses the problems of traditional social media. Include decentralization, user ownership, monetization, and community governance features.',
    type: 'written',
    sampleAnswer: 'Web3 social platform: 1) Decentralized storage: IPFS for content, blockchain for social graph, 2) User ownership: Users control data, portable profiles, 3) Monetization: Creator tokens, NFT content, tip systems, 4) Governance: Community voting on platform rules, transparent moderation, 5) Features: Censorship resistance, algorithmic choice, cross-platform compatibility, privacy controls.',
    keyPoints: [
      'Decentralized architecture and data ownership',
      'Creator monetization mechanisms',
      'Community governance and moderation',
      'Privacy and censorship resistance',
      'Interoperability and user control'
    ],
    explanation: 'This tests understanding of building user-centric, decentralized social platforms.',
    difficulty: 'hard',
    points: 30,
    category: 'Platform Design',
    timeLimit: 20
  }
];

// Export all comprehensive quizzes
export const allCourseQuizzes = {
  degen: degenQuizComprehensive,
  'nft-creation': nftCreationQuiz,
  'content-creation': contentCreationQuiz,
  'advanced-trading': advancedTradingQuiz,
  development: developmentQuiz,
  'web3-security': web3SecurityQuiz,
  'dao-governance': daoGovernanceQuiz,
  'web3-gaming': web3GamingQuiz,
  'crypto-tax': cryptoTaxQuiz,
  'web3-social': web3SocialQuiz
};
