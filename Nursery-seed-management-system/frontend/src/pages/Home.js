import React from "react";
import { Link, useNavigate } from "react-router-dom";

/* ❌ OLD IMPORT (jab Home.css same folder me tha) */
/*
import "./Home.css";
*/

/* ✅ NEW IMPORT (Home.css ab styles folder me hai) */
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  /* =====================================================
     FEATURES DATA (Professional pattern)
     👉 Industry me hardcoded JSX nahi likhte
     👉 Data se UI generate hota hai
  ===================================================== */
  const features = [
    {
      title: "Inventory Management",
      icon: "📦",
      description:
        "Track seeds, saplings, plants, and stock levels in real-time to avoid shortages and wastage.",
      route: "/inventory",
    },
    {
      title: "Supplier & Procurement",
      icon: "🤝",
      description:
        "Manage suppliers, procurement cycles, and purchase records in one centralized system.",
      route: "/suppliers",
    },
    {
      title: "Order Management",
      icon: "🛒",
      description:
        "Place, monitor, and manage customer orders with complete lifecycle tracking.",
      route: "/orders",
    },
    {
      title: "Sales & Analytics",
      icon: "📊",
      description:
        "Analyze sales trends, monthly performance, and revenue insights.",
      route: "/admin/sales-report",
    },
    {
      title: "Plant Health Monitoring",
      icon: "🌿",
      description:
        "Record plant health data, treatments, and maintenance history.",
      route: "/admin/health",
    },
  ];

  return (
    <div className="home">

      {/* =====================================================
          HERO SECTION (FIRST IMPRESSION)
      ===================================================== */}
      <section className="hero">

        {/* LEFT CONTENT */}
        <div className="hero-content">
          <span className="hero-badge">
            🌱 Smart Agriculture Platform
          </span>

          <h1 className="hero-title">
            Smart Nursery & Seed <br />
            <span>Management System</span>
          </h1>

          <p className="hero-subtitle">
            An end-to-end digital solution to manage nursery operations,
            inventory, suppliers, orders, sales analytics, and plant health
            with efficiency and transparency.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>

            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hero-visual">
          <div className="placeholder-box">

            {/* ❌ OLD WRONG CODE (for learning) */}
            {/*
            <video src="frontend/public/videos" />
            */}

            {/* ✅ CORRECT PROFESSIONAL USAGE */}
            <video
              src="/videos/nursery.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST SECTION (WHY THIS SYSTEM)
      ===================================================== */}
      <section className="trust-section">
        <div className="trust-grid">
          <div>
            <h3>✔ Centralized System</h3>
            <p>All nursery operations managed from one platform.</p>
          </div>
          <div>
            <h3>✔ Role Based Access</h3>
            <p>Admin, Staff & Customer – secure and controlled.</p>
          </div>
          <div>
            <h3>✔ Real-Time Data</h3>
            <p>Live inventory, orders, and sales insights.</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION (CLICKABLE)
      ===================================================== */}
      <section className="features">

        <header className="features-header">
          <h2 className="section-title">Core Features</h2>
          <p className="section-subtitle">
            Built to support real nursery operations — not just a demo project.
          </p>
        </header>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card feature-card"
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <span className="feature-link">
                Explore →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FINAL CALL TO ACTION
      ===================================================== */}
      <section className="cta-section">
        <h2>Ready to digitize your nursery?</h2>
        <p>
          Start managing inventory, suppliers, orders, and sales
          with a professional-grade system.
        </p>

        <Link to="/register" className="btn btn-primary large">
          Start Now
        </Link>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="footer">
        <p>
          © 2026 Smart Nursery & Seed Management System
        </p>
        <span>
          Designed & Developed by Pankaj Kumar
        </span>
      </footer>

    </div>
  );
}

export default Home;
