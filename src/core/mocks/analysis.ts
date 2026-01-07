/**
 * Analysis Result Types and Mock Data
 *
 * Types for AI analysis results and mock data for UI development
 */

import type { UserPreferences } from './preferences';

// Domain suggestion
export interface DomainSuggestion {
  domain: string;
  available: boolean;
  price?: number;
}

// Competitor info
export interface Competitor {
  name: string;
  url: string;
  description: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  traffic?: string;
}

// Keyword info for SEO
export interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
}

// Pricing tier
export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

// Launch channel
export interface LaunchChannel {
  name: string;
  priority: 'high' | 'medium' | 'low';
  expectedTraffic: string;
}

// Risk item
export interface Risk {
  level: 'high' | 'medium' | 'low';
  description: string;
}

// Concept analysis result
export interface ConceptAnalysis {
  productNames: string[];
  coreValue: string;
  mvpFeatures: string[];
  targetUsers: string[];
  differentiation: string[];
  suggestedDomains: DomainSuggestion[];
}

// Competitor analysis result
export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketGaps: string[];
  opportunities: string[];
}

// SEO analysis result
export interface SEOAnalysis {
  primaryKeywords: Keyword[];
  secondaryKeywords: Keyword[];
  trafficPotential: string;
  timeline: string;
}

// Monetization analysis result
export interface MonetizationAnalysis {
  recommendedModel: string;
  pricingTiers: PricingTier[];
  projectedMRR: {
    month3: string;
    month6: string;
    month12: string;
  };
}

// Marketing analysis result
export interface MarketingAnalysis {
  launchChannels: LaunchChannel[];
  targetCommunities: string[];
  contentStrategy: {
    blog: string;
    social: string;
  };
}

// Feasibility verdict
export type FeasibilityVerdict = 'PASS' | 'CONDITIONAL' | 'FAIL';

// Feasibility analysis result
export interface FeasibilityAnalysis {
  totalScore: number;
  verdict: FeasibilityVerdict;
  categoryScores: {
    marketDemand: number;
    competition: number;
    technicalFeasibility: number;
    monetizationPotential: number;
  };
  summary: string;
  risks: Risk[];
  recommendations: string[];
}

// Complete idea analysis
export interface IdeaAnalysis {
  id: string;
  ideaId: string;
  analyzedAt: string;
  userPreferencesSnapshot: UserPreferences;
  concept: ConceptAnalysis;
  competitors: CompetitorAnalysis;
  seo: SEOAnalysis;
  monetization: MonetizationAnalysis;
  marketing: MarketingAnalysis;
  feasibility: FeasibilityAnalysis;
}

// Analysis tab types
export type AnalysisTab = 'concept' | 'competitors' | 'seo' | 'monetization' | 'marketing' | 'feasibility';

// Mock analysis data
export const mockAnalyses: IdeaAnalysis[] = [
  {
    id: 'analysis-1',
    ideaId: '1',
    analyzedAt: '2026-01-06T10:15:00Z',
    userPreferencesSnapshot: {
      niches: ['saas', 'productivity'],
      targetRevenue: 'fulltime',
      serviceScale: 'small-team',
      onboardingCompleted: true,
      updatedAt: '2026-01-06T00:00:00Z',
    },
    concept: {
      productNames: ['PriceRadar', 'CompetitorWatch', 'PriceAlert Pro'],
      coreValue: 'Real-time competitor price monitoring that enables immediate pricing strategy response.',
      mvpFeatures: [
        'Competitor URL registration (up to 10)',
        'Automatic price change detection',
        'Email/Slack real-time alerts',
        'Price history chart',
        'Weekly report auto-delivery',
      ],
      targetUsers: ['B2B SaaS founders', 'E-commerce sellers', 'Pricing managers'],
      differentiation: [
        'Real-time alerts (competitors only check daily)',
        'AI-powered price change analysis',
        'Competitor promotion calendar prediction',
      ],
      suggestedDomains: [
        { domain: 'priceradar.io', available: true, price: 12 },
        { domain: 'competitorwatch.com', available: false },
        { domain: 'pricealert.pro', available: true, price: 35 },
      ],
    },
    competitors: {
      competitors: [
        {
          name: 'Prisync',
          url: 'https://prisync.com',
          description: 'E-commerce price monitoring tool',
          pricing: '$99-299/mo',
          strengths: ['Large data scale', 'E-commerce focused'],
          weaknesses: ['No SaaS support', 'Expensive'],
          traffic: '50K/mo',
        },
        {
          name: 'Competera',
          url: 'https://competera.net',
          description: 'AI-driven pricing platform',
          pricing: 'Enterprise pricing',
          strengths: ['AI optimization', 'Enterprise grade'],
          weaknesses: ['Complex setup', 'High cost'],
          traffic: '30K/mo',
        },
      ],
      marketGaps: [
        'No SaaS-focused price monitoring tool',
        'Real-time alert functionality lacking',
        'No affordable option for small teams',
      ],
      opportunities: [
        'Focus on SaaS vertical for differentiation',
        'Entry at $19-49/mo price point',
        'Slack/Discord integration for developer audience',
      ],
    },
    seo: {
      primaryKeywords: [
        { keyword: 'competitor price monitoring', volume: 1200, difficulty: 35, cpc: 8.5 },
        { keyword: 'price tracking tool', volume: 2400, difficulty: 45, cpc: 6.2 },
        { keyword: 'competitor pricing alert', volume: 480, difficulty: 25, cpc: 4.8 },
      ],
      secondaryKeywords: [
        { keyword: 'saas pricing monitor', volume: 320, difficulty: 20 },
        { keyword: 'price change notification', volume: 590, difficulty: 30 },
      ],
      trafficPotential: '3,000-5,000/mo (after 6 months)',
      timeline: 'Top 10 ranking possible in 3-6 months for primary keywords',
    },
    monetization: {
      recommendedModel: 'Freemium SaaS (monthly subscription)',
      pricingTiers: [
        { name: 'Free', price: '$0', features: ['2 competitors', 'Daily check', 'Email alerts'] },
        { name: 'Pro', price: '$19/mo', features: ['10 competitors', 'Real-time alerts', 'Slack integration'] },
        { name: 'Business', price: '$49/mo', features: ['Unlimited competitors', 'API access', 'Priority support'] },
      ],
      projectedMRR: {
        month3: '$500-800',
        month6: '$1,500-2,500',
        month12: '$4,000-6,000',
      },
    },
    marketing: {
      launchChannels: [
        { name: 'ProductHunt', priority: 'high', expectedTraffic: '1,000-2,000' },
        { name: 'r/SaaS', priority: 'high', expectedTraffic: '300-500' },
        { name: 'Indie Hackers', priority: 'medium', expectedTraffic: '200-400' },
      ],
      targetCommunities: ['r/Entrepreneur', 'r/ecommerce', 'SaaS Twitter', 'LinkedIn SaaS groups'],
      contentStrategy: {
        blog: 'Twice weekly - pricing strategy guides, case studies',
        social: 'Daily - price change news, competitor analysis tips',
      },
    },
    feasibility: {
      totalScore: 78,
      verdict: 'PASS',
      categoryScores: {
        marketDemand: 85,
        competition: 70,
        technicalFeasibility: 80,
        monetizationPotential: 82,
      },
      summary: 'Promising idea with validated demand and clear market gap. The niche focus on SaaS pricing creates differentiation opportunity.',
      risks: [
        { level: 'medium', description: 'Large competitor entry possible as market grows' },
        { level: 'low', description: 'Scraping technology restrictions may affect data collection' },
      ],
      recommendations: [
        'Focus on SaaS vertical for differentiation',
        'Launch MVP within 3 months',
        'Use ProductHunt for initial traction',
        'Build Slack integration early for virality',
      ],
    },
  },
  {
    id: 'analysis-2',
    ideaId: '2',
    analyzedAt: '2026-01-05T14:30:00Z',
    userPreferencesSnapshot: {
      niches: ['saas', 'productivity'],
      targetRevenue: 'fulltime',
      serviceScale: 'small-team',
      onboardingCompleted: true,
      updatedAt: '2026-01-06T00:00:00Z',
    },
    concept: {
      productNames: ['VoiceNotes AI', 'MeetingMemo', 'TranscribeFlow'],
      coreValue: 'Automatically convert voice memos into structured meeting notes with action items.',
      mvpFeatures: [
        'Voice recording or file upload',
        'AI transcription with speaker detection',
        'Automatic action item extraction',
        'Meeting summary generation',
        'Export to Notion/Google Docs',
      ],
      targetUsers: ['Product managers', 'Executives', 'Consultants', 'Remote team leads'],
      differentiation: [
        'Focus on action item extraction',
        'Meeting-specific formatting',
        'Integration with productivity tools',
      ],
      suggestedDomains: [
        { domain: 'voicenotes.ai', available: false },
        { domain: 'meetingmemo.io', available: true, price: 25 },
        { domain: 'transcribeflow.com', available: true, price: 15 },
      ],
    },
    competitors: {
      competitors: [
        {
          name: 'Otter.ai',
          url: 'https://otter.ai',
          description: 'AI meeting transcription',
          pricing: '$16.99/mo',
          strengths: ['Real-time transcription', 'Large user base'],
          weaknesses: ['Generic output', 'No action item focus'],
          traffic: '2M/mo',
        },
      ],
      marketGaps: [
        'Existing tools lack structured output',
        'No focus on action item extraction',
        'Poor integration with task management tools',
      ],
      opportunities: [
        'Specialize in action-oriented output',
        'Deep integration with Notion, Linear, Jira',
        'Focus on executive/PM persona',
      ],
    },
    seo: {
      primaryKeywords: [
        { keyword: 'voice memo to notes', volume: 880, difficulty: 40 },
        { keyword: 'meeting transcription app', volume: 3200, difficulty: 55 },
      ],
      secondaryKeywords: [],
      trafficPotential: '2,000-4,000/mo (after 6 months)',
      timeline: 'Challenging due to competition, focus on long-tail keywords',
    },
    monetization: {
      recommendedModel: 'Freemium with usage limits',
      pricingTiers: [
        { name: 'Free', price: '$0', features: ['5 memos/mo', 'Basic transcription'] },
        { name: 'Pro', price: '$12/mo', features: ['Unlimited memos', 'Action items', 'Integrations'] },
        { name: 'Team', price: '$29/mo', features: ['Team sharing', 'Analytics', 'Priority processing'] },
      ],
      projectedMRR: {
        month3: '$300-500',
        month6: '$1,000-1,500',
        month12: '$3,000-4,500',
      },
    },
    marketing: {
      launchChannels: [
        { name: 'ProductHunt', priority: 'high', expectedTraffic: '800-1,500' },
        { name: 'r/Productivity', priority: 'high', expectedTraffic: '400-600' },
      ],
      targetCommunities: ['r/ProductManagement', 'Twitter PM community', 'LinkedIn'],
      contentStrategy: {
        blog: 'Weekly - meeting productivity tips',
        social: 'Daily - productivity hacks, user testimonials',
      },
    },
    feasibility: {
      totalScore: 82,
      verdict: 'PASS',
      categoryScores: {
        marketDemand: 87,
        competition: 65,
        technicalFeasibility: 85,
        monetizationPotential: 78,
      },
      summary: 'Strong demand with clear differentiation opportunity through action item focus. Competition is intense but market is large enough.',
      risks: [
        { level: 'medium', description: 'Established players like Otter.ai may add similar features' },
        { level: 'low', description: 'AI transcription costs may squeeze margins' },
      ],
      recommendations: [
        'Focus heavily on action item extraction as differentiator',
        'Build deep integrations with Notion and Linear',
        'Target PM and executive persona specifically',
      ],
    },
  },
  {
    id: 'analysis-3',
    ideaId: '3',
    analyzedAt: '2026-01-04T09:00:00Z',
    userPreferencesSnapshot: {
      niches: ['saas', 'productivity'],
      targetRevenue: 'fulltime',
      serviceScale: 'small-team',
      onboardingCompleted: true,
      updatedAt: '2026-01-06T00:00:00Z',
    },
    concept: {
      productNames: ['InvoiceOnce', 'PayOnce Invoice', 'SimpleInvoice'],
      coreValue: 'One-time payment invoicing tool for freelancers - no subscriptions.',
      mvpFeatures: [
        'Invoice creation and customization',
        'Client management',
        'Payment tracking',
        'PDF export',
        'Basic reporting',
      ],
      targetUsers: ['Freelancers', 'Solo consultants', 'Small agencies'],
      differentiation: [
        'One-time payment model (no subscription)',
        'Extreme simplicity',
        'Offline-first with cloud sync',
      ],
      suggestedDomains: [
        { domain: 'invoiceonce.com', available: true, price: 20 },
        { domain: 'payonceinvoice.com', available: true, price: 12 },
        { domain: 'simpleinvoice.io', available: false },
      ],
    },
    competitors: {
      competitors: [
        {
          name: 'FreshBooks',
          url: 'https://freshbooks.com',
          description: 'Cloud accounting for freelancers',
          pricing: '$17-55/mo',
          strengths: ['Full featured', 'Well known'],
          weaknesses: ['Subscription model', 'Overkill for simple needs'],
          traffic: '1.5M/mo',
        },
      ],
      marketGaps: [
        'All major tools require subscriptions',
        'Freelancers with few invoices overpay',
        'Many want simple tool without accounting features',
      ],
      opportunities: [
        'One-time payment appeals to subscription fatigue',
        'Target freelancers with < 10 invoices/month',
        'Desktop app with optional cloud sync',
      ],
    },
    seo: {
      primaryKeywords: [
        { keyword: 'free invoice tool', volume: 4500, difficulty: 60 },
        { keyword: 'invoice software no subscription', volume: 320, difficulty: 25 },
      ],
      secondaryKeywords: [],
      trafficPotential: '1,500-2,500/mo (after 6 months)',
      timeline: 'Focus on "no subscription" long-tail keywords',
    },
    monetization: {
      recommendedModel: 'One-time purchase with optional add-ons',
      pricingTiers: [
        { name: 'Basic', price: '$29 one-time', features: ['Unlimited invoices', 'PDF export', 'Client list'] },
        { name: 'Pro', price: '$49 one-time', features: ['Everything in Basic', 'Custom branding', 'Reports'] },
        { name: 'Cloud Sync', price: '$19/year optional', features: ['Sync across devices', 'Backup'] },
      ],
      projectedMRR: {
        month3: '$400-600 (one-time sales)',
        month6: '$800-1,200',
        month12: '$2,000-3,000',
      },
    },
    marketing: {
      launchChannels: [
        { name: 'r/Freelance', priority: 'high', expectedTraffic: '500-800' },
        { name: 'ProductHunt', priority: 'high', expectedTraffic: '1,000-1,500' },
      ],
      targetCommunities: ['r/Freelance', 'Freelancer Facebook groups', 'Twitter indie community'],
      contentStrategy: {
        blog: 'Monthly - freelance finance tips',
        social: 'Weekly - subscription fatigue, simple tool advocacy',
      },
    },
    feasibility: {
      totalScore: 85,
      verdict: 'PASS',
      categoryScores: {
        marketDemand: 91,
        competition: 75,
        technicalFeasibility: 90,
        monetizationPotential: 80,
      },
      summary: 'Excellent fit for solo developer. Clear market gap with subscription fatigue driving demand. Low technical complexity.',
      risks: [
        { level: 'low', description: 'Major players unlikely to change pricing model' },
        { level: 'low', description: 'One-time payment may limit long-term revenue' },
      ],
      recommendations: [
        'Build as desktop-first for offline capability',
        'Launch quickly - low technical complexity',
        'Consider lifetime deal sites for initial sales',
        'Add optional cloud sync for recurring revenue',
      ],
    },
  },
];

/**
 * Get analysis by ID
 */
export function getAnalysisById(id: string): IdeaAnalysis | undefined {
  return mockAnalyses.find(a => a.id === id);
}

/**
 * Get analysis by idea ID
 */
export function getAnalysisByIdeaId(ideaId: string): IdeaAnalysis | undefined {
  return mockAnalyses.find(a => a.ideaId === ideaId);
}

/**
 * Get all analyses
 */
export function getAllAnalyses(): IdeaAnalysis[] {
  return mockAnalyses;
}

/**
 * Check if idea has analysis
 */
export function hasAnalysis(ideaId: string): boolean {
  return mockAnalyses.some(a => a.ideaId === ideaId);
}
