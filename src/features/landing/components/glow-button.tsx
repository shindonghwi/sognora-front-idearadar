'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import styles from './glow-button.module.css';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
  type?: 'button' | 'submit';
}

export function GlowButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  pulse = false,
  type = 'button',
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${pulse ? styles.pulse : ''} ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className={styles.content}>{children}</span>
      <span className={styles.glow} />
    </motion.button>
  );
}
