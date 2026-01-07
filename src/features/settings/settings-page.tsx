'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/core/stores';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import { ROUTES } from '@/core/routes';
import { Sidebar } from '@/features/dashboard/components/sidebar';
import { GlowButton } from '@/features/landing/components';
import styles from './settings-page.module.css';

const CATEGORIES = [
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
];

const REVENUE_OPTIONS = [
  { value: '1k', label: '$1K/mo' },
  { value: '5k', label: '$5K/mo' },
  { value: '10k', label: '$10K/mo' },
  { value: '50k', label: '$50K+/mo' },
];

const MARKET_SIZE_OPTIONS = [
  { value: 'niche', label: 'Niche' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

interface Settings {
  categories: string[];
  revenue: string;
  marketSize: string;
}

export function SettingsPage() {
  const router = useRouter();
  const { logout, profile } = useAuthStore();
  const [settings, setSettings] = useState<Settings>({
    categories: [],
    revenue: '',
    marketSize: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('onboarding');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    clearAccountStatus();
    logout();
    router.push(ROUTES.HOME);
  };

  const handleCategoryToggle = (category: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    setSaved(false);
  };

  const handleRevenueChange = (value: string) => {
    setSettings((prev) => ({ ...prev, revenue: value }));
    setSaved(false);
  };

  const handleMarketSizeChange = (value: string) => {
    setSettings((prev) => ({ ...prev, marketSize: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('onboarding', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} userEmail={profile?.email} />

      <main className={styles.main}>
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={styles.pageTitle}>Settings</h1>
            <p className={styles.pageDescription}>
              Update your preferences to get better idea recommendations.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className={styles.sectionTitle}>Interested Categories</h2>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`${styles.categoryChip} ${
                    settings.categories.includes(category) ? styles.selected : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Revenue Goal */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>Revenue Goal</h2>
            <div className={styles.optionRow}>
              {REVENUE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRevenueChange(option.value)}
                  className={`${styles.optionButton} ${
                    settings.revenue === option.value ? styles.selected : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Market Size */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>Preferred Market Size</h2>
            <div className={styles.optionRow}>
              {MARKET_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMarketSizeChange(option.value)}
                  className={`${styles.optionButton} ${
                    settings.marketSize === option.value ? styles.selected : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            className={styles.saveSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <GlowButton onClick={handleSave} variant="primary" size="lg">
              {saved ? 'Saved!' : 'Save Changes'}
            </GlowButton>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
