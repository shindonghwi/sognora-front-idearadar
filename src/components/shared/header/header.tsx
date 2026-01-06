'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { User, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { Button, Select } from '@sognora/ui';
import { useTheme } from '@/infra/providers/theme-provider';
import { useAuthContext } from '@/infra/providers/auth-context';
import { useAuthStore, useUIStore } from '@/core/stores';
import { useRouter, usePathname } from '@/infra/i18n/routing';
import styles from './header.module.css';

const languageOptions = [
  { value: 'en', label: <span>🇺🇸 English</span> },
  { value: 'ko', label: <span>🇰🇷 한국어</span> },
  { value: 'ja', label: <span>🇯🇵 日本語</span> },
];

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getDisplayName = useAuthStore((state) => state.getDisplayName);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className={styles.profileDropdownWrapper} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>
          <User size={16} />
        </div>
      </button>

      {isOpen && (
        <div className={styles.profileDropdown}>
          {/* User info header */}
          <div className={styles.profileHeader}>
            <span className={styles.profileName}>{getDisplayName()}</span>
          </div>

          {/* Menu items */}
          <div className={styles.profileMenuList}>
            <Button asChild type="ghost" size="sm" prefix={<User size={14} />} block className={styles.menuButton}>
              <Link href="/account/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
            </Button>
            <Button asChild type="ghost" size="sm" prefix={<Settings size={14} />} block className={styles.menuButton}>
              <Link href="/account/settings" onClick={() => setIsOpen(false)}>Settings</Link>
            </Button>
          </div>

          {/* Logout */}
          <div className={styles.profileFooter}>
            <Button
              type="outline"
              size="sm"
              prefix={<LogOut size={14} />}
              onClick={handleLogout}
              block
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { initialAuthState } = useAuthContext();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const openLoginModal = useUIStore((state) => state.openLoginModal);

  // SSR: use initialAuthState, Client: use isAuthenticated to prevent flicker
  const showAsLoggedIn = hasHydrated ? isAuthenticated : initialAuthState;
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as 'ko' | 'en' | 'ja') || 'en';

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const handleLanguageChange = (value: string | number | (string | number)[]) => {
    const newLocale = typeof value === 'string' ? value : String(value);
    router.replace(pathname, { locale: newLocale as 'ko' | 'en' | 'ja' });
  };

  return (
    <header className={styles.header}>
      {/* Left: Logo */}
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>App</Link>
      </div>

      {/* Right: Theme toggle + Language + Login/Profile */}
      <div className={styles.rightSection}>
        {/* Theme toggle button */}
        <Button
          type="outline"
          shape="circle"
          prefix={mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />

        {/* Language selector */}
        <Select
          options={languageOptions}
          value={currentLocale}
          onChange={handleLanguageChange}
          style={{ width: 120 }}
        />

        {/* SSR: use initialAuthState, Client: use isAuthenticated to prevent flicker */}
        {showAsLoggedIn ? (
          <ProfileDropdown />
        ) : (
          <Button type="primary" size="sm" onClick={() => openLoginModal()}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
