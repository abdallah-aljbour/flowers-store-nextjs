/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors — removed in the cleanup phase
        "pandora-pink": "#F593A2",
        "pandora-white": "#FFFFFF",
        "pandora-black": "#000000",

        // Pearl Champagne (contrast notes in design-handoff/tokens)
        pearl: "#FFFDF9", // page background
        champagne: {
          DEFAULT: "#F8F1E7", // soft surfaces: search, footer, info cards, chips
          deep: "#F6EDE0", // package section band
          photo: "#F1E8DA", // image placeholder
        },
        line: {
          DEFAULT: "#ECE0CE", // borders, dividers
          gold: "#D9C19B", // rings, tag outline, dashed "add more"
          link: "#CDBB9F", // text-link underline
        },
        ink: {
          DEFAULT: "#4B3F36", // main text, toast background
          muted: "#74665A", // secondary text
        },
        rose: {
          DEFAULT: "#9E4F69", // outline buttons, prices, active states
          disabled: "#C9BBAA",
        },
        whatsapp: "#1F7A4D", // WhatsApp / order actions only
        petal: "#F593A2", // decoration only, never text
      },
      fontFamily: {
        display: ["var(--font-amiri)", "serif"],
        accent: ["var(--font-amiri-accent)", "var(--font-amiri)", "serif"], // hero accent word only
        sans: ["var(--font-plex-arabic)", "system-ui", "sans-serif"],
        latin: ["var(--font-cormorant)", "serif"],
      },
      borderRadius: {
        card: "22px",
        hero: "28px",
        sheet: "28px",
      },
      boxShadow: {
        float: "0 12px 30px rgba(75, 63, 54, 0.12)",
        sheet: "0 -10px 30px rgba(75, 63, 54, 0.06)",
        whatsapp: "0 10px 24px rgba(31, 122, 77, 0.26)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(.22,.8,.25,1)",
        spring: "cubic-bezier(.3,1.4,.5,1)",
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      maxWidth: { container: "1240px" },
    },
  },
  plugins: [],
};
