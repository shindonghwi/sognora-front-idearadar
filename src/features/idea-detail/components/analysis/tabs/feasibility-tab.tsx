'use client';

import { useTranslations } from 'next-intl';
import type { FeasibilityAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface FeasibilityTabProps {
  data: FeasibilityAnalysis;
}

export function FeasibilityTab({ data }: FeasibilityTabProps) {
  const t = useTranslations('analysis.feasibility');

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'PASS':
        return styles.verdictPass;
      case 'CONDITIONAL':
        return styles.verdictConditional;
      default:
        return styles.verdictFail;
    }
  };

  const getRiskClass = (level: string) => {
    switch (level) {
      case 'high':
        return styles.riskHigh;
      case 'medium':
        return styles.riskMedium;
      default:
        return styles.riskLow;
    }
  };

  const categoryKeys = [
    'marketDemand',
    'competition',
    'technicalFeasibility',
    'monetizationPotential',
  ] as const;

  return (
    <div className={styles.tabContainer}>
      {/* Total Score & Verdict */}
      <section className={styles.section}>
        <div className={styles.scoreHeader}>
          <div className={styles.totalScore}>
            <span className={styles.scoreValue}>{data.totalScore}</span>
            <span className={styles.scoreLabel}>/100</span>
          </div>
          <span className={`${styles.verdict} ${getVerdictClass(data.verdict)}`}>
            {t(`verdict.${data.verdict}`)}
          </span>
        </div>
      </section>

      {/* Category Scores */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('categoryScores')}</h3>
        <div className={styles.scoreGrid}>
          {categoryKeys.map((key) => (
            <div key={key} className={styles.scoreCard}>
              <span className={styles.scoreCategoryLabel}>{t(`categories.${key}`)}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${data.categoryScores[key]}%` }}
                />
              </div>
              <span className={styles.scoreCategoryValue}>{data.categoryScores[key]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('summary')}</h3>
        <div className={styles.card}>
          <p className={styles.cardText}>{data.summary}</p>
        </div>
      </section>

      {/* Risks */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('risks')}</h3>
        <div className={styles.riskList}>
          {data.risks.map((risk, index) => (
            <div key={index} className={styles.riskCard}>
              <span className={`${styles.riskBadge} ${getRiskClass(risk.level)}`}>
                {t(`riskLevel.${risk.level}`)}
              </span>
              <span className={styles.riskDescription}>{risk.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('recommendations')}</h3>
        <ul className={styles.list}>
          {data.recommendations.map((rec, index) => (
            <li key={index} className={styles.listItem}>
              {rec}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
