'use client';

import styles from './animated-gradient.module.css';

interface AnimatedGradientProps {
  variant?: 'hero' | 'dark' | 'cta';
  className?: string;
}

export function AnimatedGradient({ variant = 'hero', className = '' }: AnimatedGradientProps) {
  return (
    <div className={`${styles.gradient} ${styles[variant]} ${className}`}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.noise} />
    </div>
  );
}

// Floating orbs for hero section
export function FloatingOrbs() {
  return (
    <div className={styles.orbs}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
    </div>
  );
}
