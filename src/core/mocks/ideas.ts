/**
 * Mock Ideas Data
 *
 * 백엔드 API 연동 전까지 사용할 Mock 데이터
 */

export interface ScoreBreakdown {
  upvotes: number;      // max 30
  comments: number;     // max 25
  repetition: number;   // max 25
  sentiment: number;    // max 15
  freshness: number;    // max 5
}

export interface Idea {
  id: string;
  quote: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  score: number;
  timeAgo: string;
  category: string;
  redditUrl: string;
  author: string;
  scoreBreakdown: ScoreBreakdown;
  createdAt: string;
  isBookmarked?: boolean;
}

export const CATEGORIES = [
  'SaaS',
  'Developer Tools',
  'Productivity',
  'E-commerce',
  'Health & Fitness',
  'Finance',
  'Education',
  'Mobile Apps',
  'AI/ML',
  'Marketing',
  'Social',
  'Gaming',
] as const;

export type Category = typeof CATEGORIES[number];

export const mockIdeas: Idea[] = [
  {
    id: '1',
    quote: 'Someone should build a tool that monitors competitor pricing and alerts you when they change. I\'d pay $50/month for this.',
    subreddit: 'r/SaaS',
    upvotes: 234,
    comments: 67,
    score: 94,
    timeAgo: '2 days ago',
    category: 'SaaS',
    redditUrl: 'https://reddit.com/r/SaaS/comments/example1',
    author: 'startup_founder_123',
    scoreBreakdown: {
      upvotes: 28,
      comments: 22,
      repetition: 25,
      sentiment: 14,
      freshness: 5,
    },
    createdAt: '2026-01-04T10:30:00Z',
    isBookmarked: true,
  },
  {
    id: '2',
    quote: 'I wish there was an app that automatically converts my voice memos into formatted meeting notes with action items.',
    subreddit: 'r/Productivity',
    upvotes: 156,
    comments: 43,
    score: 87,
    timeAgo: '3 days ago',
    category: 'Productivity',
    redditUrl: 'https://reddit.com/r/Productivity/comments/example2',
    author: 'busy_pm_2025',
    scoreBreakdown: {
      upvotes: 24,
      comments: 18,
      repetition: 22,
      sentiment: 13,
      freshness: 4,
    },
    createdAt: '2026-01-03T14:20:00Z',
  },
  {
    id: '3',
    quote: 'Why doesn\'t anyone make a simple invoicing tool for freelancers that doesn\'t require a subscription? Just pay once.',
    subreddit: 'r/Freelance',
    upvotes: 312,
    comments: 89,
    score: 91,
    timeAgo: '1 day ago',
    category: 'Finance',
    redditUrl: 'https://reddit.com/r/Freelance/comments/example3',
    author: 'freelance_dev_mike',
    scoreBreakdown: {
      upvotes: 29,
      comments: 23,
      repetition: 20,
      sentiment: 14,
      freshness: 5,
    },
    createdAt: '2026-01-05T09:15:00Z',
    isBookmarked: true,
  },
  {
    id: '4',
    quote: 'Someone needs to build a browser extension that blocks AI-generated content from search results. Would pay good money.',
    subreddit: 'r/Technology',
    upvotes: 567,
    comments: 124,
    score: 96,
    timeAgo: '4 hours ago',
    category: 'Developer Tools',
    redditUrl: 'https://reddit.com/r/Technology/comments/example4',
    author: 'tech_purist_99',
    scoreBreakdown: {
      upvotes: 30,
      comments: 25,
      repetition: 22,
      sentiment: 14,
      freshness: 5,
    },
    createdAt: '2026-01-06T08:00:00Z',
  },
  {
    id: '5',
    quote: 'There should be an app that tracks all my subscriptions and alerts me before renewals. Would save me hundreds a year.',
    subreddit: 'r/personalfinance',
    upvotes: 423,
    comments: 98,
    score: 89,
    timeAgo: '5 days ago',
    category: 'Finance',
    redditUrl: 'https://reddit.com/r/personalfinance/comments/example5',
    author: 'savings_guru_2025',
    scoreBreakdown: {
      upvotes: 27,
      comments: 21,
      repetition: 23,
      sentiment: 13,
      freshness: 3,
    },
    createdAt: '2026-01-01T16:45:00Z',
  },
  {
    id: '6',
    quote: 'I need a tool that generates social media content from my blog posts automatically. Would pay $30/month easily.',
    subreddit: 'r/Marketing',
    upvotes: 189,
    comments: 52,
    score: 82,
    timeAgo: '6 days ago',
    category: 'Marketing',
    redditUrl: 'https://reddit.com/r/Marketing/comments/example6',
    author: 'content_marketer_jane',
    scoreBreakdown: {
      upvotes: 25,
      comments: 19,
      repetition: 18,
      sentiment: 12,
      freshness: 2,
    },
    createdAt: '2025-12-31T11:30:00Z',
  },
  {
    id: '7',
    quote: 'Someone should build a fitness app that creates workout plans based on available equipment at home. Not everyone has a full gym.',
    subreddit: 'r/Fitness',
    upvotes: 278,
    comments: 76,
    score: 85,
    timeAgo: '4 days ago',
    category: 'Health & Fitness',
    redditUrl: 'https://reddit.com/r/Fitness/comments/example7',
    author: 'home_workout_fan',
    scoreBreakdown: {
      upvotes: 26,
      comments: 20,
      repetition: 21,
      sentiment: 12,
      freshness: 4,
    },
    createdAt: '2026-01-02T07:00:00Z',
  },
  {
    id: '8',
    quote: 'Why is there no simple tool to convert Figma designs directly to React components? Would save developers hours.',
    subreddit: 'r/webdev',
    upvotes: 445,
    comments: 112,
    score: 92,
    timeAgo: '2 days ago',
    category: 'Developer Tools',
    redditUrl: 'https://reddit.com/r/webdev/comments/example8',
    author: 'frontend_dev_2025',
    scoreBreakdown: {
      upvotes: 28,
      comments: 24,
      repetition: 24,
      sentiment: 12,
      freshness: 4,
    },
    createdAt: '2026-01-04T13:20:00Z',
  },
  {
    id: '9',
    quote: 'I wish there was a platform that matches indie game developers with composers. Finding music for my games is so hard.',
    subreddit: 'r/gamedev',
    upvotes: 167,
    comments: 45,
    score: 78,
    timeAgo: '1 week ago',
    category: 'Gaming',
    redditUrl: 'https://reddit.com/r/gamedev/comments/example9',
    author: 'indie_dev_studio',
    scoreBreakdown: {
      upvotes: 23,
      comments: 17,
      repetition: 19,
      sentiment: 11,
      freshness: 2,
    },
    createdAt: '2025-12-30T09:45:00Z',
  },
  {
    id: '10',
    quote: 'Someone should create an AI tutor that adapts to each student\'s learning pace. Current EdTech solutions are too generic.',
    subreddit: 'r/education',
    upvotes: 234,
    comments: 67,
    score: 84,
    timeAgo: '5 days ago',
    category: 'Education',
    redditUrl: 'https://reddit.com/r/education/comments/example10',
    author: 'teacher_innovator',
    scoreBreakdown: {
      upvotes: 26,
      comments: 19,
      repetition: 20,
      sentiment: 13,
      freshness: 3,
    },
    createdAt: '2026-01-01T08:30:00Z',
  },
];

/**
 * Get idea by ID
 */
export function getIdeaById(id: string): Idea | undefined {
  return mockIdeas.find(idea => idea.id === id);
}

/**
 * Get ideas by category
 */
export function getIdeasByCategory(category: string): Idea[] {
  return mockIdeas.filter(idea => idea.category === category);
}

/**
 * Get bookmarked ideas
 */
export function getBookmarkedIdeas(): Idea[] {
  return mockIdeas.filter(idea => idea.isBookmarked);
}

/**
 * Get ideas sorted by score
 */
export function getIdeasByScore(ascending: boolean = false): Idea[] {
  return [...mockIdeas].sort((a, b) =>
    ascending ? a.score - b.score : b.score - a.score
  );
}

/**
 * Get category counts
 */
export function getCategoryCounts(): Record<string, number> {
  return mockIdeas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
