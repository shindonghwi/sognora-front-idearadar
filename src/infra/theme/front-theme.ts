import { ThemeConfig } from '@sognora/ui/theme';


export const idearadarThemeLight: ThemeConfig = {
  // ===== Mode =====
  mode: 'light',

  // ===== Semantic Tokens (Layer 2) =====
  semantic: {
    // Surface - Clean, premium backgrounds
    surface: {
      base: '#FAFAFA',      // Page background (subtle gray)
      default: '#FFFFFF',   // Default content area
      paper: '#FFFFFF',     // Cards, panels, sidebar
      elevated: '#FFFFFF',  // Modals, dropdowns, popovers
      sunken: '#F4F4F5',    // Input fields, code blocks
      overlay: 'rgba(0, 0, 0, 0.5)',  // Modal backdrop
      overlayLight: 'rgba(255, 255, 255, 0.7)',  // Content loading overlay
      inverse: '#18181B',   // Inverted background
      inverseHover: 'rgba(255, 255, 255, 0.1)',  // Hover on dark backgrounds
    },

    // On-Surface - Text on backgrounds
    onSurface: {
      default: '#18181B',   // Primary text (zinc-900)
      muted: '#52525B',     // Secondary text (zinc-600)
      subtle: '#A1A1AA',    // Hint, placeholder (zinc-400)
      disabled: '#D4D4D8',  // Disabled text (zinc-300)
      inverse: '#FFFFFF',   // Text on inverted background
    },

    // Border - Clean, subtle borders
    border: {
      default: '#D4D4D8',   // Default border (zinc-300)
      muted: '#E4E4E7',     // Subtle border (zinc-200)
      strong: '#A1A1AA',    // Strong border (zinc-400)
      focus: '#F97316',     // Focus ring (orange-500)
      error: '#EF4444',     // Error state (red-500)
      inverse: '#52525B',   // Border on inverted background
    },

    // Interactive - User interaction states
    interactive: {
      default: '#F97316',   // Clickable elements (orange-500)
      hover: '#F4F4F5',     // Hover state background
      active: '#E4E4E7',    // Active/pressed state
      selected: 'rgba(249, 115, 22, 0.12)',  // Selected state background
      disabled: '#F4F4F5',  // Disabled background
    },

    // Accent - Brand/emphasis (Orange primary)
    accent: {
      primary: '#F97316',   // Primary CTA (orange-500)
      primaryHover: '#EA580C',  // Primary hover (orange-600)
      primarySubtle: '#FFF7ED', // Badge, tag background (orange-50)
      onPrimary: '#FFFFFF', // Text on accent
    },

    // Status - State indicators
    status: {
      success: '#10B981',         // success-500
      successSubtle: '#ECFDF5',   // success-50
      warning: '#F59E0B',         // warning-500
      warningSubtle: '#FFFBEB',   // warning-50
      error: '#EF4444',           // red-500
      errorSubtle: '#FEF2F2',     // red-50
      info: '#F97316',            // orange-500
      infoSubtle: '#FFF7ED',      // orange-50
    },

    // Misc
    misc: {
      scrollbarTrack: '#F4F4F5',
      scrollbarThumb: '#D4D4D8',
      scrollbarThumbHover: '#A1A1AA',
      skeletonBase: '#E4E4E7',
      skeletonHighlight: '#F4F4F5',
    },
  },

  // ===== Palette (Layer 1 - Primitive) =====
  palette: {
    // Primary - Orange (IdeaRadar brand)
    primary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',  // Orange - 메인
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
      contrast: '#FFFFFF',
    },

    // Secondary - Warm Grey (스포티파이 스타일)
    secondary: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',  // Warm Grey
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      contrast: '#FFFFFF',
    },

    // Success - Emerald (캐릭터 초록과 구분)
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      contrast: '#FFFFFF',
    },

    // Warning - Amber (캐릭터 노랑과 구분)
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      contrast: '#000000',
    },

    // Error - Rose (캐릭터 빨강과 구분)
    error: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E',
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
      contrast: '#FFFFFF',
    },

    // Info - Orange (브랜드와 통일)
    info: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
      contrast: '#FFFFFF',
    },

    // Grey - Light mode (밝은 배경 기준)
    grey: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      950: '#121212',
    },

    // Extended Colors - Magenta
    magenta: {
      50: '#fff0f6',
      100: '#ffd6e7',
      200: '#ffadd2',
      300: '#ff85c0',
      400: '#f759ab',
      500: '#eb2f96',
      600: '#c41d7f',
      700: '#9e1068',
      800: '#780650',
      900: '#520339',
      contrast: '#FFFFFF',
    },

    // Extended Colors - Gold (Rate star color)
    gold: {
      50: '#fffbe6',
      100: '#fff1b8',
      200: '#ffe58f',
      300: '#ffd666',
      400: '#ffc53d',
      500: '#faad14',
      600: '#d48806',
      700: '#ad6800',
      800: '#874d00',
      900: '#613400',
      contrast: '#000000',
    },

    // Extended Colors - Lime
    lime: {
      50: '#fcffe6',
      100: '#f4ffb8',
      200: '#eaff8f',
      300: '#d3f261',
      400: '#bae637',
      500: '#a0d911',
      600: '#7cb305',
      700: '#5b8c00',
      800: '#3f6600',
      900: '#254000',
      contrast: '#000000',
    },

    // Extended Colors - Cyan
    cyan: {
      50: '#e6fffb',
      100: '#b5f5ec',
      200: '#87e8de',
      300: '#5cdbd3',
      400: '#36cfc9',
      500: '#13c2c2',
      600: '#08979c',
      700: '#006d75',
      800: '#00474f',
      900: '#002329',
      contrast: '#FFFFFF',
    },

    // Extended Colors - Volcano
    volcano: {
      50: '#fff2e8',
      100: '#ffd8bf',
      200: '#ffbb96',
      300: '#ff9c6e',
      400: '#ff7a45',
      500: '#fa541c',
      600: '#d4380d',
      700: '#ad2102',
      800: '#871400',
      900: '#610b00',
      contrast: '#FFFFFF',
    },

    // Extended Colors - Geekblue
    geekblue: {
      50: '#f0f5ff',
      100: '#d6e4ff',
      200: '#adc6ff',
      300: '#85a5ff',
      400: '#597ef7',
      500: '#2f54eb',
      600: '#1d39c4',
      700: '#10239e',
      800: '#061178',
      900: '#030852',
      contrast: '#FFFFFF',
    },

    // Extended Colors - Purple
    purple: {
      50: '#f9f0ff',
      100: '#efdbff',
      200: '#d3adf7',
      300: '#b37feb',
      400: '#9254de',
      500: '#722ed1',
      600: '#531dab',
      700: '#391085',
      800: '#22075e',
      900: '#120338',
      contrast: '#FFFFFF',
    },

    // Background - Light mode
    background: {
      default: '#FAFAFA',  // 밝은 회색 배경
      paper: '#FFFFFF',    // 카드/사이드바 (흰색)
      elevated: '#FFFFFF', // Elevated 영역
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
    },

    // Text - Dark on Light
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
      hint: '#9E9E9E',
    },

    // Divider
    divider: '#E0E0E0',

    // Action states - Orange accent
    action: {
      active: '#F97316',
      hover: 'rgba(249, 115, 22, 0.08)',
      selected: 'rgba(249, 115, 22, 0.12)',
      disabled: '#BDBDBD',
      disabledBackground: '#F5F5F5',
      focus: 'rgba(249, 115, 22, 0.20)',
    },

    white: '#FFFFFF',
  },

  // ===== Typography =====
  typography: {
    fontFamily: {
      primary: 'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
      secondary: 'Noto Serif KR, Georgia, serif',
      mono: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
    },

    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    fontSize: {
      1: '9px',
      2: '10px',
      3: '11px',
      4: '12px',
      5: '13px',
      6: '14px',
      7: '15px',
      8: '16px',
      9: '18px',
      10: '20px',
      11: '24px',
      12: '30px',
      13: '38px',
      14: '46px',
      15: '56px',
      16: '68px',
    },

    lineHeight: {
      tight: '20px',
      normal: '22px',
      relaxed: '24px',
    },

    letterSpacing: {
      tighter: '-0.5px',
      tight: '-0.25px',
      normal: '0px',
      wide: '0.4px',
      wider: '1.5px',
    },

    // Typography variants
    h1: {
      fontSize: '38px',
      fontWeight: 600,
      lineHeight: '46px',
      letterSpacing: '-0.5px',
      margin: '0 0 19px',
    },

    h2: {
      fontSize: '30px',
      fontWeight: 600,
      lineHeight: '38px',
      letterSpacing: '-0.25px',
      margin: '36px 0 15px',
    },

    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
      letterSpacing: '0px',
      margin: '28px 0 12px',
    },

    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '28px',
      letterSpacing: '0px',
      margin: '24px 0 10px',
    },

    h5: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '0px',
      margin: '19px 0 8px',
    },

    h6: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '0px',
      margin: '16px 0 8px',
    },

    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '22px',
      letterSpacing: '0px',
    },

    body2: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0px',
    },

    subtitle1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0px',
    },

    subtitle2: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '22px',
      letterSpacing: '0px',
    },

    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.4px',
    },

    overline: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },

    button: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '22px',
      letterSpacing: '0.4px',
      textTransform: 'none',
    },
  },

  // ===== Spacing =====
  spacing: {
    unit: 4,
    scale: {
      0: '0px',
      1: '4px',
      2: '5px',
      3: '6px',
      4: '7px',
      5: '8px',
      6: '9px',
      7: '10px',
      8: '11px',
      9: '12px',
      10: '13px',
      11: '14px',
      12: '15px',
      13: '16px',
      14: '17px',
      15: '18px',
      16: '19px',
      17: '20px',
      18: '24px',
      19: '32px',
      20: '56px',
      21: '60px',
      22: '80px',
      23: '96px',
      24: '100px',
      25: '180px',
      26: '28px',
      27: '40px',
      28: '48px',
    },
  },

  // ===== Shape =====
  shape: {
    borderRadius: {
      none: '0px',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      pill: '100px',
      circle: '50%',
    },
  },

  // ===== Border =====
  border: {
    width: {
      none: '0px',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },

  // ===== Opacity =====
  opacity: {
    disabled: 0.38,
    hover: 0.04,
    selected: 0.08,
    focus: 0.12,
    active: 0.12,
    ripple: 0.04,
    rippleStart: 0.06,
  },

  // ===== Icon Size =====
  iconSize: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },

  // ===== Button Size =====
  buttonSize: {
    xs: '24px',
    sm: '28px',
    md: '32px',
    lg: '40px',
    xl: '48px',
  },

  checkboxSize: {
    sm: '10px',
    md: '12px',
    lg: '14px',
  },

  // ===== Badge Size =====
  badgeSize: {
    default: '20px',
    small: '16px',
    dot: '6px',
  },

  // ===== Layout =====
  layout: {
    headerHeight: '80px',
    sidebarWidth: '280px',
    contentMaxWidth: '1200px',
    containerMaxWidth: '1600px',
    dividerWidth: '1px',
    dividerHeight: '24px',
    iconButtonSize: '48px',
    focusOutlineOffset: '2px',
  },

  // ===== Shadows =====
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    dropdown: 'rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
  },

  // ===== Transitions =====
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      ripple: 600,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  // ===== Z-Index =====
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

/**
 * App Theme - Dark Mode
 * Dark mode with blue accents
 */
export const idearadarThemeDark: ThemeConfig = {
  ...idearadarThemeLight,
  mode: 'dark',

  // ===== Semantic Tokens (Layer 2) - Dark Mode =====
  semantic: {
    // Surface - 배경/영역 (어두운 배경)
    surface: {
      base: '#121212',      // grey-950: 페이지 최하단 배경
      default: '#181818',   // grey-50 (dark): 기본 콘텐츠 영역
      paper: '#212121',     // grey-100 (dark): 카드, 패널, 사이드바
      elevated: '#282828',  // 모달, 드롭다운, 팝오버
      sunken: '#121212',    // grey-950: 인풋 필드 배경, 코드블록
      overlay: 'rgba(0, 0, 0, 0.7)',  // 모달 뒤 딤 처리
      overlayLight: 'rgba(0, 0, 0, 0.5)',  // 컨텐츠 로딩 오버레이
      inverse: '#F5F5F5',   // grey-100: 반전 배경
      inverseHover: 'rgba(255, 255, 255, 0.1)',  // 어두운 배경 위 호버 효과
    },

    // On-Surface - 배경 위 콘텐츠 (밝은 텍스트)
    onSurface: {
      default: '#FFFFFF',   // 기본 텍스트
      muted: '#B3B3B3',     // 보조/설명 텍스트
      subtle: '#757575',    // 힌트, 플레이스홀더
      disabled: '#535353',  // 비활성화 텍스트
      inverse: '#212121',   // 반전 배경 위 텍스트
    },

    // Border - 테두리/구분선 (어두운 배경용)
    border: {
      default: '#404040',   // 기본 테두리
      muted: '#2C2C2C',     // 약한 테두리/구분선
      strong: '#535353',    // 강조 테두리
      focus: '#FB923C',     // orange-400: 포커스 링 (더 밝게)
      error: '#FB7185',     // error-400: 에러 상태 (더 밝게)
      inverse: '#E0E0E0',   // 반전 배경 위 테두리
    },

    // Interactive - 상호작용 요소
    interactive: {
      default: '#FB923C',   // orange-400: 클릭 가능한 요소 기본 (더 밝게)
      hover: '#282828',     // 호버 상태 배경
      active: '#404040',    // 클릭/활성 상태
      selected: 'rgba(251, 146, 60, 0.20)',  // orange-400/20: 선택된 상태 배경
      disabled: '#282828',  // 비활성화 배경
    },

    // Accent - 브랜드/강조
    accent: {
      primary: '#FB923C',   // orange-400: 주요 액션, CTA (더 밝게)
      primaryHover: '#FDBA74',  // orange-300: 주요 액션 호버
      primarySubtle: 'rgba(249, 115, 22, 0.20)', // orange-500/20: 배지, 태그 배경
      onPrimary: '#000000', // 액센트 위 텍스트 (어두운 텍스트)
    },

    // Status - 상태 표시 (더 밝은 색상)
    status: {
      success: '#34D399',         // success-400
      successSubtle: 'rgba(16, 185, 129, 0.20)',  // success-500/20
      warning: '#FBBF24',         // warning-400
      warningSubtle: 'rgba(245, 158, 11, 0.20)', // warning-500/20
      error: '#FB7185',           // error-400
      errorSubtle: 'rgba(244, 63, 94, 0.20)',    // error-500/20
      info: '#FB923C',            // orange-400
      infoSubtle: 'rgba(249, 115, 22, 0.20)',    // orange-500/20
    },

    // Misc - 기타
    misc: {
      scrollbarTrack: '#181818',  // 스크롤바 트랙
      scrollbarThumb: '#404040',  // 스크롤바 핸들
      scrollbarThumbHover: '#535353',  // 스크롤바 핸들 호버
      skeletonBase: '#2C2C2C',    // 스켈레톤 배경
      skeletonHighlight: '#404040',  // 스켈레톤 하이라이트
    },
  },

  palette: {
    ...idearadarThemeLight.palette,

    // Grey - STATIC (Layer 1: 테마와 무관하게 동일한 값 유지)
    // 컴포넌트는 semantic 토큰 사용 권장: --surface-*, --on-surface-*, --border-*
    // grey: appThemeLight.palette.grey, // inherited - same value

    // Background - Dark mode semantic aliases (deprecated: use --surface-* instead)
    background: {
      default: '#121212',  // → use --surface-base
      paper: '#181818',    // → use --surface-paper
      elevated: '#212121', // → use --surface-elevated
      overlay: 'rgba(0, 0, 0, 0.7)',  // → use --surface-overlay
      overlayLight: 'rgba(255, 255, 255, 0.1)',
    },

    // Text - Dark mode semantic aliases (deprecated: use --on-surface-* instead)
    text: {
      primary: '#FFFFFF',   // → use --on-surface-default
      secondary: '#B3B3B3', // → use --on-surface-muted
      disabled: '#616161',  // → use --on-surface-disabled
      hint: '#757575',      // → use --on-surface-subtle
    },

    // Divider (deprecated: use --border-* instead)
    divider: '#404040',  // 수정: #2C2C2C → #404040 (더 좋은 대비)

    // Action states - Orange accent for dark mode
    action: {
      active: '#FB923C',
      hover: 'rgba(251, 146, 60, 0.12)',
      selected: 'rgba(251, 146, 60, 0.20)',
      disabled: '#616161',
      disabledBackground: '#2C2C2C',
      focus: 'rgba(251, 146, 60, 0.28)',
    },
  },
};
