'use client';

import Link from 'next/link';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import styles from './landing-page.module.css';

const features = [
  {
    title: 'Reddit Auto-Scanning',
    description: 'We scan 1,000+ subreddits daily to find explicit product requests like "Someone should build..." and "I wish there was..."',
  },
  {
    title: 'Validation Scoring',
    description: 'Every idea gets a 0-100 validation score based on upvotes, comments, repetition, and sentiment intensity.',
  },
  {
    title: 'Weekly Digest',
    description: 'Get the top 20 validated ideas delivered to your inbox every week. Never miss a promising opportunity.',
  },
];

const steps = [
  {
    number: 1,
    title: 'We Scan',
    description: 'Our AI continuously monitors Reddit for product requests and pain points across thousands of communities.',
  },
  {
    number: 2,
    title: 'We Score',
    description: 'Each idea is analyzed and scored based on engagement, demand signals, and market potential.',
  },
  {
    number: 3,
    title: 'You Discover',
    description: 'Browse validated ideas, filter by niche, and find your next startup opportunity with confidence.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring',
    features: [
      '5 ideas per week',
      '7-day delay',
      'Basic filters',
      'Email digest',
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
      'All filters & niches',
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
      'Custom alerts',
      'Export to CSV',
    ],
    popular: false,
  },
];

export function LandingPage() {
  const openLoginModal = useUIStore((state) => state.openLoginModal);

  return (
    <div className={styles.landing}>
      {/* Floating Navigation */}
      <FloatingNavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>The #1 Reddit Idea Scanner</span>
          </div>

          <h1 className={styles.heroTitle}>
            Find <span className={styles.heroTitleHighlight}>Validated Startup Ideas</span> from Reddit
          </h1>

          <p className={styles.heroDescription}>
            Stop guessing what to build. We scan thousands of Reddit posts daily to find ideas people are actually begging for.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.heroButtonPrimary} onClick={() => openLoginModal()}>
              Get Started Free →
            </button>
            <a href="#how-it-works" className={styles.heroButtonSecondary}>
              See How It Works
            </a>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>1,000+</div>
              <div className={styles.heroStatLabel}>Subreddits Scanned</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>10,000+</div>
              <div className={styles.heroStatLabel}>Ideas Validated</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>500+</div>
              <div className={styles.heroStatLabel}>Happy Builders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Features</span>
            <h2 className={styles.sectionTitle}>Everything You Need to Find Your Next Big Idea</h2>
            <p className={styles.sectionDescription}>
              From automated scanning to intelligent scoring, we handle the hard work so you can focus on building.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>How It Works</span>
            <h2 className={styles.sectionTitle}>From Reddit Post to Startup Idea in 3 Steps</h2>
            <p className={styles.sectionDescription}>
              Our AI-powered system does the heavy lifting, so you can focus on what matters.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
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
              Start for free, upgrade when you&apos;re ready. No hidden fees.
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

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Next Big Idea?</h2>
          <p className={styles.ctaDescription}>
            Join 500+ indie hackers and founders who are building products people actually want.
          </p>
          <button className={styles.ctaButton} onClick={() => openLoginModal()}>
            Start for Free →
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
