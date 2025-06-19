// Import all individual course data
import { foundationCourse } from './foundationCourse';
import { defiFundamentalsCourse } from './defiFundamentalsCourse';
import { degenCourseMetadata, degenCourse } from './degenCourse';
import { nftCreationCourse } from './nftCreationCourse';
import { contentCreationCourse } from './contentCreationCourse';

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
    }
  ]
};

const blockchainDevelopmentCourse = {
  id: 'development',
  title: 'Blockchain Development Mastery',
  description: 'Complete guide to building on blockchain networks and creating dApps',
  longDescription: 'Comprehensive development course covering smart contracts, dApp development, and blockchain integration.',
  level: 'Advanced' as const,
  duration: '6-8 weeks',
  color: 'from-green-400 to-blue-600',
  gradient: 'bg-gradient-to-br from-green-400 to-blue-600',
  prerequisites: ['foundation', 'defi-fundamentals'],
  learningOutcomes: [
    'Build and deploy smart contracts',
    'Create full-stack dApps',
    'Understand blockchain architecture',
    'Master Web3 development tools'
  ],
  totalXP: 1500,
  difficulty: 5,
  category: 'development' as const,
  skills: ['Solidity', 'Web3.js', 'React', 'Smart Contracts'],
  certification: {
    available: true,
    requirements: ['Complete all modules', 'Build capstone project', 'Pass final assessment'],
    credentialName: 'Blockchain Development Certificate'
  },
  xpReward: 1500,
  modules: [
    {
      id: 1,
      title: 'Smart Contract Fundamentals',
      description: 'Learn Solidity and smart contract development',
      estimatedTime: '2 weeks',
      xpReward: 500,
      chapters: [
        {
          id: 1,
          title: 'Introduction to Solidity',
          duration: '60 min',
          content: `
## Smart Contract Development with Solidity

### Solidity Fundamentals

**What is Solidity?**
Solidity is a high-level programming language designed for implementing smart contracts on Ethereum and other EVM-compatible blockchains.

**Key Features:**
• **Statically typed:** Variable types must be declared
• **Contract-oriented:** Designed specifically for smart contracts
• **Inheritance support:** Object-oriented programming features
• **Built-in security features:** Gas optimization and safety checks

### Basic Syntax and Structure

**Contract Structure:**
\`\`\`solidity
pragma solidity ^0.8.0;

contract MyContract {
    // State variables
    uint256 public myNumber;
    address public owner;

    // Constructor
    constructor() {
        owner = msg.sender;
        myNumber = 0;
    }

    // Functions
    function setNumber(uint256 _number) public {
        require(msg.sender == owner, "Only owner can set number");
        myNumber = _number;
    }
}
\`\`\`

**Data Types:**
• **uint256:** Unsigned integer (256 bits)
• **address:** Ethereum address (20 bytes)
• **bool:** Boolean true/false
• **string:** Dynamic string
• **bytes:** Dynamic byte array
• **mapping:** Key-value storage
          `,
          keyTakeaways: [
            'Solidity is specifically designed for smart contract development',
            'Understanding data types and contract structure is fundamental',
            'Security considerations must be built into every contract',
            'Gas optimization is crucial for cost-effective contracts'
          ],
          xpReward: 125,
          difficulty: 'hard' as const,
          tags: ['solidity', 'smart-contracts', 'programming']
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
  'development': blockchainDevelopmentCourse
};
