'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import styles from './landing-page.module.css';

// Real Reddit examples with validation scores
const liveExamples = [
  {
    quote: "Someone should build a tool that monitors competitor pricing and alerts you when they change. I'd pay $50/month for this.",
    subreddit: 'r/SaaS',
    upvotes: 234,
    comments: 67,
    score: 94,
    timeAgo: '2 days ago',
  },
  {
    quote: "I wish there was an app that automatically converts my voice memos into formatted meeting notes with action items.",
    subreddit: 'r/Productivity',
    upvotes: 156,
    comments: 43,
    score: 87,
    timeAgo: '3 days ago',
  },
  {
    quote: "Why doesn't anyone make a simple invoicing tool for freelancers that doesn't require a subscription? Just pay once.",
    subreddit: 'r/Freelance',
    upvotes: 312,
    comments: 89,
    score: 91,
    timeAgo: '1 day ago',
  },
  {
    quote: "Someone needs to build a browser extension that blocks AI-generated content from search results. Would pay good money.",
    subreddit: 'r/Technology',
    upvotes: 567,
    comments: 124,
    score: 96,
    timeAgo: '4 hours ago',
  },
];

// Niche categories
const categories = [
  { name: 'SaaS', count: 1247 },
  { name: 'Developer Tools', count: 892 },
  { name: 'Productivity', count: 756 },
  { name: 'E-commerce', count: 634 },
  { name: 'Health & Fitness', count: 521 },
  { name: 'Finance', count: 489 },
  { name: 'Education', count: 412 },
  { name: 'Mobile Apps', count: 378 },
  { name: 'AI/ML', count: 356 },
  { name: 'Marketing', count: 298 },
  { name: 'Social', count: 267 },
  { name: 'Gaming', count: 234 },
];

// Before/After comparison
const comparison = {
  before: [
    'Scroll Reddit for 6+ hours weekly',
    'Miss trending ideas buried in threads',
    'No way to measure idea demand',
    'Manually track interesting posts',
    'Random, unstructured research',
  ],
  after: [
    'Get curated ideas in your inbox',
    'Real-time alerts for high-score ideas',
    '0-100 validation score per idea',
    'Auto-saved, searchable database',
    'Organized by niche & demand',
  ],
};

// FAQ items
const faqItems = [
  {
    question: 'What makes IdeaRadar different from just searching Reddit?',
    answer: 'We use AI to specifically detect explicit product requests ("Someone should build...", "I wish there was...") and score them based on engagement, repetition across subreddits, and sentiment intensity. You get validated demand signals, not just random complaints.',
  },
  {
    question: 'How is the validation score calculated?',
    answer: 'Each idea is scored 0-100 based on: Upvotes (30pts), Comments (25pts), Repetition across subreddits (25pts), Sentiment intensity (15pts), and Freshness (5pts). A score above 80 indicates strong validated demand.',
  },
  {
    question: 'What\'s included in the free tier?',
    answer: 'Free users get 5 ideas per week with a 7-day delay. You can browse basic categories and receive weekly email digests. Upgrade to Hunter ($19/mo) for 50 real-time ideas or Pro ($39/mo) for unlimited access.',
  },
  {
    question: 'Can I filter ideas by my niche?',
    answer: 'Yes! We categorize ideas into 12+ niches including SaaS, Developer Tools, E-commerce, Health, Finance, and more. Hunter and Pro users can set up custom alerts for specific niches.',
  },
  {
    question: 'How often is the database updated?',
    answer: 'We scan 1,000+ subreddits continuously. Free users see ideas with a 7-day delay, while paid users get real-time access to new ideas as they\'re discovered and scored.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try before you commit',
    features: [
      '5 ideas per week',
      '7-day delayed access',
      'Basic category filters',
      'Weekly email digest',
    ],
    popular: false,
  },
  {
    name: 'Hunter',
    price: '$19',
    description: 'For serious builders',
    features: [
      '50 ideas per week',
      'Real-time access',
      'All 12+ niche filters',
      'Bookmark & export',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Pro',
    price: '$39',
    description: 'For power users',
    features: [
      'Unlimited ideas',
      'API access',
      'Custom Slack/Discord alerts',
      'Historical archive access',
      'Dedicated support',
    ],
    popular: false,
  },
];

export function LandingPage() {
  const openLoginModal = useUIStore((state) => state.openLoginModal);
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <p className={styles.heroTagline}>Stop Guessing. Start Building What People Want.</p>

          <h1 className={styles.heroTitle}>
            Find Startup Ideas Reddit Users Are <span className={styles.highlight}>Begging</span> Someone to Build
          </h1>

          <p className={styles.heroDescription}>
            We scan 1,000+ subreddits daily to find explicit product requests like
            "Someone should build..." and score each idea 0-100 based on real demand signals.
          </p>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>6+ hrs</span>
              <span className={styles.statLabel}>Saved weekly</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1,000+</span>
              <span className={styles.statLabel}>Subreddits scanned</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10,000+</span>
              <span className={styles.statLabel}>Ideas validated</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form className={styles.emailForm} onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.emailButton}>
              Get Free Ideas
            </button>
          </form>
          <p className={styles.emailHint}>Free: 5 ideas/week. No credit card required.</p>
        </div>
      </section>

      {/* Live Examples Section */}
      <section className={styles.liveExamples}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Live from Reddit</span>
            <h2 className={styles.sectionTitle}>Real Ideas People Are Asking For Right Now</h2>
            <p className={styles.sectionDescription}>
              These are actual Reddit posts we found and scored. Click any to see the full context.
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
                    <span>{example.upvotes} upvotes</span>
                    <span>{example.comments} comments</span>
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
            <span className={styles.sectionLabel}>Why IdeaRadar</span>
            <h2 className={styles.sectionTitle}>Stop Wasting Hours on Manual Research</h2>
          </div>

          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <div className={styles.comparisonHeader}>
                <span className={styles.comparisonBadgeBefore}>Without IdeaRadar</span>
              </div>
              <ul className={styles.comparisonList}>
                {comparison.before.map((item, index) => (
                  <li key={index} className={styles.comparisonItemBefore}>
                    <span className={styles.crossMark}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.comparisonCard}>
              <div className={styles.comparisonHeader}>
                <span className={styles.comparisonBadgeAfter}>With IdeaRadar</span>
              </div>
              <ul className={styles.comparisonList}>
                {comparison.after.map((item, index) => (
                  <li key={index} className={styles.comparisonItemAfter}>
                    <span className={styles.checkMark}>✓</span>
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
              <span className={styles.sectionLabel}>Weekly Digest</span>
              <h2 className={styles.sectionTitle}>Get Top Ideas Delivered to Your Inbox</h2>
              <p className={styles.digestDescription}>
                Every week, we send you the 20 highest-scoring ideas from the past 7 days.
                Each email includes the original Reddit quote, validation score breakdown,
                and direct link to the source post.
              </p>
              <ul className={styles.digestFeatures}>
                <li>Curated top 20 ideas weekly</li>
                <li>Full score breakdown per idea</li>
                <li>Direct links to Reddit posts</li>
                <li>Niche category tags</li>
              </ul>
              <button className={styles.digestButton} onClick={() => openLoginModal()}>
                Subscribe Free
              </button>
            </div>

            <div className={styles.digestMockup}>
              <div className={styles.emailMock}>
                <div className={styles.emailHeader}>
                  <div className={styles.emailHeaderTop}>
                    <span className={styles.emailFrom}>From: IdeaRadar Weekly</span>
                    <span className={styles.emailDate}>Today</span>
                  </div>
                  <div className={styles.emailSubject}>Your Top 20 Validated Ideas This Week</div>
                </div>
                <div className={styles.emailBody}>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScore}>94</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"Someone should build a tool that monitors competitor pricing..."</p>
                      <span>r/SaaS - 234 upvotes</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScoreMed}>87</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"I wish there was an app that converts voice memos to..."</p>
                      <span>r/Productivity - 156 upvotes</span>
                    </div>
                  </div>
                  <div className={styles.emailIdea}>
                    <div className={styles.emailIdeaScore}>91</div>
                    <div className={styles.emailIdeaContent}>
                      <p>"Why doesn't anyone make a simple invoicing tool for..."</p>
                      <span>r/Freelance - 312 upvotes</span>
                    </div>
                  </div>
                  <div className={styles.emailMore}>+ 17 more ideas...</div>
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
            <span className={styles.sectionLabel}>Browse by Niche</span>
            <h2 className={styles.sectionTitle}>Find Ideas in Your Industry</h2>
            <p className={styles.sectionDescription}>
              Filter by 12+ categories to find opportunities in your area of expertise.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category.name} className={styles.categoryCard}>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>{category.count} ideas</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Score Works */}
      <section className={styles.howScore}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Validation Score</span>
            <h2 className={styles.sectionTitle}>How We Measure Real Demand</h2>
            <p className={styles.sectionDescription}>
              Each idea gets a 0-100 score based on multiple demand signals.
            </p>
          </div>

          <div className={styles.scoreBreakdown}>
            <div className={styles.scoreItem}>
              <div className={styles.scoreItemHeader}>
                <span className={styles.scoreItemLabel}>Upvotes</span>
                <span className={styles.scoreItemMax}>30 pts</span>
              </div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: '100%' }} />
              </div>
              <p className={styles.scoreItemDesc}>How many people agree this should exist</p>
            </div>

            <div className={styles.scoreItem}>
              <div className={styles.scoreItemHeader}>
                <span className={styles.scoreItemLabel}>Comments</span>
                <span className={styles.scoreItemMax}>25 pts</span>
              </div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: '83%' }} />
              </div>
              <p className={styles.scoreItemDesc}>Discussion depth indicates interest level</p>
            </div>

            <div className={styles.scoreItem}>
              <div className={styles.scoreItemHeader}>
                <span className={styles.scoreItemLabel}>Repetition</span>
                <span className={styles.scoreItemMax}>25 pts</span>
              </div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: '83%' }} />
              </div>
              <p className={styles.scoreItemDesc}>Similar requests across multiple subreddits</p>
            </div>

            <div className={styles.scoreItem}>
              <div className={styles.scoreItemHeader}>
                <span className={styles.scoreItemLabel}>Sentiment</span>
                <span className={styles.scoreItemMax}>15 pts</span>
              </div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: '50%' }} />
              </div>
              <p className={styles.scoreItemDesc}>Urgency and willingness to pay signals</p>
            </div>

            <div className={styles.scoreItem}>
              <div className={styles.scoreItemHeader}>
                <span className={styles.scoreItemLabel}>Freshness</span>
                <span className={styles.scoreItemMax}>5 pts</span>
              </div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: '17%' }} />
              </div>
              <p className={styles.scoreItemDesc}>Recent posts indicate current demand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Pricing</span>
            <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p className={styles.sectionDescription}>
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ''}`}
              >
                {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
                <h3 className={styles.pricingName}>{plan.name}</h3>
                <div className={styles.pricingPrice}>
                  {plan.price}
                  <span>/mo</span>
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
                  Get Started
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
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
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
                  <span className={styles.faqToggle}>{openFaq === index ? '−' : '+'}</span>
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
          <h2 className={styles.ctaTitle}>Stop Scrolling. Start Building.</h2>
          <p className={styles.ctaDescription}>
            Every day you wait, someone else might build the idea you could have found first.
            Join 500+ builders who get validated ideas delivered weekly.
          </p>
          <button className={styles.ctaButton} onClick={() => openLoginModal()}>
            Get Your First 5 Ideas Free
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
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
            <Link href="/support" className={styles.footerLink}>Support</Link>
          </div>

          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} IdeaRadar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
