/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f3",
          100: "#fce7e9",
          200: "#f8d0d5",
          300: "#f4adb5",
          400: "#ee7d8a",
          500: "#e54d5e",
          600: "#cb4154", // Our main brand color
          700: "#b02e42",
          800: "#932939",
          900: "#7a2834",
        },
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [],
};
