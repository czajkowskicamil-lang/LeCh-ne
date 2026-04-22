/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary dark — deep navy, matches the logo
        ink: {
          DEFAULT: '#0A1F4F',
          soft: '#132858',
        },
        navy: {
          DEFAULT: '#0A1F4F',
          deep: '#061238',
          darker: '#03091C',
          light: '#1B3470',
        },
        cream: {
          DEFAULT: '#F5F1E8',
          deep: '#EDE6D3',
          soft: '#FAF7EF',
        },
        // Gold — matches the luminous logo gold
        or: {
          DEFAULT: '#D4A82D',
          light: '#E6C259',
          dark: '#A7801F',
          deep: '#6E5414',
        },
        // Forest green kept as secondary accent (sporting/patrimonial feel)
        chene: {
          DEFAULT: '#2D4A33',
          dark: '#1F3A2E',
          deep: '#142419',
          light: '#3E6247',
        },
        stone: {
          DEFAULT: '#7A7566',
          light: '#A8A395',
          dark: '#504B3F',
        },
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        'prose-wide': '68ch',
        'shell': '1440px',
      },
      letterSpacing: {
        'micro': '0.16em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 1.2s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
