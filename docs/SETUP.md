# New Service Setup Guide

> Claude Code reads this document when setting up a new project and proceeds in order.

---

## Pre-setup Questions (Claude Code → User)

Before setting up a new service, confirm the following:

1. **Service name**: lowercase English (e.g., `howmuchpet`)
2. **Display name**: How users see the service (e.g., `HowMuchPet`)
3. **Port number**: Development server port (e.g., `3008`)
4. **Service description**: One-line description
5. **Primary color**: Brand primary color (e.g., `#FF6B35`)
6. **Supported languages**: Which languages? (e.g., `en` only, or `en,ko,ja`)

---

## Checklist

### Phase 1: Basic Configuration

- [ ] **1.1 Copy .env.example to .env**
  - Update values based on answers

- [ ] **1.2 package.json**
  - `name`: `sognora-front-{service-name}`
  - `version`: `0.1.0`
  - `scripts.dev`: `next dev -p {port}`
  - `scripts.start`: `next start -p {port}`

- [ ] **1.3 Makefile**
  - `PORT := {port}` (line 3)
  - help message: `Sognora {Display Name}` (line 9)

- [ ] **1.4 env/.env.local**
  - Same content as `.env`

- [ ] **1.5 CLAUDE.md**
  - Update project name, port, service description

---

### Phase 2: Brand Configuration

- [ ] **2.1 messages/{locale}.json**
  - Create translation files for each supported language
  - Minimum structure:
  ```json
  {
    "common": {
      "appName": "{Display Name}",
      "tagline": "{Service description}",
      "loading": "Loading...",
      "error": "An error occurred",
      "retry": "Retry"
    }
  }
  ```

- [ ] **2.2 docs/brand/** (optional)
  - `identity.md` - Brand identity
  - `design.md` - Design direction
  - `ux.md` - User experience
  - `anti-patterns.md` - Anti-patterns to avoid

- [ ] **2.3 public/**
  - `images/common/favicon.png` - Favicon
  - `images/og-default.png` - OG image

---

### Phase 3: Code Modifications

- [ ] **3.1 src/infra/i18n/config.ts**
  - Update `locales` array based on supported languages
  - Set `defaultLocale`

- [ ] **3.2 src/core/seo/metadata.ts**
  - `SITE_INFO.name`: Display name
  - `SITE_INFO.description`: Service description
  - `keywords`: SEO keywords
  - `twitter.site`: Twitter account (optional)

- [ ] **3.3 src/core/constants/legal-urls.ts**
  - `brand`: Service name
  - Legal document URLs (privacy policy, terms of service, refund policy)

- [ ] **3.4 src/infra/theme/front-theme.ts**
  - Rename theme exports: `appThemeLight` → `{serviceName}ThemeLight`
  - Update primary color palette to match brand color
  - Update related colors (hover, subtle, etc.)

- [ ] **3.5 Theme references**
  - Update all imports from `appThemeLight/Dark` to new names
  - Files to check:
    - `src/infra/providers/theme-provider.tsx`
    - `src/app/[locale]/layout.tsx`

- [ ] **3.6 src/app/globals.css**
  - Update `--app-*` CSS variables to `--{serviceName}-*`
  - Update data-theme selectors if needed

- [ ] **3.7 src/components/shared/header/header.tsx**
  - Update logo text (line 116)

- [ ] **3.8 src/components/shared/footer/footer.tsx**
  - Update copyright text

- [ ] **3.9 src/app/global-error.tsx**
  - Update brand name in error page

---

### Phase 4: API Integration (when backend is ready)

- [ ] **4.1 Update API URLs**
  - `src/core/api/manual/axios-instance.ts`
  - Update `development` and `production` URLs

- [ ] **4.2 Connect to backend Swagger**
  ```bash
  make swagger
  ```
  - Generates `src/core/api/generated/` files
  - Generates `src/core/domain/` React Query hooks

- [ ] **4.3 Replace local types with generated types**
  - `src/core/stores/auth-store.ts` - Replace local enums with generated ones
  - Enable full auth integration in `src/infra/providers/auth-context.tsx`

---

### Phase 5: Verification

- [ ] **5.1 Start development server**
  ```bash
  npm install
  make dev
  ```

- [ ] **5.2 Type check**
  ```bash
  npm run type-check
  ```

- [ ] **5.3 Lint**
  ```bash
  npm run lint
  ```

- [ ] **5.4 Build test**
  ```bash
  make build
  ```

---

## File Reference

### .env
```env
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_BRAND_KEY={service-name}
NEXT_PUBLIC_SITE_URL=http://localhost:{port}
NEXT_PUBLIC_CDN_URL=
```

### package.json
```json
{
  "name": "sognora-front-{service-name}",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p {port}",
    "start": "next start -p {port}"
  }
}
```

### Makefile
```makefile
PORT := {port}

help:
	@echo "Sognora {Display Name} v$(CURRENT_VERSION)"
```

### src/core/seo/metadata.ts
```typescript
export const SITE_INFO = {
  name: '{Display Name}',
  description: '{Service description}',
  url: config.siteUrl || '',
  ogImage: '/images/og-default.png',
} as const;
```

### src/infra/theme/front-theme.ts
```typescript
export const {serviceName}ThemeLight: ThemeConfig = {
  mode: 'light',
  palette: {
    primary: {
      500: '{brand-primary-color}',
      // Generate other shades based on primary
    },
  },
  // ...
};
```

---

## Directory Structure

```
{project}/
├── .env                    # Environment variables
├── .env.example            # Environment template
├── CLAUDE.md               # Claude Code guide
├── Makefile                # Build commands
├── package.json            # Dependencies
├── docs/
│   ├── SETUP.md            # This file
│   └── brand/              # Brand guide (optional)
├── env/
│   └── .env.local          # Local environment
├── messages/               # i18n translations
│   └── en.json
├── public/                 # Static files
│   ├── fonts/
│   └── images/
└── src/
    ├── app/                # Next.js App Router
    ├── components/
    │   ├── auth/           # Auth components (implement as needed)
    │   ├── layout/         # Layout components
    │   └── shared/         # Shared components (header, footer, sidebar)
    ├── core/
    │   ├── api/            # API layer
    │   ├── config/         # Configuration
    │   ├── constants/      # Constants
    │   ├── seo/            # SEO utilities
    │   ├── stores/         # Zustand stores
    │   └── utils/          # Utilities
    ├── features/           # Feature pages (implement here)
    └── infra/
        ├── i18n/           # i18n configuration
        ├── middleware/     # Next.js middleware
        ├── providers/      # React providers
        └── theme/          # Theme configuration
```

---

## After Completion

When all checklist items are complete:
1. `npm install` - Install dependencies
2. `make dev` - Start development server
3. Implement features in `features/` directory
4. Run `make swagger` when backend is ready
