/** Palette from the approved design canvas: navy, ink, ice and brass. The logo's own gold only appears in the logo image. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14202D',
        navy: { DEFAULT: '#1B2D44', soft: '#27405E' },
        gold: { DEFAULT: '#C39A4B', light: '#D3AB5E', deep: '#8A6420', tint: '#F5EBD4' },
        ice: { DEFAULT: '#F2F5F8', deep: '#E9EEF3' },
        line: '#D3DCE5',
        mute: '#556473',
      },
      fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'], display: ['Sora', 'sans-serif'] },
      boxShadow: {
        card: '0 12px 30px -22px rgba(20,32,45,.5)',
        btn: '0 8px 18px -8px rgba(20,32,45,.55)',
        gold: '0 8px 18px -8px rgba(125,90,12,.7)',
      },
    },
  },
  plugins: [],
}
