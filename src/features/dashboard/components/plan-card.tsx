'use client';

import styles from './plan-card.module.css';

interface PlanData {
  name: string;
  renewalDate: string;
  ideasUsed: number;
  ideasLimit: number;
  reportsUsed: number;
  reportsLimit: number;
}

interface PlanCardProps {
  plan: PlanData;
}

export function PlanCard({ plan }: PlanCardProps) {
  const ideasPercent = (plan.ideasUsed / plan.ideasLimit) * 100;
  const reportsPercent = (plan.reportsUsed / plan.reportsLimit) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.planInfo}>
          <span className={styles.planBadge}>{plan.name}</span>
          <span className={styles.renewalDate}>Renews {plan.renewalDate}</span>
        </div>
        <button className={styles.upgradeButton}>Upgrade</button>
      </div>

      <div className={styles.usage}>
        <div className={styles.usageItem}>
          <div className={styles.usageHeader}>
            <span className={styles.usageLabel}>Ideas</span>
            <span className={styles.usageCount}>
              {plan.ideasUsed}/{plan.ideasLimit}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${ideasPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.usageItem}>
          <div className={styles.usageHeader}>
            <span className={styles.usageLabel}>Reports</span>
            <span className={styles.usageCount}>
              {plan.reportsUsed}/{plan.reportsLimit}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${reportsPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
