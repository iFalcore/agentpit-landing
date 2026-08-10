/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // agentpit.dev sets everything in Instrument Sans; `display` is the
        // same face carried at heavy weights and tight tracking.
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Theme-aware semantic tokens (see :root / .dark in index.css)
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        brand: {
          // Resolves to brand-600 on light backgrounds, brand-400 on dark.
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          400: '#60A5FA', // accent on dark backgrounds
          600: '#2563EB', // accent on light backgrounds
        },
        // The hero sits on video and stays dark in both themes; this is the
        // dark-theme background, so the hero blends into the page below it.
        night: '#020817',
      },
    },
  },
  plugins: [],
}
