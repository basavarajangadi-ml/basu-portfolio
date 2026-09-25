import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f9fafb",
        card: {
          DEFAULT: "rgba(17, 24, 39, 0.7)",
          hover: "rgba(30, 41, 59, 0.8)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        accent: {
          cyan: "#06b6d4",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          violet: "#a855f7",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.08), transparent 70%)",
        "mesh-pattern": "radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(6, 182, 212, 0.3)",
        "glow-purple": "0 0 30px -5px rgba(139, 92, 246, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
