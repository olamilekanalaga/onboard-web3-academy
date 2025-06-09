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
import { degenCourse } from './degenCourse';
import { contentCreationCourse } from './contentCreationCourse';
import { nftCreationCourse } from './nftCreationCourse';

// Comprehensive crypto education platform courses
export const courses: Record<string, Course> = {
  foundation: foundationCourse,
  'defi-fundamentals': defiFundamentalsCourse,
  degen: degenCourse,
  'content-creation': contentCreationCourse,
  'advanced-trading': {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    description: 'Master professional trading techniques, risk management, and market analysis',
    level: 'Advanced',
    duration: '5-7 weeks',
    xpReward: 1200,
    modules: [
      {
        id: 'module-1',
        title: 'Advanced Technical Analysis',
        estimatedTime: '2 weeks',
        chapters: [
          {
            id: 'chapter-1',
            title: 'Professional Chart Patterns',
            duration: '45 min',
            content: 'Advanced chart pattern recognition and trading strategies...',
            keyTakeaways: [
              'Complex chart patterns indicate major market moves',
              'Volume confirmation is crucial for pattern validity',
              'Professional traders use multiple timeframe analysis'
            ]
          }
        ]
      }
    ]
  },
  'nft-creation': nftCreationCourse,
  development: {
    id: 'development',
    title: 'Blockchain Development',
    description: 'Learn to build decentralized applications and smart contracts',
    level: 'Expert',
    duration: '6-8 weeks',
    xpReward: 1500,
    modules: [
      {
        id: 'module-1',
        title: 'Smart Contract Development',
        estimatedTime: '3 weeks',
        chapters: [
          {
            id: 'chapter-1',
            title: 'Solidity Fundamentals',
            duration: '60 min',
            content: 'Learn the basics of Solidity programming language...',
            keyTakeaways: [
              'Solidity is the primary language for Ethereum smart contracts',
              'Understanding gas optimization is crucial for cost-effective contracts',
              'Security best practices prevent costly vulnerabilities'
            ]
          }
        ]
      }
    ]
  }
};
