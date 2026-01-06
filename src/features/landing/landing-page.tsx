'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import styles from './landing-page.module.css';

const valueProps = [
  {
    title: 'Stop Scrolling Reddit',
    description: 'We scan 1,000+ subreddits daily so you don\'t have to. Our AI finds "Someone should build..." posts automatically.',
  },
  {
    title: 'Know What\'s Worth Building',
    description: 'Every idea gets a 0-100 validation score. High score = real demand, not just random complaints.',
  },
  {
    title: 'Never Miss an Opportunity',
    description: 'Get the top validated ideas delivered to your inbox weekly. First-mover advantage on proven demand.',
  },
];

const features = [
  {
    title: 'AI-Powered Pattern Detection',
    description: 'Our NLP engine identifies explicit product requests like "I wish there was...", "Why doesn\'t anyone make...", and "Someone should build..."',
  },
  {
    title: 'Multi-Signal Validation',
    description: 'Score based on upvotes, comments, sentiment intensity, repetition across subreddits, and recency.',
  },
  {
    title: 'Niche Filtering',
    description: 'Filter by 12+ categories: SaaS, Mobile Apps, Developer Tools, E-commerce, Health, Finance, and more.',
  },
  {
    title: 'Real-Time Alerts',
    description: 'Get notified instantly when high-scoring ideas appear in your chosen niches. Never miss trending demand.',
  },
  {
    title: 'Source Transparency',
    description: 'Every idea links directly to the original Reddit post. Verify demand and read the full context yourself.',
  },
  {
    title: 'Weekly Digest',
    description: 'Can\'t check daily? Get a curated email with the top 20 validated ideas every week.',
  },
];

const testimonials = [
  {
    quote: 'I spent 6 hours manually searching r/Entrepreneur for "I wish there was" posts and found only 12 good ones. IdeaRadar does this in seconds.',
    author: 'Alex K.',
    role: 'Indie Hacker',
  },
  {
    quote: 'Finally, a tool that separates real product requests from random complaints. The validation score is a game-changer.',
    author: 'Sarah M.',
    role: 'SaaS Founder',
  },
  {
    quote: 'Found my current project through IdeaRadar. A 94-score idea that already had people asking "where can I buy this?"',
    author: 'David L.',
    role: 'Solo Developer',
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
      'Priority support',
    ],
    popular: false,
  },
];

export function LandingPage() {
  const openLoginModal = useUIStore((state) => state.openLoginModal);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      openLoginModal();
    }
  };

  return (
    <div className={styles.landing}>
      <FloatingNavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <p className={styles.heroTagline}>The GummySearch Alternative for Idea Hunters</p>

          <h1 className={styles.heroTitle}>
            Find Startup Ideas People Are <span className={styles.highlight}>Begging</span> Someone to Build
          </h1>

          <p className={styles.heroDescription}>
            We scan Reddit for explicit product requests like "Someone should build..." and
            score each idea 0-100 based on real demand signals. Stop guessing. Start building what people actually want.
          </p>

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
          <p className={styles.emailHint}>Free tier: 5 ideas/week. No credit card required.</p>

          {/* Social Proof Stats */}
          <div className={styles.socialProof}>
            <div className={styles.proofItem}>
              <span className={styles.proofValue}>1,000+</span>
              <span className={styles.proofLabel}>Subreddits Scanned Daily</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span className={styles.proofValue}>10,000+</span>
              <span className={styles.proofLabel}>Ideas Validated</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span className={styles.proofValue}>500+</span>
              <span className={styles.proofLabel}>Builders Using IdeaRadar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className={styles.valueProps}>
        <div className={styles.sectionContainer}>
          {valueProps.map((prop) => (
            <div key={prop.title} className={styles.valuePropCard}>
              <h3 className={styles.valuePropTitle}>{prop.title}</h3>
              <p className={styles.valuePropDescription}>{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className={styles.demo}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Product Demo</span>
            <h2 className={styles.sectionTitle}>See How It Works</h2>
            <p className={styles.sectionDescription}>
              From Reddit post to validated idea in seconds. Here's what you'll see inside.
            </p>
          </div>

          <div className={styles.demoContent}>
            <div className={styles.demoCard}>
              <div className={styles.demoHeader}>
                <div className={styles.demoTabs}>
                  <span className={styles.demoTabActive}>All Ideas</span>
                  <span className={styles.demoTab}>Saved</span>
                  <span className={styles.demoTab}>Alerts</span>
                </div>
              </div>
              <div className={styles.demoBody}>
                {/* Mock Idea Card 1 */}
                <div className={styles.mockIdeaCard}>
                  <div className={styles.mockScore}>
                    <span className={styles.mockScoreValue}>94</span>
                  </div>
                  <div className={styles.mockIdeaContent}>
                    <h4 className={styles.mockIdeaTitle}>"Someone should build a tool that tracks competitor pricing changes"</h4>
                    <p className={styles.mockIdeaMeta}>r/SaaS • 234 upvotes • 67 comments • 12 similar mentions</p>
                  </div>
                </div>
                {/* Mock Idea Card 2 */}
                <div className={styles.mockIdeaCard}>
                  <div className={styles.mockScore}>
                    <span className={styles.mockScoreValueMedium}>78</span>
                  </div>
                  <div className={styles.mockIdeaContent}>
                    <h4 className={styles.mockIdeaTitle}>"I wish there was an app that converts voice memos to formatted notes"</h4>
                    <p className={styles.mockIdeaMeta}>r/Productivity • 156 upvotes • 43 comments • 8 similar mentions</p>
                  </div>
                </div>
                {/* Mock Idea Card 3 */}
                <div className={styles.mockIdeaCard}>
                  <div className={styles.mockScore}>
                    <span className={styles.mockScoreValueMedium}>71</span>
                  </div>
                  <div className={styles.mockIdeaContent}>
                    <h4 className={styles.mockIdeaTitle}>"Why doesn't anyone make a simple invoicing tool for freelancers?"</h4>
                    <p className={styles.mockIdeaMeta}>r/Freelance • 89 upvotes • 28 comments • 5 similar mentions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className={styles.scoreBreakdown}>
              <h4 className={styles.breakdownTitle}>Validation Score Breakdown</h4>
              <div className={styles.breakdownItems}>
                <div className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>Upvotes</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: '93%' }} />
                  </div>
                  <span className={styles.breakdownValue}>28/30</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>Comments</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: '88%' }} />
                  </div>
                  <span className={styles.breakdownValue}>22/25</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>Repetition</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: '100%' }} />
                  </div>
                  <span className={styles.breakdownValue}>25/25</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>Sentiment</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: '80%' }} />
                  </div>
                  <span className={styles.breakdownValue}>12/15</span>
                </div>
                <div className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>Freshness</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: '100%' }} />
                  </div>
                  <span className={styles.breakdownValue}>5/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Features</span>
            <h2 className={styles.sectionTitle}>Everything You Need to Find Validated Ideas</h2>
            <p className={styles.sectionDescription}>
              Built specifically for indie hackers and founders who want to build products people actually want.
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

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Testimonials</span>
            <h2 className={styles.sectionTitle}>Builders Love IdeaRadar</h2>
            <p className={styles.sectionDescription}>
              Join hundreds of indie hackers who stopped guessing and started building.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{testimonial.author.charAt(0)}</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{testimonial.author}</span>
                    <span className={styles.authorRole}>{testimonial.role}</span>
                  </div>
                </div>
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
