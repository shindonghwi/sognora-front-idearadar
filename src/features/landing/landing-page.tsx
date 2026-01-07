'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  TiltCard,
  GlowCard,
  CountUp,
  GlowButton,
  AnimatedGradient,
  FloatingOrbs,
} from './components';
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

interface ReportSection {
  title: string;
  items: string[];
}

interface PricingPlan {
  name: string;
  price: string;
  tagline?: string;
  description: string;
  ideas: string;
  reports: string;
  cta?: string;
  features: string[];
  reportSection?: ReportSection;
  popular?: boolean;
}

interface VibeCoderFeature {
  title: string;
  description: string;
}

interface CostComparisonRow {
  label: string;
  diy: string;
  ours: string;
}

interface PipelineStep {
  title: string;
  description: string;
  tier?: string;
  tierLabel?: string;
}

export function LandingPage() {
  const t = useTranslations('landing');
  const openLoginModal = useUIStore((state) => state.openLoginModal);
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
  const vibeCoderFeatures = t.raw('vibeCoders.features') as VibeCoderFeature[];
  const costComparisonRows = t.raw('costComparison.rows') as CostComparisonRow[];
  const pipelinePhase1Steps = t.raw('pipeline.phase1.steps') as PipelineStep[];
  const pipelinePhase2Steps = t.raw('pipeline.phase2.steps') as PipelineStep[];

  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 70) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <div className={styles.landing}>
      <FloatingNavbar />

      {/* Hero Section - Premium Redesign */}
      <section className={styles.hero}>
        <AnimatedGradient variant="hero" />
        <FloatingOrbs />

        <div className={styles.heroContent}>
          <motion.p
            className={styles.heroTagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('hero.title')} <span className={styles.highlight}>{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('hero.description')}
          </motion.p>

          {/* Stats bar with CountUp */}
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                <CountUp to={6} suffix="+" duration={2} />
              </span>
              <span className={styles.statLabel}>{t('hero.stats.timeSavedLabel')}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                <CountUp to={1000} suffix="+" duration={2.5} />
              </span>
              <span className={styles.statLabel}>{t('hero.stats.subredditsLabel')}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                <CountUp to={50000} suffix="+" duration={3} />
              </span>
              <span className={styles.statLabel}>{t('hero.stats.ideasLabel')}</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlowButton onClick={() => openLoginModal()} size="lg" pulse>
              {t('hero.ctaButton')}
            </GlowButton>
          </motion.div>

          <motion.p
            className={styles.heroHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {t('hero.ctaHint')}
          </motion.p>
        </div>
      </section>

      {/* Live Examples Section */}
      <section id="features" className={styles.liveExamples}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('liveExamples.label')}</span>
              <h2 className={styles.sectionTitle}>{t('liveExamples.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('liveExamples.description')}
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className={styles.examplesGrid}>
            {liveExamples.map((example, index) => (
              <StaggerItem key={index}>
                <TiltCard className={styles.exampleCard} glowColor="rgba(249, 115, 22, 0.2)">
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
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Vibe Coders Section */}
      <section className={styles.vibeCoders}>
        <AnimatedGradient variant="dark" />
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('vibeCoders.label')}</span>
              <h2 className={styles.sectionTitle}>{t('vibeCoders.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('vibeCoders.description')}
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className={styles.vibeCodersGrid}>
            {vibeCoderFeatures.map((feature, index) => (
              <StaggerItem key={index}>
                <GlowCard className={styles.vibeCoderCard} glowColor="rgba(249, 115, 22, 0.25)">
                  <h3 className={styles.vibeCoderTitle}>{feature.title}</h3>
                  <p className={styles.vibeCoderDesc}>{feature.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className={styles.costComparison}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('costComparison.label')}</span>
              <h2 className={styles.sectionTitle}>{t('costComparison.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('costComparison.description')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className={styles.costTableWrapper}>
              <table className={styles.costTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th className={styles.costTableDiy}>{t('costComparison.diy')}</th>
                    <th className={styles.costTableOurs}>{t('costComparison.ideaRadar')}</th>
                  </tr>
                </thead>
                <tbody>
                  {costComparisonRows.map((row, index) => (
                    <tr key={index}>
                      <td className={styles.costTableLabel}>{row.label}</td>
                      <td className={styles.costTableDiyValue}>{row.diy}</td>
                      <td className={styles.costTableOursValue}>{row.ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <motion.div
                className={styles.costSavings}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className={styles.costSavingsValue}>{t('costComparison.savings.value')}</span>
                <span className={styles.costSavingsLabel}>{t('costComparison.savings.label')}</span>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className={styles.pipeline}>
        <AnimatedGradient variant="dark" />
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('pipeline.label')}</span>
              <h2 className={styles.sectionTitle}>{t('pipeline.title')}</h2>
            </div>
          </ScrollReveal>

          {/* Phase 1: Discovery */}
          <ScrollReveal delay={0.1}>
            <div className={styles.pipelinePhase}>
              <div className={styles.pipelinePhaseHeader}>
                <h3 className={styles.pipelinePhaseTitle}>{t('pipeline.phase1.title')}</h3>
                <span className={styles.pipelineBadgeFree}>{t('pipeline.phase1.badge')}</span>
              </div>
              <div className={styles.pipelineTimeline}>
                {pipelinePhase1Steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className={styles.pipelineStep}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className={styles.pipelineStepNumber}>{index + 1}</div>
                    <div className={styles.pipelineStepContent}>
                      <h4 className={styles.pipelineStepTitle}>{step.title}</h4>
                      <p className={styles.pipelineStepDesc}>{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Phase 2: Deep Analysis */}
          <ScrollReveal delay={0.2}>
            <div className={styles.pipelinePhase}>
              <div className={styles.pipelinePhaseHeader}>
                <h3 className={styles.pipelinePhaseTitle}>{t('pipeline.phase2.title')}</h3>
                <span className={styles.pipelineBadgePro}>{t('pipeline.phase2.badge')}</span>
              </div>
              <p className={styles.pipelinePhaseDesc}>{t('pipeline.phase2.description')}</p>
              <div className={styles.pipelineAnalysisGrid}>
                {pipelinePhase2Steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className={styles.pipelineAnalysisCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0 0 30px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <div className={styles.pipelineAnalysisHeader}>
                      <h4 className={styles.pipelineAnalysisTitle}>{step.title}</h4>
                      <span className={`${styles.tierBadge} ${styles[`tierBadge${step.tier?.charAt(0).toUpperCase()}${step.tier?.slice(1)}`]}`}>
                        {step.tierLabel}
                      </span>
                    </div>
                    <p className={styles.pipelineAnalysisDesc}>{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className={styles.comparison}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('comparison.label')}</span>
              <h2 className={styles.sectionTitle}>{t('comparison.title')}</h2>
            </div>
          </ScrollReveal>

          <div className={styles.comparisonGrid}>
            <ScrollReveal delay={0.1} direction="left">
              <GlowCard className={styles.comparisonCard} glowColor="rgba(239, 68, 68, 0.15)">
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
              </GlowCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2} direction="right">
              <GlowCard className={styles.comparisonCard} glowColor="rgba(16, 185, 129, 0.2)">
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
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Weekly Digest Preview */}
      <section className={styles.digestPreview}>
        <div className={styles.sectionContainer}>
          <div className={styles.digestContent}>
            <ScrollReveal direction="left">
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
                <GlowButton onClick={() => openLoginModal()} size="lg">
                  {t('digest.button')}
                </GlowButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className={styles.digestMockup}>
                <TiltCard className={styles.emailMock} tiltAmount={8} glowColor="rgba(249, 115, 22, 0.25)">
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
                </TiltCard>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className={styles.categories}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('categories.label')}</span>
              <h2 className={styles.sectionTitle}>{t('categories.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('categories.description')}
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className={styles.categoriesGrid}>
            {categories.map((category) => (
              <StaggerItem key={category.name}>
                <motion.div
                  className={styles.categoryCard}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How Score Works */}
      <section id="how-it-works" className={styles.howScore}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('howScore.label')}</span>
              <h2 className={styles.sectionTitle}>{t('howScore.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('howScore.description')}
              </p>
            </div>
          </ScrollReveal>

          <div className={styles.scoreBreakdown}>
            {scoreFactors.map((factor, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <GlowCard className={styles.scoreItem} glowColor="rgba(249, 115, 22, 0.15)">
                  <div className={styles.scoreItemHeader}>
                    <span className={styles.scoreItemLabel}>{factor.label}</span>
                    <span className={styles.scoreItemMax}>{factor.max} {t('howScore.pts')}</span>
                  </div>
                  <div className={styles.scoreBar}>
                    <motion.div
                      className={styles.scoreFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${factor.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                  <p className={styles.scoreItemDesc}>{factor.desc}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('pricing.label')}</span>
              <h2 className={styles.sectionTitle}>{t('pricing.title')}</h2>
              <p className={styles.sectionDescription}>
                {t('pricing.description')}
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.name}>
                <motion.div
                  className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ''}`}
                  style={{ height: '100%' }}
                  whileHover={{
                    y: -8,
                    boxShadow: plan.popular
                      ? '0 25px 50px rgba(249, 115, 22, 0.35)'
                      : '0 20px 40px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {plan.popular && <span className={styles.popularBadge}>{t('pricing.mostPopular')}</span>}
                  <h3 className={styles.pricingName}>{plan.name}</h3>
                  <div className={styles.pricingPrice}>
                    {plan.price}
                    <span>{t('pricing.perMonth')}</span>
                  </div>
                  <p className={styles.pricingDescription}>{plan.description}</p>
                  <div className={styles.pricingLimits}>
                    <div className={styles.pricingLimit}>
                      <span className={styles.pricingLimitValue}>{plan.ideas}</span>
                    </div>
                    <div className={styles.pricingLimit}>
                      <span className={styles.pricingLimitValue}>{plan.reports}</span>
                    </div>
                  </div>
                  <ul className={styles.pricingFeatures}>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  {plan.reportSection && (
                    <div className={styles.reportSection}>
                      <div className={styles.reportSectionTitle}>{plan.reportSection.title}</div>
                      <ul className={styles.reportSectionItems}>
                        {plan.reportSection.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <GlowButton
                    onClick={() => openLoginModal()}
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="md"
                    className={styles.pricingButtonWrapper}
                  >
                    {plan.cta || t('pricing.getStarted')}
                  </GlowButton>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('faq.label')}</span>
              <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
            </div>
          </ScrollReveal>

          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <motion.div
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqItemOpen : ''}`}
                  layout
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{item.question}</span>
                    <motion.span
                      className={styles.faqToggle}
                      animate={{ rotate: openFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      +
                    </motion.span>
                  </button>
                  <motion.div
                    className={styles.faqAnswer}
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <AnimatedGradient variant="cta" />
        <div className={styles.ctaContent}>
          <ScrollReveal>
            <motion.h2
              className={styles.ctaTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              className={styles.ctaDescription}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('cta.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlowButton onClick={() => openLoginModal()} size="lg" pulse>
                {t('cta.button')}
              </GlowButton>
            </motion.div>
          </ScrollReveal>
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
