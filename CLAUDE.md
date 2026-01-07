# IdeaRadar

> Find validated startup ideas from Reddit daily

Reddit에서 "Someone should build..." 문구를 자동 스캔하여 검증된 스타트업 아이디어를 매주 전달하는 AI 기반 아이디어 헌팅 어시스턴트

## Quick Start

```bash
npm install
make dev        # http://localhost:3008
```

## Commands

| Command | Description |
|---------|-------------|
| `make dev` | 개발 서버 실행 (port 3008) |
| `make build` | 프로덕션 빌드 |
| `make swagger` | API 클라이언트 생성 |
| `make clean` | 빌드 캐시 정리 |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + @sognora/ui
- **State:** Zustand + React Query
- **i18n:** next-intl (en)

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/
│   ├── auth/           # Auth components
│   ├── layout/         # Layout components
│   └── shared/         # Header, Footer, Sidebar
├── core/
│   ├── api/            # API layer
│   ├── config/         # Configuration
│   ├── constants/      # Constants
│   ├── seo/            # SEO utilities
│   ├── stores/         # Zustand stores
│   └── utils/          # Utilities
├── features/           # Feature pages
└── infra/
    ├── i18n/           # i18n config
    ├── middleware/     # Next.js middleware
    ├── providers/      # React providers
    └── theme/          # Theme config
```

## Environment Variables

```env
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_BRAND_KEY=idearadar
NEXT_PUBLIC_SITE_URL=http://localhost:3008
NEXT_PUBLIC_CDN_URL=
```
