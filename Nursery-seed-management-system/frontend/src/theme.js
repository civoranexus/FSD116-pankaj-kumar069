// src/theme.js
// ==================================================
// 🌱 PROFESSIONAL DESIGN SYSTEM (Enterprise Ready)
// Purpose: Maintain consistency, scalability & clean UI
// ==================================================

const theme = {
  // ----------------------------------
  // 🎨 COLOR SYSTEM
  // ----------------------------------
  colors: {
    brand: {
      // Primary brand accent (links, highlights, focus states)
      primaryTeal: "#1B9AAA",

      // Main CTA buttons (Add to Cart, Save, Submit)
      tealDark: "#16808D",

      // Core dark color (Navbar, headers, dashboard top bars)
      navyCore: "#142C52",

      // ❌ OLD (too bright for professional UI)
      // primaryGreen: "#4CAF50",
    },

    neutral: {
      // Primary text (headings, body text)
      textDark: "#071426",

      // Secondary / muted text (labels, hints)
      textLight: "#6B7280",

      // App background (pages)
      background: "#F4F7FA",

      // Card, modal, dropdown surfaces
      surface: "#FFFFFF",

      // Borders, dividers, outlines
      border: "#E5E7EB",

      // ❌ OLD (pure white everywhere – flat look)
      // white: "#FFFFFF",
    },

    feedback: {
      // Success states (order placed, saved)
      success: "#22C55E",
      successDark: "#178740",

      // Error / destructive actions
      alert: "#EF4444",
      alertDark: "#EB1414",

      // Warning states
      warning: "#F59E0B",

      // Informational states
      info: "#3B82F6",
    },
  },

  // ----------------------------------
  // 🔤 TYPOGRAPHY
  // ----------------------------------
  fonts: {
    // Headings – modern, professional
    heading: "'Poppins', sans-serif",

    // Body text – highly readable
    body: "'Inter', sans-serif",

    // Code, IDs, system text
    mono: "'Roboto Mono', monospace",
  },

  fontSizes: {
    xs: "12px",
    sm: "14px",
    base: "16px", // default body
    lg: "18px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px", // page headings
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // ----------------------------------
  // 📐 SPACING SYSTEM
  // (Use instead of random margins/padding)
  // ----------------------------------
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",  // default spacing
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  // ----------------------------------
  // ⭕ BORDER RADIUS
  // ----------------------------------
  borderRadius: {
    sm: "4px",
    md: "8px",   // cards, inputs
    lg: "12px",  // modals
    full: "9999px", // pills, avatars
  },

  // ----------------------------------
  // 🌫️ SHADOWS (Very subtle = premium)
  // ----------------------------------
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 10px rgba(0,0,0,0.08)",
    lg: "0 10px 20px rgba(0,0,0,0.12)",

    // ❌ OLD (too harsh, amateur look)
    // heavy: "0 20px 40px rgba(0,0,0,0.3)",
  },

  // ----------------------------------
  // ⏱️ TRANSITIONS
  // ----------------------------------
  transitions: {
    fast: "all 0.15s ease-in-out",
    normal: "all 0.25s ease",
    slow: "all 0.4s ease",
  },

  // ----------------------------------
  // 📱 RESPONSIVE BREAKPOINTS
  // ----------------------------------
  breakpoints: {
    sm: "640px",   // mobile
    md: "768px",   // tablet
    lg: "1024px",  // laptop
    xl: "1280px",  // desktop
    xxl: "1536px", // large screens
  },

  // ----------------------------------
  // 🧱 Z-INDEX SCALE
  // ----------------------------------
  zIndex: {
    dropdown: 1000,
    sticky: 1020,  // navbar
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // ----------------------------------
  // 📏 STANDARD UI HEIGHTS
  // ----------------------------------
  sizes: {
    inputHeight: "44px",
    buttonHeight: "44px",
    navbarHeight: "64px",
  },
};

export default theme;
