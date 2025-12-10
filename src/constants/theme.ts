/**
 * Modern Black & White Theme
 * Futuristic 2027 design system
 */

export const theme = {
  colors: {
    // Primary palette - monochrome
    background: '#0A0A0A',
    surface: '#141414',
    surfaceElevated: '#1A1A1A',
    surfaceHighlight: '#242424',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textMuted: '#666666',
    
    // Accent colors
    accent: '#FFFFFF',
    accentMuted: '#808080',
    
    // Status colors (subtle)
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    critical: '#EF4444',
    
    // Borders
    border: '#2A2A2A',
    borderLight: '#333333',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(255, 255, 255, 0.05)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.2,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
  },
  
  shadows: {
    sm: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0px 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0px 0px 20px rgba(255, 255, 255, 0.1)',
  },
  
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export type Theme = typeof theme;
