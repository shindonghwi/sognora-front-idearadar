'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/core/routes';
import { CATEGORIES } from '@/core/mocks/ideas';
import { usePreferencesStore } from '@/core/stores';
import { NICHE_OPTIONS, REVENUE_OPTIONS, SCALE_OPTIONS } from '@/core/mocks/preferences';
import styles from './settings-page.module.css';

// Mock user data
const mockUser = {
  email: 'builder@example.com',
  plan: 'hunter',
  joinedAt: '2024-12-15',
  ideasThisWeek: 32,
  ideasLimit: 50,
  reportsThisWeek: 2,
  reportsLimit: 3,
};

export function SettingsPage() {
  const t = useTranslations('settings');
  const { preferences } = usePreferencesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Email notification settings
  const [emailDigest, setEmailDigest] = useState(true);
  const [highScoreAlerts, setHighScoreAlerts] = useState(true);
  const [newReportAlerts, setNewReportAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'SaaS', 'Developer Tools', 'AI/ML'
  ]);

  // Helper functions to get labels
  const getNicheLabels = () => {
    if (!mounted) return [];
    return preferences.niches.map(nicheId => {
      const niche = NICHE_OPTIONS.find(n => n.id === nicheId);
      return niche?.label || nicheId;
    });
  };

  const getRevenueLabel = () => {
    if (!mounted) return '';
    const revenue = REVENUE_OPTIONS.find(r => r.value === preferences.targetRevenue);
    return revenue?.label || '';
  };

  const getScaleLabel = () => {
    if (!mounted) return '';
    const scale = SCALE_OPTIONS.find(s => s.value === preferences.serviceScale);
    return scale?.label || '';
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case 'pro': return styles.proBadge;
      case 'hunter': return styles.hunterBadge;
      default: return styles.freeBadge;
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={ROUTES.IDEAS} className={styles.backLink}>
            <span className={styles.backIcon}>←</span>
            {t('backToIdeas')}
          </Link>
          <Link href="/" className={styles.logo}>
            IdeaRadar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('title')}</h1>

          {/* Subscription Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{t('subscription.title')}</h2>
              <span className={`${styles.planBadge} ${getPlanBadgeClass(mockUser.plan)}`}>
                {mockUser.plan.charAt(0).toUpperCase() + mockUser.plan.slice(1)}
              </span>
            </div>

            <div className={styles.usageInfo}>
              <div className={styles.usageBar}>
                <div className={styles.usageHeader}>
                  <span>{t('subscription.ideasUsage')}</span>
                  <span>{mockUser.ideasThisWeek} / {mockUser.ideasLimit}</span>
                </div>
                <div className={styles.usageTrack}>
                  <div
                    className={styles.usageFill}
                    style={{ width: `${(mockUser.ideasThisWeek / mockUser.ideasLimit) * 100}%` }}
                  />
                </div>
              </div>
              <div className={styles.usageBar}>
                <div className={styles.usageHeader}>
                  <span>{t('subscription.reportsUsage')}</span>
                  <span>{mockUser.reportsThisWeek} / {mockUser.reportsLimit}</span>
                </div>
                <div className={styles.usageTrack}>
                  <div
                    className={styles.usageFill}
                    style={{ width: `${(mockUser.reportsThisWeek / mockUser.reportsLimit) * 100}%` }}
                  />
                </div>
              </div>
              <p className={styles.usageNote}>
                {t('subscription.resetNote')}
              </p>
            </div>

            <div className={styles.cardActions}>
              {mockUser.plan !== 'pro' && (
                <Link href={ROUTES.PRICING} className={styles.upgradeButton}>
                  {t('subscription.upgrade')}
                </Link>
              )}
              <button className={styles.secondaryButton}>
                {t('subscription.manageBilling')}
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{t('preferences.title')}</h2>
              <Link href={ROUTES.ONBOARDING} className={styles.editButton}>
                {t('preferences.edit')}
              </Link>
            </div>

            <div className={styles.preferencesInfo}>
              <div className={styles.preferenceRow}>
                <span className={styles.preferenceLabel}>{t('preferences.interests')}</span>
                <span className={styles.preferenceValue}>
                  {mounted && getNicheLabels().length > 0
                    ? getNicheLabels().join(', ')
                    : '-'}
                </span>
              </div>
              <div className={styles.preferenceRow}>
                <span className={styles.preferenceLabel}>{t('preferences.targetRevenue')}</span>
                <span className={styles.preferenceValue}>
                  {mounted ? getRevenueLabel() || '-' : '-'}
                </span>
              </div>
              <div className={styles.preferenceRow}>
                <span className={styles.preferenceLabel}>{t('preferences.serviceScale')}</span>
                <span className={styles.preferenceValue}>
                  {mounted ? getScaleLabel() || '-' : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Email Notifications Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('notifications.title')}</h2>

            <div className={styles.toggleList}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>{t('notifications.digest')}</span>
                  <span className={styles.toggleDescription}>
                    {t('notifications.digestDescription')}
                  </span>
                </div>
                <button
                  className={`${styles.toggle} ${emailDigest ? styles.toggleOn : ''}`}
                  onClick={() => setEmailDigest(!emailDigest)}
                  aria-pressed={emailDigest}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>{t('notifications.highScore')}</span>
                  <span className={styles.toggleDescription}>
                    {t('notifications.highScoreDescription')}
                  </span>
                </div>
                <button
                  className={`${styles.toggle} ${highScoreAlerts ? styles.toggleOn : ''}`}
                  onClick={() => setHighScoreAlerts(!highScoreAlerts)}
                  aria-pressed={highScoreAlerts}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>{t('notifications.newReport')}</span>
                  <span className={styles.toggleDescription}>
                    {t('notifications.newReportDescription')}
                  </span>
                </div>
                <button
                  className={`${styles.toggle} ${newReportAlerts ? styles.toggleOn : ''}`}
                  onClick={() => setNewReportAlerts(!newReportAlerts)}
                  aria-pressed={newReportAlerts}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>{t('notifications.marketing')}</span>
                  <span className={styles.toggleDescription}>
                    {t('notifications.marketingDescription')}
                  </span>
                </div>
                <button
                  className={`${styles.toggle} ${marketingEmails ? styles.toggleOn : ''}`}
                  onClick={() => setMarketingEmails(!marketingEmails)}
                  aria-pressed={marketingEmails}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('categories.title')}</h2>
            <p className={styles.cardDescription}>{t('categories.description')}</p>

            <div className={styles.categoryGrid}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryChip} ${
                    selectedCategories.includes(category) ? styles.categorySelected : ''
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Account Info Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('account.title')}</h2>

            <div className={styles.accountInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t('account.email')}</span>
                <span className={styles.infoValue}>{mockUser.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t('account.joined')}</span>
                <span className={styles.infoValue}>
                  {new Date(mockUser.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`${styles.card} ${styles.dangerCard}`}>
            <h2 className={styles.cardTitle}>{t('danger.title')}</h2>
            <p className={styles.dangerDescription}>{t('danger.description')}</p>
            <button className={styles.dangerButton}>
              {t('danger.deleteAccount')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
