/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TVS Design System Colors
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#3182ce', // Accent Blue
          600: '#1a365d', // Primary Deep Blue
          700: '#153450',
          800: '#0f2438',
          900: '#0a1a25',
        },
        secondary: {
          50: '#f7fafc', // Background Light Gray
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096', // Text Secondary Medium Gray
          600: '#4a5568',
          700: '#2d3748', // Secondary Dark Gray
          800: '#1a202c',
          900: '#171923',
        },
        success: {
          50: '#f0fff4',
          100: '#c6f6d5',
          200: '#9ae6b4',
          300: '#68d391',
          400: '#48bb78',
          500: '#38a169', // Success Green
          600: '#2f855a',
          700: '#276749',
          800: '#22543d',
          900: '#1c4532',
        },
        warning: {
          50: '#fffaf0',
          100: '#feebc8',
          200: '#fbd38d',
          300: '#f6ad55',
          400: '#ed8936',
          500: '#d69e2e', // Warning Orange
          600: '#c05621',
          700: '#9c4221',
          800: '#7b341e',
          900: '#652b19',
        },
        error: {
          50: '#fed7d7',
          100: '#feb2b2',
          200: '#fc8181',
          300: '#f56565',
          400: '#ed64a6',
          500: '#e53e3e', // Error Red
          600: '#c53030',
          700: '#9b2c2c',
          800: '#742a2a',
          900: '#63171b',
        },
        // Text Colors
        text: {
          primary: '#2d3748', // Text Primary Dark Gray
          secondary: '#718096', // Text Secondary Medium Gray
        },
        // Background Colors
        background: {
          primary: '#f7fafc', // Background Light Gray
          secondary: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // TVS Typography Scale
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }], // 32px
        'h3': ['1.5rem', { lineHeight: '1.33', fontWeight: '600' }], // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }], // 20px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px
        'caption': ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }], // 14px
      },
      spacing: {
        // TVS Spacing System
        'xs': '0.25rem', // 4px
        'sm': '0.5rem', // 8px
        'md': '1rem', // 16px
        'lg': '1.5rem', // 24px
        'xl': '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'soft': '0.75rem', // 12px - for cards and panels
        'medium': '1rem', // 16px - for modals
        'large': '1.5rem', // 24px - for hero sections
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-up-delay-200': 'fadeInUp 0.6s ease-out 0.2s both',
        'fade-in-up-delay-400': 'fadeInUp 0.6s ease-out 0.4s both',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        pulseSoft: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};