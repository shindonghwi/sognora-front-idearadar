'use client';

import { useTranslations } from 'next-intl';
import type { MarketingAnalysis } from '@/core/mocks/analysis';
import styles from './tab-shared.module.css';

interface MarketingTabProps {
  data: MarketingAnalysis;
}

export function MarketingTab({ data }: MarketingTabProps) {
  const t = useTranslations('analysis.marketing');

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      default:
        return styles.priorityLow;
    }
  };

  return (
    <div className={styles.tabContainer}>
      {/* Launch Channels */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('launchChannels')}</h3>
        <div className={styles.channelList}>
          {data.launchChannels.map((channel) => (
            <div key={channel.name} className={styles.channelCard}>
              <div className={styles.channelHeader}>
                <span className={styles.channelName}>{channel.name}</span>
                <span className={`${styles.priorityBadge} ${getPriorityClass(channel.priority)}`}>
                  {t(`priority.${channel.priority}`)}
                </span>
              </div>
              <div className={styles.channelMeta}>
                <span className={styles.metaLabel}>{t('expectedTraffic')}:</span>
                <span className={styles.metaValue}>{channel.expectedTraffic}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Communities */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('targetCommunities')}</h3>
        <div className={styles.chipList}>
          {data.targetCommunities.map((community) => (
            <span key={community} className={styles.chipOutline}>
              {community}
            </span>
          ))}
        </div>
      </section>

      {/* Content Strategy */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('contentStrategy')}</h3>
        <div className={styles.strategyGrid}>
          <div className={styles.strategyCard}>
            <h4 className={styles.strategyLabel}>{t('blog')}</h4>
            <p className={styles.strategyText}>{data.contentStrategy.blog}</p>
          </div>
          <div className={styles.strategyCard}>
            <h4 className={styles.strategyLabel}>{t('social')}</h4>
            <p className={styles.strategyText}>{data.contentStrategy.social}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
