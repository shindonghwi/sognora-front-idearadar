'use client';

import Link from 'next/link';
import styles from './footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <Link href="/terms" className={styles.link}>Terms</Link>
          <Link href="/privacy" className={styles.link}>Privacy</Link>
          <Link href="/support" className={styles.link}>Support</Link>
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} IdeaRadar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
