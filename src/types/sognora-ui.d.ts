/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@sognora/ui/theme/server' {
  export const SognoraThemeScript: React.FC<any>;
  export const sognoraLightTheme: any;
  export const sognoraDarkTheme: any;
}

declare module '@sognora/ui/theme/client' {
  export const SognoraThemeProvider: React.FC<any>;
}

declare module '@sognora/ui/theme' {
  export type ThemeConfig = Record<string, any>;
}
