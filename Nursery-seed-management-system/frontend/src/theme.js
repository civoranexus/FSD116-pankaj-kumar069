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
      background: "#F4F7FA",    // page backgrounds
      surface: "#FFFFFF",       // cards, modals
    },
    feedback: {
      success: "#22C55E",       // success states
      successDark: "#178740",   // success buttons
      alert: "#EF4444",         // error states
      alertDark: "#EB1414",     // destructive actions
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
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};

export default theme;