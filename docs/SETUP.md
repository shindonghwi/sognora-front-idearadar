# 새 서비스 초기 설정 가이드

> Claude Code가 새 프로젝트 설정 시 이 문서를 읽고 순서대로 진행합니다.

---

## 사전 질문 (Claude Code → 사용자)

새 서비스 설정 전 아래 정보를 확인하세요:

1. **서비스명**: 영문 소문자 (예: `newbrand`)
2. **서비스 표시명**: 한글/영문 (예: `뉴브랜드`, `NewBrand`)
3. **포트 번호**: 개발 서버 포트 (예: `3007`)
4. **서비스 설명**: 한 줄 설명
5. **Google OAuth Client ID**: (없으면 나중에 설정)
6. **브랜드 주요 색상**: Primary 컬러 (예: `#E67E22`)

---

## 체크리스트

### Phase 1: 기본 설정

- [ ] **1.1 package.json 수정**
  - `name`: `sognora-front-{서비스명}`
  - `version`: `0.1.0`
  - `scripts.dev`: `next dev -p {포트}`
  - `scripts.start`: `next start -p {포트}`

- [ ] **1.2 Makefile 수정**
  - `PORT := {포트}` (3행)
  - help 메시지: `Sognora {서비스 표시명}` (7행)

- [ ] **1.3 .env 생성**
  ```env
  NEXT_PUBLIC_ENV=local
  NEXT_PUBLIC_BRAND_KEY={서비스명}
  NEXT_PUBLIC_SITE_URL=http://localhost:{포트}
  NEXT_PUBLIC_GOOGLE_CLIENT_ID={구글_클라이언트_ID}
  NEXT_PUBLIC_CDN_URL=https://d3uceoqa908nb.cloudfront.net
  ```

- [ ] **1.4 env/.env.local 생성**
  - `.env`와 동일한 내용

- [ ] **1.5 CLAUDE.md 수정**
  - 프로젝트명, 포트, 서비스 설명 업데이트

---

### Phase 2: 브랜드 설정

- [ ] **2.1 messages/ 생성**
  - `ko.json`, `en.json`, `ja.json` 생성
  - 서비스명, 공통 텍스트 번역

- [ ] **2.2 docs/brand/ 생성**
  - `identity.md` - 브랜드 정체성
  - `design.md` - 디자인 방향
  - `ux.md` - 사용자 경험
  - `anti-patterns.md` - 피해야 할 패턴

- [ ] **2.3 public/ 설정**
  - `images/common/favicon.png` - 파비콘
  - `images/og-default.png` - OG 이미지
  - `fonts/` - 필요한 폰트

---

### Phase 3: 코드 수정

- [ ] **3.1 src/core/seo/metadata.ts**
  - `SITE_INFO.name`: 서비스 표시명
  - `SITE_INFO.description`: 서비스 설명
  - `keywords`: SEO 키워드
  - `twitter.site`: 트위터 계정

- [ ] **3.2 src/core/constants/legal-urls.ts**
  - `brand`: 서비스명
  - 법적 문서 URL (개인정보처리방침, 이용약관, 환불정책)

- [ ] **3.3 src/infra/theme/front-theme.ts**
  - 테마 변수명: `{서비스명}ThemeLight`, `{서비스명}ThemeDark`
  - Primary 색상 팔레트
  - 브랜드에 맞는 색상 체계

- [ ] **3.4 src/components/auth/** (필요시)
  - 로그인 모달 구현
  - OAuth 연동 (Google, Kakao 등)

---

### Phase 4: API 연동

- [ ] **4.1 백엔드 Swagger 연결**
  ```bash
  make swagger
  ```
  - `src/core/api/generated/` 파일 생성됨
  - `src/core/domain/` React Query 훅 생성됨

---

### Phase 5: 확인

- [ ] **5.1 개발 서버 실행**
  ```bash
  npm install
  make dev
  ```

- [ ] **5.2 빌드 테스트**
  ```bash
  make build
  ```

- [ ] **5.3 타입 체크**
  ```bash
  npm run type-check
  ```

---

## 파일별 상세 가이드

### package.json
```json
{
  "name": "sognora-front-{서비스명}",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p {포트}",
    "start": "next start -p {포트}"
  }
}
```

### Makefile
```makefile
PORT := {포트}

help:
	@echo "Sognora {서비스 표시명} v$(CURRENT_VERSION)"
```

### .env
```env
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_BRAND_KEY={서비스명}
NEXT_PUBLIC_SITE_URL=http://localhost:{포트}
NEXT_PUBLIC_GOOGLE_CLIENT_ID={구글_클라이언트_ID}
NEXT_PUBLIC_CDN_URL=https://d3uceoqa908nb.cloudfront.net
```

### messages/ko.json (최소 구조)
```json
{
  "common": {
    "appName": "{서비스 표시명}",
    "loading": "로딩 중...",
    "error": "오류가 발생했습니다",
    "retry": "다시 시도",
    "cancel": "취소",
    "confirm": "확인",
    "save": "저장",
    "delete": "삭제",
    "edit": "수정",
    "close": "닫기"
  },
  "auth": {
    "login": "로그인",
    "logout": "로그아웃",
    "loginRequired": "로그인이 필요합니다"
  },
  "nav": {
    "home": "홈",
    "myPage": "마이페이지",
    "settings": "설정"
  }
}
```

### src/core/seo/metadata.ts
```typescript
export const SITE_INFO = {
  name: '{서비스 표시명}',
  description: '{서비스 설명}',
  url: config.siteUrl || '',
  ogImage: '/images/og-default.png',
} as const;
```

### src/core/constants/legal-urls.ts
```typescript
export const LEGAL_DOCUMENTS = {
  brand: '{서비스명}',
  version: '0.0.1',
  effectiveDate: '',
  updatedAt: '',
  documents: {
    'privacy-policy': {
      ko: '{개인정보처리방침 URL}',
      en: '',
      ja: '',
    },
    // ...
  },
} as const;
```

### src/infra/theme/front-theme.ts
```typescript
export const {서비스명}ThemeLight: ThemeConfig = {
  mode: 'light',
  palette: {
    primary: {
      500: '{브랜드 주요 색상}',
      // ...
    },
  },
  // ...
};
```

---

## 디렉토리 구조

```
{프로젝트}/
├── .env                    # 환경변수
├── CLAUDE.md               # Claude Code 가이드
├── Makefile                # 빌드 명령어
├── package.json            # 의존성
├── docs/
│   └── brand/              # 브랜드 가이드
├── env/
│   └── .env.local          # 로컬 환경변수
├── messages/               # i18n 번역
│   ├── ko.json
│   ├── en.json
│   └── ja.json
├── public/                 # 정적 파일
│   ├── fonts/
│   └── images/
└── src/
    ├── components/auth/    # 인증 컴포넌트 (구현 필요)
    ├── core/
    │   ├── constants/legal-urls.ts  # 법적 문서 URL
    │   └── seo/metadata.ts          # SEO 메타데이터
    ├── features/           # 페이지 (구현 필요)
    └── infra/
        └── theme/front-theme.ts     # 브랜드 테마
```

---

## 완료 후

모든 체크리스트 완료 시:
1. `npm install` 실행
2. `make swagger` 실행 (백엔드 연결 시)
3. `make dev` 로 개발 서버 시작
4. `features/` 에 페이지 구현 시작
