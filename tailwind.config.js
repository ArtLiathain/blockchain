/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#0C0032",
        "light-purple": "#190061",
        "dark-blue": "#240090",
        "light-blue": "#3500D3",
        sgray: "#282828",
      },
    },
  },
  plugins: [],
};
