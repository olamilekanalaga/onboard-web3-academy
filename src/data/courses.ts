

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
import { foundationCourse } from './foundationCourse';
import { defiFundamentalsCourse } from './defiFundamentalsCourse';
import { degenCourseMetadata } from './degenCourse';
import { contentCreationCourse } from './contentCreationCourse';
import { nftCreationCourse } from './nftCreationCourse';

// Comprehensive crypto education platform courses
export const courses: Record<string, Course> = {
  foundation: {
    ...foundationCourse,
    icon: null
  },
  'defi-fundamentals': {
    ...defiFundamentalsCourse,
    icon: null,
    longDescription: 'Comprehensive introduction to Decentralized Finance (DeFi) protocols, yield farming, liquidity provision, and advanced DeFi strategies.',
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    learningOutcomes: [
      'Understand DeFi protocols and how they work',
      'Learn about yield farming and liquidity mining',
      'Master DeFi security best practices',
      'Navigate popular DeFi platforms confidently'
    ],
    difficulty: 2,
    category: 'defi' as const,
    skills: ['DeFi Protocols', 'Yield Farming', 'Liquidity Provision', 'DeFi Security']
  },
  degen: {
    ...degenCourseMetadata,
    longDescription: 'Master the art of high-risk, high-reward cryptocurrency trading with advanced strategies, risk management, and psychological techniques. Learn memecoin analysis, DeFi strategies, and advanced technical analysis.',
    color: 'from-purple-400 to-purple-600',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    icon: null,
    duration: '4-6 weeks',
    learningOutcomes: [
      'Master memecoin and altcoin analysis',
      'Understand advanced DeFi strategies',
      'Implement sophisticated risk management',
      'Develop psychological trading edge'
    ],
    skills: ['Memecoin Analysis', 'High-Risk Trading', 'DeFi Strategies', 'Risk Management'],
    modules: [
      {
        id: 1,
        title: 'The Degen Mindset & Psychology',
        description: 'Understanding the psychology behind high-risk trading and developing the right mindset',
        estimatedTime: '1 week',
        xpReward: 200,
        chapters: [
          {
            id: 1,
            title: 'What Does "Degen" Really Mean?',
            duration: '15 min',
            content: 'Understand the true meaning of being a "degen" trader and the culture behind it.',
            keyTakeaways: [
              'Origin of "degen" in crypto culture',
              'High-risk, high-reward mentality',
              'FOMO and YOLO psychology'
            ],
            xpReward: 50,
            difficulty: 'easy' as const,
            tags: ['psychology', 'culture', 'mindset']
          }
        ]
      }
    ]
  },
  'content-creation': {
    ...contentCreationCourse,
    icon: null,
    longDescription: 'Learn to create engaging crypto and blockchain content across multiple platforms. Master storytelling, video production, and audience building in the crypto space.',
    color: 'from-pink-400 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
    learningOutcomes: [
      'Create compelling crypto content',
      'Build and engage audiences',
      'Master video and written content',
      'Monetize your content effectively'
    ],
    difficulty: 2,
    category: 'fundamentals' as const,
    skills: ['Content Creation', 'Video Production', 'Audience Building', 'Storytelling']
  },
  'advanced-trading': {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    description: 'Master professional trading techniques, risk management, and market analysis',
    longDescription: 'Deep dive into professional-grade trading strategies, advanced technical analysis, risk management frameworks, and market psychology. Learn from real-world case studies and develop skills used by institutional traders.',
    level: 'Advanced' as const,
    duration: '5-7 weeks',
    color: 'from-red-400 to-red-600',
    gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    icon: null,
    prerequisites: ['degen'],
    learningOutcomes: [
      'Master advanced technical analysis patterns',
      'Implement professional risk management strategies',
      'Understand market psychology and sentiment analysis',
      'Execute complex trading strategies with confidence'
    ],
    totalXP: 1200,
    difficulty: 4,
    category: 'trading' as const,
    skills: ['Advanced TA', 'Risk Management', 'Market Psychology', 'Portfolio Management'],
    certification: {
      available: true,
      requirements: ['Complete all modules', 'Pass trading simulation', 'Pass final assessment'],
      credentialName: 'Advanced Trading Strategies Certificate'
    },
    modules: [
      {
        id: 1,
        title: 'Advanced Technical Analysis',
        description: 'Master complex chart patterns and technical indicators',
        estimatedTime: '2 weeks',
        xpReward: 400,
        chapters: [
          {
            id: 1,
            title: 'Professional Chart Patterns',
            duration: '45 min',
            content: 'Advanced chart pattern recognition and trading strategies...',
            keyTakeaways: [
              'Complex chart patterns indicate major market moves',
              'Volume confirmation is crucial for pattern validity',
              'Professional traders use multiple timeframe analysis'
            ],
            xpReward: 100,
            difficulty: 'hard' as const,
            tags: ['technical-analysis', 'chart-patterns', 'advanced']
          }
        ]
      }
    ]
  },
  'nft-creation': {
    ...nftCreationCourse,
    icon: null,
    category: 'development' as const
  },
  development: {
    id: 'development',
    title: 'Blockchain Development',
    description: 'Learn to build decentralized applications and smart contracts',
    longDescription: 'Comprehensive blockchain development course covering smart contract programming, DApp development, security best practices, and deployment strategies. Build real-world projects and master the tools used by professional blockchain developers.',
    level: 'Expert' as const,
    duration: '6-8 weeks',
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    icon: null,
    prerequisites: ['defi-fundamentals'],
    learningOutcomes: [
      'Write secure smart contracts in Solidity',
      'Build full-stack decentralized applications',
      'Implement security best practices',
      'Deploy and maintain blockchain applications'
    ],
    totalXP: 1500,
    difficulty: 5,
    category: 'development' as const,
    skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'DApp Development'],
    certification: {
      available: true,
      requirements: ['Complete all modules', 'Build capstone project', 'Pass security audit simulation'],
      credentialName: 'Blockchain Developer Certificate'
    },
    modules: [
      {
        id: 1,
        title: 'Smart Contract Development',
        description: 'Learn Solidity and smart contract programming',
        estimatedTime: '3 weeks',
        xpReward: 500,
        chapters: [
          {
            id: 1,
            title: 'Solidity Fundamentals',
            duration: '60 min',
            content: 'Learn the basics of Solidity programming language...',
            keyTakeaways: [
              'Solidity is the primary language for Ethereum smart contracts',
              'Understanding gas optimization is crucial for cost-effective contracts',
              'Security best practices prevent costly vulnerabilities'
            ],
            xpReward: 125,
            difficulty: 'hard' as const,
            tags: ['solidity', 'smart-contracts', 'programming']
          }
        ]
      }
    ]
  }
};
