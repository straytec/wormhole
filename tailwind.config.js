import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          900: '#0B0B1A',
          800: '#131329',
          700: '#1A1A3A',
          600: '#252551',
          500: '#3D3D7A',
          400: '#5151A3',
          300: '#7272CC',
          200: '#9999E6',
          100: '#CCCCF5',
        },
        stellar: {
          900: '#1A0B2E',
          800: '#2D1B3D',
          700: '#4A2C5A',
          600: '#663D77',
          500: '#8B5DA8',
          400: '#B07EC8',
          300: '#CFA5E8',
          200: '#E6CCFA',
          100: '#F5F0FF',
        },
        nebula: {
          900: '#0D1B2A',
          800: '#1B263B',
          700: '#2E3A4B',
          600: '#415A77',
          500: '#5A7BA3',
          400: '#739ACC',
          300: '#8BB9E6',
          200: '#B8D4F0',
          100: '#E8F3FF',
        },
        void: {
          950: '#000000',
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2A2A2A',
          600: '#3A3A3A',
          500: '#4A4A4A',
        },
      },
      fontFamily: {
        cosmic: ['Inter', 'system-ui', 'sans-serif'],
        stellar: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
  ],
};