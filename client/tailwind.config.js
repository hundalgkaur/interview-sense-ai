/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-base': '#0B0B1A',
        'dark-card': '#111827',
        'dark-accent': 'rgba(255, 255, 255, 0.05)',
        'neon-purple': '#8B5CF6',
        'neon-pink': '#EC4899',
        'neon-cyan': '#22D3EE',
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'blur(10px)' },
          '50%': { opacity: 0.6, filter: 'blur(20px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}
