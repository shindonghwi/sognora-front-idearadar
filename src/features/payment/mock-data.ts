// Mock data for Payment page

export interface Plan {
  id: 'lite' | 'pro' | 'max';
  name: string;
  price: number;
  ideas: number; // -1 = unlimited
  reports: number; // -1 = unlimited
  popular?: boolean;
}

export interface Subscription {
  plan: Plan['id'];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'past_due';
  cancelAtPeriodEnd?: boolean;
  usage: {
    ideasUsed: number;
    ideasLimit: number;
    reportsUsed: number;
    reportsLimit: number;
  };
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
}

export const PLANS: Plan[] = [
  { id: 'lite', name: 'Lite', price: 0, ideas: 10, reports: 1 },
  { id: 'pro', name: 'Pro', price: 19, ideas: 50, reports: 5, popular: true },
  { id: 'max', name: 'Max', price: 99, ideas: -1, reports: -1 },
];

export const MOCK_SUBSCRIPTION: Subscription = {
  plan: 'pro',
  price: 19,
  billingCycle: 'monthly',
  nextBillingDate: '2025-02-15',
  status: 'active',
  usage: {
    ideasUsed: 23,
    ideasLimit: 50,
    reportsUsed: 3,
    reportsLimit: 5,
  },
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2026, isDefault: true },
  { id: '2', brand: 'mastercard', last4: '5555', expMonth: 3, expYear: 2025, isDefault: false },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: '1', date: '2025-01-15', description: 'Pro Plan - Monthly', amount: 19, status: 'paid' },
  { id: '2', date: '2024-12-15', description: 'Pro Plan - Monthly', amount: 19, status: 'paid' },
  { id: '3', date: '2024-11-15', description: 'Upgrade to Pro (Prorated)', amount: 14.25, status: 'paid' },
  { id: '4', date: '2024-11-01', description: 'Lite Plan - Monthly', amount: 0, status: 'paid' },
];

export function getPlanById(id: Plan['id']): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatCardBrand(brand: PaymentMethod['brand']): string {
  const brands: Record<PaymentMethod['brand'], string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  };
  return brands[brand];
}
