'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAllAnalyses } from '@/core/mocks/analysis';
import { getIdeaById } from '@/core/mocks/ideas';
import { useAuthStore } from '@/core/stores';
import { ROUTES } from '@/core/routes';
import { ReportCard } from './components/report-card';
import styles from './reports-page.module.css';

export function ReportsPage() {
  const t = useTranslations('reports');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(ROUTES.HOME);
    }
  }, [mounted, isAuthenticated, router]);

  const analyses = getAllAnalyses();

  // Enrich analyses with idea data
  const enrichedReports = analyses.map((analysis) => {
    const idea = getIdeaById(analysis.ideaId);
    return {
      analysis,
      idea,
    };
  });

  if (!mounted) {
    return null;
  }

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
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t('title')}</h1>
            <p className={styles.pageDescription}>{t('description')}</p>
          </div>

          {enrichedReports.length === 0 ? (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>{t('empty.title')}</h2>
              <p className={styles.emptyDescription}>{t('empty.description')}</p>
            </div>
          ) : (
            <div className={styles.reportsList}>
              <div className={styles.listHeader}>
                <span className={styles.reportCount}>
                  {enrichedReports.length} {t('reportsAvailable')}
                </span>
              </div>
              <div className={styles.reportsGrid}>
                {enrichedReports.map(({ analysis, idea }) => (
                  <ReportCard
                    key={analysis.id}
                    analysis={analysis}
                    ideaQuote={idea?.quote || ''}
                    subreddit={idea?.subreddit || ''}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
