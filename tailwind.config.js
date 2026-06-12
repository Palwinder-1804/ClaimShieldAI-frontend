/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      colors: {
        aurora: {
          bg: "#0B0F19",
          surface: "#111827",
          cyan: "#00F0FF",
          purple: "#8A2BE2",
          blue: "#3B82F6",
          slate: "#94A3B8",
          dark: "#080B12",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glassHover: "0 12px 40px 0 rgba(0, 240, 255, 0.15)",
        btn: "0 4px 14px rgba(138, 43, 226, 0.4)",
        glowCyan: "0 0 20px rgba(0, 240, 255, 0.3)",
        glowPurple: "0 0 20px rgba(138, 43, 226, 0.3)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "mesh-shift": "meshShift 15s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        meshShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundImage: {
        'mesh-aurora': 'radial-gradient(at 0% 0%, rgba(138,43,226,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,240,255,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59,130,246,0.15) 0px, transparent 50%)',
        'mesh-aurora-intense': 'radial-gradient(at 0% 0%, rgba(138,43,226,0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,240,255,0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59,130,246,0.25) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
