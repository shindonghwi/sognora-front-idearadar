'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@sognora/ui';
import { useUIStore, useAuthStore } from '@/core/stores';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import styles from './floating-navbar.module.css';

export function FloatingNavbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const openLoginModal = useUIStore((state) => state.openLoginModal);
  const { isAuthenticated, profile, logout } = useAuthStore();

  const navItems = [
    { label: t('features'), href: '#features' },
    { label: t('howItWorks'), href: '#how-it-works' },
    { label: t('pricing'), href: '#pricing' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearTokens();
    clearAccountStatus();
    logout();
    setDropdownOpen(false);
    window.location.href = '/';
  };

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

        {/* CTA Button / User Menu */}
        {mounted && isAuthenticated ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              className={styles.userButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className={styles.userAvatar}>
                {profile?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className={styles.userEmail}>{profile?.email || 'User'}</span>
              <span className={styles.chevron}>{dropdownOpen ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="primary"
            size="sm"
            onClick={() => openLoginModal()}
          >
            {t('getStarted')}
          </Button>
        )}
      </div>
    </nav>
  );
}
