'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { User, Sun, Moon, HelpCircle, LogOut, Gift, Archive, Settings } from 'lucide-react';
import { Button, Select } from '@sognora/ui';
import { useTheme } from '@/infra/providers/theme-provider';
import { useAuthContext } from '@/infra/providers/auth-context';
import { useAuthStore, useUIStore } from '@/core/stores';
import { useWalletSummaryGet } from '@/core/domain/wallet';
import { useAuthLogoutPost } from '@/core/domain/auth';
import { useRouter, usePathname } from '@/infra/i18n/routing';
import styles from './header.module.css';

const languageOptions = [
  { value: 'ko', label: <span>🇰🇷 한국어</span> },
  { value: 'en', label: <span>🇺🇸 English</span> },
  { value: 'ja', label: <span>🇯🇵 日本語</span> },
];

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getDisplayName = useAuthStore((state) => state.getDisplayName);
  const logout = useAuthStore((state) => state.logout);
  const logoutMutation = useAuthLogoutPost();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* 유저 정보 헤더 */}
          <div className={styles.profileHeader}>
            <span className={styles.profileName}>{getDisplayName()}</span>
          </div>

          {/* 메뉴 아이템들 */}
          <div className={styles.profileMenuList}>
            <Button asChild type="ghost" size="sm" prefix={<User size={14} />} block className={styles.menuButton}>
              <Link href="/account/profile" onClick={() => setIsOpen(false)}>내 프로필</Link>
            </Button>
            <Button asChild type="ghost" size="sm" prefix={<Archive size={14} />} block className={styles.menuButton}>
              <Link href="/account/library" onClick={() => setIsOpen(false)}>내 보관함</Link>
            </Button>
            <Button asChild type="ghost" size="sm" prefix={<HelpCircle size={14} />} block className={styles.menuButton}>
              <Link href="/support" onClick={() => setIsOpen(false)}>고객지원</Link>
            </Button>
            <Button asChild type="ghost" size="sm" prefix={<Settings size={14} />} block className={styles.menuButton}>
              <Link href="/account/settings" onClick={() => setIsOpen(false)}>설정</Link>
            </Button>
          </div>

          {/* 친구 초대 카드 */}
          <div className={styles.inviteCard}>
            <div className={styles.inviteCardHeader}>
              <div className={styles.inviteIcon}>
                <Gift size={18} />
              </div>
              <div className={styles.inviteHeaderText}>
                <span className={styles.inviteTitle}>친구 초대</span>
                <span className={styles.inviteProgress}>초대 현황: 0 / 3</span>
              </div>
            </div>
            <p className={styles.inviteDesc}>
              친구에게 <strong>무료 크레딧</strong>을 선물하고 나도 받아요!
            </p>
            <Button type="primary" size="sm" prefix={<Gift size={14} />} block>
              초대하기
            </Button>
          </div>

          {/* 하단 로그아웃 */}
          <div className={styles.profileFooter}>
            <Button
              type="outline"
              size="sm"
              prefix={<LogOut size={14} />}
              onClick={async () => {
                setIsOpen(false);
                try {
                  await logoutMutation.mutateAsync();
                } catch {
                  // 백엔드 로그아웃 실패해도 로컬 로그아웃 진행
                }
                logout();
              }}
              loading={logoutMutation.isPending}
              block
            >
              로그아웃
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

  // SSR/hydration 전에는 initialAuthState 사용, 후에는 isAuthenticated 사용
  const showAsLoggedIn = hasHydrated ? isAuthenticated : initialAuthState;
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as 'ko' | 'en' | 'ja') || 'ko';

  // 크레딧 잔액 조회 (로그인 상태일 때만)
  const { data: walletSummary } = useWalletSummaryGet('CREDIT', {
    enabled: isAuthenticated,
  });

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
      {/* 좌측: 로고 */}
      <div className={styles.leftSection}>
        <span className={styles.logo}>AUNERI</span>
      </div>

      {/* 우측: 테마 전환 + 언어 변경 + 로그인/프로필 */}
      <div className={styles.rightSection}>
        {/* 테마 전환 버튼 */}
        <Button
          type="outline"
          shape="circle"
          prefix={mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          onClick={toggleTheme}
          aria-label="테마 전환"
        />

        {/* 언어 변경 */}
        <Select
          options={languageOptions}
          value={currentLocale}
          onChange={handleLanguageChange}
          style={{ width: 120 }}
        />

        {/* SSR: initialAuthState, Client: isAuthenticated 사용으로 깜빡임 방지 */}
        {showAsLoggedIn ? (
          <>
            {/* 크레딧 충전 */}
            <Link href="/credits" className={styles.creditButton}>
              <Image
                src="/images/icons/icon-credit.png"
                alt="크레딧"
                width={16}
                height={16}
              />
              <span className={styles.creditBalance}>
                {walletSummary?.totalBalance?.toLocaleString() ?? '0'}
              </span>
              <span className={styles.creditAction}>충전</span>
            </Link>
            {/* 프로필 드롭다운 */}
            <ProfileDropdown />
          </>
        ) : (
          <Button type="primary" size="sm" onClick={() => openLoginModal()}>
            로그인하기
          </Button>
        )}
      </div>
    </header>
  );
}
