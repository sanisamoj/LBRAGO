import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: "#4169E1",
        ciano: "#00ACC1",
        "ciano-suave": "#E0F7FA",
      },
    },
  },
  plugins: [],
}

export default config
