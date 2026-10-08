/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ultra-violet': '#7B2CFF',
        'electric-purple': '#A855F7',
        'neon-magenta': '#E600FF',
        'electric-cyan': '#00E5FF',
        'deep-space': '#070014',
        'deep-space-2': '#0B0020',
        'deep-space-3': '#110030',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7B2CFF 0%, #E600FF 50%, #00E5FF 100%)',
        'gradient-brain': 'linear-gradient(90deg, #7B2CFF 0%, #E600FF 50%, #00E5FF 100%)',
        'gradient-violet-cyan': 'linear-gradient(135deg, #7B2CFF 0%, #00E5FF 100%)',
        'gradient-magenta-purple': 'linear-gradient(135deg, #E600FF 0%, #7B2CFF 100%)',
        'radial-glow': 'radial-gradient(circle at center, rgba(123,44,255,0.25) 0%, rgba(230,0,255,0.1) 40%, transparent 70%)',
      },
      boxShadow: {
        'glow-violet': '0 0 60px rgba(123,44,255,0.4)',
        'glow-magenta': '0 0 60px rgba(230,0,255,0.4)',
        'glow-cyan': '0 0 60px rgba(0,229,255,0.4)',
        'glow-brand': '0 0 80px rgba(168,85,247,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
