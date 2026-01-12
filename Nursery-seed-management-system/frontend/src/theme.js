// src/theme.js
const theme = {
  colors: {
    brand: {
      primaryTeal: "#1B9AAA",   // accents, links
      tealDark: "#16808D",      // primary buttons
      navyCore: "#142C52",      // headers, navigation
    },
    neutral: {
      textDark: "#071426",      // body text
      textLight: "#6B7280",     // secondary text
      background: "#F4F7FA",    // page backgrounds
      surface: "#FFFFFF",       // cards, modals
      border: "#E5E7EB",        // borders, dividers
    },
    feedback: {
      success: "#22C55E",       // success states
      successDark: "#178740",   // success buttons
      alert: "#EF4444",         // error states
      alertDark: "#EB1414",     // destructive actions
      warning: "#F59E0B",       // warning states
      info: "#3B82F6",          // info states
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Roboto Mono', monospace",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px", // pill buttons, avatars
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.15)",
  },
  transitions: {
    fast: "all 0.2s ease-in-out",
    normal: "all 0.3s ease",
    slow: "all 0.5s ease",
  },
  breakpoints: {
    sm: "640px",   // mobile
    md: "768px",   // tablet
    lg: "1024px",  // laptop
    xl: "1280px",  // desktop
    xxl: "1536px", // large screens
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;