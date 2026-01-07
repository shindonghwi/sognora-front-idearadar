'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore, useAuthStore } from '@/core/stores';
import { ROUTES } from '@/core/routes';
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

interface VibeCoderFeature {
  title: string;
  description: string;
}

interface LLMComparison {
  name: string;
  manualCost: number;
  ourCost: number;
}

interface PipelineStep {
  title: string;
  description: string;
}

export function LandingPage() {
  const t = useTranslations('landing');
  const router = useRouter();
  const openLoginModal = useUIStore((state) => state.openLoginModal);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Redirect logged-in users to ideas page
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(ROUTES.IDEAS);
    }
  }, [mounted, isAuthenticated, router]);

  // Get data from translations
  const liveExamples = t.raw('liveExamples.examples') as Example[];
  const categories = t.raw('categories.list') as Category[];
  const beforeItems = t.raw('comparison.before.items') as string[];
  const afterItems = t.raw('comparison.after.items') as string[];
  const faqItems = t.raw('faq.items') as FaqItem[];
  const scoreFactors = t.raw('howScore.factors') as Factor[];
  const pricingPlans = t.raw('pricing.plans') as PricingPlan[];
  const digestFeatures = t.raw('digest.features') as string[];
  const vibeCoderFeatures = t.raw('vibeCoders.features') as VibeCoderFeature[];
  const llmComparisons = t.raw('tokenComparison.llms') as LLMComparison[];
  const pipelineSteps = t.raw('pipeline.steps') as PipelineStep[];

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
      <section id="features" className={styles.liveExamples}>
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
                <p className={styles.exampleQuote}>{`"${example.quote}"`}</p>
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

      {/* Vibe Coders Section */}
      <section className={styles.vibeCoders}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('vibeCoders.label')}</span>
            <h2 className={styles.sectionTitle}>{t('vibeCoders.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('vibeCoders.description')}
            </p>
          </div>

          <div className={styles.vibeCodersGrid}>
            {vibeCoderFeatures.map((feature, index) => (
              <div key={index} className={styles.vibeCoderCard}>
                <h3 className={styles.vibeCoderTitle}>{feature.title}</h3>
                <p className={styles.vibeCoderDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Comparison Section */}
      <section className={styles.tokenComparison}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('tokenComparison.label')}</span>
            <h2 className={styles.sectionTitle}>{t('tokenComparison.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('tokenComparison.description')}
            </p>
          </div>

          <div className={styles.tokenChartWrapper}>
            {/* Legend */}
            <div className={styles.tokenChartLegend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendLine} ${styles.legendLineManual}`} />
                <span>{t('tokenComparison.manual')}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendLine} ${styles.legendLineOurs}`} />
                <span>{t('tokenComparison.withUs')}</span>
              </div>
            </div>

            {/* Line Chart */}
            <div className={styles.lineChartContainer}>
              <svg className={styles.chartSvg} viewBox="0 0 600 300">
                {/* Grid lines */}
                <line x1="60" y1="40" x2="580" y2="40" className={styles.gridLine} />
                <line x1="60" y1="106" x2="580" y2="106" className={styles.gridLine} />
                <line x1="60" y1="172" x2="580" y2="172" className={styles.gridLine} />
                <line x1="60" y1="238" x2="580" y2="238" className={styles.gridLine} />

                {/* Y-axis labels */}
                <text x="50" y="44" className={styles.axisLabel} textAnchor="end">$1.50</text>
                <text x="50" y="110" className={styles.axisLabel} textAnchor="end">$1.00</text>
                <text x="50" y="176" className={styles.axisLabel} textAnchor="end">$0.50</text>
                <text x="50" y="242" className={styles.axisLabel} textAnchor="end">$0</text>

                {/* X-axis labels */}
                {llmComparisons.map((llm, i) => {
                  const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                  return (
                    <text key={llm.name} x={x} y="270" className={styles.axisLabel} textAnchor="middle">
                      {llm.name}
                    </text>
                  );
                })}

                {/* Area fill for manual (subtle) */}
                <polygon
                  className={styles.areaManual}
                  points={`60,238 ${llmComparisons.map((llm, i) => {
                    const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                    const y = 238 - (llm.manualCost / 1.5) * 198;
                    return `${x},${y}`;
                  }).join(' ')} 580,238`}
                />

                {/* Manual cost line */}
                <polyline
                  className={styles.lineManual}
                  points={llmComparisons.map((llm, i) => {
                    const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                    const y = 238 - (llm.manualCost / 1.5) * 198;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                />

                {/* IdeaRadar cost line */}
                <polyline
                  className={styles.lineOurs}
                  points={llmComparisons.map((llm, i) => {
                    const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                    const y = 238 - (llm.ourCost / 1.5) * 198;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                />

                {/* Data points - Manual */}
                {llmComparisons.map((llm, i) => {
                  const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                  const y = 238 - (llm.manualCost / 1.5) * 198;
                  return (
                    <g key={`manual-${i}`}>
                      <circle cx={x} cy={y} r="8" className={styles.dotManual} />
                      <text x={x} y={y - 16} className={styles.valueLabel} textAnchor="middle">
                        ${llm.manualCost.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Data points - Ours */}
                {llmComparisons.map((llm, i) => {
                  const x = 60 + (i / (llmComparisons.length - 1)) * 520;
                  const y = 238 - (llm.ourCost / 1.5) * 198;
                  return (
                    <circle key={`ours-${i}`} cx={x} cy={y} r="8" className={styles.dotOurs} />
                  );
                })}

                {/* IdeaRadar label on first point */}
                <text x="90" y="230" className={styles.oursLabel}>$0.04</text>
              </svg>
            </div>

            {/* Savings callout */}
            <div className={styles.savingsCallout}>
              <div className={styles.savingsNumber}>{t('tokenComparison.savings.value')}</div>
              <div className={styles.savingsText}>{t('tokenComparison.savings.label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className={styles.pipeline}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('pipeline.label')}</span>
            <h2 className={styles.sectionTitle}>{t('pipeline.title')}</h2>
          </div>

          <div className={styles.pipelineTimeline}>
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className={styles.pipelineStep}>
                <div className={styles.pipelineDot} />
                <h3 className={styles.pipelineTitle}>{step.title}</h3>
                <p className={styles.pipelineDesc}>{step.description}</p>
                {index < pipelineSteps.length - 1 && (
                  <div className={styles.pipelineLine} />
                )}
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
                      <p>{`"${liveExamples[0]?.quote?.substring(0, 60)}..."`}</p>
                      <span>{liveExamples[0]?.subreddit} - {liveExamples[0]?.upvotes} {t('liveExamples.upvotes')}</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScoreMed}>87</div>
                    <div className={styles.emailIdeaContent}>
                      <p>{`"${liveExamples[1]?.quote?.substring(0, 50)}..."`}</p>
                      <span>{liveExamples[1]?.subreddit} - {liveExamples[1]?.upvotes} {t('liveExamples.upvotes')}</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScore}>91</div>
                    <div className={styles.emailIdeaContent}>
                      <p>{`"${liveExamples[2]?.quote?.substring(0, 50)}..."`}</p>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Score Works */}
      <section id="how-it-works" className={styles.howScore}>
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
