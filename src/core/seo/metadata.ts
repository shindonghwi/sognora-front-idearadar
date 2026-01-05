/**
 * SEO 메타데이터 관리
 *
 * 서비스별로 수정 필요
 */

import { Metadata } from 'next';
import config from '@/core/config/env';

// 기본 사이트 정보 - TODO: 서비스별 수정
export const SITE_INFO = {
  name: '', // TODO: 서비스명
  description: '', // TODO: 서비스 설명
  url: config.siteUrl || '',
  ogImage: '/images/og-default.png',
} as const;

// 기본 메타데이터
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url || 'http://localhost:3000'),
  title: {
    default: SITE_INFO.name,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [], // TODO: 서비스 키워드
  authors: [{ name: SITE_INFO.name }],
  icons: {
    icon: '/images/common/favicon.png',
    shortcut: '/images/common/favicon.png',
    apple: '/images/common/favicon.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_INFO.name,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '', // TODO: 트위터 계정
  },
  robots: {
    index: true,
    follow: true,
  },
};

// 페이지별 메타데이터 생성 헬퍼
interface PageMetadataParams {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: PageMetadataParams): Metadata {
  const url = `${SITE_INFO.url}${path}`;
  const image = ogImage || SITE_INFO.ogImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

// 다국어 메타데이터 헬퍼
interface LocalizedMessages {
  title?: string;
  description?: string;
}

export function getLocalizedMetadata(
  messages: LocalizedMessages,
  path: string
): Metadata {
  return createPageMetadata({
    title: messages.title || SITE_INFO.name,
    description: messages.description || SITE_INFO.description,
    path,
  });
}
