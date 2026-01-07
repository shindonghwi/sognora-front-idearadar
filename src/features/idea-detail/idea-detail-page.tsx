'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getIdeaById } from '@/core/mocks/ideas';
import { getAnalysisByIdeaId } from '@/core/mocks/analysis';
import { ROUTES } from '@/core/routes';
import { AnalysisReport } from './components/analysis';
import styles from './idea-detail-page.module.css';

interface IdeaDetailPageProps {
  id: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return styles.scoreHigh;
  if (score >= 70) return styles.scoreMedium;
  return styles.scoreLow;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Low';
}

export function IdeaDetailPage({ id }: IdeaDetailPageProps) {
  const t = useTranslations('ideaDetail');
  const idea = getIdeaById(id);
  const analysis = getAnalysisByIdeaId(id);
  const [isBookmarked, setIsBookmarked] = useState(idea?.isBookmarked ?? false);
  const [copied, setCopied] = useState(false);

  if (!idea) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.description')}</p>
          <Link href={ROUTES.IDEAS} className={styles.backButton}>
            {t('notFound.backToIdeas')}
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: API call to save bookmark
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={ROUTES.IDEAS} className={styles.backLink}>
            <span className={styles.backIcon}>←</span>
            {t('back')}
          </Link>
          <Link href="/" className={styles.logo}>
            IdeaRadar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Two Column Layout */}
          <div className={styles.layout}>
            {/* Left Column - Main Content */}
            <div className={styles.mainColumn}>
              {/* Quote Card */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteHeader}>
                  <span className={styles.categoryBadge}>{idea.category}</span>
                  <span className={styles.timeAgo}>{idea.timeAgo}</span>
                </div>
                <blockquote className={styles.quote}>
                  {`"${idea.quote}"`}
                </blockquote>
                <div className={styles.source}>
                  <a
                    href={idea.redditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    {idea.subreddit}
                  </a>
                  <span className={styles.author}>by u/{idea.author}</span>
                </div>
              </div>

              {/* Stats */}
              <div className={styles.statsCard}>
                <h3 className={styles.cardTitle}>{t('engagement')}</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{idea.upvotes}</span>
                    <span className={styles.statLabel}>{t('upvotes')}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{idea.comments}</span>
                    <span className={styles.statLabel}>{t('comments')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actionsCard}>
                <a
                  href={idea.redditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryAction}
                >
                  {t('viewOnReddit')}
                  <span className={styles.externalIcon}>↗</span>
                </a>
                <div className={styles.secondaryActions}>
                  <button
                    className={`${styles.actionButton} ${isBookmarked ? styles.bookmarked : ''}`}
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? '🔖' : '📑'} {isBookmarked ? t('bookmarked') : t('bookmark')}
                  </button>
                  <button className={styles.actionButton} onClick={handleShare}>
                    {copied ? '✓' : '🔗'} {copied ? t('copied') : t('share')}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Score Breakdown */}
            <div className={styles.sideColumn}>
              {/* Score Card */}
              <div className={styles.scoreCard}>
                <div className={styles.scoreHeader}>
                  <h3 className={styles.cardTitle}>{t('validationScore')}</h3>
                </div>
                <div className={styles.scoreMain}>
                  <div className={`${styles.scoreBig} ${getScoreColor(idea.score)}`}>
                    {idea.score}
                  </div>
                  <span className={styles.scoreLabel}>{getScoreLabel(idea.score)}</span>
                </div>

                <div className={styles.scoreBreakdown}>
                  <h4 className={styles.breakdownTitle}>{t('breakdown')}</h4>
                  <ScoreBar
                    label={t('factors.upvotes')}
                    value={idea.scoreBreakdown.upvotes}
                    max={30}
                  />
                  <ScoreBar
                    label={t('factors.comments')}
                    value={idea.scoreBreakdown.comments}
                    max={25}
                  />
                  <ScoreBar
                    label={t('factors.repetition')}
                    value={idea.scoreBreakdown.repetition}
                    max={25}
                  />
                  <ScoreBar
                    label={t('factors.sentiment')}
                    value={idea.scoreBreakdown.sentiment}
                    max={15}
                  />
                  <ScoreBar
                    label={t('factors.freshness')}
                    value={idea.scoreBreakdown.freshness}
                    max={5}
                  />
                </div>
              </div>

              {/* Info Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>{t('howScoreWorks')}</h3>
                <p className={styles.infoText}>
                  {t('scoreExplanation')}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Report Section */}
          {analysis && (
            <div className={styles.analysisSection}>
              <AnalysisReport analysis={analysis} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
}

function ScoreBar({ label, value, max }: ScoreBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={styles.scoreBarItem}>
      <div className={styles.scoreBarHeader}>
        <span className={styles.scoreBarLabel}>{label}</span>
        <span className={styles.scoreBarValue}>{value}/{max}</span>
      </div>
      <div className={styles.scoreBarTrack}>
        <div
          className={styles.scoreBarFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
