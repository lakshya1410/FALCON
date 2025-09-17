/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'heading': ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        'display': ['Outfit', 'Clash Display', 'sans-serif'],
        'accent': ['Clash Display', 'Outfit', 'sans-serif'],
      },
      colors: {
        'neon': {
          'cyan': '#00f5ff',
          'pink': '#ff0080',
          'purple': '#8b5cf6',
          'green': '#00ff88',
          'orange': '#ff6b35',
        },
        'cyber': {
          'dark': '#0a0a0f',
          'card': 'rgba(15, 15, 25, 0.8)',
          'glass': 'rgba(255, 255, 255, 0.05)',
        }
      },
      letterSpacing: {
        'tightest': '-0.075em',
        'extra-tight': '-0.05em',
      },
      lineHeight: {
        'extra-tight': '1.1',
        'super-tight': '1.05',
=======
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
        }
>>>>>>> 0e16b53b80a55a3038838e89d787e0e64dc51c59
      }
    },
  },
  plugins: [],
<<<<<<< HEAD
};
=======
}
>>>>>>> 0e16b53b80a55a3038838e89d787e0e64dc51c59
