'use client';

import { NotificationHolder } from '@sognora/ui';
import { DevToolsFloatButton } from '@/components/dev';
import { LoginModal } from '@/components/auth';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  return (
    <>
      {children}

      {/* Login Modal */}
      <LoginModal />

      {/* Dev Tools */}
      <DevToolsFloatButton />

      {/* Notification Container */}
      <NotificationHolder />
    </>
  );
}
