'use client';

import { useTranslations } from 'next-intl';
import type { AnalysisTab } from '@/core/mocks/analysis';
import styles from './report-tabs.module.css';

interface ReportTabsProps {
  activeTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
}

const TABS: AnalysisTab[] = [
  'concept',
  'competitors',
  'seo',
  'monetization',
  'marketing',
  'feasibility',
];

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const t = useTranslations('analysis.tabs');

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {t(tab)}
          </button>
        ))}
      </div>
    </div>
  );
}
