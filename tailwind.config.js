/** @type {import('tailwindcss').Config} */
// const { nextui } = require("@nextui-org/react");
import { nextui } from "@nextui-org/react";
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      backgroundColor: {
        "book-dark": "2B2B2B",
      },
      colors: {
        "book-dark": "#f8f8ea",
      },
    },
  },
  plugins: [nextui()],
};
