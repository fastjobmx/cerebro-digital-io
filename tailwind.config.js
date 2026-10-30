/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta extraída del logo CEREBRO DIGITAL IO
        ink: {
          DEFAULT: '#05010D',
          2: '#0A0418',
          3: '#120A26',
          4: '#1B1236',
        },
        magenta: '#F03CFF',
        violet: '#8B5CF6',
        indigo: '#5B5BFF',
        electric: '#3B82F6',
        cyan: '#3DD9FF',
        chrome: '#E9E6FF',
              },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        brand: ['Michroma', 'Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(100deg, #F03CFF 0%, #8B5CF6 38%, #3B82F6 72%, #3DD9FF 100%)',
        'gradient-mv': 'linear-gradient(135deg, #F03CFF 0%, #8B5CF6 100%)',
        'gradient-vc': 'linear-gradient(135deg, #8B5CF6 0%, #3DD9FF 100%)',
      },
      boxShadow: {
        'glow-m': '0 0 40px -6px rgba(240,60,255,.55)',
        'glow-v': '0 0 40px -6px rgba(139,92,246,.55)',
        'glow-c': '0 0 40px -6px rgba(61,217,255,.5)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        pulseDot: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(.6)', opacity: '.5' },
        },
        shine: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
        shine: 'shine 6s linear infinite',
      },
    },
  },
  plugins: [],
}
