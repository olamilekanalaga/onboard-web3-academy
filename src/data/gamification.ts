// Gamification system for the crypto education platform

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'practice' | 'community' | 'milestone';
  xpReward: number;
  requirements: {
    type: 'course_completion' | 'xp_threshold' | 'streak' | 'practice' | 'community';
    value: number | string;
    description: string;
  }[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedBy?: string[]; // User IDs who have unlocked this
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  coursesCompleted: string[];
  chaptersCompleted: string[];
  achievementsUnlocked: string[];
  badges: string[];
  practiceSessionsCompleted: number;
  communityContributions: number;
  lastActiveDate: Date;
  skillLevels: Record<string, number>; // skill -> level (1-5)
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalXP: number;
  level: number;
  rank: number;
  weeklyXP: number;
  monthlyXP: number;
  specializations: string[];
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: SkillNode[];
  prerequisites?: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  xpRequired: number;
  prerequisites: string[];
  unlocks: string[];
  rewards: {
    type: 'badge' | 'tool_access' | 'content_unlock' | 'certificate';
    value: string;
  }[];
  position: { x: number; y: number };
}

// Achievement definitions
export const achievements: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first crypto lesson',
    icon: '👶',
    category: 'learning',
    xpReward: 50,
    requirements: [
      {
        type: 'course_completion',
        value: 1,
        description: 'Complete any chapter'
      }
    ],
    rarity: 'common'
  },
  {
    id: 'foundation_master',
    name: 'Foundation Master',
    description: 'Complete the Foundation course',
    icon: '🏗️',
    category: 'learning',
    xpReward: 200,
    requirements: [
      {
        type: 'course_completion',
        value: 'foundation',
        description: 'Complete Foundation course'
      }
    ],
    rarity: 'rare'
  },
  {
    id: 'defi_explorer',
    name: 'DeFi Explorer',
    description: 'Complete the DeFi Fundamentals course',
    icon: '🏦',
    category: 'learning',
    xpReward: 300,
    requirements: [
      {
        type: 'course_completion',
        value: 'intermediate',
        description: 'Complete DeFi Fundamentals course'
      }
    ],
    rarity: 'epic'
  },
  {
    id: 'smart_contract_wizard',
    name: 'Smart Contract Wizard',
    description: 'Deploy your first smart contract',
    icon: '🧙‍♂️',
    category: 'practice',
    xpReward: 500,
    requirements: [
      {
        type: 'practice',
        value: 'deploy_contract',
        description: 'Successfully deploy a smart contract'
      }
    ],
    rarity: 'epic'
  },
  {
    id: 'security_guardian',
    name: 'Security Guardian',
    description: 'Complete advanced security training',
    icon: '🛡️',
    category: 'learning',
    xpReward: 400,
    requirements: [
      {
        type: 'course_completion',
        value: 'expert',
        description: 'Complete Expert level course'
      }
    ],
    rarity: 'legendary'
  },
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    category: 'milestone',
    xpReward: 300,
    requirements: [
      {
        type: 'streak',
        value: 30,
        description: 'Learn for 30 consecutive days'
      }
    ],
    rarity: 'rare'
  },
  {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Help 10 fellow learners in the community',
    icon: '🤝',
    category: 'community',
    xpReward: 250,
    requirements: [
      {
        type: 'community',
        value: 10,
        description: 'Provide helpful answers in community forums'
      }
    ],
    rarity: 'rare'
  },
  {
    id: 'xp_collector',
    name: 'XP Collector',
    description: 'Earn 10,000 total XP',
    icon: '💎',
    category: 'milestone',
    xpReward: 500,
    requirements: [
      {
        type: 'xp_threshold',
        value: 10000,
        description: 'Accumulate 10,000 XP'
      }
    ],
    rarity: 'epic'
  }
];

// Skill trees for different learning paths
export const skillTrees: SkillTree[] = [
  {
    id: 'crypto_fundamentals',
    name: 'Crypto Fundamentals',
    description: 'Master the basics of cryptocurrency and blockchain',
    category: 'fundamentals',
    nodes: [
      {
        id: 'money_basics',
        name: 'Money Basics',
        description: 'Understand the evolution of money',
        icon: '💰',
        level: 1,
        xpRequired: 100,
        prerequisites: [],
        unlocks: ['blockchain_intro'],
        rewards: [
          { type: 'badge', value: 'Money Master' }
        ],
        position: { x: 100, y: 100 }
      },
      {
        id: 'blockchain_intro',
        name: 'Blockchain Introduction',
        description: 'Learn how blockchain technology works',
        icon: '⛓️',
        level: 2,
        xpRequired: 200,
        prerequisites: ['money_basics'],
        unlocks: ['bitcoin_basics', 'crypto_wallets'],
        rewards: [
          { type: 'badge', value: 'Blockchain Explorer' }
        ],
        position: { x: 200, y: 100 }
      },
      {
        id: 'bitcoin_basics',
        name: 'Bitcoin Basics',
        description: 'Understand Bitcoin and digital gold concept',
        icon: '₿',
        level: 3,
        xpRequired: 300,
        prerequisites: ['blockchain_intro'],
        unlocks: ['altcoins'],
        rewards: [
          { type: 'badge', value: 'Bitcoin Pioneer' }
        ],
        position: { x: 150, y: 200 }
      },
      {
        id: 'crypto_wallets',
        name: 'Crypto Wallets',
        description: 'Master wallet security and management',
        icon: '👛',
        level: 3,
        xpRequired: 300,
        prerequisites: ['blockchain_intro'],
        unlocks: ['trading_basics'],
        rewards: [
          { type: 'badge', value: 'Wallet Guardian' },
          { type: 'tool_access', value: 'portfolio_tracker' }
        ],
        position: { x: 250, y: 200 }
      }
    ]
  },
  {
    id: 'defi_mastery',
    name: 'DeFi Mastery',
    description: 'Become an expert in decentralized finance',
    category: 'defi',
    prerequisites: ['crypto_fundamentals'],
    nodes: [
      {
        id: 'defi_intro',
        name: 'DeFi Introduction',
        description: 'Learn the basics of decentralized finance',
        icon: '🏦',
        level: 1,
        xpRequired: 400,
        prerequisites: [],
        unlocks: ['lending_borrowing', 'dex_trading'],
        rewards: [
          { type: 'badge', value: 'DeFi Pioneer' }
        ],
        position: { x: 100, y: 100 }
      },
      {
        id: 'lending_borrowing',
        name: 'Lending & Borrowing',
        description: 'Master DeFi lending protocols',
        icon: '🏛️',
        level: 2,
        xpRequired: 600,
        prerequisites: ['defi_intro'],
        unlocks: ['yield_farming'],
        rewards: [
          { type: 'badge', value: 'Lending Expert' },
          { type: 'tool_access', value: 'yield_calculator' }
        ],
        position: { x: 50, y: 200 }
      },
      {
        id: 'dex_trading',
        name: 'DEX Trading',
        description: 'Trade on decentralized exchanges',
        icon: '🔄',
        level: 2,
        xpRequired: 600,
        prerequisites: ['defi_intro'],
        unlocks: ['liquidity_provision'],
        rewards: [
          { type: 'badge', value: 'DEX Trader' },
          { type: 'tool_access', value: 'impermanent_loss_calculator' }
        ],
        position: { x: 150, y: 200 }
      }
    ]
  }
];

// Level system
export const levelSystem = {
  getLevel: (xp: number): number => {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 600) return 3;
    if (xp < 1000) return 4;
    if (xp < 1500) return 5;
    if (xp < 2500) return 6;
    if (xp < 4000) return 7;
    if (xp < 6000) return 8;
    if (xp < 9000) return 9;
    if (xp < 13000) return 10;
    return Math.floor(10 + (xp - 13000) / 2000);
  },
  
  getXPForNextLevel: (currentXP: number): number => {
    const level = levelSystem.getLevel(currentXP);
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 9000, 13000];
    
    if (level <= 10) {
      return thresholds[level] - currentXP;
    }
    
    const nextThreshold = 13000 + (level - 10) * 2000;
    return nextThreshold - currentXP;
  },
  
  getLevelTitle: (level: number): string => {
    if (level === 1) return 'Crypto Newbie';
    if (level <= 3) return 'Blockchain Explorer';
    if (level <= 5) return 'Crypto Enthusiast';
    if (level <= 7) return 'DeFi Practitioner';
    if (level <= 10) return 'Crypto Expert';
    if (level <= 15) return 'Blockchain Master';
    return 'Crypto Legend';
  }
};
