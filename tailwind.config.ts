import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1fb6ff',
          DEFAULT: '#1fb6ff',
          dark: '#0e9de8',
        },
        secondary: {
          light: '#7e5bef',
          DEFAULT: '#7e5bef',
          dark: '#6544d4',
        },
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        surface: {
          light: '#f5f5f5',
          dark: '#2a2a2a',
        },
        text: {
          light: '#1a1a1a',
          dark: '#ffffff',
        },
        accent: {
          light: '#ff49db',
          DEFAULT: '#ff49db',
          dark: '#e622c3',
        },
        success: {
          light: '#13ce66',
          DEFAULT: '#13ce66',
          dark: '#0fb857',
        },
        warning: {
          light: '#ffc82c',
          DEFAULT: '#ffc82c',
          dark: '#e6b425',
        },
        error: {
          light: '#ff4949',
          DEFAULT: '#ff4949',
          dark: '#e63333',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)');
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('inverted-colors', '@media (inverted-colors: inverted)');
    }),
  ],
};
export default config;
