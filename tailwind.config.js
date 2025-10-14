/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        header: '#202020',
        primaryGradientFrom: '#1481F1',
        primaryGradientTo: '#014FE9',
        light: '#C5D3E0',
        error: '#FF5252',
        success: '#30AF5B',
        grey: {
          1: '#3B3B3B',
          2: '#AEAEAE',
          3: '#E6E6E6',
          4: '#F5F5F5',
        },
        blueDark: '#1481F1',
        scroll: '#c5d3e0',
        textSiderPrimary: '#9fcbf9',
        textSiderSecondary: '#ffffff',
        coverBg: '#dcddde',
        coverText: '#595959',
        notification: {
          success: '#EFFFF4',
          primary: '#D7EBFF',
          warning: '#FFF4E7',
          error: '#FFE2E2',
        },
        siderBg: '#ecf1ff',
        revisionCardBg: '#ffc8c9',
      },
      boxShadow: {
        sider: 'inset 4px 0 10px rgba(0, 0, 0, 0.8)',
        button: '0 0 6px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};
