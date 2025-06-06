
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
  icon: any;
  prerequisites?: string[];
  learningOutcomes: string[];
}

// Change from array to object for easier access by ID
export const courses: Record<string, Course> = {
  foundations: {
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
  defi: {
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
  development: {
    id: "development",
    title: "Smart Contracts & dApps",
    description: "Build decentralized applications and smart contracts from scratch",
    longDescription: "Learn to build smart contracts and decentralized applications. Master Solidity, Web3 development tools, and dApp architecture.",
    level: "Advanced",
    duration: "8-10 weeks",
    color: "bg-purple-500",
    icon: "Code",
    prerequisites: ["Web3 Foundations"],
    learningOutcomes: [
      "Write and deploy smart contracts in Solidity",
      "Build full-stack dApps with React and Web3",
      "Understand gas optimization and security best practices",
      "Deploy on multiple blockchain networks",
      "Test and audit smart contracts"
    ],
    modules: [
      {
        id: 1,
        title: "Solidity Fundamentals",
        description: "Learn the programming language of Ethereum smart contracts",
        estimatedTime: "3 weeks",
        chapters: [
          {
            id: 1,
            title: "Introduction to Solidity",
            duration: "45 min",
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

\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}

function withdraw() public onlyOwner {
    // Only owner can call this
}
\`\`\`

**4. Events:**
Logs that external applications can listen to

\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint256 value);

function transfer(address to, uint256 amount) public {
    // Transfer logic
    emit Transfer(msg.sender, to, amount);
}
\`\`\`

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
              "Security must be considered from the beginning"
            ],
            practicalTask: "Set up Remix IDE and deploy your first 'Hello World' contract to a testnet"
          }
        ]
      }
    ]
  },
  trading: {
    id: "trading",
    title: "Crypto Trading",
    description: "Master cryptocurrency trading strategies and market analysis",
    longDescription: "Learn professional trading strategies, technical analysis, and risk management in crypto markets.",
    level: "Intermediate",
    duration: "5-6 weeks",
    color: "bg-yellow-500",
    icon: "TrendingUp",
    prerequisites: ["Web3 Foundations"],
    learningOutcomes: [
      "Master technical analysis and chart reading",
      "Understand different trading strategies",
      "Implement proper risk management",
      "Navigate CEX and DEX trading platforms",
      "Develop trading psychology and discipline"
    ],
    modules: [
      {
        id: 1,
        title: "Trading Fundamentals",
        description: "Essential concepts every trader must know",
        estimatedTime: "2 weeks",
        chapters: [
          {
            id: 1,
            title: "Market Structure and Psychology",
            duration: "40 min",
            content: `Understanding market structure and psychology is fundamental to successful trading. Markets are driven by human emotions and behaviors that create predictable patterns.

**Market Participants:**

**1. Retail Traders (Individual investors)**
- Smaller position sizes
- Emotional decision making
- FOMO and panic selling
- Often follow trends late

**2. Institutional Investors**
- Large capital pools
- Sophisticated analysis tools
- Professional risk management
- Long-term strategies

**3. Market Makers**
- Provide liquidity to markets
- Profit from bid-ask spreads
- Use algorithms for trading
- Help reduce volatility

**4. Arbitrageurs**
- Exploit price differences across exchanges
- Help maintain price efficiency
- Use automated trading systems
- Quick to capitalize on opportunities

**Market Psychology Cycles:**

**1. Accumulation Phase**
- Smart money builds positions quietly
- Low volatility and volume
- Price moves sideways
- Public interest is minimal

**2. Markup Phase**
- Price starts trending upward
- Volume increases
- Media attention grows
- FOMO begins to set in

**3. Distribution Phase**
- Smart money starts taking profits
- High volatility and volume
- Price moves sideways at high levels
- Maximum public participation

**4. Markdown Phase**
- Price trends downward
- Panic selling occurs
- Volume spikes on down moves
- Capitulation and despair

**Key Emotions in Trading:**

**Fear:**
- Fear of missing out (FOMO)
- Fear of losing money
- Fear of being wrong
- Leads to poor timing and decisions

**Greed:**
- Wanting to make money quickly
- Not taking profits when appropriate
- Overleveraging positions
- Ignoring risk management

**Hope:**
- Holding losing positions too long
- Expecting markets to reverse
- Not cutting losses quickly
- Avoiding reality of bad trades

**Regret:**
- Second-guessing decisions
- Dwelling on missed opportunities
- Revenge trading after losses
- Paralysis from past mistakes

**Cognitive Biases:**

**Confirmation Bias:**
Seeking information that confirms existing beliefs while ignoring contradictory evidence.

**Anchoring Bias:**
Over-relying on the first piece of information encountered.

**Overconfidence Bias:**
Overestimating one's ability to predict market movements.

**Loss Aversion:**
The tendency to prefer avoiding losses over acquiring equivalent gains.

**Market Efficiency:**
Markets aren't perfectly efficient, creating opportunities for skilled traders to profit from:
- Information asymmetries
- Emotional reactions
- Technical patterns
- Fundamental mispricing

**Developing Trading Psychology:**
1. **Emotional Control**: Don't let emotions drive decisions
2. **Discipline**: Stick to your trading plan
3. **Patience**: Wait for high-probability setups
4. **Objectivity**: Analyze markets without bias
5. **Continuous Learning**: Adapt to changing market conditions`,
            keyTakeaways: [
              "Markets are driven by human psychology and emotions",
              "Understanding market cycles helps time entries and exits",
              "Cognitive biases can lead to poor trading decisions",
              "Emotional control and discipline are crucial for success"
            ],
            practicalTask: "Observe a trending cryptocurrency for one week and identify which phase of the market cycle it's in"
          }
        ]
      }
    ]
  },
  daos: {
    id: "daos",
    title: "DAOs & Governance",
    description: "Understand decentralized autonomous organizations and on-chain governance",
    longDescription: "Learn how DAOs work, participate in governance, and understand the future of decentralized organizations.",
    level: "Intermediate",
    duration: "4-5 weeks",
    color: "bg-indigo-500",
    icon: "Users",
    prerequisites: ["Web3 Foundations"],
    learningOutcomes: [
      "Understand DAO structures and governance models",
      "Participate in on-chain voting and proposals",
      "Analyze tokenomics and governance tokens",
      "Create and manage DAO proposals",
      "Understand legal and regulatory considerations"
    ],
    modules: [
      {
        id: 1,
        title: "Introduction to DAOs",
        description: "Understanding decentralized autonomous organizations",
        estimatedTime: "1 week",
        chapters: [
          {
            id: 1,
            title: "What are DAOs?",
            duration: "30 min",
            content: `A Decentralized Autonomous Organization (DAO) is an organization represented by rules encoded as a computer program that is transparent, controlled by the organization members, and not influenced by a central government.

**Traditional Organizations vs DAOs:**

**Traditional Organizations:**
- Hierarchical structure
- Centralized decision making
- Opaque operations
- Geographic limitations
- High barriers to entry
- Manual processes

**Decentralized Autonomous Organizations:**
- Flat or minimal hierarchy
- Democratic decision making
- Transparent operations
- Global participation
- Low barriers to entry
- Automated processes via smart contracts

**Key Components of a DAO:**

**1. Smart Contracts:**
The backbone of a DAO, containing:
- Governance rules
- Voting mechanisms
- Treasury management
- Proposal execution

**2. Governance Tokens:**
- Represent voting power in the DAO
- Often also represent economic stake
- Can be earned through contribution
- Tradeable on secondary markets

**3. Proposals:**
- Formal suggestions for DAO actions
- Can cover treasury allocation, parameter changes, strategic decisions
- Submitted by token holders
- Voted on by the community

**4. Treasury:**
- DAO's collective resources
- Managed by smart contracts
- Allocated through governance votes
- Can include tokens, NFTs, other assets

**Types of DAOs:**

**1. Protocol DAOs:**
- Govern DeFi protocols (Uniswap, Aave, Compound)
- Make decisions about protocol parameters
- Manage protocol treasuries
- Examples: UNI, AAVE, COMP

**2. Investment DAOs:**
- Pool capital for investments
- Make collective investment decisions
- Share returns among members
- Examples: The LAO, MetaCartel Ventures

**3. Service DAOs:**
- Provide services to other protocols or organizations
- Talent coordination and project delivery
- Examples: RaidGuild, LexDAO

**4. Social DAOs:**
- Focus on community and shared interests
- Social networking and coordination
- Examples: Friends with Benefits, Developer DAO

**5. Creator DAOs:**
- Support content creators and artists
- Fund creative projects
- Examples: PleasrDAO, FlamingoDAO

**DAO Governance Models:**

**1. Token-Based Voting:**
- One token = one vote
- Simple and straightforward
- Risk of whale domination

**2. Quadratic Voting:**
- Cost increases quadratically for additional votes
- Reduces whale influence
- More complex to implement

**3. Reputation-Based:**
- Voting power based on contribution history
- Rewards active participants
- Harder to game than pure token voting

**4. Delegated Voting:**
- Token holders can delegate voting power
- Increases participation through representatives
- Used by protocols like Compound and Gitcoin

**Benefits of DAOs:**
- **Transparency**: All decisions and transactions on-chain
- **Global Access**: Anyone can participate regardless of location
- **Efficiency**: Automated execution through smart contracts
- **Alignment**: Token incentives align individual and collective interests
- **Innovation**: Rapid experimentation and iteration

**Challenges:**
- **Coordination**: Difficult to coordinate large groups
- **Security**: Smart contract vulnerabilities
- **Legal Status**: Unclear regulatory framework
- **Participation**: Low voter turnout in many DAOs
- **Centralization Risk**: Power concentration in large holders`,
            keyTakeaways: [
              "DAOs are organizations governed by smart contracts and token holders",
              "They enable transparent, global, and democratic decision-making",
              "Different DAO types serve various purposes from protocol governance to investments",
              "Governance models vary but all aim to distribute decision-making power"
            ],
            practicalTask: "Join a DAO like Gitcoin or Uniswap, explore their governance forum, and observe how proposals are discussed"
          }
        ]
      }
    ]
  },
  security: {
    id: "security",
    title: "Security & Privacy",
    description: "Learn to protect yourself and your assets in the Web3 ecosystem",
    longDescription: "Master Web3 security practices, understand common attack vectors, and learn to protect your digital assets.",
    level: "Advanced",
    duration: "3-4 weeks",
    color: "bg-red-500",
    icon: "Shield",
    prerequisites: ["Web3 Foundations"],
    learningOutcomes: [
      "Identify and avoid common Web3 scams",
      "Implement proper wallet security practices",
      "Understand smart contract security",
      "Protect privacy in blockchain transactions",
      "Respond to security incidents"
    ],
    modules: [
      {
        id: 1,
        title: "Web3 Security Fundamentals",
        description: "Essential security practices for Web3 users",
        estimatedTime: "1 week",
        chapters: [
          {
            id: 1,
            title: "Common Attack Vectors",
            duration: "35 min",
            content: `Web3 introduces new security challenges that didn't exist in traditional web applications. Understanding these attack vectors is crucial for protecting your assets.

**1. Phishing Attacks:**

**Website Spoofing:**
- Fake versions of popular DeFi protocols
- Identical looking websites with malicious smart contracts
- Often use similar domain names (uniswap.corn instead of uniswap.org)
- Steal private keys or authorize malicious transactions

**Social Media Scams:**
- Fake support accounts on Twitter/Discord
- Impersonation of team members
- Fake giveaways and airdrops
- Direct message scams

**Protection:**
- Always check URLs carefully
- Bookmark legitimate protocol websites
- Never share private keys or seed phrases
- Verify official social media accounts

**2. Smart Contract Exploits:**

**Reentrancy Attacks:**
- Malicious contracts call back into victim contracts
- Drain funds before balances are updated
- Famous example: The DAO hack (2016)

**Flash Loan Attacks:**
- Borrow large amounts without collateral
- Manipulate prices or exploit arbitrage
- Repay loan in same transaction
- Example: bZx protocol attacks

**Oracle Manipulation:**
- Manipulate price feeds that smart contracts rely on
- Cause liquidations or profitable trades
- Target protocols with centralized oracles

**Front-Running:**
- Monitor mempool for profitable transactions
- Submit similar transaction with higher gas
- Profit from price movements
- MEV (Maximal Extractable Value) extraction

**3. Social Engineering:**

**Discord/Telegram Infiltration:**
- Hackers join project communities
- Build trust over time
- Eventually promote malicious links or contracts
- Target high-value community members

**Fake Support:**
- Impersonate customer support
- Ask for private keys "for verification"
- Direct users to malicious websites
- Create urgency to bypass critical thinking

**4. Wallet Security Risks:**

**Seed Phrase Exposure:**
- Taking photos of seed phrases
- Storing in cloud services
- Sharing with "support" personnel
- Using weak storage methods

**Hot Wallet Risks:**
- Browser extensions can be compromised
- Malware on computers
- Unauthorized access to devices
- Automatic transaction signing

**5. DeFi-Specific Attacks:**

**Impermanent Loss Exploitation:**
- Manipulate token prices in liquidity pools
- Cause LPs to lose money through price divergence
- Time attacks around major market movements

**Governance Attacks:**
- Acquire large amounts of governance tokens
- Propose malicious changes to protocols
- Rush votes through with minimal discussion
- Extract value from protocol treasuries

**6. NFT-Specific Scams:**

**Fake Collections:**
- Copy metadata from legitimate projects
- Create identical-looking NFTs
- List on marketplaces at lower prices
- Buyers receive worthless copies

**Metadata Manipulation:**
- Change NFT metadata after purchase
- Rug pull after initial sales
- Promise utility that never delivers

**Security Best Practices:**

**1. Wallet Hygiene:**
- Use hardware wallets for large amounts
- Keep hot wallets with minimal funds
- Use different wallets for different purposes
- Regular security audits of connected dApps

**2. Transaction Verification:**
- Always verify transaction details before signing
- Check contract addresses and function calls
- Use transaction simulation tools
- Understand what you're approving

**3. Information Security:**
- Never share private keys or seed phrases
- Use secure communication channels
- Be skeptical of unsolicited contact
- Verify information through multiple sources

**4. Operational Security:**
- Keep software updated
- Use antivirus and anti-malware
- Separate devices for high-value operations
- Regular backups of important data

**5. Community Awareness:**
- Follow security researchers and auditors
- Stay updated on latest attack vectors
- Participate in security-focused communities
- Report suspicious activity

**Red Flags to Watch For:**
- Promises of guaranteed returns
- Pressure to act quickly
- Requests for private information
- Unknown or unverified smart contracts
- Too-good-to-be-true opportunities
- Unsolicited investment advice`,
            keyTakeaways: [
              "Web3 introduces unique attack vectors not seen in traditional web",
              "Social engineering and phishing are the most common threats",
              "Smart contract exploits can drain entire protocols",
              "Multi-layered security approach is essential for protection"
            ],
            practicalTask: "Set up a hardware wallet and practice secure transaction signing procedures"
          }
        ]
      }
    ]
  }
};
