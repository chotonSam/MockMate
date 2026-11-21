/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core canvas (Smart Light Theme) ───────────────────────────
        ink: {
          DEFAULT: "#EEF2F6",   // Sophisticated cool-slate smart light canvas (never harsh blinding white)
          soft: "#FFFFFF",      // Elevated pure white card surfaces
          line: "#E2E6ED",      // Subtle, refined hairline borders & dividers
          muted: "#E5E9F1",     // Soft neutral surface for tracks, chips & code blocks
        },
        paper: "#111827",       // High-contrast Gray-900 primary text (sharp & ultra-readable)
        // ── MockMate brand purple/indigo ──────────────────────────────
        brand: {
          DEFAULT: "#6366F1",   // Vibrant modern SaaS indigo
          dim: "#4F46E5",       // Hover / active state
          glow: "#818CF8",      // Accent glow
          subtle: "#EEF2FF",    // Soft indigo-50 tint for badges/active
        },
        // ── Keep "indigo" alias for backward compat ───────────────────
        indigo: {
          DEFAULT: "#6366F1",
          dim: "#4F46E5",
        },
        // ── Semantic signals ──────────────────────────────────────────
        signal: {
          green: "#059669",     // Rich Emerald-600 for clear readability on light backgrounds
          amber: "#D97706",     // Rich Amber-600 for sharp text contrast on light
          red:   "#DC2626",     // Rich Red-600
        },
        slate: {
          muted: "#4B5563",     // Gray-600 secondary text (strict WCAG AA contrast on light backgrounds)
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body:    ["var(--font-body)",    "sans-serif"],
        mono:    ["var(--font-mono)",    "monospace"],
      },
      boxShadow: {
        "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 4px 16px -2px rgba(17, 24, 39, 0.05)",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 24px -3px rgba(17, 24, 39, 0.08)",
        "brand-glow": "0 0 30px 0 rgba(99, 102, 241, 0.2)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
        "hero-mesh":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.07) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
