'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/core/stores';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import { ROUTES } from '@/core/routes';
import { Sidebar } from '@/features/dashboard/components/sidebar';
import styles from './report-detail-page.module.css';

// Mock report data
const MOCK_REPORT = {
  id: '1',
  title: 'AI-powered code review tool for solo developers',
  score: 94,
  category: 'Developer Tools',
  source: 'Reddit',
  sourceUrl: 'https://reddit.com/r/SideProject/...',
  date: '2025-01-05',
  summary:
    'A tool that automatically reviews code for solo developers, catching bugs, suggesting improvements, and ensuring best practices without needing a team.',
};

const REPORT_TABS = [
  { id: 'vibe', label: 'The Vibe', tier: 'lite' },
  { id: 'customer', label: 'Customer', tier: 'pro' },
  { id: 'market', label: 'Market', tier: 'pro' },
  { id: 'competitors', label: 'Competitors', tier: 'pro' },
  { id: 'seo', label: 'SEO', tier: 'pro' },
  { id: 'money', label: 'Money', tier: 'max' },
  { id: 'marketing', label: 'Marketing', tier: 'max' },
  { id: 'build', label: 'Build', tier: 'max' },
  { id: 'shipit', label: 'Ship It?', tier: 'max' },
];

// Mock content for each report
const MOCK_CONTENTS: Record<string, { title: string; items: string[] }> = {
  vibe: {
    title: 'Product Overview',
    items: [
      'Product Name: CodeBuddy',
      'Tagline: Your AI pair programmer, 24/7',
      'Target Users: Solo developers, indie hackers, freelancers',
      'MVP Features: Auto-review on push, bug detection, style suggestions',
      'Differentiator: Built specifically for 1-person teams',
    ],
  },
  customer: {
    title: 'Customer Analysis',
    items: [
      'Persona 1: Indie Hacker (25-35, building SaaS solo)',
      'Persona 2: Freelancer (30-45, maintaining multiple client projects)',
      'Persona 3: Career Switcher (28-40, learning to code)',
      'Pain Points: No code review, imposter syndrome, missing bugs',
      'Willingness to Pay: $15-30/month',
    ],
  },
  market: {
    title: 'Market Size',
    items: [
      'TAM: $2.4B (global code review tools)',
      'SAM: $340M (solo developer tools)',
      'SOM: $34M (AI-powered for individuals)',
      'Growth Rate: 28% CAGR',
      'Market Timing: Excellent (AI adoption surge)',
    ],
  },
  competitors: {
    title: 'Competitive Landscape',
    items: [
      'GitHub Copilot: Code generation, not review',
      'SonarQube: Enterprise-focused, complex',
      'CodeClimate: Team-oriented pricing',
      'DeepCode: Acquired, losing focus',
      'Gap: No solo-dev focused AI reviewer',
    ],
  },
  seo: {
    title: 'SEO Keywords',
    items: [
      'code review tool solo developer (1.2K/mo)',
      'AI code reviewer (2.8K/mo)',
      'automated code review (4.1K/mo)',
      'best code review for indie hackers (800/mo)',
      'one person code review (600/mo)',
    ],
  },
  money: {
    title: 'Revenue Model',
    items: [
      'Pricing: Freemium + $19/mo Pro',
      'CAC Estimate: $25',
      'LTV Estimate: $228 (12mo avg retention)',
      'Break-even: 500 paid users',
      'MRR Target Y1: $15K',
    ],
  },
  marketing: {
    title: 'Go-to-Market',
    items: [
      'Channel 1: Reddit (r/SideProject, r/IndieHackers)',
      'Channel 2: Twitter/X indie dev community',
      'Channel 3: Dev.to content marketing',
      'Launch: ProductHunt + HackerNews',
      'Content: "Ship code alone, not lonely" campaign',
    ],
  },
  build: {
    title: 'Build Plan',
    items: [
      'Tech Stack: Next.js, Python (AI), PostgreSQL',
      'MVP Timeline: 6-8 weeks',
      'Dev Cost: $0 (solo build) or $5K (freelancer)',
      'First Validation: 50 beta signups',
      'Key Risk: AI accuracy and speed',
    ],
  },
  shipit: {
    title: 'Final Verdict',
    items: [
      'Overall Score: 94/100 - STRONG GO',
      'Demand: Validated (234 upvotes, 67 comments)',
      'Competition: Low for solo-dev niche',
      'Feasibility: High (proven tech stack)',
      'Recommendation: Ship MVP in 6 weeks, validate with beta',
    ],
  },
};

interface ReportDetailPageProps {
  id: string;
}

export function ReportDetailPage({ id: _id }: ReportDetailPageProps) {
  const router = useRouter();
  const { logout, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('vibe');

  const handleLogout = () => {
    clearTokens();
    clearAccountStatus();
    logout();
    router.push(ROUTES.HOME);
  };

  const handleBack = () => {
    router.push(ROUTES.DASHBOARD);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 70) return styles.scoreMedium;
    return styles.scoreLow;
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'lite':
        return styles.tierLite;
      case 'pro':
        return styles.tierPro;
      case 'max':
        return styles.tierMax;
      default:
        return '';
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} userEmail={profile?.email} />

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Back Button */}
          <button onClick={handleBack} className={styles.backButton}>
            Back to Dashboard
          </button>

          {/* Report Header */}
          <motion.div
            className={styles.reportHeader}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.headerTop}>
              <span className={styles.category}>{MOCK_REPORT.category}</span>
              <span className={`${styles.score} ${getScoreColor(MOCK_REPORT.score)}`}>
                {MOCK_REPORT.score}
              </span>
            </div>
            <h1 className={styles.reportTitle}>{MOCK_REPORT.title}</h1>
            <p className={styles.reportSummary}>{MOCK_REPORT.summary}</p>
            <div className={styles.meta}>
              <span className={styles.source}>{MOCK_REPORT.source}</span>
              <span className={styles.date}>{MOCK_REPORT.date}</span>
            </div>
          </motion.div>

          {/* Report Tabs */}
          <motion.div
            className={styles.tabs}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {REPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              >
                {tab.label}
                <span className={`${styles.tierBadge} ${getTierBadge(tab.tier)}`}>
                  {tab.tier.toUpperCase()}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Report Content */}
          <motion.div
            className={styles.reportContent}
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.contentTitle}>
              {MOCK_CONTENTS[activeTab]?.title}
            </h2>
            <ul className={styles.contentList}>
              {MOCK_CONTENTS[activeTab]?.items.map((item, index) => (
                <li key={index} className={styles.contentItem}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
