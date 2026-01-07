'use client';

import { useTranslations } from 'next-intl';
import type { ConceptAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface ConceptTabProps {
  data: ConceptAnalysis;
}

export function ConceptTab({ data }: ConceptTabProps) {
  const t = useTranslations('analysis.concept');

  return (
    <div className={styles.tabContainer}>
      {/* Product Names */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('productNames')}</h3>
        <div className={styles.chipList}>
          {data.productNames.map((name) => (
            <span key={name} className={styles.chip}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Core Value */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('coreValue')}</h3>
        <div className={styles.card}>
          <p className={styles.cardText}>{data.coreValue}</p>
        </div>
      </section>

      {/* MVP Features */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('mvpFeatures')}</h3>
        <ul className={styles.list}>
          {data.mvpFeatures.map((feature, index) => (
            <li key={index} className={styles.listItem}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Target Users */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('targetUsers')}</h3>
        <div className={styles.chipList}>
          {data.targetUsers.map((user) => (
            <span key={user} className={styles.chipOutline}>
              {user}
            </span>
          ))}
        </div>
      </section>

      {/* Differentiation */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('differentiation')}</h3>
        <ul className={styles.list}>
          {data.differentiation.map((point, index) => (
            <li key={index} className={styles.listItem}>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Suggested Domains */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('domains')}</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.tableHeaderCell}>{t('domain')}</span>
            <span className={styles.tableHeaderCell}>{t('status')}</span>
            <span className={styles.tableHeaderCell}>{t('price')}</span>
          </div>
          {data.suggestedDomains.map((domain) => (
            <div key={domain.domain} className={styles.tableRow}>
              <span className={styles.tableCell}>{domain.domain}</span>
              <span className={`${styles.tableCell} ${domain.available ? styles.available : styles.taken}`}>
                {domain.available ? t('available') : t('taken')}
              </span>
              <span className={styles.tableCell}>
                {domain.available && domain.price ? `$${domain.price}/yr` : '-'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
