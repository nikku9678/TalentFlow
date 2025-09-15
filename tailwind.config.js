/** @type {import('tailwindcss').Config} */
export default {
   darkMode: "class", // enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scan all files in src
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // default body font
        heading: ["Poppins", "sans-serif"], // custom heading font
        mono: ["Fira Code", "monospace"], // monospace option
      },
    },
  },
  plugins: [],
}
