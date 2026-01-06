'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@sognora/ui';
import { useUIStore } from '@/core/stores';
import styles from './floating-navbar.module.css';

export function FloatingNavbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const openLoginModal = useUIStore((state) => state.openLoginModal);

  const navItems = [
    { label: t('features'), href: '#features' },
    { label: t('howItWorks'), href: '#how-it-works' },
    { label: t('pricing'), href: '#pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>IdeaRadar</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.navLink}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          type="primary"
          size="sm"
          onClick={() => openLoginModal()}
        >
          {t('getStarted')}
        </Button>
      </div>
    </nav>
  );
}
