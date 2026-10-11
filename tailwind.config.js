/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060a14',
          900: '#0a1020',
          850: '#0d1428',
          800: '#111a33',
          700: '#1a2748',
          600: '#27365e',
          500: '#3a4a73',
          400: '#5b6b96',
          300: '#8595bd',
          200: '#b0bcd8',
          100: '#d5dcec',
          50: '#eef2f9',
        },
        accent: {
          cyan: '#22d3ee',
          electric: '#3b82f6',
          neon: '#10f2a0',
          warn: '#f59e0b',
          danger: '#ef4444',
          flag: '#fb3b53',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
        'flash': 'flash 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(16,242,160,0.4), 0 0 10px rgba(16,242,160,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(16,242,160,0.6), 0 0 30px rgba(16,242,160,0.3)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flash: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
