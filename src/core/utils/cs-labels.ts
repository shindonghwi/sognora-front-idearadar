import { CsInquiryCategory, CsFaqCategory, CsInquiryStatus } from '@/core/api/generated/types/cs';

/**
 * 문의 카테고리 한글 라벨
 */
export const INQUIRY_CATEGORY_LABELS: Record<CsInquiryCategory, string> = {
  [CsInquiryCategory.CsInquiryCategoryAccount]: '계정 관련',
  [CsInquiryCategory.CsInquiryCategoryPayment]: '결제 관련',
  [CsInquiryCategory.CsInquiryCategoryProduct]: '상품 관련',
  [CsInquiryCategory.CsInquiryCategoryFeature]: '기능 사용',
  [CsInquiryCategory.CsInquiryCategoryBug]: '버그 신고',
  [CsInquiryCategory.CsInquiryCategoryProposal]: '기능 제안',
  [CsInquiryCategory.CsInquiryCategoryEtc]: '기타',
};

/**
 * FAQ 카테고리 한글 라벨
 */
export const FAQ_CATEGORY_LABELS: Record<CsFaqCategory, string> = {
  [CsFaqCategory.CsFaqCategoryAccount]: '계정',
  [CsFaqCategory.CsFaqCategoryPayment]: '결제',
  [CsFaqCategory.CsFaqCategoryProduct]: '상품',
  [CsFaqCategory.CsFaqCategoryFeature]: '기능 사용',
  [CsFaqCategory.CsFaqCategoryService]: '서비스/분석',
  [CsFaqCategory.CsFaqCategoryTechnical]: '기술 지원',
  [CsFaqCategory.CsFaqCategoryEtc]: '기타',
};

/**
 * 문의 상태 한글 라벨
 */
export const INQUIRY_STATUS_LABELS: Record<CsInquiryStatus, string> = {
  [CsInquiryStatus.CsInquiryStatusPending]: '대기',
  [CsInquiryStatus.CsInquiryStatusProcessing]: '처리중',
  [CsInquiryStatus.CsInquiryStatusCompleted]: '완료',
  [CsInquiryStatus.CsInquiryStatusClosed]: '종료',
};

/**
 * 문의 카테고리 선택 옵션 (폼용)
 */
export const INQUIRY_CATEGORY_OPTIONS = Object.entries(INQUIRY_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * FAQ 카테고리 선택 옵션 (필터용)
 */
export const FAQ_CATEGORY_OPTIONS = Object.entries(FAQ_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * 문의 상태 선택 옵션 (필터용)
 */
export const INQUIRY_STATUS_OPTIONS = Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
