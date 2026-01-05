'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/features/landing/sections/footer';
import styles from './app-layout.module.css';

interface AppLayoutProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export function AppLayout({
  children,
  header = <Header />,
  sidebar,
  footer = <Footer />,
  noPadding = false,
}: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* 헤더 */}
      {header}

      {/* 바디 영역 (사이드바 + 메인) */}
      <div className={styles.bodyArea}>
        {/* 사이드바 (optional) */}
        {sidebar}

        {/* 메인 콘텐츠 */}
        <main className={`${styles.mainArea} ${noPadding ? styles.noPadding : ''}`}>
          <div className={styles.content}>
            {children}
            {/* 풋터 - 콘텐츠 끝에 배치 (스크롤 후 보임) */}
            {footer}
          </div>
        </main>
      </div>
    </div>
  );
}
