/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. BRAND COLORS
        primary: {
          900: '#680a0d', // dark red / brand identity
          800: '#9e1317', // dark brand
          700: '#c81e22', // dark red
          600: '#eb282d', // primary interactive / action
          500: '#f04a4e', // highlight
          100: '#fee2e2', // light red background
          50: '#fef2f2',  // very light red background
          DEFAULT: '#eb282d',
        },
        gold: {
          600: '#B89B4A', // premium accent
          500: '#D3B973', // signature accent
          100: '#F5EED5', // light accent background
          DEFAULT: '#D3B973',
        },
        brand: {
          red: '#680a0d',
          'red-vibrant': '#eb282d',
          purple: '#680a0d',
          'purple-vibrant': '#eb282d',
          gold: '#D3B973',
        },
        'brand-red': '#680a0d',
        'brand-red-vibrant': '#eb282d',
        'brand-purple': '#680a0d',
        'brand-purple-vibrant': '#eb282d',
        'brand-gold': '#D3B973',

        // 2. SEMANTIC COLORS
        success: {
          700: '#15803D',
          600: '#16A34A',
          500: '#22C55E',
          200: '#BBF7D0',
          100: '#DCFCE7',
          50: '#F0FDF4',
          DEFAULT: '#16A34A',
        },
        warning: {
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          200: '#FDE68A',
          100: '#FEF3C7',
          50: '#FFFBEB',
          DEFAULT: '#F59E0B',
        },
        error: {
          700: '#B91C1C',
          600: '#DC2626',
          500: '#EF4444',
          200: '#FECACA',
          100: '#FEE2E2',
          50: '#FEF2F2',
          DEFAULT: '#DC2626',
        },
        info: {
          700: '#0369A1',
          600: '#0284C7',
          500: '#0EA5E9',
          200: '#BAE6FD',
          100: '#E0F2FE',
          50: '#F0F9FF',
          DEFAULT: '#0284C7',
        },

        // 3. NEUTRAL / GRAY
        gray: {
          950: '#111827',
          900: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },

        // Legacy / TailAdmin Support
        boxdark: '#24303F',
        'boxdark-2': '#1A222F',
        dark: '#1C2434',
        body: '#F1F5F9',
        bodydark: '#AEB7C0',
        bodydark1: '#DEE4EE',
        bodydark2: '#8A99AD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Typography scale from design system
        display: ['48px', { lineHeight: '56px', fontWeight: '700' }],
        h1: ['36px', { lineHeight: '44px', fontWeight: '700' }],
        h2: ['30px', { lineHeight: '38px', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '32px', fontWeight: '600' }],
        h4: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        // Exact radii specifications
        xs: '4px',
        sm: '6px',
        md: '8px',   // Default: Button, Input
        lg: '12px',  // Default: Card
        xl: '16px',  // Default: Modal / Slide-over
        '2xl': '24px',
        full: '9999px', // Default: Badge, Switch
        // Explicit numeric aliases
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
      },
      spacing: {
        // 4px Grid Spacing System
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      height: {
        'form-sm': '32px',
        'form-md': '40px', // Default form height: 40px
        'form-lg': '48px',
      }
    },
  },
  plugins: [],
}
