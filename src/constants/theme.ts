export const COLORS = {
  // Ultra-HD Warm Light Palette
  bgDark: '#F5F8F4',          // Crisp warm ambient background
  bgDarkAlt: '#FFFFFF',       // Pure white surfaces
  cardBg: '#FFFFFF',
  cardBgHover: '#F8FAF7',
  cardBorder: '#E1E8DE',      // Crisp HD light border
  cardBorderHighlight: '#10B981', // Interactive focus green
  
  // Ultra High Contrast Text Tiers
  textBright: '#0D211A',      // Deepest slate black for max readability
  textSecondary: '#364B41',   // Strong green-slate for subheaders
  textMuted: '#6B8276',       // Muted label text
  textDark: '#071812',
  textOnDark: '#F0FDF4',      // Pure crisp text on dark glass surfaces

  // Radiant Accent Highlights
  emeraldPrimary: '#10B981',  // Vibrant neon emerald
  emeraldBright: '#047857',   // Rich green for text on light backgrounds
  emeraldGlow: 'rgba(16, 185, 129, 0.12)',
  emeraldDeep: '#064E3B',     // Deepest forest emerald
  deepGreen: '#0B3C2F',       // Forest green header background
  forestHeader: '#F5F8F4',
  accentTeal: '#0D9488',      // Rich teal for data visualization
  accentSky: '#0284C7',       // Sky blue highlight

  // Warning & Alert Coral/Amber
  amberData: '#F59E0B',
  amberDataBright: '#B45309',
  amberGlow: 'rgba(245, 158, 11, 0.14)',
  redAlert: '#E11D48',        // High-contrast alert red
  redGlow: 'rgba(225, 29, 72, 0.12)',

  // Form elements
  badgeBg: '#E6F4EA',
  badgeBorder: '#B9E4C5',
  inputBg: '#EFF4EE',
  inputBorder: '#D2DEC9',
  
  // Floating Glass Navigation Dock
  tabBg: '#FFFFFF',
  tabActive: '#10B981',
  tabInactive: '#6B8276',

  // Ultra-HD Glassmorphism Surface Specs
  surfaceFrost: 'rgba(255, 255, 255, 0.85)',
  surfaceMist: 'rgba(245, 248, 244, 0.96)',
  borderFrost: 'rgba(255, 255, 255, 0.75)',
  overlayDark: 'rgba(4, 20, 15, 0.90)',
};

export const FONTS = {
  familyMono: 'monospace',
  familySans: 'System',
  bold: '700' as const,
  semiBold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
};

export const TYPOGRAPHY = {
  caption: { fontSize: 10, lineHeight: 14 },
  captionBold: { fontSize: 10, lineHeight: 14, fontWeight: '700' as const },
  bodySmall: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' as const },
  subtitle: { fontSize: 16, lineHeight: 22 },
  title: { fontSize: 20, lineHeight: 28 },
  heading: { fontSize: 24, lineHeight: 32 },
  display: { fontSize: 32, lineHeight: 40 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  medium: {
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
  floating: {
    shadowColor: '#072017',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  terminalCard: {
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  glowGreen: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 4,
  },
  glowAmber: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const GLASS = {
  light: {
    bg: 'rgba(255, 255, 255, 0.78)',
    border: 'rgba(255, 255, 255, 0.85)',
  },
  dark: {
    bg: 'rgba(8, 28, 22, 0.92)',
    border: 'rgba(52, 211, 153, 0.25)',
  },
  emerald: {
    bg: 'rgba(11, 74, 56, 0.94)',
    border: 'rgba(167, 243, 208, 0.35)',
  },
  frost: {
    bg: 'rgba(247, 250, 246, 0.88)',
    border: 'rgba(228, 234, 226, 0.8)',
  },
  crystal: {
    bg: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(255, 255, 255, 0.95)',
  },
};

export const LAYOUT = {
  borderRadius: 18,
  borderRadiusSm: 14,
  borderRadiusLg: 24,
  borderRadiusXl: 28,
  borderRadiusPill: 999,
  paddingHorizontal: 16,
  paddingVertical: 12,
};
