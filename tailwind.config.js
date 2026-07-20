module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0b2340',
          700: '#12355b',
          500: '#1E90FF'
        },
        celeste: '#cfeefd',
        gold: '#d4b36a'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}
