import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13201a",
        moss: "#345b45",
        mint: "#d8f2de",
        lemon: "#f7e27a",
        clay: "#c8754d",
        paper: "#fbfaf5"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(19, 32, 26, 0.10)",
        card: "0 4px 20px rgba(19, 32, 26, 0.04)"
      }
    }
  },
  plugins: []
};

export default config;
