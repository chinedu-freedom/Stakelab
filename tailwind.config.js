/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.375rem',
        md: '0.375rem',
        lg: '0.375rem',
        xl: '0.375rem',
        '2xl': '0.375rem',
        '3xl': '0.375rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        righteous: ['var(--font-righteous)', 'Righteous', 'cursive'],
      },
      colors: {
        darkBg: '#090D16',
        cardBg: '#111827',
        cardBorder: '#1F293D',
        brandRed: '#ff0044',
        brandOrange: '#fe780b',
        stakelabDark: '#0b0f19',
        stakelabCard: '#13192b',
        stakelabCardBorder: '#1c243f',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #ff0044 0%, #fe780b 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(28, 36, 63, 0.6) 0%, rgba(19, 25, 43, 0.8) 100%)',
      },
    },
  },
  plugins: [],
};
