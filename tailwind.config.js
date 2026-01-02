import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#e6f9f3",
            100: "#ccf3e7",
            200: "#99e7cf",
            300: "#66dbb7",
            400: "#33cf9f",
            500: "#16C79A",
            600: "#129f7b",
            700: "#0d775c",
            800: "#094f3e",
            900: "#04281f",
            DEFAULT: "#16C79A",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
}
