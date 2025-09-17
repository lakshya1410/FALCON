/** @type {import('tailwindcss').Config} */
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
      }
    },
  },
  plugins: [],
};
