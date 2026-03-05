/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY - Light Green (for buttons, CTAs, success states)
        primary: {
          DEFAULT: "#88E788", // Light Green
          light: "#A3F0A3",
          dark: "#114F11", // Dark Green (for headings, high contrast)
        },
        // SECONDARY - Light Yellow (for warnings, subtle accents)
        secondary: {
          DEFAULT: "#FFFFC5", // Light Yellow
          dark: "#FFD700",
        },
        // ACCENT COLORS
        accent: {
          orchid: "#ED80E9", // Orchid/Purple (highlights, tags, hover)
          blue: {
            DEFAULT: "#B5C7EB", // Misty Blue (secondary buttons, borders)
            dark: "#7B9FD3", // Darker Blue (save buttons, better contrast)
          },
          orange: "#FFB84D", // Warm Orange (info buttons, highlights)
        },
        // NEUTRAL - Light Gray (for text, dividers, disabled states)
        neutral: {
          DEFAULT: "#D4D4D4",
          light: "#E8E8E8",
          dark: "#A8A8A8",
        },
        background: "#ffffff",
        foreground: "#171717",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
