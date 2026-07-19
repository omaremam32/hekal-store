import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2734",
        bone: "#F1EEE3",
        chambray: "#7C96A8",
        brass: "#A8762E",
        thread: "#9B3A2E",
        charcoal: "#22282D",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-tag)"],
        arabic: ["var(--font-arabic)"],
      },
      backgroundImage: {
        "stitch-line":
          "repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px)",
      },
    },
  },
  plugins: [],
};
export default config;
