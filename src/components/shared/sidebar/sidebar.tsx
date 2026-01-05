'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, BookOpen, Sparkles, Heart, Moon, Flower2, History, Bookmark, Compass, HelpCircle, MessageCircle } from 'lucide-react';
import { Layout } from '@sognora/ui';
import type { SidebarMenuGroup } from '@sognora/ui';
import { useAuthContext } from '@/infra/providers/auth-context';
import { useAuthStore } from '@/core/stores';
import styles from './sidebar.module.css';

const MAIN_MENU_ITEMS = [
  { key: '/', label: '홈', icon: <Home size={20} /> },
  { key: '/stories', label: '스토리', icon: <BookOpen size={20} />, disabled: true },
];

const SERVICE_ITEMS = [
  { key: '/explore/horoscope', label: '운세', icon: <Sparkles size={20} /> },
  { key: '/explore/fortune', label: '사주', icon: <Compass size={20} /> },
  { key: '/explore/compatibility', label: '궁합', icon: <Heart size={20} /> },
  { key: '/explore/tarot', label: '타로', icon: <Flower2 size={20} /> },
  { key: '/explore/dreams', label: '해몽', icon: <Moon size={20} /> },
];

const MY_MENU_ITEMS = [
  { key: '/my/results', label: '운세 기록', icon: <History size={20} /> },
  { key: '/my/saved', label: '저장한 운세', icon: <Bookmark size={20} /> },
];

const getSupportItems = (isAuthenticated: boolean) => {
  const items = [
    { key: '/support?tab=faq', label: '자주 묻는 질문', icon: <HelpCircle size={20} /> },
  ];

  // 로그인한 사용자만 문의 메뉴 표시
  if (isAuthenticated) {
    items.push({ key: '/support?tab=contact', label: '문의하기', icon: <MessageCircle size={20} /> });
    items.push({ key: '/support?tab=inquiries', label: '내 문의 내역', icon: <MessageCircle size={20} /> });
  }

  return items;
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initialAuthState } = useAuthContext();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  // SSR/hydration 전에는 initialAuthState 사용, 후에는 isAuthenticated 사용
  const showAsLoggedIn = hasHydrated ? isAuthenticated : initialAuthState;

  // 현재 경로와 메뉴 href 비교 (locale prefix 제거)
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  // support 페이지일 경우 tab 쿼리 파라미터 포함
  const tab = searchParams.get('tab');
  const selectedKey = cleanPath === '/support' && tab ? `/support?tab=${tab}` : cleanPath;

  // 메뉴 그룹 구성
  const menuGroups: SidebarMenuGroup[] = [
    {
      key: 'main',
      title: '',
      items: MAIN_MENU_ITEMS,
      hideTitle: true,
    },
    {
      key: 'services',
      title: '서비스',
      items: SERVICE_ITEMS,
    },
  ];

  if (showAsLoggedIn) {
    menuGroups.push({
      key: 'my-library',
      title: '내 라이브러리',
      items: MY_MENU_ITEMS,
    });
  }

  menuGroups.push({
    key: 'support',
    title: '고객 지원',
    items: getSupportItems(showAsLoggedIn),
  });

  const handleSelect = (key: string) => {
    router.push(key);
  };

  // Footer 콘텐츠
  const footerContent = (
    <div className={styles.adBox}>
      <span className={styles.adLabel}>AD</span>
      <div className={styles.adPlaceholder}>광고 영역</div>
    </div>
  );

  return (
    <Layout.Sidebar
      items={menuGroups}
      selectedKey={selectedKey}
      onSelect={handleSelect}
      footer={footerContent}
      size="md"
      collapsible={false}
      className={styles.sidebar}
    />
  );
}
