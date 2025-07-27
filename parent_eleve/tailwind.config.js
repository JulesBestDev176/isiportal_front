import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./public/index.html"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3c5fa0",
          50: "#f0f5ff",
          100: "#e1ebff",
          200: "#c9d9fa",
          300: "#a6c1f0",
          400: "#7fa3e0",
          500: "#5178c0",
          600: "#3c5fa0",
          700: "#294681",
          800: "#1a2d61",
          900: "#0f1d45",
          950: "#060f2a"
        },
        neutral: {
          50: "#f7f7f7",
          100: "#eeeeee",
          200: "#e0e0e0",
          300: "#cacaca",
          400: "#b1b1b1",
          500: "#999999",
          600: "#7f7f7f",
          700: "#676767",
          800: "#545454",
          900: "#464646",
          950: "#282828"
        },
        navy: {
          DEFAULT: "#071335",
          50: "#e6eaf4",
          100: "#c3cde5",
          200: "#9baed6",
          300: "#7a91c8",
          400: "#5d74b9",
          500: "#3f57aa",
          600: "#304593",
          700: "#21337c",
          800: "#192464",
          900: "#10184d",
          950: "#071335"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [animate]
};

export default config; 