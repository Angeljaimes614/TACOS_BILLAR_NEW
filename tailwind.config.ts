import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Brand swatches (uso decorativo, gradientes, acentos)
        brass: {
          50: "#faf3e3",
          100: "#f3e3bd",
          200: "#e8cc88",
          300: "#dab35a",
          400: "#c99e3f",
          500: "#b8915a",
          600: "#94703f",
          700: "#71542d",
          800: "#4d391d",
          900: "#291e0f",
        },
        felt: {
          50: "#e9f3ee",
          100: "#c6dfd1",
          200: "#92c2a8",
          300: "#5fa481",
          400: "#3a8866",
          500: "#1f6b4f",
          600: "#185640",
          700: "#124132",
          800: "#0c2c22",
          900: "#061812",
        },
        walnut: {
          50: "#f7f0e8",
          100: "#e8d6bf",
          200: "#cfa987",
          300: "#a87a4e",
          400: "#7e5634",
          500: "#5c3d24",
          600: "#48301c",
          700: "#352314",
          800: "#22170d",
          900: "#0e0a06",
        },
        ivory: {
          50: "#fdf9ef",
          100: "#f8efd8",
          200: "#f4ebd9",
          300: "#ecdcb8",
          400: "#dcc48b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 6vw, 5.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.025em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4vw, 3.75rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3vw, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brass":
          "linear-gradient(135deg, #d4ad6f 0%, #b8915a 45%, #8a6a3e 100%)",
        "gradient-felt":
          "linear-gradient(135deg, #1f6b4f 0%, #124132 100%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        "felt-cloth":
          "radial-gradient(ellipse at top, hsl(var(--secondary) / 0.18), transparent 60%), radial-gradient(ellipse at bottom right, hsl(var(--primary) / 0.12), transparent 55%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "marquee-x": "marquee-x 30s linear infinite",
      },
      boxShadow: {
        soft: "0 2px 16px -6px rgba(20, 14, 8, 0.08), 0 1px 4px -2px rgba(20, 14, 8, 0.06)",
        "soft-lg":
          "0 12px 32px -12px rgba(20, 14, 8, 0.18), 0 4px 12px -4px rgba(20, 14, 8, 0.08)",
        warm: "0 14px 40px -12px rgba(184, 145, 90, 0.45)",
        "warm-lg": "0 28px 80px -20px rgba(184, 145, 90, 0.55)",
        "inner-glow": "inset 0 1px 0 0 rgba(244, 235, 217, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
