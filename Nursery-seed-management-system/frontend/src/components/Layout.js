import React from "react";
import Navbar from "./Navbar";
import "../styles/Layout.css";

/*
  =====================================================
  🌱 Layout Component (Professional / Production Ready)
  -----------------------------------------------------
  Responsibilities:
  - Global page wrapper
  - Consistent Navbar & Footer
  - Centralized content spacing
  - Sticky footer support
  - Clean UX hierarchy (Header → Main → Footer)

  NOTE:
  - This component is intentionally simple
  - Styling responsibility stays in Layout.css
  =====================================================
*/

function Layout({ children }) {
  return (
    <div className="app-layout">
      {/* ================= HEADER ================= */}
      <header className="layout-header">
        <Navbar />
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="layout-main" role="main">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="layout-footer">
        <div className="footer-inner">
          <span className="footer-title">
            Nursery Seed Management System
          </span>

          <span className="footer-divider">•</span>

          <span className="footer-copy">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* ❌ OLD (too plain / student-like)
        Nursery Seed Management System © {new Date().getFullYear()} |
        Designed for professional usability
        */}
      </footer>
    </div>
  );
}

export default Layout;
