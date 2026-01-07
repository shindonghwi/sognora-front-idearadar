'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/core/routes';
import styles from './sidebar.module.css';

interface SidebarProps {
  onLogout: () => void;
  userEmail?: string;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD },
  { label: 'Payment', href: ROUTES.PAYMENT },
  { label: 'Settings', href: ROUTES.SETTINGS },
];

export function Sidebar({ onLogout, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const cleanPath = pathname.replace(/^\/[a-z]{2}/, '');
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href={ROUTES.HOME} className={styles.logoLink}>
          IdeaRadar
        </Link>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {userEmail?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className={styles.userEmail}>{userEmail || 'User'}</span>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          Log out
        </button>
      </div>
    </aside>
  );
}
