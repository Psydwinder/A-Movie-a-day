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
        primary: "#1a365d",
        secondary: "#2d3748",
        accent: "#ed8936",
      },
      animation: {
        "door-open": "door 0.5s ease-in-out",
      },
      keyframes: {
        door: {
          "0%": { transform: "perspective(1000px) rotateY(0deg)" },
          "100%": { transform: "perspective(1000px) rotateY(-105deg)" },
        },
      },
    },
  },
  plugins: [],
}

export default config; 