/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'cyber-purple': '#b026ff',
        'dark-cyber': '#0a0a1f',
        'glass': 'rgba(255, 255, 255, 0.1)',
        'cyber-green': '#00ff9f',
        'cyber-yellow': '#ffee00',
        'cyber-red': '#ff0055',
        'cyber-black': '#0a0a1f',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanner': 'scanner 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 1s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 10px #00f3ff' },
          '100%': { 'box-shadow': '0 0 20px #00f3ff, 0 0 40px #00f3ff' }
        },
        scanner: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        matrix: {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '0% 100%' }
        }
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      }
    },
  },
  plugins: [],
};
