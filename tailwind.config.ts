import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        'dvh': '100dvh',
      },
      minHeight: {
        'dvh': '100dvh',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(16, 185, 129, 0.4)'
          },
          '50%': { 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(16, 185, 129, 0)'
          }
        },
        'pulse-blue': {
          '0%, 100%': { 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(59, 130, 246, 0.4)'
          },
          '50%': { 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 15px rgba(59, 130, 246, 0)'
          }
        }
      },
      animation: {
        'pulse-green': 'pulse-green 2s infinite',
        'pulse-blue': 'pulse-blue 1s infinite'
      },
      clipPath: {
        'mountain': 'polygon(50% 0%, 0% 100%, 100% 100%)',
        'puzzle-left': 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%, 50% 0)',
        'puzzle-right': 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.clip-path-puzzle-left': {
          'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%, 50% 0)',
        },
        '.clip-path-puzzle-right': {
          'clip-path': 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)',
        },
      });
    },
  ],
}
export default config 