'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePreferencesStore, useAuthStore } from '@/core/stores';
import {
  NICHE_OPTIONS,
  REVENUE_OPTIONS,
  SCALE_OPTIONS,
  type TargetRevenue,
  type ServiceScale,
} from '@/core/mocks/preferences';
import { ROUTES } from '@/core/routes';
import styles from './onboarding-page.module.css';

type Step = 1 | 2 | 3;

export function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    preferences,
    setNiches,
    setTargetRevenue,
    setServiceScale,
    completeOnboarding,
    isOnboardingCompleted,
  } = usePreferencesStore();

  const [step, setStep] = useState<Step>(1);
  const [selectedNiches, setSelectedNiches] = useState<string[]>(preferences.niches);
  const [selectedRevenue, setSelectedRevenue] = useState<TargetRevenue>(preferences.targetRevenue);
  const [selectedScale, setSelectedScale] = useState<ServiceScale>(preferences.serviceScale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated or already completed
  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.replace(ROUTES.HOME);
      } else if (isOnboardingCompleted()) {
        router.replace(ROUTES.IDEAS);
      }
    }
  }, [mounted, isAuthenticated, isOnboardingCompleted, router]);

  const handleNicheToggle = (nicheId: string) => {
    setSelectedNiches((prev) => {
      if (prev.includes(nicheId)) {
        return prev.filter((n) => n !== nicheId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, nicheId];
    });
  };

  const handleNext = () => {
    if (step === 1) {
      setNiches(selectedNiches);
      setStep(2);
    } else if (step === 2) {
      setTargetRevenue(selectedRevenue);
      setStep(3);
    } else if (step === 3) {
      setServiceScale(selectedScale);
      completeOnboarding();
      router.push(ROUTES.IDEAS);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return selectedNiches.length === 0;
    return false;
  };

  const progressPercent = (step / 3) * 100;

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoText}>IdeaRadar</span>
        </div>

        {/* Card */}
        <div className={styles.card}>
          {/* Progress Bar */}
          <div className={styles.progress}>
            <div className={styles.progressHeader}>
              <span className={styles.stepLabel}>{t('step')} {step} {t('of')} 3</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step 1: Niches */}
          {step === 1 && (
            <>
              <h1 className={styles.stepTitle}>{t('niche.title')}</h1>
              <p className={styles.stepDescription}>{t('niche.description')}</p>

              <div className={styles.nicheGrid}>
                {NICHE_OPTIONS.map((niche) => {
                  const isSelected = selectedNiches.includes(niche.id);
                  const isDisabled = !isSelected && selectedNiches.length >= 3;
                  return (
                    <button
                      key={niche.id}
                      className={`${styles.nicheOption} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                      onClick={() => handleNicheToggle(niche.id)}
                      disabled={isDisabled}
                    >
                      <span className={styles.nicheCheck} />
                      <span className={styles.nicheLabel}>{niche.label}</span>
                    </button>
                  );
                })}
              </div>

              <p className={styles.selectedCount}>
                {selectedNiches.length}/3 {t('niche.selected')}
              </p>
            </>
          )}

          {/* Step 2: Revenue */}
          {step === 2 && (
            <>
              <h1 className={styles.stepTitle}>{t('revenue.title')}</h1>
              <p className={styles.stepDescription}>{t('revenue.description')}</p>

              <div className={styles.revenueList}>
                {REVENUE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.revenueOption} ${selectedRevenue === option.value ? styles.selected : ''}`}
                    onClick={() => setSelectedRevenue(option.value)}
                  >
                    <span className={styles.radioCircle} />
                    <div className={styles.revenueContent}>
                      <span className={styles.revenueLabel}>{option.label}</span>
                      <span className={styles.revenueDescription}>{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Scale */}
          {step === 3 && (
            <>
              <h1 className={styles.stepTitle}>{t('scale.title')}</h1>
              <p className={styles.stepDescription}>{t('scale.description')}</p>

              <div className={styles.scaleList}>
                {SCALE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.scaleOption} ${selectedScale === option.value ? styles.selected : ''}`}
                    onClick={() => setSelectedScale(option.value)}
                  >
                    <span className={styles.scaleCheck}>
                      {selectedScale === option.value && 'v'}
                    </span>
                    <div className={styles.scaleLabel}>{option.label}</div>
                    <div className={styles.scaleDescription}>{option.description}</div>
                    <div className={styles.scaleExamples}>{option.examples}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className={styles.buttons}>
            {step > 1 && (
              <button className={styles.backButton} onClick={handleBack}>
                {t('back')}
              </button>
            )}
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              {step === 3 ? t('complete') : t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
