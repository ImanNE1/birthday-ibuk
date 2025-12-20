import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Kita mendaftarkan variabel font yang akan kita buat di layout
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        cream: '#FDFBF7',
        gold: '#D4AF37', 
      }
    },
  },
  plugins: [],
};
export default config;