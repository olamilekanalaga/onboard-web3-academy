import { Course } from "@/types";

export const courses: Course[] = [
  {
    id: "foundation",
    title: "Crypto Foundation",
    description: "Master the fundamentals of cryptocurrency and blockchain technology",
    instructor: "Alex Chen",
    duration: "2 weeks",
    level: "Beginner",
    enrolled: 1240,
    rating: 4.8,
    price: "Free",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
    tags: ["Blockchain", "Cryptocurrency", "Basics"],
    chapters: [
      {
        title: "Introduction to Blockchain",
        lessons: [
          { title: "What is Blockchain?", duration: "20 min" },
          { title: "History of Blockchain", duration: "15 min" },
        ],
      },
      {
        title: "Cryptocurrency Basics",
        lessons: [
          { title: "What is Cryptocurrency?", duration: "25 min" },
          { title: "Bitcoin and Altcoins", duration: "20 min" },
        ],
      },
    ],
    progress: 70,
  },
  {
    id: "defi",
    title: "DeFi Mastery",
    description: "Learn decentralized finance protocols, yield farming, and liquidity provision",
    instructor: "Sarah Kim",
    duration: "3 weeks",
    level: "Intermediate",
    enrolled: 890,
    rating: 4.9,
    price: "$49",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=250&fit=crop",
    tags: ["DeFi", "Yield Farming", "Liquidity"],
    chapters: [
      {
        title: "DeFi Protocols",
        lessons: [
          { title: "Introduction to DeFi", duration: "30 min" },
          { title: "Lending and Borrowing", duration: "25 min" },
        ],
      },
      {
        title: "Yield Farming Strategies",
        lessons: [
          { title: "What is Yield Farming?", duration: "35 min" },
          { title: "Risks of Yield Farming", duration: "30 min" },
        ],
      },
    ],
    progress: 30,
  },
  {
    id: "degen",
    title: "Degen Trading",
    description: "Explore memecoins, leverage trading, and airdrop strategies",
    instructor: "Tom Lee",
    duration: "2 weeks",
    level: "Advanced",
    enrolled: 620,
    rating: 4.7,
    price: "$79",
    image: "https://images.unsplash.com/photo-1618523444535-c489ca1640ca?w=400&h=250&fit=crop",
    tags: ["Memecoins", "Leverage", "Airdrops"],
    chapters: [
      {
        title: "Memecoin Mania",
        lessons: [
          { title: "Understanding Memecoins", duration: "20 min" },
          { title: "Risks of Memecoins", duration: "15 min" },
        ],
      },
      {
        title: "Leverage Trading",
        lessons: [
          { title: "Introduction to Leverage", duration: "25 min" },
          { title: "Managing Risk", duration: "20 min" },
        ],
      },
    ],
    progress: 10,
  },
  {
    id: "advanced-trading",
    title: "Advanced Trading",
    description: "Learn technical analysis and derivatives trading",
    instructor: "Alice Johnson",
    duration: "3 weeks",
    level: "Advanced",
    enrolled: 480,
    rating: 4.6,
    price: "$99",
    image: "https://images.unsplash.com/photo-1576766411991-305b83c59951?w=400&h=250&fit=crop",
    tags: ["Technical Analysis", "Derivatives", "Trading"],
    chapters: [
      {
        title: "Technical Analysis",
        lessons: [
          { title: "Chart Patterns", duration: "30 min" },
          { title: "Indicators", duration: "25 min" },
        ],
      },
      {
        title: "Derivatives Trading",
        lessons: [
          { title: "Futures", duration: "35 min" },
          { title: "Options", duration: "30 min" },
        ],
      },
    ],
    progress: 0,
  },
  {
    id: "development",
    title: "Smart Contract Development",
    description: "Develop smart contracts and decentralized applications",
    instructor: "Bob Williams",
    duration: "4 weeks",
    level: "Intermediate",
    enrolled: 750,
    rating: 4.5,
    price: "$69",
    image: "https://images.unsplash.com/photo-1518770660439-464c4c6902b4?w=400&h=250&fit=crop",
    tags: ["Solidity", "dApps", "Smart Contracts"],
    chapters: [
      {
        title: "Solidity Basics",
        lessons: [
          { title: "Introduction to Solidity", duration: "20 min" },
          { title: "Data Types", duration: "15 min" },
        ],
      },
      {
        title: "dApp Development",
        lessons: [
          { title: "Building a dApp", duration: "25 min" },
          { title: "Testing and Deployment", duration: "20 min" },
        ],
      },
    ],
    progress: 0,
  },
];
