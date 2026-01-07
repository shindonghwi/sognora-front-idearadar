'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/core/stores';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import { ROUTES, DYNAMIC_ROUTES } from '@/core/routes';
import { Sidebar } from './components/sidebar';
import { PlanCard } from './components/plan-card';
import { IdeaCard } from './components/idea-card';
import styles from './dashboard-page.module.css';

// Mock data for ideas
const MOCK_IDEAS = [
  {
    id: '1',
    title: 'AI-powered code review tool for solo developers',
    score: 94,
    category: 'Developer Tools',
    source: 'Reddit',
    date: '2025-01-05',
  },
  {
    id: '2',
    title: 'Subscription management dashboard for freelancers',
    score: 87,
    category: 'SaaS',
    source: 'Reddit',
    date: '2025-01-04',
  },
  {
    id: '3',
    title: 'Voice memo to action items converter',
    score: 91,
    category: 'Productivity',
    source: 'IdeaRadar',
    date: '2025-01-04',
  },
  {
    id: '4',
    title: 'Simple invoicing for one-time payments',
    score: 88,
    category: 'Finance',
    source: 'Reddit',
    date: '2025-01-03',
  },
  {
    id: '5',
    title: 'Browser extension to block AI content',
    score: 96,
    category: 'AI/ML',
    source: 'Reddit',
    date: '2025-01-03',
  },
  {
    id: '6',
    title: 'Competitor pricing monitor with alerts',
    score: 92,
    category: 'Marketing',
    source: 'Reddit',
    date: '2025-01-02',
  },
];

// Mock plan data
const MOCK_PLAN = {
  name: 'Pro',
  renewalDate: '2025-02-15',
  ideasUsed: 23,
  ideasLimit: 50,
  reportsUsed: 3,
  reportsLimit: 5,
};

export function DashboardPage() {
  const router = useRouter();
  const { logout, profile } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    clearAccountStatus();
    logout();
    router.push(ROUTES.HOME);
  };

  const handleIdeaClick = (id: string) => {
    router.push(DYNAMIC_ROUTES.REPORT_DETAIL(id));
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} userEmail={profile?.email} />

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Header */}
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={styles.pageTitle}>Dashboard</h1>
          </motion.div>

          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PlanCard plan={MOCK_PLAN} />
          </motion.div>

          {/* Ideas Grid */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>Your Ideas</h2>
            <div className={styles.ideaGrid}>
              {MOCK_IDEAS.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <IdeaCard
                    idea={idea}
                    onClick={() => handleIdeaClick(idea.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
