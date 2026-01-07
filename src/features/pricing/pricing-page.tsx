'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { useUIStore } from '@/core/stores';
import styles from './pricing-page.module.css';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function PricingPage() {
  const t = useTranslations('pricing');
  const openLoginModal = useUIStore((state) => state.openLoginModal);

  const plans = t.raw('plans') as PricingPlan[];
  const faqItems = t.raw('faq.items') as FaqItem[];

  return (
    <div className={styles.page}>
      <FloatingNavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('title')}</h1>
          <p className={styles.heroDescription}>{t('description')}</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ''}`}
              >
                {plan.popular && <span className={styles.popularBadge}>{t('mostPopular')}</span>}
                <h3 className={styles.pricingName}>{plan.name}</h3>
                <div className={styles.pricingPrice}>
                  {plan.price}
                  <span>{t('perMonth')}</span>
                </div>
                <p className={styles.pricingDescription}>{plan.description}</p>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`${styles.pricingButton} ${plan.popular ? styles.pricingButtonPrimary : styles.pricingButtonSecondary}`}
                  onClick={() => openLoginModal()}
                >
                  {t('getStarted')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{t('faq.label')}</span>
            <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
          </div>

          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  {item.question}
                </summary>
                <div className={styles.faqAnswer}>
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaDescription}>{t('cta.description')}</p>
          <button className={styles.ctaButton} onClick={() => openLoginModal()}>
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/" className={styles.footerLogo}>
            IdeaRadar
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
