import React from "react";
import Navbar from "./Navbar";
import "../styles/Layout.css";

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
    <div className="app-layout">
      {/* Top navigation */}
      <Navbar />

      {/* Main content */}
      <main className="layout-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="layout-footer">
        Nursery Seed Management System &copy; {new Date().getFullYear()} | 
        Designed for professional usability
      </footer>
    </div>
  );
}

export default Layout;
