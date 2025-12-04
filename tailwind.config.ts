import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        agentsea: {
          "primary": "#0284c7",          // Ocean Blue
          "primary-content": "#ffffff",
          "secondary": "#06b6d4",         // Turquoise
          "secondary-content": "#ffffff",
          "accent": "#2dd4bf",            // Seafoam
          "accent-content": "#0c4a6e",
          "neutral": "#1e3a5f",           // Deep Navy
          "neutral-content": "#e0f2fe",
          "base-100": "#ffffff",          // White
          "base-200": "#f0f9ff",          // Light Sky
          "base-300": "#e0f2fe",          // Lighter Sky
          "base-content": "#0c4a6e",      // Deep Ocean Text
          "info": "#38bdf8",              // Light Blue
          "info-content": "#0c4a6e",
          "success": "#2dd4bf",           // Seafoam
          "success-content": "#0c4a6e",
          "warning": "#fbbf24",           // Beach Sand
          "warning-content": "#78350f",
          "error": "#f97316",             // Coral
          "error-content": "#ffffff",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
} satisfies Config;
