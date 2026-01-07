'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { IdeaAnalysis } from '@/core/mocks/analysis';
import { ROUTES } from '@/core/routes';
import styles from './report-card.module.css';

interface ReportCardProps {
  analysis: IdeaAnalysis;
  ideaQuote: string;
  subreddit: string;
}

export function ReportCard({ analysis, ideaQuote, subreddit }: ReportCardProps) {
  const t = useTranslations('reports');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'PASS':
        return styles.verdictPass;
      case 'CONDITIONAL':
        return styles.verdictConditional;
      default:
        return styles.verdictFail;
    }
  };

  // Truncate quote if too long
  const truncatedQuote = ideaQuote.length > 100
    ? ideaQuote.substring(0, 100) + '...'
    : ideaQuote;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.subreddit}>{subreddit}</span>
        <span className={styles.date}>{formatDate(analysis.analyzedAt)}</span>
      </div>

      <p className={styles.quote}>{`"${truncatedQuote}"`}</p>

      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>{t('feasibility')}</span>
          <span className={styles.scoreValue}>{analysis.feasibility.totalScore}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={`${styles.verdict} ${getVerdictStyle(analysis.feasibility.verdict)}`}>
            {analysis.feasibility.verdict}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.productNames}>
          {analysis.concept.productNames.slice(0, 2).map((name) => (
            <span key={name} className={styles.productTag}>
              {name}
            </span>
          ))}
        </div>
        <Link href={`${ROUTES.IDEAS}/${analysis.ideaId}`} className={styles.viewButton}>
          {t('viewReport')}
        </Link>
      </div>
    </div>
  );
}
