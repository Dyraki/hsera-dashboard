/**
 * Framework V1 - Official Design System Tokens
 * Style: Modern SaaS, Profesional, Sederhana, Clean, Business-Oriented
 */

export const DesignSystem = {
  // A. FOUNDATION

  // 1. BRAND COLOR
  brand: {
    primary: {
      900: '#231043', // dark purple / brand identity
      800: '#231034', // dark brand
      700: '#3B176D', // dark purple
      600: '#6D28D9', // primary interactive / action
      500: '#7C3AED', // highlight
      100: '#EDE9FE', // light purple background
      50: '#F5F3FF',  // very light purple background
      DEFAULT: '#6D28D9',
    },
    accent: {
      gold600: '#B89B4A', // premium accent
      gold500: '#D3B973', // signature accent
      gold100: '#F5EED5', // light accent background
    },
  },

  // 2. SEMANTIC COLOR
  semantic: {
    success: {
      600: '#15803D',
      500: '#16A34A',
      100: '#DCFCE7',
      50: '#F0FDF4',
      DEFAULT: '#16A34A',
    },
    warning: {
      600: '#B45309',
      500: '#F59E0B',
      100: '#FEF3C7',
      50: '#FFFBEB',
      DEFAULT: '#F59E0B',
    },
    error: {
      600: '#B91C1C',
      500: '#DC2626',
      100: '#FEE2E2',
      50: '#FEF2F2',
      DEFAULT: '#DC2626',
    },
    info: {
      600: '#0369A1',
      500: '#0284C7',
      100: '#E0F2FE',
      50: '#F0F9FF',
      DEFAULT: '#0284C7',
    },
  },

  // 3. NEUTRAL / GRAY
  neutral: {
    gray950: '#111827',
    gray900: '#1F2937',
    gray700: '#374151',
    gray600: '#4B5563',
    gray500: '#6B7280',
    gray400: '#9CA3AF',
    gray300: '#D1D5DB',
    gray200: '#E5E7EB',
    gray100: '#F3F4F6',
    gray50: '#F9FAFB',
    white: '#FFFFFF',
  },

  // 4. TYPOGRAPHY (Inter)
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    scale: {
      display: { fontSize: '48px', lineHeight: '56px', fontWeight: 700 },
      h1: { fontSize: '36px', lineHeight: '44px', fontWeight: 700 },
      h2: { fontSize: '30px', lineHeight: '38px', fontWeight: 700 },
      h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
      h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
      bodyLarge: { fontSize: '18px', lineHeight: '28px', fontWeight: 400 },
      body: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
      bodySmall: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
      caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
    },
    form: {
      label: { fontSize: '14px', fontWeight: 500 },
      inputText: { fontSize: '14px', fontWeight: 400 },
      placeholder: '#6B7280',
      helperText: { fontSize: '12px', fontWeight: 400 },
      errorMessage: { fontSize: '12px', fontWeight: 400, color: '#DC2626' },
    },
  },

  // 5. SPACING (4px Grid)
  spacing: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    64: '64px',
    80: '80px',
    96: '96px',
  },

  // 6. BORDER RADIUS
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',   // Default: Button, Input
    lg: '12px',  // Default: Card
    xl: '16px',  // Default: Modal / Slide-over
    '2xl': '24px',
    full: '9999px', // Default: Badge, Switch
  },

  // FORM GENERAL RULES
  form: {
    heights: {
      sm: '32px',
      md: '40px', // Default
      lg: '48px',
    },
    borderDefault: '#D1D5DB', // Gray 300
    borderHover: '#9CA3AF',   // Gray 400
    borderFocus: '#6D28D9',   // Primary 600
    ringFocus: '#EDE9FE',     // Primary 100
    bgDisabled: '#F3F4F6',    // Gray 100
    borderDisabled: '#E5E7EB',// Gray 200
    textDisabled: '#9CA3AF',  // Gray 400
    borderError: '#DC2626',   // Error 500
    borderSuccess: '#16A34A', // Success 500
    bgDefault: '#FFFFFF',
    radius: '8px',
  },
} as const;

export default DesignSystem;
