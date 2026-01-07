'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { mockIdeas, CATEGORIES, type Idea } from '@/core/mocks/ideas';
import { DYNAMIC_ROUTES } from '@/core/routes';
import styles from './ideas-page.module.css';

type FilterType = 'all' | 'bookmarked';
type SortType = 'score' | 'recent' | 'upvotes';

function getScoreColor(score: number): string {
  if (score >= 90) return styles.scoreHigh;
  if (score >= 70) return styles.scoreMedium;
  return styles.scoreLow;
}

export function IdeasPage() {
  const t = useTranslations('ideas');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('score');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIdeas = useMemo(() => {
    let ideas = [...mockIdeas];

    // Filter by tab
    if (filter === 'bookmarked') {
      ideas = ideas.filter(idea => idea.isBookmarked);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      ideas = ideas.filter(idea => idea.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      ideas = ideas.filter(idea =>
        idea.quote.toLowerCase().includes(query) ||
        idea.subreddit.toLowerCase().includes(query) ||
        idea.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'score':
        ideas.sort((a, b) => b.score - a.score);
        break;
      case 'recent':
        ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'upvotes':
        ideas.sort((a, b) => b.upvotes - a.upvotes);
        break;
    }

    return ideas;
  }, [filter, sortBy, selectedCategory, searchQuery]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            IdeaRadar
          </Link>
          <div className={styles.headerRight}>
            <Link href="/pricing" className={styles.headerLink}>
              {t('upgrade')}
            </Link>
            <Link href="/account/settings" className={styles.headerLink}>
              {t('settings')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Title */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t('title')}</h1>
            <p className={styles.pageDescription}>{t('description')}</p>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('tabs.all')}
              <span className={styles.tabCount}>{mockIdeas.length}</span>
            </button>
            <button
              className={`${styles.tab} ${filter === 'bookmarked' ? styles.tabActive : ''}`}
              onClick={() => setFilter('bookmarked')}
            >
              {t('tabs.bookmarked')}
              <span className={styles.tabCount}>{mockIdeas.filter(i => i.isBookmarked).length}</span>
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">{t('filter.allCategories')}</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className={styles.filterSelect}
              >
                <option value="score">{t('sort.score')}</option>
                <option value="recent">{t('sort.recent')}</option>
                <option value="upvotes">{t('sort.upvotes')}</option>
              </select>
            </div>
          </div>

          {/* Ideas Grid */}
          {filteredIdeas.length > 0 ? (
            <div className={styles.ideasGrid}>
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <h3 className={styles.emptyTitle}>{t('empty.title')}</h3>
              <p className={styles.emptyDescription}>{t('empty.description')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface IdeaCardProps {
  idea: Idea;
}

function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Link href={DYNAMIC_ROUTES.IDEA_DETAIL(idea.id)} className={styles.ideaCard}>
      <div className={styles.cardHeader}>
        <span className={styles.categoryBadge}>{idea.category}</span>
        <div className={`${styles.score} ${getScoreColor(idea.score)}`}>
          {idea.score}
        </div>
      </div>

      <p className={styles.quote}>{`"${idea.quote}"`}</p>

      <div className={styles.cardMeta}>
        <span className={styles.subreddit}>{idea.subreddit}</span>
        <span className={styles.timeAgo}>{idea.timeAgo}</span>
      </div>

      <div className={styles.cardStats}>
        <span className={styles.stat}>
          <span className={styles.statIcon}>▲</span>
          {idea.upvotes}
        </span>
        <span className={styles.stat}>
          <span className={styles.statIcon}>💬</span>
          {idea.comments}
        </span>
        {idea.isBookmarked && (
          <span className={styles.bookmarked}>🔖</span>
        )}
      </div>
    </Link>
  );
}
