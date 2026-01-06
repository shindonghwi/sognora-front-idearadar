'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import styles from './landing-page.module.css';

interface Example {
  quote: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  score: number;
  timeAgo: string;
}

interface Category {
  name: string;
  count: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Factor {
  label: string;
  max: number;
  percent: number;
  desc: string;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export function LandingPage() {
  const t = useTranslations('landing');
  const openLoginModal = useUIStore((state) => state.openLoginModal);
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Get data from translations
  const liveExamples = t.raw('liveExamples.examples') as Example[];
  const categories = t.raw('categories.list') as Category[];
  const beforeItems = t.raw('comparison.before.items') as string[];
  const afterItems = t.raw('comparison.after.items') as string[];
  const faqItems = t.raw('faq.items') as FaqItem[];
  const scoreFactors = t.raw('howScore.factors') as Factor[];
  const pricingPlans = t.raw('pricing.plans') as PricingPlan[];
  const digestFeatures = t.raw('digest.features') as string[];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      openLoginModal();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 70) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <div className={styles.landing}>
      <FloatingNavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <p className={styles.heroTagline}>{t('hero.tagline')}</p>

          <h1 className={styles.heroTitle}>
            {t('hero.title')} <span className={styles.highlight}>{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
          </h1>

          <p className={styles.heroDescription}>
            {t('hero.description')}
          </p>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{t('hero.stats.timeSaved')}</span>
              <span className={styles.statLabel}>{t('hero.stats.timeSavedLabel')}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{t('hero.stats.subreddits')}</span>
              <span className={styles.statLabel}>{t('hero.stats.subredditsLabel')}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{t('hero.stats.ideas')}</span>
              <span className={styles.statLabel}>{t('hero.stats.ideasLabel')}</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form className={styles.emailForm} onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder={t('hero.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.emailButton}>
              {t('hero.emailButton')}
            </button>
          </form>
          <p className={styles.emailHint}>{t('hero.emailHint')}</p>
        </div>
      </section>

      {/* Live Examples Section */}
      <section className={styles.liveExamples}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('liveExamples.label')}</span>
            <h2 className={styles.sectionTitle}>{t('liveExamples.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('liveExamples.description')}
            </p>
          </div>

          <div className={styles.examplesGrid}>
            {liveExamples.map((example, index) => (
              <div key={index} className={styles.exampleCard}>
                <div className={styles.exampleHeader}>
                  <span className={styles.exampleSubreddit}>{example.subreddit}</span>
                  <span className={styles.exampleTime}>{example.timeAgo}</span>
                </div>
                <p className={styles.exampleQuote}>"{example.quote}"</p>
                <div className={styles.exampleFooter}>
                  <div className={styles.exampleStats}>
                    <span>{example.upvotes} {t('liveExamples.upvotes')}</span>
                    <span>{example.comments} {t('liveExamples.comments')}</span>
                  </div>
                  <div className={`${styles.exampleScore} ${getScoreColor(example.score)}`}>
                    <span className={styles.scoreValue}>{example.score}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className={styles.comparison}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('comparison.label')}</span>
            <h2 className={styles.sectionTitle}>{t('comparison.title')}</h2>
          </div>

          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <div className={styles.comparisonHeader}>
                <span className={styles.comparisonBadgeBefore}>{t('comparison.before.badge')}</span>
              </div>
              <ul className={styles.comparisonList}>
                {beforeItems.map((item, index) => (
                  <li key={index} className={styles.comparisonItemBefore}>
                    <span className={styles.crossMark}>x</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.comparisonCard}>
              <div className={styles.comparisonHeader}>
                <span className={styles.comparisonBadgeAfter}>{t('comparison.after.badge')}</span>
              </div>
              <ul className={styles.comparisonList}>
                {afterItems.map((item, index) => (
                  <li key={index} className={styles.comparisonItemAfter}>
                    <span className={styles.checkMark}>v</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Digest Preview */}
      <section className={styles.digestPreview}>
        <div className={styles.sectionContainer}>
          <div className={styles.digestContent}>
            <div className={styles.digestInfo}>
              <span className={styles.sectionLabel}>{t('digest.label')}</span>
              <h2 className={styles.sectionTitle}>{t('digest.title')}</h2>
              <p className={styles.digestDescription}>
                {t('digest.description')}
              </p>
              <ul className={styles.digestFeatures}>
                {digestFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className={styles.digestButton} onClick={() => openLoginModal()}>
                {t('digest.button')}
              </button>
            </div>

            <div className={styles.digestMockup}>
              <div className={styles.emailMock}>
                <div className={styles.emailHeader}>
                  <div className={styles.emailHeaderTop}>
                    <span className={styles.emailFrom}>{t('digest.emailMock.from')}</span>
                    <span className={styles.emailDate}>{t('digest.emailMock.date')}</span>
                  </div>
                  <div className={styles.emailSubject}>{t('digest.emailMock.subject')}</div>
                </div>
                <div className={styles.emailBody}>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScore}>94</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"{liveExamples[0]?.quote?.substring(0, 60)}..."</p>
                      <span>{liveExamples[0]?.subreddit} - {liveExamples[0]?.upvotes} {t('liveExamples.upvotes')}</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScoreMed}>87</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"{liveExamples[1]?.quote?.substring(0, 50)}..."</p>
                      <span>{liveExamples[1]?.subreddit} - {liveExamples[1]?.upvotes} {t('liveExamples.upvotes')}</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScore}>91</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"{liveExamples[2]?.quote?.substring(0, 50)}..."</p>
                      <span>{liveExamples[2]?.subreddit} - {liveExamples[2]?.upvotes} {t('liveExamples.upvotes')}</span>
                    </div>
                  </div>
                  <div className={styles.emailMore}>{t('digest.emailMock.more')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className={styles.categories}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('categories.label')}</span>
            <h2 className={styles.sectionTitle}>{t('categories.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('categories.description')}
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category.name} className={styles.categoryCard}>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>{category.count} {t('categories.ideas')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Score Works */}
      <section className={styles.howScore}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('howScore.label')}</span>
            <h2 className={styles.sectionTitle}>{t('howScore.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('howScore.description')}
            </p>
          </div>

          <div className={styles.scoreBreakdown}>
            {scoreFactors.map((factor, index) => (
              <div key={index} className={styles.scoreItem}>
                <div className={styles.scoreItemHeader}>
                  <span className={styles.scoreItemLabel}>{factor.label}</span>
                  <span className={styles.scoreItemMax}>{factor.max} {t('howScore.pts')}</span>
                </div>
                <div className={styles.scoreBar}>
                  <div className={styles.scoreFill} style={{ width: `${factor.percent}%` }} />
                </div>
                <p className={styles.scoreItemDesc}>{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('pricing.label')}</span>
            <h2 className={styles.sectionTitle}>{t('pricing.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('pricing.description')}
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ''}`}
              >
                {plan.popular && <span className={styles.popularBadge}>{t('pricing.mostPopular')}</span>}
                <h3 className={styles.pricingName}>{plan.name}</h3>
                <div className={styles.pricingPrice}>
                  {plan.price}
                  <span>{t('pricing.perMonth')}</span>
                </div>
                <p className={styles.pricingDescription}>{plan.description}</p>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`${styles.pricingButton} ${plan.popular ? styles.pricingButtonPrimary : styles.pricingButtonSecondary}`}
                  onClick={() => openLoginModal()}
                >
                  {t('pricing.getStarted')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('faq.label')}</span>
            <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
          </div>

          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openFaq === index ? styles.faqItemOpen : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <span className={styles.faqToggle}>{openFaq === index ? '-' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaDescription}>
            {t('cta.description')}
          </p>
          <button className={styles.ctaButton} onClick={() => openLoginModal()}>
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/" className={styles.footerLogo}>
            <span>IdeaRadar</span>
          </Link>

          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>{t('footer.terms')}</Link>
            <Link href="/privacy" className={styles.footerLink}>{t('footer.privacy')}</Link>
            <Link href="/support" className={styles.footerLink}>{t('footer.support')}</Link>
          </div>

          <p className={styles.footerCopyright}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
