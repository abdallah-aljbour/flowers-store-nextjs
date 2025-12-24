/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pandora-pink": "#F593A2",
        "pandora-white": "#FFFFFF",
        "pandora-black": "#000000",
      },
    },
  },
  plugins: [],
};
