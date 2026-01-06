'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@sognora/ui';
import { useUIStore } from '@/core/stores';
import styles from './floating-navbar.module.css';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const openLoginModal = useUIStore((state) => state.openLoginModal);

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
          Get Started
        </Button>
      </div>
    </nav>
  );
}
