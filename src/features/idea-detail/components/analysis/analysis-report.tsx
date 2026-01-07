'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { IdeaAnalysis, AnalysisTab } from '@/core/mocks/analysis';
import { ReportTabs } from './report-tabs';
import { ConceptTab } from './tabs/concept-tab';
import { CompetitorTab } from './tabs/competitor-tab';
import { SEOTab } from './tabs/seo-tab';
import { MonetizationTab } from './tabs/monetization-tab';
import { MarketingTab } from './tabs/marketing-tab';
import { FeasibilityTab } from './tabs/feasibility-tab';
import styles from './analysis-report.module.css';

interface AnalysisReportProps {
  analysis: IdeaAnalysis;
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const t = useTranslations('analysis');
  const [activeTab, setActiveTab] = useState<AnalysisTab>('concept');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.report}>
      <div className={styles.reportHeader}>
        <h2 className={styles.reportTitle}>{t('title')}</h2>
        <span className={styles.analyzedDate}>
          {t('analyzedOn')} {formatDate(analysis.analyzedAt)}
        </span>
      </div>

      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.tabContent}>
        {activeTab === 'concept' && <ConceptTab data={analysis.concept} />}
        {activeTab === 'competitors' && <CompetitorTab data={analysis.competitors} />}
        {activeTab === 'seo' && <SEOTab data={analysis.seo} />}
        {activeTab === 'monetization' && <MonetizationTab data={analysis.monetization} />}
        {activeTab === 'marketing' && <MarketingTab data={analysis.marketing} />}
        {activeTab === 'feasibility' && <FeasibilityTab data={analysis.feasibility} />}
      </div>
    </div>
  );
}
