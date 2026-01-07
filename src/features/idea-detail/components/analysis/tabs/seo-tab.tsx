'use client';

import { useTranslations } from 'next-intl';
import type { SEOAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface SEOTabProps {
  data: SEOAnalysis;
}

export function SEOTab({ data }: SEOTabProps) {
  const t = useTranslations('analysis.seo');

  const getDifficultyClass = (difficulty: number) => {
    if (difficulty <= 30) return styles.difficultyEasy;
    if (difficulty <= 60) return styles.difficultyMedium;
    return styles.difficultyHard;
  };

  return (
    <div className={styles.tabContainer}>
      {/* Primary Keywords */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('primaryKeywords')}</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.tableHeaderCell}>{t('keyword')}</span>
            <span className={styles.tableHeaderCell}>{t('volume')}</span>
            <span className={styles.tableHeaderCell}>{t('difficulty')}</span>
          </div>
          {data.primaryKeywords.map((keyword) => (
            <div key={keyword.keyword} className={styles.tableRow}>
              <span className={styles.tableCell}>{keyword.keyword}</span>
              <span className={styles.tableCell}>{keyword.volume.toLocaleString()}</span>
              <span className={`${styles.tableCell} ${getDifficultyClass(keyword.difficulty)}`}>
                {keyword.difficulty}/100
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Keywords */}
      {data.secondaryKeywords.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('secondaryKeywords')}</h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.tableHeaderCell}>{t('keyword')}</span>
              <span className={styles.tableHeaderCell}>{t('volume')}</span>
              <span className={styles.tableHeaderCell}>{t('difficulty')}</span>
            </div>
            {data.secondaryKeywords.map((keyword) => (
              <div key={keyword.keyword} className={styles.tableRow}>
                <span className={styles.tableCell}>{keyword.keyword}</span>
                <span className={styles.tableCell}>{keyword.volume.toLocaleString()}</span>
                <span className={`${styles.tableCell} ${getDifficultyClass(keyword.difficulty)}`}>
                  {keyword.difficulty}/100
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Traffic Potential */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('trafficPotential')}</h3>
        <div className={styles.card}>
          <p className={styles.cardText}>{data.trafficPotential}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('timeline')}</h3>
        <div className={styles.card}>
          <p className={styles.cardText}>{data.timeline}</p>
        </div>
      </section>
    </div>
  );
}
