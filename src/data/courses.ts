// Import all individual course data
import { foundationCourse } from './foundationCourse';
import { defiFundamentalsCourse } from './defiFundamentalsCourse';
import { degenCourseMetadata, degenCourse } from './degenCourse';
import { nftCreationCourse } from './nftCreationCourse';
import { contentCreationCourse } from './contentCreationCourse';
import { web3SecurityCourse } from './web3SecurityCourse';
import { daoGovernanceCourse } from './daoGovernanceCourse';
import { web3GamingCourse } from './web3GamingCourse';
import { cryptoTaxCourse } from './cryptoTaxCourse';
import { web3SocialCourse } from './web3SocialCourse';

// Create additional courses to reach 7 total
const advancedTradingCourse = {
  id: 'advanced-trading',
  title: 'Advanced Trading Strategies',
  description: 'Master technical analysis, derivatives, and professional trading techniques',
  longDescription: 'Advanced course covering sophisticated trading strategies, risk management, and market psychology for professional traders.',
  level: 'Advanced' as const,
  duration: '4-5 weeks',
  color: 'from-red-400 to-orange-600',
  gradient: 'bg-gradient-to-br from-red-400 to-orange-600',
  prerequisites: ['degen'],
  learningOutcomes: [
    'Master advanced technical analysis techniques',
    'Understand derivatives and complex instruments',
    'Develop professional risk management skills',
    'Build systematic trading approaches'
  ],
  totalXP: 1200,
  difficulty: 5,
  category: 'trading' as const,
  skills: ['Technical Analysis', 'Risk Management', 'Derivatives', 'Market Psychology'],
  certification: {
    available: true,
    requirements: ['Complete all modules', 'Pass trading simulation', 'Pass final assessment'],
    credentialName: 'Advanced Trading Certificate'
  },
  xpReward: 1200,
  modules: [
    {
      id: 1,
      title: 'Advanced Technical Analysis',
      description: 'Master sophisticated charting and analysis techniques',
      estimatedTime: '1.5 weeks',
      xpReward: 400,
      chapters: [
        {
          id: 1,
          title: 'Advanced Chart Patterns',
          duration: '45 min',
          content: `
## Advanced Chart Patterns and Market Structure

### Complex Chart Patterns

**Advanced Reversal Patterns:**
• **Head and Shoulders:** Classic reversal pattern with three peaks
• **Double Top/Bottom:** Strong reversal signals at key levels
• **Triple Top/Bottom:** Rare but powerful reversal patterns
• **Rounding Top/Bottom:** Gradual trend reversal patterns

**Continuation Patterns:**
• **Flags and Pennants:** Brief consolidation before trend continuation
• **Triangles:** Ascending, descending, and symmetrical formations
• **Rectangles:** Horizontal support and resistance ranges
• **Cup and Handle:** Bullish continuation pattern

### Market Structure Analysis

**Understanding Market Phases:**
• **Accumulation:** Smart money building positions
• **Markup:** Public participation and price appreciation
• **Distribution:** Smart money taking profits
• **Markdown:** Public selling and price decline

**Volume Analysis:**
• **Volume Profile:** Understanding price acceptance levels
• **On-Balance Volume:** Tracking money flow
• **Volume Weighted Average Price (VWAP):** Institutional reference point
• **Accumulation/Distribution Line:** Measuring buying/selling pressure
          `,
          keyTakeaways: [
            'Advanced patterns provide higher probability trade setups',
            'Market structure analysis reveals institutional behavior',
            'Volume confirmation is crucial for pattern validity',
            'Understanding market phases improves timing'
          ],
          xpReward: 100,
          difficulty: 'hard' as const,
          tags: ['technical-analysis', 'chart-patterns', 'market-structure']
        }
      ]
    },
    {
      id: 2,
      title: 'Ethereum Smart Contract Development with Solidity',
      description: 'Master Solidity programming and Ethereum smart contract development',
      estimatedTime: '3 weeks',
      xpReward: 600,
      chapters: [
        {
          id: 1,
          title: 'Solidity Fundamentals',
          duration: '75 min',
          content: `
## Mastering Solidity Programming

### Solidity Language Basics

**What is Solidity?**
Solidity is a statically-typed programming language designed for developing smart contracts that run on the Ethereum Virtual Machine (EVM).

**Core Concepts:**
\`\`\`solidity
pragma solidity ^0.8.19;

contract MyFirstContract {
    // State variables
    uint256 public count;
    address public owner;
    mapping(address => uint256) public balances;

    // Events
    event CountIncremented(uint256 newCount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        count = 0;
    }

    function increment() public onlyOwner {
        count++;
        emit CountIncremented(count);
    }
}
\`\`\`

### Advanced Solidity Features

**Inheritance:**
\`\`\`solidity
contract Base {
    uint256 public value;

    function setValue(uint256 _value) public virtual {
        value = _value;
    }
}

contract Derived is Base {
    function setValue(uint256 _value) public override {
        value = _value * 2;
    }
}
\`\`\`

### 📺 Video Resources:
- [Solidity Tutorial - 32 Hour Course](https://www.youtube.com/watch?v=M576WGiDBdQ) - freeCodeCamp
- [Learn Solidity in 1 Hour](https://www.youtube.com/watch?v=p3C7jljTXaA) - Dapp University
- [Advanced Solidity Concepts](https://www.youtube.com/watch?v=YJ-D1RMI0T0) - Smart Contract Programmer

### 📖 Article Resources:
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Solidity Security Patterns](https://fravoll.github.io/solidity-patterns/)
          `,
          keyTakeaways: [
            'Solidity syntax is similar to JavaScript but with blockchain-specific features',
            'Understanding state variables, functions, and modifiers is essential',
            'Events provide a way to log important contract activities',
            'Inheritance allows for code reusability and modularity'
          ],
          xpReward: 150,
          difficulty: 'medium' as const,
          tags: ['solidity', 'ethereum', 'programming', 'smart-contracts']
        },
        {
          id: 2,
          title: 'Building Your First DeFi Contract',
          duration: '90 min',
          content: `
## Creating a Simple DeFi Token Contract

### ERC-20 Token Implementation

**Standard Token Contract:**
\`\`\`solidity
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
\`\`\`

### Simple Staking Contract

**Staking Implementation:**
\`\`\`solidity
contract SimpleStaking {
    IERC20 public stakingToken;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTime;

    uint256 public rewardRate = 100; // 1% per day

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");

        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        stakingTime[msg.sender] = block.timestamp;
    }

    function calculateReward(address user) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakingTime[user];
        return (stakedBalance[user] * rewardRate * timeStaked) / (100 * 1 days);
    }
}
\`\`\`

### 📺 Video Resources:
- [Build ERC-20 Token from Scratch](https://www.youtube.com/watch?v=8rpir_ZSK1g) - Dapp University
- [DeFi Staking Contract Tutorial](https://www.youtube.com/watch?v=OJ-IRzCYzU8) - Smart Contract Programmer
- [OpenZeppelin Contracts Explained](https://www.youtube.com/watch?v=2g9R5ltfKdE) - OpenZeppelin

### 📖 Article Resources:
- [ERC-20 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
- [DeFi Development Guide](https://ethereum.org/en/defi/)
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)
          `,
          keyTakeaways: [
            'ERC-20 is the standard for fungible tokens on Ethereum',
            'OpenZeppelin provides secure, tested contract templates',
            'Staking contracts involve token transfers and reward calculations',
            'Security considerations are paramount in DeFi development'
          ],
          xpReward: 200,
          difficulty: 'hard' as const,
          tags: ['defi', 'erc20', 'staking', 'openzeppelin']
        }
      ]
    }
  ]
};

const blockchainDevelopmentCourse = {
  id: 'development',
  title: 'Blockchain Development Mastery',
  description: 'Complete guide to building on Ethereum (Solidity) and Solana (Rust) - from smart contracts to full dApps',
  longDescription: 'Comprehensive development course covering Ethereum smart contracts with Solidity, Solana programs with Rust, dApp development, and blockchain integration across multiple ecosystems.',
  level: 'Advanced' as const,
  duration: '8-12 weeks',
  color: 'from-green-400 to-blue-600',
  gradient: 'bg-gradient-to-br from-green-400 to-blue-600',
  prerequisites: ['foundation', 'defi-fundamentals'],
  learningOutcomes: [
    'Build and deploy Ethereum smart contracts with Solidity',
    'Develop Solana programs using Rust and Anchor',
    'Create full-stack dApps on multiple blockchains',
    'Understand blockchain architecture and consensus mechanisms',
    'Master Web3 development tools and frameworks',
    'Deploy to mainnet and manage production applications'
  ],
  totalXP: 2500,
  difficulty: 5,
  category: 'development' as const,
  skills: ['Solidity', 'Rust', 'Anchor Framework', 'Web3.js', 'React', 'Smart Contracts', 'Solana CLI'],
  certification: {
    available: true,
    requirements: ['Complete all modules', 'Build Ethereum dApp', 'Build Solana program', 'Pass final assessment'],
    credentialName: 'Full-Stack Blockchain Developer Certificate'
  },
  xpReward: 2500,
  modules: [
    {
      id: 1,
      title: 'Development Environment & Blockchain Fundamentals',
      description: 'Set up development tools and understand blockchain architecture',
      estimatedTime: '1 week',
      xpReward: 400,
      chapters: [
        {
          id: 1,
          title: 'Development Environment Setup',
          duration: '45 min',
          content: `
## Setting Up Your Blockchain Development Environment

### Essential Tools for Multi-Chain Development

**Ethereum Development Stack:**
- Node.js (v18+) and npm/yarn
- Hardhat framework
- MetaMask wallet
- Remix IDE
- OpenZeppelin contracts

**Solana Development Stack:**
- Rust programming language
- Solana CLI tools
- Anchor framework
- Phantom wallet
- Solana Explorer

### Installation Guide

**Ethereum Setup:**
\`\`\`bash
npm install -g hardhat
npm install @openzeppelin/contracts
npm install @nomiclabs/hardhat-ethers
\`\`\`

**Solana Setup:**
\`\`\`bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
npm install -g @coral-xyz/anchor-cli
\`\`\`

### 📺 Video Resources:
- [Complete Ethereum Dev Setup 2024](https://www.youtube.com/watch?v=gyMwXuJrbJQ) - Dapp University
- [Solana Development Environment](https://www.youtube.com/watch?v=0P8JeL3TURU) - Solana Foundation
- [Hardhat Tutorial Complete Guide](https://www.youtube.com/watch?v=9Qpi80dQsGU) - Patrick Collins

### 📖 Article Resources:
- [Ethereum Developer Documentation](https://ethereum.org/en/developers/docs/)
- [Solana Developer Resources](https://docs.solana.com/developers)
- [Hardhat Getting Started](https://hardhat.org/tutorial)
          `,
          keyTakeaways: [
            'Proper development environment is crucial for productivity',
            'Ethereum and Solana require different toolchains',
            'Local blockchain networks are essential for testing',
            'Version management ensures reproducible builds'
          ],
          xpReward: 100,
          difficulty: 'medium' as const,
          tags: ['setup', 'tools', 'ethereum', 'solana']
        },
        {
          id: 2,
          title: 'Blockchain Architecture Comparison',
          duration: '60 min',
          content: `
## Ethereum vs Solana: Architecture Deep Dive

### Ethereum Architecture
**Key Characteristics:**
- Account-based model
- Global state machine
- EVM (Ethereum Virtual Machine)
- Proof of Stake consensus
- Gas-based fee system

### Solana Architecture
**Key Characteristics:**
- Account model with programs
- Parallel transaction processing
- Sealevel runtime
- Proof of History + Proof of Stake
- Fixed fee structure

### Smart Contracts vs Programs

**Ethereum Smart Contracts:**
- Self-contained code and data
- Deployed to specific addresses
- Interact through function calls
- State stored within contract

**Solana Programs:**
- Stateless code execution
- Data stored in separate accounts
- Programs are upgradeable
- More efficient resource usage

### 📺 Video Resources:
- [Ethereum Architecture Explained](https://www.youtube.com/watch?v=zcX7OJ-L8XQ) - Finematics
- [Solana Architecture Deep Dive](https://www.youtube.com/watch?v=4dNuMXBjpr6) - Solana Foundation
- [EVM vs Solana Runtime Comparison](https://www.youtube.com/watch?v=kNuDHNa_yis) - Coin Bureau

### 📖 Article Resources:
- [Ethereum Yellow Paper Simplified](https://ethereum.github.io/yellowpaper/paper.pdf)
- [Solana Whitepaper](https://solana.com/solana-whitepaper.pdf)
- [Understanding Ethereum Gas](https://ethereum.org/en/developers/docs/gas/)
- [Solana Account Model Guide](https://docs.solana.com/developing/programming-model/accounts)
          `,
          keyTakeaways: [
            'Different blockchains have fundamentally different architectures',
            'Understanding the underlying model is crucial for development',
            'Ethereum prioritizes decentralization, Solana prioritizes speed',
            'Choose the right blockchain for your specific use case'
          ],
          xpReward: 150,
          difficulty: 'medium' as const,
          tags: ['architecture', 'ethereum', 'solana', 'comparison']
        }
      ]
    },
    {
      id: 3,
      title: 'Solana Program Development with Rust',
      description: 'Learn Rust programming and Solana program development',
      estimatedTime: '4 weeks',
      xpReward: 800,
      chapters: [
        {
          id: 1,
          title: 'Rust Programming Fundamentals',
          duration: '90 min',
          content: `
## Rust Programming for Blockchain Development

### Why Rust for Blockchain?
**Rust Advantages:**
- Memory safety without garbage collection
- Zero-cost abstractions
- Fearless concurrency
- Excellent performance
- Strong type system

### Rust Basics for Solana
\`\`\`rust
// Variables and mutability
let x = 5; // immutable
let mut y = 10; // mutable

// Functions
fn add(a: i32, b: i32) -> i32 {
    a + b // no semicolon = return value
}

// Structs
#[derive(Debug)]
struct User {
    name: String,
    age: u32,
    active: bool,
}
\`\`\`

### 📺 Video Resources:
- [Rust Programming Course - 15 Hours](https://www.youtube.com/watch?v=zF34dRivLOw) - freeCodeCamp
- [Rust for Solana Development](https://www.youtube.com/watch?v=vhWiRBfbglc) - Solana Foundation

### 📖 Article Resources:
- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
- [Solana Rust Guidelines](https://docs.solana.com/developing/on-chain-programs/developing-rust)
          `,
          keyTakeaways: [
            'Rust provides memory safety and performance for blockchain development',
            'Ownership system prevents common programming errors',
            'Understanding borrowing is crucial for Rust development'
          ],
          xpReward: 200,
          difficulty: 'hard' as const,
          tags: ['rust', 'programming', 'solana', 'fundamentals']
        },
        {
          id: 2,
          title: 'Anchor Framework Development',
          duration: '120 min',
          content: `
## Building with Anchor Framework

### What is Anchor?
Anchor is a framework for Solana's Sealevel runtime providing:
- Rust eDSL for writing programs
- IDL specification
- TypeScript package for clients
- CLI and workspace management

### Basic Anchor Program
\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
\`\`\`

### 📺 Video Resources:
- [Complete Anchor Tutorial](https://www.youtube.com/watch?v=_vQ3bSs3svs) - Solana Foundation
- [Anchor Framework Deep Dive](https://www.youtube.com/watch?v=cvW8EwGHw8U) - Solana Bytes

### 📖 Article Resources:
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
          `,
          keyTakeaways: [
            'Anchor simplifies Solana program development significantly',
            'Account validation is handled automatically by Anchor',
            'IDL generation enables easy client integration'
          ],
          xpReward: 300,
          difficulty: 'expert' as const,
          tags: ['anchor', 'solana', 'framework', 'defi']
        }
      ]
    }
  ]
};

// Convert degenCourse modules to proper format
const degenCourseFormatted = {
  ...degenCourseMetadata,
  longDescription: degenCourseMetadata.description,
  color: 'from-yellow-400 to-red-600',
  gradient: 'bg-gradient-to-br from-yellow-400 to-red-600',
  category: 'trading' as const,
  skills: ['Risk Management', 'Technical Analysis', 'DeFi Strategies', 'Market Psychology'],
  certification: {
    available: true,
    requirements: ['Complete all modules', 'Pass risk assessment', 'Pass final assessment'],
    credentialName: 'Degen Trading Certificate'
  },
  modules: degenCourse.map((module, index) => ({
    id: index + 1,
    title: module.title,
    description: module.description,
    estimatedTime: '1 week',
    xpReward: 300,
    chapters: module.chapters.map((chapter, chapterIndex) => ({
      id: chapterIndex + 1,
      title: chapter.title,
      duration: chapter.duration,
      content: `
## ${chapter.title}

${chapter.content.description}

### Key Points:
${chapter.content.keyPoints.map(point => `• ${point}`).join('\n')}

### Practical Example:
${chapter.content.practicalExample}

${chapter.content.warning ? `### ⚠️ Warning:
${chapter.content.warning}` : ''}
      `,
      keyTakeaways: chapter.content.keyPoints,
      xpReward: chapter.xpReward,
      difficulty: 'medium' as const,
      tags: ['degen-trading', 'high-risk', 'advanced-strategies']
    }))
  }))
};

// Create the courses object that maps IDs to course data
export const courses: Record<string, any> = {
  'foundation': foundationCourse,
  'defi-fundamentals': defiFundamentalsCourse,
  'degen': degenCourseFormatted,
  'nft-creation': nftCreationCourse,
  'content-creation': contentCreationCourse,
  'advanced-trading': advancedTradingCourse,
  'development': blockchainDevelopmentCourse,
  'web3-security': web3SecurityCourse,
  'dao-governance': daoGovernanceCourse,
  'web3-gaming': web3GamingCourse,
  'crypto-tax': cryptoTaxCourse,
  'web3-social': web3SocialCourse
};
