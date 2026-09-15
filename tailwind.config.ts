import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: ["var(--font-thai)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        parchment: {
          50: "#fdf8ec",
          100: "#f7ecd0",
          200: "#efd9a6",
          300: "#e3c073",
          400: "#d6a94a",
          500: "#c08f34",
          600: "#a06f28",
          700: "#7d5522",
          800: "#5c3e1e",
          900: "#3d2914",
        },
        seal: "#b3222c",
        ink: "#2b2117",
        wood: "#4c7a3f",
        fire: "#c0392b",
        earth: "#b08843",
        metal: "#9a9a9a",
        water: "#2c6b8f",
      },
      boxShadow: {
        parchment: "inset 0 0 40px rgba(92, 62, 30, 0.35), 0 4px 10px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
