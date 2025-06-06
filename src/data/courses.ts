
// Enhanced interfaces for the comprehensive crypto education platform

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface PracticalTask {
  title: string;
  description: string;
  instructions: string[];
  estimatedTime: string;
  tools?: string[];
  resources?: string[];
  completionCriteria: string[];
  points: number;
}

export interface InteractiveContent {
  type: 'video' | 'infographic' | 'simulator' | 'calculator' | 'podcast';
  title: string;
  url?: string;
  description: string;
  duration?: string;
  interactive?: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  duration: string;
  content: string;
  keyTakeaways: string[];
  practicalTask?: PracticalTask;
  quiz?: Quiz;
  interactiveContent?: InteractiveContent[];
  prerequisites?: string[];
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  estimatedTime: string;
  xpReward: number;
  badge?: {
    name: string;
    icon: string;
    description: string;
  };
  practicalProject?: {
    title: string;
    description: string;
    requirements: string[];
    deliverables: string[];
    estimatedTime: string;
    xpReward: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  modules: Module[];
  level: 'Foundation' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  color: string;
  gradient: string;
  icon: any;
  prerequisites?: string[];
  learningOutcomes: string[];
  totalXP: number;
  difficulty: number; // 1-5 scale
  category: 'fundamentals' | 'trading' | 'defi' | 'development' | 'security' | 'governance';
  skills: string[];
  certification?: {
    available: boolean;
    requirements: string[];
    credentialName: string;
  };
  industryPartners?: string[];
  careerPaths?: string[];
}

// Import modern courses
import { modernCourses } from './modernCourses';

// Comprehensive crypto education platform courses
export const courses: Record<string, Course> = {
  // Include modern courses first
  ...modernCourses,
  // FOUNDATION LEVEL (Week 1-2)
  foundation: {
    id: "foundation",
    title: "Crypto Foundation: What is Money?",
    description: "Start your crypto journey by understanding the fundamentals of money and digital currency",
    longDescription: "Begin with the basics - understand what money really is, how traditional finance works, and why digital currencies were created. Perfect for complete beginners.",
    level: "Foundation",
    duration: "2 weeks",
    color: "bg-emerald-500",
    gradient: "from-emerald-400 to-emerald-600",
    icon: "Coins",
    category: "fundamentals",
    difficulty: 1,
    totalXP: 500,
    skills: ["Financial Literacy", "Digital Currency Basics", "Economic Principles"],
    learningOutcomes: [
      "Understand the history and evolution of money",
      "Grasp the difference between traditional and digital currency",
      "Learn basic economic principles behind cryptocurrencies",
      "Understand the problems crypto aims to solve",
      "Get familiar with essential terminology"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Pass final assessment with 80%"],
      credentialName: "Crypto Foundation Certificate"
    },
    modules: [
      {
        id: 1,
        title: "What is Money? Traditional vs Digital",
        description: "Understand the fundamental concept of money and how digital currencies evolved",
        estimatedTime: "1 week",
        xpReward: 150,
        badge: {
          name: "Money Master",
          icon: "💰",
          description: "Completed the fundamentals of money and currency"
        },
        chapters: [
          {
            id: 1,
            title: "The History and Evolution of Money",
            duration: "20 min",
            difficulty: "easy",
            xpReward: 25,
            tags: ["history", "economics", "fundamentals"],
            content: `Money is one of humanity's greatest inventions. But what exactly is money, and how did we get from bartering chickens to digital currencies?

**The Evolution of Money:**

**1. Barter System (Pre-3000 BC)**
- Direct exchange of goods and services
- Problems: Double coincidence of wants, no standard value
- Example: Trading 5 chickens for 1 goat

**2. Commodity Money (3000 BC - 1000 AD)**
- Items with intrinsic value used as currency
- Examples: Salt, shells, cattle, precious metals
- Gold and silver became dominant due to durability and scarcity

**3. Representative Money (1000 AD - 1971)**
- Paper money backed by precious metals
- Gold standard: Each dollar could be exchanged for gold
- Easier to transport and divide than physical gold

**4. Fiat Money (1971 - Present)**
- Currency not backed by physical commodities
- Value derived from government decree and public trust
- Examples: US Dollar, Euro, Japanese Yen

**5. Digital Money (1990s - Present)**
- Electronic representation of fiat currency
- Credit cards, online banking, digital wallets
- Still controlled by central authorities

**6. Cryptocurrency (2009 - Present)**
- Decentralized digital currency
- No central authority or government control
- Secured by cryptography and blockchain technology

**Key Properties of Good Money:**
- **Durability**: Must last over time
- **Portability**: Easy to transport
- **Divisibility**: Can be broken into smaller units
- **Uniformity**: Each unit is identical
- **Limited Supply**: Scarcity maintains value
- **Acceptability**: Widely accepted for transactions

**Why Digital Currency Emerged:**
Traditional money systems have limitations:
- Central control and potential manipulation
- High transaction fees for international transfers
- Exclusion of unbanked populations
- Inflation eroding purchasing power
- Lack of transparency in monetary policy

Digital currencies like Bitcoin were created to address these issues by providing:
- Decentralized control
- Lower transaction costs
- Global accessibility
- Transparent monetary policy
- Protection against inflation (limited supply)`,
            keyTakeaways: [
              "Money evolved from barter to digital currencies over thousands of years",
              "Each form of money solved problems of the previous system",
              "Good money must be durable, portable, divisible, uniform, scarce, and acceptable",
              "Digital currencies emerged to solve problems with traditional fiat money",
              "Cryptocurrencies represent the latest evolution in monetary systems"
            ],
            practicalTask: {
              title: "Money Timeline Research",
              description: "Create a visual timeline of money's evolution in your region",
              instructions: [
                "Research the history of currency in your country",
                "Identify 5-7 major milestones in your local monetary history",
                "Create a simple timeline (digital or hand-drawn)",
                "Include one interesting fact about each milestone"
              ],
              estimatedTime: "30 minutes",
              completionCriteria: [
                "Timeline includes at least 5 historical milestones",
                "Each milestone has a brief description",
                "Timeline is visually organized and easy to read"
              ],
              points: 15
            },
            quiz: {
              question: "What is the main advantage of cryptocurrency over traditional fiat money?",
              options: [
                "It's always more valuable",
                "It's completely anonymous",
                "It operates without central authority control",
                "It can't be stolen"
              ],
              correctAnswer: 2,
              explanation: "The main advantage of cryptocurrency is decentralization - it operates without central authority control, unlike fiat money which is controlled by governments and central banks.",
              difficulty: "easy",
              points: 10
            },
            interactiveContent: [
              {
                type: "infographic",
                title: "Evolution of Money Visual Guide",
                description: "Interactive timeline showing the progression from barter to cryptocurrency",
                interactive: true
              }
            ]
          },
          {
            id: 2,
            title: "Introduction to Blockchain Technology",
            duration: "25 min",
            difficulty: "easy",
            xpReward: 30,
            tags: ["blockchain", "technology", "fundamentals"],
            content: `Now that you understand money's evolution, let's explore the technology that makes cryptocurrencies possible: blockchain.

**What is Blockchain?**
Blockchain is a revolutionary technology that creates a permanent, unchangeable record of transactions across multiple computers. Think of it as a digital ledger that everyone can see, but no one can tamper with.

**Simple Analogy:**
Imagine a classroom where every student has an identical notebook. When someone wants to make a transaction, they announce it to the class. Everyone writes it down only if the majority agrees it's valid. Once written, it can never be erased. This is essentially how blockchain works.

**How Blockchain Works:**

**1. Blocks**: Information is stored in "blocks" - containers that hold transaction data
- Each block contains multiple transactions
- Blocks have a timestamp showing when they were created
- Each block has a unique identifier called a "hash"

**2. Chain**: These blocks are linked together chronologically, forming a "chain"
- New blocks reference the previous block's hash
- This creates an unbreakable chain of records
- Changing any old block would break the chain

**3. Decentralization**: Instead of one central authority, the ledger is maintained by thousands of computers worldwide
- No single point of failure
- No central authority to corrupt or manipulate
- Network remains operational even if some computers go offline

**4. Consensus**: All computers must agree on new transactions before they're added
- Majority rule prevents fraud
- Mathematical algorithms ensure agreement
- Invalid transactions are rejected by the network

**Key Properties of Blockchain:**

**Immutable**: Once data is recorded, it cannot be changed
- Cryptographic hashing makes tampering virtually impossible
- Historical records are permanently preserved
- Provides ultimate accountability

**Transparent**: All transactions are visible to everyone
- Anyone can verify the blockchain's history
- No hidden or secret transactions
- Complete audit trail available

**Decentralized**: No single point of control or failure
- Distributed across thousands of computers globally
- No central authority can shut it down
- Resistant to censorship and manipulation

**Secure**: Cryptography protects against fraud
- Advanced mathematical algorithms secure data
- Private keys control access to funds
- Network consensus prevents double-spending

**Why Blockchain Matters:**

**Trust Without Intermediaries**
Traditional systems require trust in banks, governments, or companies. Blockchain removes the need for this trust by making everything transparent and verifiable by anyone.

**Global Accessibility**
Anyone with internet access can participate in blockchain networks, regardless of location, background, or financial status.

**Reduced Costs**
By eliminating intermediaries, blockchain can significantly reduce transaction costs, especially for international transfers.

**Innovation Platform**
Blockchain enables new types of applications and business models that weren't possible before, like decentralized finance (DeFi) and smart contracts.`,
            keyTakeaways: [
              "Blockchain is a shared, immutable ledger maintained by many computers",
              "Decentralization eliminates the need for trusted intermediaries",
              "Transparency and cryptography ensure security and trust",
              "Once data is added to a blockchain, it cannot be changed",
              "Blockchain enables new forms of digital interaction and value transfer"
            ],
            practicalTask: {
              title: "Blockchain Explorer Investigation",
              description: "Explore a real blockchain to see transparency in action",
              instructions: [
                "Visit blockchain.info (Bitcoin explorer)",
                "Look at the latest block and examine its contents",
                "Find a transaction and trace its path",
                "Note the timestamp, transaction amount, and addresses involved",
                "Write a brief summary of what you observed"
              ],
              estimatedTime: "20 minutes",
              tools: ["Web browser", "Blockchain.info"],
              resources: ["https://blockchain.info"],
              completionCriteria: [
                "Successfully navigated a blockchain explorer",
                "Examined at least one block and one transaction",
                "Wrote a summary of observations"
              ],
              points: 20
            },
            quiz: {
              question: "What makes blockchain transactions immutable (unchangeable)?",
              options: [
                "They are stored on government servers",
                "Cryptographic hashing and chain linkage",
                "They require bank approval",
                "They are written in permanent ink"
              ],
              correctAnswer: 1,
              explanation: "Blockchain transactions are immutable because of cryptographic hashing and the way blocks are linked together. Changing any transaction would require changing all subsequent blocks, which is computationally impossible.",
              difficulty: "medium",
              points: 15
            },
            interactiveContent: [
              {
                type: "simulator",
                title: "Blockchain Visualization Tool",
                description: "Interactive tool showing how blocks are created and linked together",
                interactive: true
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Basic Wallet Security & Terminology",
        description: "Learn essential crypto terms and wallet security fundamentals",
        estimatedTime: "1 week",
        xpReward: 150,
        badge: {
          name: "Security Guardian",
          icon: "🔐",
          description: "Mastered basic crypto security and terminology"
        },
        chapters: [
          {
            id: 1,
            title: "Essential Crypto Terminology",
            duration: "25 min",
            difficulty: "easy",
            xpReward: 30,
            tags: ["terminology", "basics", "vocabulary"],
            content: `Understanding crypto terminology is crucial for navigating the ecosystem safely and confidently. Let's learn the essential terms every crypto user should know.

**Fundamental Terms:**

**Cryptocurrency**
Digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit or double-spend.

**Blockchain**
A distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography.

**Wallet**
A digital tool that stores your private keys and allows you to interact with blockchain networks. It doesn't actually store cryptocurrency.

**Private Key**
A secret cryptographic key that proves ownership of cryptocurrency. Never share this with anyone.

**Public Key/Address**
A cryptographic identifier derived from your private key. Safe to share for receiving payments.

**Seed Phrase (Recovery Phrase)**
A series of 12-24 words that can restore access to your wallet. This is your ultimate backup.

**Transaction**
The transfer of cryptocurrency from one address to another, recorded on the blockchain.

**Hash**
A unique digital fingerprint created by a mathematical algorithm. Used to identify blocks and transactions.

**Node**
A computer that maintains a copy of the blockchain and helps validate transactions.

**Mining**
The process of validating transactions and adding new blocks to the blockchain (in Proof of Work systems).

**Gas/Fees**
The cost required to perform transactions or execute smart contracts on a blockchain network.

**Exchange**
A platform where you can buy, sell, or trade cryptocurrencies.

**Market Cap**
The total value of a cryptocurrency (price × circulating supply).

**Volatility**
The degree of price fluctuation in cryptocurrency markets.

**HODL**
A misspelling of "hold" that became a popular term meaning to hold cryptocurrency long-term regardless of price fluctuations.

**FOMO**
Fear of Missing Out - the anxiety that others are having rewarding experiences from which one is absent.

**FUD**
Fear, Uncertainty, and Doubt - negative information spread to influence perception.

**DeFi**
Decentralized Finance - financial services built on blockchain technology without traditional intermediaries.

**Smart Contract**
Self-executing contracts with terms directly written into code.

**Token**
A digital asset created on an existing blockchain (like Ethereum).

**NFT**
Non-Fungible Token - a unique digital asset that represents ownership of a specific item.

**Staking**
Locking up cryptocurrency to support network operations and earn rewards.

**Yield Farming**
Earning rewards by providing liquidity to DeFi protocols.

**Liquidity**
How easily an asset can be bought or sold without affecting its price.

**Slippage**
The difference between expected and actual transaction prices due to market movement.

**Why Terminology Matters:**
- Prevents costly mistakes from misunderstanding
- Helps you communicate effectively in crypto communities
- Enables you to research and evaluate projects properly
- Protects you from scams that exploit confusion
- Builds confidence in navigating the ecosystem`,
            keyTakeaways: [
              "Understanding terminology prevents costly mistakes and confusion",
              "Private keys and seed phrases are your most important secrets",
              "Different types of keys and addresses serve different purposes",
              "Market terms help you understand price movements and trading",
              "DeFi and smart contract terms are essential for advanced features"
            ],
            practicalTask: {
              title: "Crypto Vocabulary Flashcards",
              description: "Create flashcards for the most important crypto terms",
              instructions: [
                "Choose 15 terms from the lesson that are new to you",
                "Create flashcards (physical or digital) with term on one side, definition on the other",
                "Include a real-world example for each term",
                "Test yourself daily for one week"
              ],
              estimatedTime: "45 minutes",
              completionCriteria: [
                "Created flashcards for at least 15 terms",
                "Each card includes definition and example",
                "Can correctly define 80% of terms without looking"
              ],
              points: 20
            },
            quiz: {
              question: "What is the most important thing to keep secret and secure in cryptocurrency?",
              options: [
                "Your public address",
                "Your private key and seed phrase",
                "Your transaction history",
                "Your wallet balance"
              ],
              correctAnswer: 1,
              explanation: "Your private key and seed phrase are the most critical secrets. They provide complete access to your funds. Your public address is meant to be shared, and transaction history is public on most blockchains.",
              difficulty: "easy",
              points: 15
            },
            interactiveContent: [
              {
                type: "infographic",
                title: "Crypto Terms Visual Dictionary",
                description: "Interactive visual guide to essential cryptocurrency terminology",
                interactive: true
              }
            ]
          }
        ]
      }
    ]
  },

  // BEGINNER LEVEL (Week 3-4)
  beginner: {
    id: "beginner",
    title: "Cryptocurrency Fundamentals",
    description: "Explore different types of cryptocurrencies, exchanges, and basic trading concepts",
    longDescription: "Build on your foundation knowledge by exploring the diverse cryptocurrency ecosystem, learning about exchanges, and understanding basic trading and portfolio management.",
    level: "Beginner",
    duration: "2 weeks",
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    icon: "BookOpen",
    category: "fundamentals",
    difficulty: 2,
    totalXP: 750,
    prerequisites: ["foundation"],
    skills: ["Cryptocurrency Types", "Exchange Navigation", "Basic Trading", "Portfolio Basics"],
    learningOutcomes: [
      "Distinguish between different types of cryptocurrencies",
      "Navigate centralized and decentralized exchanges",
      "Understand basic trading concepts and order types",
      "Learn portfolio management and diversification principles",
      "Identify and avoid common scams and red flags"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Pass final assessment with 75%"],
      credentialName: "Cryptocurrency Fundamentals Certificate"
    },
    modules: [
      {
        id: 1,
        title: "Cryptocurrency Types & Ecosystem",
        description: "Learn about different cryptocurrencies and their unique purposes",
        estimatedTime: "1 week",
        xpReward: 200,
        badge: {
          name: "Crypto Explorer",
          icon: "🌐",
          description: "Explored the diverse cryptocurrency ecosystem"
        },
        chapters: [
          {
            id: 1,
            title: "Bitcoin vs Altcoins: Understanding the Differences",
            duration: "30 min",
            difficulty: "easy",
            xpReward: 35,
            tags: ["bitcoin", "altcoins", "cryptocurrency-types"],
            content: `The cryptocurrency world extends far beyond Bitcoin. Let's explore the different types of cryptocurrencies and understand their unique purposes and characteristics.

**Bitcoin: The Original Cryptocurrency**

**What Makes Bitcoin Special:**
- First successful cryptocurrency (launched 2009)
- Largest market capitalization
- Most widely accepted and recognized
- Store of value ("digital gold")
- Proof of Work consensus mechanism
- Fixed supply of 21 million coins

**Bitcoin's Primary Use Cases:**
- Store of value and hedge against inflation
- International money transfers
- Censorship-resistant transactions
- Portfolio diversification asset

**Altcoins: Alternative Cryptocurrencies**

Altcoins are all cryptocurrencies other than Bitcoin. They were created to improve upon Bitcoin's limitations or serve different purposes.

**Major Categories of Altcoins:**

**1. Smart Contract Platforms**
- **Ethereum (ETH)**: First programmable blockchain
- **Solana (SOL)**: High-speed, low-cost transactions
- **Cardano (ADA)**: Research-driven, sustainable blockchain
- **Polygon (MATIC)**: Ethereum scaling solution

**Purpose**: Enable decentralized applications (dApps) and smart contracts

**2. Payment Cryptocurrencies**
- **Litecoin (LTC)**: "Silver to Bitcoin's gold"
- **Bitcoin Cash (BCH)**: Bitcoin fork with larger blocks
- **Dash (DASH)**: Focus on privacy and instant transactions
- **Monero (XMR)**: Privacy-focused cryptocurrency

**Purpose**: Faster, cheaper, or more private transactions than Bitcoin

**3. Stablecoins**
- **USDC**: USD-backed stablecoin
- **USDT (Tether)**: Most widely used stablecoin
- **DAI**: Decentralized stablecoin backed by crypto collateral
- **BUSD**: Binance USD stablecoin

**Purpose**: Maintain stable value pegged to fiat currencies

**4. Exchange Tokens**
- **BNB (Binance Coin)**: Binance exchange token
- **FTT**: FTX exchange token (now defunct)
- **CRO**: Crypto.com token
- **UNI**: Uniswap governance token

**Purpose**: Provide utility and governance rights on exchanges

**5. DeFi Tokens**
- **AAVE**: Lending protocol token
- **COMP**: Compound protocol token
- **YFI**: Yearn Finance token
- **SUSHI**: SushiSwap DEX token

**Purpose**: Governance and utility in decentralized finance protocols

**6. Meme Coins**
- **Dogecoin (DOGE)**: Original meme coin
- **Shiba Inu (SHIB)**: "Dogecoin killer"
- **Pepe (PEPE)**: Internet meme-based token

**Purpose**: Community-driven, often speculative investments

**Key Differences to Understand:**

**Consensus Mechanisms:**
- **Proof of Work (PoW)**: Bitcoin, Litecoin - energy-intensive mining
- **Proof of Stake (PoS)**: Ethereum 2.0, Cardano - energy-efficient staking
- **Delegated Proof of Stake (DPoS)**: EOS, Tron - faster transactions

**Supply Models:**
- **Fixed Supply**: Bitcoin (21M), Litecoin (84M)
- **Inflationary**: Ethereum, Dogecoin - no maximum supply
- **Deflationary**: Some tokens burn supply over time

**Transaction Speed & Costs:**
- **Bitcoin**: ~7 TPS, higher fees
- **Ethereum**: ~15 TPS, variable fees
- **Solana**: ~65,000 TPS, very low fees
- **Visa (comparison)**: ~24,000 TPS

**How to Evaluate Cryptocurrencies:**

**1. Use Case & Problem Solving**
- What problem does it solve?
- Is there real-world demand?
- Does it have a competitive advantage?

**2. Technology & Innovation**
- Is the technology sound and innovative?
- How does it compare to competitors?
- Is the development active?

**3. Team & Community**
- Who are the founders and developers?
- Is there an active community?
- Are there partnerships and adoption?

**4. Tokenomics**
- What is the supply model?
- How are tokens distributed?
- What are the incentive mechanisms?

**5. Market Position**
- What is the market cap and trading volume?
- How does it rank among competitors?
- What is the price history and volatility?

**Common Misconceptions:**

**"All altcoins are just copies of Bitcoin"**
Reality: Many altcoins solve different problems and use different technologies.

**"Newer cryptocurrencies are always better"**
Reality: Age and proven track record matter. Many new projects fail.

**"Price determines quality"**
Reality: A high price doesn't mean a cryptocurrency is better. Market cap and utility matter more.

**Investment Considerations:**
- Bitcoin is often considered the "safest" cryptocurrency investment
- Altcoins can offer higher returns but with higher risk
- Diversification across different types can reduce risk
- Always research thoroughly before investing
- Never invest more than you can afford to lose`,
            keyTakeaways: [
              "Bitcoin is the original and most established cryptocurrency",
              "Altcoins serve different purposes: payments, smart contracts, DeFi, etc.",
              "Different cryptocurrencies use different consensus mechanisms and supply models",
              "Evaluate cryptocurrencies based on use case, technology, team, and tokenomics",
              "Diversification and thorough research are key to crypto investing"
            ],
            practicalTask: {
              title: "Cryptocurrency Research Project",
              description: "Research and compare three different types of cryptocurrencies",
              instructions: [
                "Choose one cryptocurrency from three different categories (e.g., Bitcoin, one smart contract platform, one DeFi token)",
                "Research each cryptocurrency's purpose, technology, and market position",
                "Create a comparison chart with key metrics (market cap, supply, consensus mechanism, use case)",
                "Write a brief summary of which you find most interesting and why"
              ],
              estimatedTime: "60 minutes",
              tools: ["CoinMarketCap", "CoinGecko", "Project websites"],
              resources: ["https://coinmarketcap.com", "https://coingecko.com"],
              completionCriteria: [
                "Researched three cryptocurrencies from different categories",
                "Created comparison chart with key metrics",
                "Wrote thoughtful analysis of findings"
              ],
              points: 30
            },
            quiz: {
              question: "What is the main difference between Bitcoin and Ethereum?",
              options: [
                "Bitcoin is newer than Ethereum",
                "Bitcoin focuses on payments, Ethereum enables smart contracts",
                "Bitcoin is more expensive than Ethereum",
                "Bitcoin uses Proof of Stake, Ethereum uses Proof of Work"
              ],
              correctAnswer: 1,
              explanation: "Bitcoin was designed primarily as a digital currency and store of value, while Ethereum was built as a platform for smart contracts and decentralized applications. This fundamental difference in purpose drives their different features and capabilities.",
              difficulty: "medium",
              points: 20
            },
            interactiveContent: [
              {
                type: "infographic",
                title: "Cryptocurrency Categories Map",
                description: "Interactive visualization of different cryptocurrency types and their relationships",
                interactive: true
              }
            ]
          }
        ]
      }
    ]
  },

  // INTERMEDIATE LEVEL (Week 5-8) - DeFi Fundamentals
  intermediate: {
    id: "intermediate",
    title: "DeFi Fundamentals",
    description: "Master decentralized finance protocols, yield farming, and advanced trading",
    longDescription: "Deep dive into the revolutionary world of Decentralized Finance. Learn how to lend, borrow, trade, and earn yield without traditional banks.",
    level: "Intermediate",
    duration: "4 weeks",
    color: "bg-emerald-500",
    gradient: "from-emerald-400 to-emerald-600",
    icon: "Target",
    category: "defi",
    difficulty: 3,
    totalXP: 1200,
    prerequisites: ["foundation", "beginner"],
    skills: ["DeFi Protocols", "Yield Farming", "Liquidity Provision", "Risk Management"],
    learningOutcomes: [
      "Understand DeFi protocols and their mechanisms",
      "Master lending and borrowing strategies",
      "Navigate DEXs and automated market makers",
      "Implement yield farming and liquidity mining",
      "Assess and manage DeFi risks"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Pass final assessment with 80%"],
      credentialName: "DeFi Fundamentals Certificate"
    },
    modules: [
      {
        id: 1,
        title: "Introduction to DeFi",
        description: "Core concepts and building blocks of decentralized finance",
        estimatedTime: "2 weeks",
        xpReward: 300,
        badge: {
          name: "DeFi Pioneer",
          icon: "🏦",
          description: "Mastered DeFi fundamentals and protocols"
        },
        chapters: [
          {
            id: 1,
            title: "What is DeFi?",
            duration: "35 min",
            difficulty: "medium",
            xpReward: 50,
            tags: ["defi", "protocols", "fundamentals"],
            content: `Decentralized Finance (DeFi) represents a paradigm shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on blockchain.

**Traditional Finance vs DeFi:**

**Traditional Finance (TradFi):**
- Banks and institutions control your money
- Limited hours and geographic restrictions
- High fees and slow settlements
- Requires trust in intermediaries
- Exclusive access based on credit/location
- Opaque operations

**Decentralized Finance (DeFi):**
- You control your funds via smart contracts
- 24/7 global access
- Lower fees and instant settlements
- Trustless - code enforces rules
- Permissionless access for anyone
- Transparent and auditable

**Core DeFi Principles:**

**1. Programmable Money:**
Money that can execute automatically based on conditions. Smart contracts replace traditional intermediaries like banks.

**2. Composability:**
DeFi protocols can stack on top of each other like "money legos." You can combine lending, trading, and insurance in complex strategies.

**3. Transparency:**
All transactions and smart contract code are public and auditable on the blockchain.

**4. Permissionless:**
Anyone with an internet connection can access DeFi protocols without KYC or geographic restrictions.

**Main DeFi Categories:**

**1. Lending & Borrowing:**
- Protocols: Aave, Compound, MakerDAO
- Earn interest on deposits or borrow against collateral
- No credit checks - everything is over-collateralized

**2. Decentralized Exchanges (DEXs):**
- Protocols: Uniswap, SushiSwap, Curve
- Trade tokens without centralized intermediaries
- Automated Market Makers (AMMs) provide liquidity

**3. Derivatives & Synthetics:**
- Protocols: Synthetix, dYdX, GMX
- Trade synthetic assets and derivatives
- Get exposure to traditional assets on-chain

**4. Insurance:**
- Protocols: Nexus Mutual, Cover Protocol
- Decentralized insurance for smart contract risks

**5. Asset Management:**
- Protocols: Yearn Finance, Convex
- Automated yield farming and portfolio management

**Real-World Impact:**
DeFi has unlocked over $100 billion in total value locked (TVL), enabling anyone to become their own bank, earn yield on digital assets, and access financial services without traditional gatekeepers.`,
            keyTakeaways: [
              "DeFi eliminates intermediaries through smart contracts",
              "Protocols are composable - they work together like building blocks",
              "Anyone can access DeFi services 24/7 globally",
              "All transactions are transparent and verifiable on-chain",
              "DeFi offers higher yields but with higher risks than traditional finance"
            ],
            practicalTask: {
              title: "DeFi Protocol Analysis",
              description: "Explore and analyze a major DeFi protocol",
              instructions: [
                "Visit DeFiPulse or DefiLlama to see protocol rankings",
                "Choose one protocol from the top 10 (e.g., Uniswap, Aave, Compound)",
                "Research the protocol's purpose, how it works, and its TVL",
                "Explore the protocol's website and documentation",
                "Write a summary of what the protocol does and why it's valuable"
              ],
              estimatedTime: "45 minutes",
              tools: ["DeFiPulse", "DefiLlama", "Protocol websites"],
              resources: ["https://defipulse.com", "https://defillama.com"],
              completionCriteria: [
                "Analyzed at least one major DeFi protocol",
                "Understood the protocol's core functionality",
                "Wrote clear summary of findings"
              ],
              points: 35
            },
            quiz: {
              question: "What is the main advantage of DeFi over traditional finance?",
              options: [
                "DeFi is always more profitable",
                "DeFi eliminates the need for intermediaries",
                "DeFi is completely risk-free",
                "DeFi only works with Bitcoin"
              ],
              correctAnswer: 1,
              explanation: "The main advantage of DeFi is that it eliminates traditional intermediaries like banks through the use of smart contracts, enabling direct peer-to-peer financial interactions.",
              difficulty: "medium",
              points: 25
            },
            interactiveContent: [
              {
                type: "simulator",
                title: "DeFi Protocol Simulator",
                description: "Interactive simulation of lending and borrowing in DeFi protocols",
                interactive: true
              }
            ]
          }
        ]
      }
    ]
  },

  // ADVANCED LEVEL (Week 9-12) - Smart Contract Development
  advanced: {
    id: "advanced",
    title: "Smart Contract Development",
    description: "Build decentralized applications and smart contracts from scratch",
    longDescription: "Learn to build smart contracts and decentralized applications. Master Solidity, Web3 development tools, and dApp architecture.",
    level: "Advanced",
    duration: "4 weeks",
    color: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
    icon: "Code",
    category: "development",
    difficulty: 4,
    totalXP: 1500,
    prerequisites: ["foundation", "beginner", "intermediate"],
    skills: ["Solidity", "Smart Contracts", "dApp Development", "Web3 Integration"],
    learningOutcomes: [
      "Write and deploy smart contracts in Solidity",
      "Build full-stack dApps with React and Web3",
      "Understand gas optimization and security best practices",
      "Deploy on multiple blockchain networks",
      "Test and audit smart contracts"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Deploy working dApp", "Pass final assessment with 85%"],
      credentialName: "Smart Contract Developer Certificate"
    },
    modules: [
      {
        id: 1,
        title: "Solidity Fundamentals",
        description: "Learn the programming language of Ethereum smart contracts",
        estimatedTime: "2 weeks",
        xpReward: 400,
        badge: {
          name: "Solidity Developer",
          icon: "⚡",
          description: "Mastered Solidity programming language"
        },
        practicalProject: {
          title: "Build a Token Contract",
          description: "Create and deploy your own ERC-20 token",
          requirements: [
            "Write a complete ERC-20 token contract",
            "Include basic security features",
            "Deploy to testnet",
            "Verify contract on block explorer"
          ],
          deliverables: [
            "Solidity contract code",
            "Deployment transaction hash",
            "Contract verification link",
            "Basic documentation"
          ],
          estimatedTime: "3-4 hours",
          xpReward: 200
        },
        chapters: [
          {
            id: 1,
            title: "Introduction to Solidity",
            duration: "45 min",
            difficulty: "hard",
            xpReward: 60,
            tags: ["solidity", "smart-contracts", "ethereum"],
            content: `Solidity is a high-level programming language designed for implementing smart contracts on Ethereum and other EVM-compatible blockchains.

**What makes Solidity special:**
- Statically typed language
- Contract-oriented programming
- Inherits features from C++, Python, and JavaScript
- Compiles to Ethereum Virtual Machine (EVM) bytecode

**Basic Solidity Structure:**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyFirstContract {
    // State variables
    string public message;
    address public owner;

    // Constructor
    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
    }

    // Function
    function updateMessage(string memory _newMessage) public {
        require(msg.sender == owner, "Only owner can update");
        message = _newMessage;
    }
}
\`\`\`

**Key Concepts:**

**1. State Variables:**
Data stored permanently on the blockchain
- \`uint256 public balance;\`
- \`address private owner;\`
- \`mapping(address => uint256) balances;\`

**2. Functions:**
- \`public\`: Callable from anywhere
- \`private\`: Only within the contract
- \`internal\`: Within contract and derived contracts
- \`external\`: Only from outside the contract

**3. Modifiers:**
Reusable code that checks conditions before function execution

**4. Events:**
Logs that external applications can listen to

**Development Environment Setup:**
1. **Remix IDE**: Browser-based Solidity IDE
2. **Hardhat**: Development framework with testing
3. **Truffle**: Alternative development framework
4. **MetaMask**: Browser wallet for testing

**Gas and Optimization:**
Every operation costs gas (computational resources)
- Simple operations: 3-5 gas
- Storage operations: 20,000+ gas
- Deploy contract: 21,000+ gas base fee

**Security Considerations:**
- Reentrancy attacks
- Integer overflow/underflow
- Access control
- Input validation`,
            keyTakeaways: [
              "Solidity is the primary language for Ethereum smart contracts",
              "Contracts have state variables, functions, and events",
              "Gas optimization is crucial for cost-effective contracts",
              "Security must be considered from the beginning",
              "Proper testing and auditing are essential"
            ],
            practicalTask: {
              title: "First Smart Contract",
              description: "Set up development environment and deploy your first contract",
              instructions: [
                "Set up Remix IDE in your browser",
                "Create a simple 'Hello World' contract",
                "Compile the contract successfully",
                "Deploy to a testnet (Goerli or Sepolia)",
                "Interact with the deployed contract"
              ],
              estimatedTime: "60 minutes",
              tools: ["Remix IDE", "MetaMask", "Testnet faucet"],
              resources: ["https://remix.ethereum.org", "Ethereum documentation"],
              completionCriteria: [
                "Successfully compiled a smart contract",
                "Deployed contract to testnet",
                "Verified contract interaction works"
              ],
              points: 50
            },
            quiz: {
              question: "What is the purpose of the 'require' statement in Solidity?",
              options: [
                "To import external libraries",
                "To validate conditions and revert if false",
                "To declare state variables",
                "To emit events"
              ],
              correctAnswer: 1,
              explanation: "The 'require' statement is used to validate conditions in Solidity. If the condition is false, the transaction is reverted and any changes are undone.",
              difficulty: "hard",
              points: 30
            },
            interactiveContent: [
              {
                type: "simulator",
                title: "Solidity Code Playground",
                description: "Interactive environment for writing and testing Solidity code",
                interactive: true
              }
            ]
          }
        ]
      }
    ]
  },

  // EXPERT LEVEL (Week 13-16) - Advanced Trading & Security
  expert: {
    id: "expert",
    title: "Advanced Trading & Security",
    description: "Master advanced trading strategies, security practices, and emerging trends",
    longDescription: "Become an expert in cryptocurrency trading, security, and cutting-edge blockchain technologies. Learn institutional-level strategies and security practices.",
    level: "Expert",
    duration: "4 weeks",
    color: "bg-red-500",
    gradient: "from-red-400 to-red-600",
    icon: "Shield",
    category: "security",
    difficulty: 5,
    totalXP: 2000,
    prerequisites: ["foundation", "beginner", "intermediate", "advanced"],
    skills: ["Advanced Trading", "Security Auditing", "Risk Management", "Emerging Technologies"],
    learningOutcomes: [
      "Master advanced trading strategies and derivatives",
      "Conduct security audits and risk assessments",
      "Understand institutional DeFi and treasury management",
      "Navigate regulatory landscape and compliance",
      "Explore emerging trends like zero-knowledge proofs"
    ],
    certification: {
      available: true,
      requirements: ["Complete all modules", "Complete capstone project", "Pass comprehensive exam with 90%"],
      credentialName: "Crypto Expert Certification"
    },
    industryPartners: ["Chainlink", "Aave", "Uniswap", "ConsenSys"],
    careerPaths: ["DeFi Protocol Developer", "Crypto Security Auditor", "Institutional Crypto Trader", "Blockchain Consultant"],
    modules: [
      {
        id: 1,
        title: "Advanced Security & Risk Management",
        description: "Master enterprise-level security practices and risk assessment",
        estimatedTime: "2 weeks",
        xpReward: 500,
        badge: {
          name: "Security Expert",
          icon: "🛡️",
          description: "Mastered advanced crypto security practices"
        },
        practicalProject: {
          title: "Security Audit Report",
          description: "Conduct a comprehensive security audit of a DeFi protocol",
          requirements: [
            "Choose a real DeFi protocol for analysis",
            "Identify potential security vulnerabilities",
            "Assess smart contract risks",
            "Evaluate economic attack vectors",
            "Create professional audit report"
          ],
          deliverables: [
            "Detailed security audit report",
            "Risk assessment matrix",
            "Recommendations for improvements",
            "Executive summary for stakeholders"
          ],
          estimatedTime: "8-10 hours",
          xpReward: 300
        },
        chapters: [
          {
            id: 1,
            title: "Advanced Attack Vectors & Prevention",
            duration: "50 min",
            difficulty: "hard",
            xpReward: 75,
            tags: ["security", "attacks", "prevention"],
            content: `Advanced security in the crypto space requires understanding sophisticated attack vectors and implementing comprehensive defense strategies.

**Advanced Attack Categories:**

**1. Flash Loan Attacks:**
- Borrow large amounts without collateral
- Manipulate prices or exploit arbitrage
- Repay loan in same transaction
- Examples: bZx, Harvest Finance attacks

**2. Oracle Manipulation:**
- Manipulate price feeds that smart contracts rely on
- Cause liquidations or profitable trades
- Target protocols with centralized oracles
- Sandwich attacks on price updates

**3. Governance Attacks:**
- Acquire large amounts of governance tokens
- Propose malicious changes to protocols
- Rush votes through with minimal discussion
- Extract value from protocol treasuries

**4. MEV (Maximal Extractable Value):**
- Front-running profitable transactions
- Sandwich attacks on DEX trades
- Liquidation sniping
- Arbitrage extraction

**5. Cross-Chain Bridge Exploits:**
- Exploit vulnerabilities in bridge contracts
- Double-spending across chains
- Validator set manipulation
- Examples: Ronin, Wormhole hacks

**Advanced Defense Strategies:**

**1. Multi-Signature Security:**
- Require multiple signatures for critical operations
- Implement time delays for major changes
- Use hardware security modules (HSMs)
- Regular key rotation procedures

**2. Smart Contract Security:**
- Formal verification of critical contracts
- Multiple independent audits
- Bug bounty programs
- Gradual rollout with circuit breakers

**3. Economic Security Models:**
- Game theory analysis of incentives
- Stress testing under extreme conditions
- Insurance and risk mitigation strategies
- Diversified oracle networks

**4. Operational Security:**
- Air-gapped systems for critical operations
- Secure communication protocols
- Regular security training for team members
- Incident response procedures

**5. Regulatory Compliance:**
- KYC/AML procedures where required
- Sanctions screening
- Regulatory reporting requirements
- Legal structure optimization

**Enterprise Risk Management:**

**Risk Assessment Framework:**
1. **Technical Risks**: Smart contract bugs, oracle failures
2. **Economic Risks**: Market manipulation, liquidity crises
3. **Operational Risks**: Key management, human error
4. **Regulatory Risks**: Compliance requirements, legal changes
5. **Reputational Risks**: Public perception, community trust

**Risk Mitigation Strategies:**
- Diversification across protocols and assets
- Insurance coverage for smart contract risks
- Regular security audits and penetration testing
- Continuous monitoring and alerting systems
- Emergency response procedures

**Institutional Security Practices:**
- Segregated custody solutions
- Multi-party computation (MPC) wallets
- Institutional-grade key management
- Compliance with regulatory frameworks
- Regular third-party security assessments`,
            keyTakeaways: [
              "Advanced attacks often exploit economic incentives rather than just technical vulnerabilities",
              "Defense requires layered security across technical, economic, and operational domains",
              "Institutional security practices are essential for managing large amounts of crypto assets",
              "Continuous monitoring and rapid response capabilities are crucial",
              "Regulatory compliance is becoming increasingly important for institutional adoption"
            ],
            practicalTask: {
              title: "Security Vulnerability Assessment",
              description: "Analyze a real DeFi protocol for potential security vulnerabilities",
              instructions: [
                "Choose a DeFi protocol with public smart contracts",
                "Review the contract code for common vulnerabilities",
                "Analyze the economic model for potential attack vectors",
                "Research any past security incidents",
                "Create a risk assessment report with recommendations"
              ],
              estimatedTime: "2 hours",
              tools: ["Etherscan", "GitHub", "Security analysis tools"],
              resources: ["Smart contract security best practices", "DeFi security frameworks"],
              completionCriteria: [
                "Completed thorough security analysis",
                "Identified potential vulnerabilities",
                "Created professional risk assessment",
                "Provided actionable recommendations"
              ],
              points: 60
            },
            quiz: {
              question: "What is the primary defense against flash loan attacks?",
              options: [
                "Using only centralized exchanges",
                "Implementing time delays and oracle checks",
                "Avoiding all DeFi protocols",
                "Using only Bitcoin"
              ],
              correctAnswer: 1,
              explanation: "The primary defense against flash loan attacks is implementing time delays for critical operations and using multiple, independent oracle sources to prevent price manipulation within a single transaction.",
              difficulty: "hard",
              points: 40
            },
            interactiveContent: [
              {
                type: "simulator",
                title: "Attack Vector Simulator",
                description: "Interactive simulation of various crypto attack scenarios and defense mechanisms",
                interactive: true
              }
            ]
          }
        ]
      }
    ]
  }
};
