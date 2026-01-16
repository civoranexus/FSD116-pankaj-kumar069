import React from "react";
import Navbar from "./Navbar";

/*
  Nursery Seed Management System - Layout Component

  Responsibilities:
  - Wraps all pages with a consistent Navbar and Footer.
  - Provides responsive container for main content.
  - Ensures spacing, typography, and background are uniform.
  - Supports modular page injection via "children" prop.
  - Designed with professional UI/UX principles for clarity and hierarchy.
*/

function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f5f6fa",
      }}
    >
      {/* Top navigation */}
      <Navbar />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "15px 20px",
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        Nursery Seed Management System &copy; {new Date().getFullYear()} | 
        Designed for professional usability
      </footer>
    </div>
  );
}

export default Layout;
