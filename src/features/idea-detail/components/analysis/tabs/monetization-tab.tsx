'use client';

import { useTranslations } from 'next-intl';
import type { MonetizationAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface MonetizationTabProps {
  data: MonetizationAnalysis;
}

export function MonetizationTab({ data }: MonetizationTabProps) {
  const t = useTranslations('analysis.monetization');

  return (
    <div className={styles.tabContainer}>
      {/* Recommended Model */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('recommendedModel')}</h3>
        <div className={styles.card}>
          <p className={styles.cardTextLarge}>{data.recommendedModel}</p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('pricingTiers')}</h3>
        <div className={styles.pricingGrid}>
          {data.pricingTiers.map((tier) => (
            <div key={tier.name} className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h4 className={styles.pricingName}>{tier.name}</h4>
                <span className={styles.pricingPrice}>{tier.price}</span>
              </div>
              <ul className={styles.pricingFeatures}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} className={styles.pricingFeature}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projected MRR */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('projectedMRR')}</h3>
        <div className={styles.mrrGrid}>
          <div className={styles.mrrCard}>
            <span className={styles.mrrLabel}>{t('month3')}</span>
            <span className={styles.mrrValue}>{data.projectedMRR.month3}</span>
          </div>
          <div className={styles.mrrCard}>
            <span className={styles.mrrLabel}>{t('month6')}</span>
            <span className={styles.mrrValue}>{data.projectedMRR.month6}</span>
          </div>
          <div className={styles.mrrCard}>
            <span className={styles.mrrLabel}>{t('month12')}</span>
            <span className={styles.mrrValue}>{data.projectedMRR.month12}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
