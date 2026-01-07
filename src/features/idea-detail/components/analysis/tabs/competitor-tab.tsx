'use client';

import { useTranslations } from 'next-intl';
import type { CompetitorAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface CompetitorTabProps {
  data: CompetitorAnalysis;
}

export function CompetitorTab({ data }: CompetitorTabProps) {
  const t = useTranslations('analysis.competitors');

  return (
    <div className={styles.tabContainer}>
      {/* Competitors */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('title')}</h3>
        <div className={styles.cardGrid}>
          {data.competitors.map((competitor) => (
            <div key={competitor.name} className={styles.competitorCard}>
              <div className={styles.competitorHeader}>
                <h4 className={styles.competitorName}>{competitor.name}</h4>
                {competitor.traffic && (
                  <span className={styles.trafficBadge}>{competitor.traffic}</span>
                )}
              </div>
              <p className={styles.competitorDescription}>{competitor.description}</p>

              <div className={styles.competitorMeta}>
                <span className={styles.metaLabel}>{t('pricing')}:</span>
                <span className={styles.metaValue}>{competitor.pricing}</span>
              </div>

              <div className={styles.competitorDetails}>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>{t('strengths')}</span>
                  <ul className={styles.detailList}>
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>{t('weaknesses')}</span>
                  <ul className={styles.detailList}>
                    {competitor.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.competitorLink}
              >
                {t('visitSite')}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Market Gaps */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('marketGaps')}</h3>
        <ul className={styles.list}>
          {data.marketGaps.map((gap, index) => (
            <li key={index} className={styles.listItem}>
              {gap}
            </li>
          ))}
        </ul>
      </section>

      {/* Opportunities */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('opportunities')}</h3>
        <ul className={styles.list}>
          {data.opportunities.map((opportunity, index) => (
            <li key={index} className={styles.listItem}>
              {opportunity}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
