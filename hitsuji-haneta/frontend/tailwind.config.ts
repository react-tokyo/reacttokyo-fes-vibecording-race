import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "x-bg": "#000000",
        "x-card": "#16181c",
        "x-border": "#2f3336",
        "x-text": "#e7e9ea",
        "x-secondary": "#71767b",
        "x-blue": "#1d9bf0",
        "x-blue-hover": "#1a8cd8",
      },
    },
  },
  plugins: [],
} satisfies Config;
