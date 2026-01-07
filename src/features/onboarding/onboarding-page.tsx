'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton } from '@/features/landing/components';
import styles from './onboarding-page.module.css';

const CATEGORIES = [
  'SaaS',
  'Developer Tools',
  'Productivity',
  'E-commerce',
  'Health & Fitness',
  'Finance',
  'Education',
  'Mobile Apps',
  'AI/ML',
  'Marketing',
  'Social',
  'Gaming',
];

const REVENUE_OPTIONS = [
  { value: '1k', label: '$1K/mo', description: 'Side income' },
  { value: '5k', label: '$5K/mo', description: 'Part-time income' },
  { value: '10k', label: '$10K/mo', description: 'Full-time income' },
  { value: '50k', label: '$50K+/mo', description: 'Scale business' },
];

const MARKET_SIZE_OPTIONS = [
  { value: 'niche', label: 'Niche', description: 'Small, focused market' },
  { value: 'medium', label: 'Medium', description: 'Growing market' },
  { value: 'large', label: 'Large', description: 'Mass market' },
];

interface OnboardingData {
  categories: string[];
  revenue: string;
  marketSize: string;
}

export function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    categories: [],
    revenue: '',
    marketSize: '',
  });

  const totalSteps = 3;

  const handleCategoryToggle = (category: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleRevenueSelect = (value: string) => {
    setData((prev) => ({ ...prev, revenue: value }));
  };

  const handleMarketSizeSelect = (value: string) => {
    setData((prev) => ({ ...prev, marketSize: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.categories.length > 0;
      case 2:
        return data.revenue !== '';
      case 3:
        return data.marketSize !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save to localStorage or API
      localStorage.setItem('onboarding', JSON.stringify(data));
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Progress */}
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={styles.progressText}>
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.step}
            >
              <h1 className={styles.title}>What interests you?</h1>
              <p className={styles.description}>
                Select the categories you want to explore. You can change this later.
              </p>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`${styles.categoryChip} ${
                      data.categories.includes(category) ? styles.selected : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.step}
            >
              <h1 className={styles.title}>Revenue goal?</h1>
              <p className={styles.description}>
                How much do you want to earn per month?
              </p>
              <div className={styles.optionGrid}>
                {REVENUE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRevenueSelect(option.value)}
                    className={`${styles.optionCard} ${
                      data.revenue === option.value ? styles.selected : ''
                    }`}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionDesc}>{option.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.step}
            >
              <h1 className={styles.title}>Preferred market size?</h1>
              <p className={styles.description}>
                What size of market are you looking for?
              </p>
              <div className={styles.optionGrid}>
                {MARKET_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleMarketSizeSelect(option.value)}
                    className={`${styles.optionCard} ${
                      data.marketSize === option.value ? styles.selected : ''
                    }`}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionDesc}>{option.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className={styles.navigation}>
          {step > 1 && (
            <button onClick={handleBack} className={styles.backButton}>
              Back
            </button>
          )}
          <GlowButton
            onClick={handleNext}
            variant="primary"
            size="lg"
            className={!canProceed() ? styles.disabled : ''}
          >
            {step === totalSteps ? 'Get Started' : 'Continue'}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
