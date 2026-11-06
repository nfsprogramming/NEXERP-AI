/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1120',
        navyLight: '#131D31',
        teal: '#4F46E5', // Modern Indigo primary accent
        tealHover: '#4338CA',
        cyanAccent: '#06B6D4',
        surface: '#F8FAFC',
        ink: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        chart2: '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.03)',
        cardHover: '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
