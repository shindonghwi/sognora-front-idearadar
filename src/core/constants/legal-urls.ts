/**
 * Legal documents hosted on S3/CloudFront
 *
 * 서비스별로 수정 필요
 */

export const LEGAL_DOCUMENTS = {
  brand: 'IdeaRadar',
  version: '0.0.1',
  effectiveDate: '',
  updatedAt: '',
  documents: {
    'privacy-policy': {
      ko: '', // TODO: 개인정보처리방침 URL
      en: '',
      ja: '',
    },
    'terms-of-service': {
      ko: '', // TODO: 이용약관 URL
      en: '',
      ja: '',
    },
    'refund-policy': {
      ko: '', // TODO: 환불정책 URL
      en: '',
      ja: '',
    },
  },
} as const;

type Locale = 'ko' | 'en' | 'ja';
type LegalDocumentType = keyof typeof LEGAL_DOCUMENTS.documents;

/**
 * Get legal document URL by type and locale
 */
export function getLegalUrl(type: LegalDocumentType, locale: Locale = 'ko'): string {
  return LEGAL_DOCUMENTS.documents[type][locale];
}
