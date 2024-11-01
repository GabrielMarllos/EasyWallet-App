/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      darkMode: "class",
      colors: {
        primary: {
          DEFAULT: "#3066be",
          dark: "#1d3b56",
        },
        secondary: {
          DEFAULT: "#00c9a7",
          dark: "#008272",
        },
        tertiary: {
          DEFAULT: "#f5f9ff",
          dark: "#cdd9e1",
        },
        black: "#161d21"
      },
    },
  },
  plugins: [
  ],
}

