import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: 'rgb(9, 9, 11)',
        secondary: 'rgb(113, 113, 122)',
        tertiary: 'rgb(255, 255, 255)',
        error: 'rgb(211, 47, 47)',
        warning: 'rgb(245, 124, 0)',
        info: 'rgb(2, 136, 209)',
        success: 'rgb(56, 142, 60)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
