
export interface Chapter {
  id: number;
  title: string;
  duration: string;
  content: string;
  keyTakeaways: string[];
  practicalTask?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface Module {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  estimatedTime: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  modules: Module[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  color: string;
  icon: string;
  prerequisites?: string[];
  learningOutcomes: string[];
}

export const courses: Course[] = [
  {
    id: "foundations",
    title: "Web3 Foundations",
    description: "Complete beginner's guide to Web3, blockchain, and crypto fundamentals",
    longDescription: "Master the essential concepts that power the decentralized web. From understanding what blockchain actually is, to setting up your first wallet, to navigating the ecosystem safely.",
    level: "Beginner",
    duration: "4-6 weeks",
    color: "bg-blue-500",
    icon: "BookOpen",
    learningOutcomes: [
      "Understand blockchain technology and its applications",
      "Set up and secure crypto wallets",
      "Navigate Web3 applications safely",
      "Understand tokens, NFTs, and digital assets",
      "Grasp the difference between Layer 1 and Layer 2 networks"
    ],
    modules: [
      {
        id: 1,
        title: "Understanding Blockchain & Web3",
        description: "Learn what blockchain is, how it works, and why it matters",
        estimatedTime: "1 week",
        chapters: [
          {
            id: 1,
            title: "What is Blockchain?",
            duration: "25 min",
            content: `Blockchain is a revolutionary technology that creates a permanent, unchangeable record of transactions across multiple computers. Think of it as a digital ledger that everyone can see, but no one can tamper with.

**How Blockchain Works:**
1. **Blocks**: Information is stored in "blocks" - containers that hold transaction data
2. **Chain**: These blocks are linked together chronologically, forming a "chain"
3. **Decentralization**: Instead of one central authority, the ledger is maintained by thousands of computers worldwide
4. **Consensus**: All computers must agree on new transactions before they're added

**Real-World Analogy:**
Imagine a classroom where every student has an identical notebook. When someone wants to make a transaction, they announce it to the class. Everyone writes it down only if the majority agrees it's valid. Once written, it can never be erased.

**Key Properties:**
- **Immutable**: Once data is recorded, it cannot be changed
- **Transparent**: All transactions are visible to everyone
- **Decentralized**: No single point of control or failure
- **Secure**: Cryptography protects against fraud

**Why This Matters:**
Traditional systems require trust in banks, governments, or companies. Blockchain removes the need for this trust by making everything transparent and verifiable by anyone.`,
            keyTakeaways: [
              "Blockchain is a shared, immutable ledger maintained by many computers",
              "Decentralization eliminates the need for trusted intermediaries",
              "Transparency and cryptography ensure security",
              "Once data is added to a blockchain, it cannot be changed"
            ],
            practicalTask: "Visit blockchain.info and explore recent Bitcoin transactions to see blockchain transparency in action"
          },
          {
            id: 2,
            title: "From Web1 to Web3: The Evolution",
            duration: "20 min",
            content: `The internet has evolved through distinct phases, each with different characteristics and power structures.

**Web1 (1990s-2000s): The Read-Only Web**
- Static websites with basic HTML
- Users could only consume content, not create
- Think: early Yahoo, basic company websites
- Centralized but simple

**Web2 (2000s-Present): The Interactive Web**
- Social media, user-generated content
- Companies like Facebook, Google, Amazon dominate
- Users create content but don't own their data
- Centralized platforms with network effects
- "If it's free, you're the product"

**Web3 (2020s+): The Ownership Web**
- Users own their data, identity, and digital assets
- Decentralized protocols instead of centralized platforms
- Programmable money and smart contracts
- Creators monetize directly without intermediaries

**Key Differences:**

| Aspect | Web2 | Web3 |
|--------|------|------|
| Data Ownership | Platform owns | User owns |
| Identity | Platform-controlled | Self-sovereign |
| Monetization | Advertising | Direct ownership |
| Governance | Corporate | Community |
| Censorship | Platform decides | Resistant |

**Real Examples:**
- **Web2**: Instagram owns your photos and followers
- **Web3**: You own your NFT art and follower list on decentralized social networks

**The Paradigm Shift:**
Web3 isn't just about technology - it's about shifting power from corporations back to individuals. Instead of building on someone else's platform, you build on open protocols that no one controls.`,
            keyTakeaways: [
              "Web1 was read-only, Web2 added interaction, Web3 adds ownership",
              "Web2 platforms extract value from users, Web3 returns value to users",
              "Decentralized protocols replace centralized platforms",
              "Users control their data, identity, and digital assets in Web3"
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Wallets & Digital Identity",
        description: "Set up your gateway to Web3 and understand digital ownership",
        estimatedTime: "1 week",
        chapters: [
          {
            id: 1,
            title: "Understanding Crypto Wallets",
            duration: "30 min",
            content: `A crypto wallet isn't actually a wallet in the traditional sense - it doesn't store your cryptocurrency. Instead, it stores the cryptographic keys that prove you own assets on the blockchain.

**What Wallets Actually Do:**
- Store your private keys (like super-secure passwords)
- Generate public addresses (like bank account numbers)
- Sign transactions to prove ownership
- Interact with blockchain applications

**Types of Wallets:**

**1. Hot Wallets (Connected to Internet):**
- **Browser Extensions**: MetaMask, Phantom
- **Mobile Apps**: Trust Wallet, Coinbase Wallet
- **Desktop Apps**: Exodus, Electrum
- **Pros**: Convenient for daily use, easy to access dApps
- **Cons**: Vulnerable to hacking, phishing

**2. Cold Wallets (Offline Storage):**
- **Hardware Wallets**: Ledger, Trezor
- **Paper Wallets**: Private keys written on paper
- **Pros**: Maximum security, immune to online attacks
- **Cons**: Less convenient, can be lost or damaged

**The Seed Phrase (Recovery Phrase):**
- 12-24 random words that can restore your entire wallet
- NEVER share this with anyone
- Write it down physically and store securely
- If you lose this, you lose access to your funds forever

**Public vs Private Keys:**
- **Public Key**: Like your bank account number - safe to share
- **Private Key**: Like your PIN - NEVER share this
- **Address**: Shortened version of your public key

**Wallet Security Best Practices:**
1. Never share your seed phrase or private keys
2. Use hardware wallets for large amounts
3. Double-check addresses before sending funds
4. Be cautious of phishing websites
5. Keep your wallet software updated`,
            keyTakeaways: [
              "Wallets store keys, not actual cryptocurrency",
              "Seed phrases can restore your entire wallet - keep them safe",
              "Hot wallets are convenient, cold wallets are secure",
              "Your private keys = your funds - never share them"
            ],
            practicalTask: "Download MetaMask, create a wallet, and safely store your seed phrase (practice with small amounts only)"
          }
        ]
      }
    ]
  },
  {
    id: "defi",
    title: "DeFi Mastery",
    description: "Master decentralized finance: lending, borrowing, trading, and yield strategies",
    longDescription: "Deep dive into the revolutionary world of Decentralized Finance. Learn how to lend, borrow, trade, and earn yield without traditional banks.",
    level: "Intermediate",
    duration: "6-8 weeks",
    color: "bg-emerald-500",
    icon: "Target",
    prerequisites: ["Web3 Foundations"],
    learningOutcomes: [
      "Understand DeFi protocols and their mechanisms",
      "Master lending and borrowing strategies",
      "Navigate DEXs and automated market makers",
      "Implement yield farming and liquidity mining",
      "Assess and manage DeFi risks"
    ],
    modules: [
      {
        id: 1,
        title: "DeFi Fundamentals",
        description: "Core concepts and building blocks of decentralized finance",
        estimatedTime: "2 weeks",
        chapters: [
          {
            id: 1,
            title: "What is DeFi?",
            duration: "35 min",
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

**The DeFi Stack:**

**Layer 1: Settlement Layer**
- Ethereum, BSC, Polygon, Avalanche
- Where smart contracts live and execute

**Layer 2: Protocol Layer**
- Lending protocols (Aave)
- Exchange protocols (Uniswap)
- Core DeFi primitives

**Layer 3: Application Layer**
- User interfaces and aggregators
- Portfolio managers and yield optimizers

**Layer 4: Aggregation Layer**
- Services that combine multiple protocols
- 1inch (DEX aggregator), Zapper (portfolio management)

**Real-World Impact:**
DeFi has unlocked over $100 billion in total value locked (TVL), enabling anyone to become their own bank, earn yield on digital assets, and access financial services without traditional gatekeepers.`,
            keyTakeaways: [
              "DeFi eliminates intermediaries through smart contracts",
              "Protocols are composable - they work together like building blocks",
              "Anyone can access DeFi services 24/7 globally",
              "All transactions are transparent and verifiable on-chain"
            ],
            practicalTask: "Explore DeFiPulse or DefiLlama to see real-time DeFi protocol rankings and TVL data"
          }
        ]
      }
    ]
  },
  {
    id: "degen-trading",
    title: "Degen Trading Mastery",
    description: "High-risk, high-reward trading strategies in crypto markets",
    longDescription: "Learn advanced trading techniques, memecoin strategies, and risk management for volatile crypto markets. Understand the degen mindset while protecting your capital.",
    level: "Advanced",
    duration: "4-5 weeks",
    color: "bg-red-500",
    icon: "TrendingUp",
    prerequisites: ["Web3 Foundations", "DeFi Mastery"],
    learningOutcomes: [
      "Master advanced trading strategies and technical analysis",
      "Understand memecoin and altcoin market dynamics",
      "Implement proper risk management and position sizing",
      "Navigate DEX trading and MEV protection",
      "Develop a sustainable trading psychology"
    ],
    modules: [
      {
        id: 1,
        title: "Degen Trading Fundamentals",
        description: "Understanding high-risk crypto trading and market psychology",
        estimatedTime: "1 week",
        chapters: [
          {
            id: 1,
            title: "The Degen Mindset",
            duration: "30 min",
            content: `"Degen" (short for degenerate) trading refers to high-risk, high-reward trading strategies in cryptocurrency markets. While the term might sound negative, successful degen traders combine calculated risk-taking with deep market knowledge.

**What Makes Someone a "Degen":**
- Willing to take significant risks for potential high returns
- Trades newer, more volatile tokens
- Uses high leverage and complex strategies
- Embraces uncertainty and rapid market changes
- Often trades based on community sentiment and narratives

**The Degen Trading Spectrum:**

**Level 1: Cautious Degen**
- Allocates 5-10% of portfolio to high-risk plays
- Focuses on established altcoins during cycles
- Uses basic technical analysis
- Sets stop losses and takes profits systematically

**Level 2: Moderate Degen**
- 20-30% portfolio in speculative plays
- Trades newer DeFi tokens and gaming coins
- Uses leverage up to 3x
- Follows yield farming opportunities

**Level 3: Full Degen**
- 50%+ portfolio in ultra-high-risk assets
- Trades memecoins and very new launches
- Uses high leverage (5x-20x)
- APE (All Protocols Everything) into new trends

**Level 4: Degen Degen**
- 90%+ in extremely volatile assets
- Trades with 50x+ leverage
- Chases 100x opportunities
- High risk of total loss

**Key Degen Markets:**

**1. Memecoins:**
- Tokens with no fundamental value
- Driven purely by community and memes
- Examples: DOGE, SHIB, PEPE, WIF
- Extreme volatility (1000%+ moves common)

**2. New Protocol Tokens:**
- Early-stage DeFi/GameFi projects
- High risk but potential for massive returns
- Often lack proven product-market fit

**3. Layer 1 Altcoins:**
- Alternative blockchain platforms
- Compete with Ethereum
- Examples: SOL, AVAX, FTM during their early days

**4. NFT Collections:**
- Speculative art and utility projects
- Driven by hype cycles and celebrity endorsements
- Highly illiquid and volatile

**Degen Trading Psychology:**

**FOMO (Fear of Missing Out):**
- Seeing others make money drives impulsive decisions
- Often leads to buying tops and selling bottoms
- Solution: Set aside "FOMO money" with strict limits

**Diamond Hands vs Paper Hands:**
- Diamond hands: Holding through volatility
- Paper hands: Selling at first sign of trouble
- Both can be right depending on context

**The Narrative Game:**
- Crypto moves in cycles driven by narratives
- DeFi Summer (2020), NFT mania (2021), AI tokens (2023)
- Understanding and timing narratives is crucial

**Risk Management for Degens:**

**1. Position Sizing:**
- Never risk more than you can afford to lose completely
- Use the "1% rule" - never risk more than 1% on a single trade
- Scale position sizes based on conviction

**2. Diversification:**
- Don't put all eggs in one basket
- Spread risk across different sectors and timeframes
- Balance high-risk plays with stable positions

**3. Emotional Control:**
- Set rules and stick to them
- Don't trade when emotional
- Take breaks during losing streaks

**4. Continuous Learning:**
- Markets evolve constantly
- Stay updated on new narratives and technologies
- Learn from both wins and losses

**The Dark Side of Degen Trading:**
- 90%+ of traders lose money long-term
- Addiction and gambling behavior are common
- Social media creates unrealistic expectations
- Scams and rug pulls are frequent

**Success Principles:**
1. Treat it as high-risk speculation, not investment
2. Only use money you can afford to lose completely
3. Focus on asymmetric risk/reward opportunities
4. Develop a systematic approach to entry and exit
5. Maintain perspective - one trade doesn't define you`,
            keyTakeaways: [
              "Degen trading involves calculated high-risk speculation",
              "Position sizing and risk management are crucial for survival",
              "Markets are driven by narratives and community sentiment",
              "Most traders lose money - treat this as entertainment with upside"
            ],
            practicalTask: "Set up a separate 'degen wallet' with a small amount you can afford to lose completely, and practice with minimal risk"
          }
        ]
      }
    ]
  }
];
