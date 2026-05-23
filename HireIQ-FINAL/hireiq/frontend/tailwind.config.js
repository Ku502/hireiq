/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#09090f',
          surface: '#0f0f1a',
          elevated: '#141420',
          overlay: '#1a1a2e',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.15)',
        },
        text: {
          primary: '#f0f0ff',
          secondary: '#9898b8',
          muted: '#5a5a7a',
        },
        cyan: {
          DEFAULT: '#00e5ff',
          dim: 'rgba(0,229,255,0.10)',
          glow: 'rgba(0,229,255,0.06)',
        },
        brand: {
          green: '#00ff9d',
          amber: '#ffb800',
          red: '#ff4466',
          purple: '#b060ff',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'spin-slow': 'spin 2s linear infinite',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        slideIn: { from: { opacity: 0, transform: 'translateX(20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
      },
      backgroundSize: { 'grid': '48px 48px' },
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(0,229,255,0.12)',
        'glow-green': '0 0 30px rgba(0,255,157,0.15)',
      },
    },
  },
  plugins: [],
}
