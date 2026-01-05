import createMiddleware from 'next-intl/middleware';
import { routing } from '@/infra/i18n/routing';

// locale 감지 및 리다이렉트 미들웨어
export const localeMiddleware = createMiddleware(routing);