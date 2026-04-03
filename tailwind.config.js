/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy theme
        background: {
          DEFAULT: '#071124',
          secondary: '#0a1929',
          tertiary: '#0d2137',
        },
        // Glass card colors
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          hover: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        // Accent colors
        accent: {
          purple: '#5D3FD3',
          pink: '#FF4D8A',
          teal: '#00C2A8',
          blue: '#3B82F6',
        },
        // Text colors
        text: {
          primary: '#E6EEF8',
          secondary: '#A8B3C6',
          muted: '#6B7A90',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5D3FD3 0%, #FF4D8A 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #00C2A8 0%, #3B82F6 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(93, 63, 211, 0.3)',
        'glow-teal': '0 0 20px rgba(0, 194, 168, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
