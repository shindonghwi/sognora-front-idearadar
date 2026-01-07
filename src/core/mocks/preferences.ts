/**
 * User Preferences Types and Mock Data
 *
 * Used for onboarding and personalized analysis
 */

// Revenue target options
export type TargetRevenue = 'side' | 'fulltime' | 'small-business' | 'startup';

// Service scale options
export type ServiceScale = 'solo' | 'small-team' | 'growth-startup';

// User preferences interface
export interface UserPreferences {
  niches: string[];
  targetRevenue: TargetRevenue;
  serviceScale: ServiceScale;
  onboardingCompleted: boolean;
  updatedAt: string;
}

// Niche option interface
export interface NicheOption {
  id: string;
  label: string;
}

// Revenue option interface
export interface RevenueOption {
  value: TargetRevenue;
  label: string;
  description: string;
}

// Scale option interface
export interface ScaleOption {
  value: ServiceScale;
  label: string;
  description: string;
  examples: string;
}

// Niche options list
export const NICHE_OPTIONS: NicheOption[] = [
  { id: 'saas', label: 'SaaS' },
  { id: 'dev-tools', label: 'Developer Tools' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Health & Fitness' },
  { id: 'ai-ml', label: 'AI/ML' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'education', label: 'Education' },
  { id: 'social', label: 'Social' },
  { id: 'gaming', label: 'Gaming' },
];

// Revenue options list
export const REVENUE_OPTIONS: RevenueOption[] = [
  {
    value: 'side',
    label: '$0 - $1,000',
    description: 'Side project',
  },
  {
    value: 'fulltime',
    label: '$1,000 - $5,000',
    description: 'Full-time income level',
  },
  {
    value: 'small-business',
    label: '$5,000 - $10,000',
    description: 'Small business',
  },
  {
    value: 'startup',
    label: '$10,000+',
    description: 'Growth startup',
  },
];

// Scale options list
export const SCALE_OPTIONS: ScaleOption[] = [
  {
    value: 'solo',
    label: 'Solo Project',
    description: 'Can be built and run by one person',
    examples: 'Single-feature tools, Chrome extensions, API services',
  },
  {
    value: 'small-team',
    label: 'Small Team (2-5)',
    description: 'Can be run with a small team',
    examples: 'SaaS platforms, Marketplaces, B2B tools',
  },
  {
    value: 'growth-startup',
    label: 'Growth Startup',
    description: 'Aiming for investment and scaling',
    examples: 'Platform businesses, Enterprise solutions',
  },
];

// Default preferences for new users
export const defaultUserPreferences: UserPreferences = {
  niches: [],
  targetRevenue: 'fulltime',
  serviceScale: 'solo',
  onboardingCompleted: false,
  updatedAt: new Date().toISOString(),
};

// Mock user preferences (for demo)
export const mockUserPreferences: UserPreferences = {
  niches: ['saas', 'productivity'],
  targetRevenue: 'fulltime',
  serviceScale: 'small-team',
  onboardingCompleted: true,
  updatedAt: '2026-01-06T00:00:00Z',
};

/**
 * Get niche label by id
 */
export function getNicheLabel(nicheId: string): string {
  const niche = NICHE_OPTIONS.find(n => n.id === nicheId);
  return niche?.label || nicheId;
}

/**
 * Get revenue label by value
 */
export function getRevenueLabel(revenue: TargetRevenue): string {
  const option = REVENUE_OPTIONS.find(r => r.value === revenue);
  return option?.label || revenue;
}

/**
 * Get scale label by value
 */
export function getScaleLabel(scale: ServiceScale): string {
  const option = SCALE_OPTIONS.find(s => s.value === scale);
  return option?.label || scale;
}
