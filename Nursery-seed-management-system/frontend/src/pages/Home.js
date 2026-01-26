import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =====================================================
   STYLES
   ❌ OLD (same folder)
   import "./Home.css";
   ✅ NEW (centralized styles folder)
===================================================== */
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  /* =====================================================
     UX HOOK
     👉 Page load pe subtle animation trigger
     👉 Google, Stripe, Notion sab yahi pattern follow karte
  ===================================================== */
  useEffect(() => {
    document.body.classList.add("page-fade-in");

    return () => {
      document.body.classList.remove("page-fade-in");
    };
  }, []);

  /* =====================================================
     FEATURES DATA
     👉 JSX me hardcode nahi
     👉 Data driven UI = professional frontend
  ===================================================== */
  const features = [
    {
      title: "Inventory Management",
      icon: "📦",
      description:
        "Track seeds, saplings, plants, and stock levels in real-time.",
      route: "/inventory",
    },
    {
      title: "Supplier & Procurement",
      icon: "🤝",
      description:
        "Manage suppliers, procurement cycles, and purchase records.",
      route: "/suppliers",
    },
    {
      title: "Order Management",
      icon: "🛒",
      description:
        "Monitor customer orders with complete lifecycle tracking.",
      route: "/orders",
    },
    {
      title: "Sales & Analytics",
      icon: "📊",
      description:
        "Visualize revenue, trends, and monthly performance insights.",
      route: "/admin/sales-report",
    },
    {
      title: "Plant Health Monitoring",
      icon: "🌿",
      description:
        "Record plant health, treatments, and maintenance history.",
      route: "/admin/health",
    },
  ];

  return (
    <div className="home">

      {/* =====================================================
          HERO SECTION
          👉 First impression = make or break
      ===================================================== */}
      <section className="hero">

        {/* ================= LEFT CONTENT ================= */}
        <div className="hero-content">

          {/* Small trust badge */}
          <span className="hero-badge">
            🌱 Smart Agriculture Platform
          </span>

          <h1 className="hero-title">
            Smart Nursery & Seed <br />
            <span>Management System</span>
          </h1>

          <p className="hero-subtitle">
            A professional digital platform to manage nursery inventory,
            suppliers, orders, sales analytics, and plant health — all in
            one centralized system.
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

        {/* ================= RIGHT VISUAL ================= */}
        <div className="hero-visual">

          {/* ❌ OLD LEARNING CODE (DO NOT DELETE) */}
          {/*
          <video src="frontend/public/videos" />
          */}

          {/* ✅ PROFESSIONAL VIDEO USAGE */}
          <video
            src="/videos/nursery.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
          />

          {/* =================================================
             UX MAGIC ✨
             👉 Subtle overlay pattern + animated text
             👉 Background me "alive" feel aata hai
          ================================================= */}
          <div className="hero-overlay-pattern">
            <span>Inventory</span>
            <span>Seeds</span>
            <span>Suppliers</span>
            <span>Growth</span>
            <span>Analytics</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST SECTION
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
          FEATURES SECTION
      ===================================================== */}
      <section className="features">

        <header className="features-header">
          <h2 className="section-title">Core Features</h2>
          <p className="section-subtitle">
            Built for real-world nursery operations — not just a demo project.
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
          FINAL CTA
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
        <p>© 2026 Smart Nursery & Seed Management System</p>

        {/* ❌ OPTIONAL (remove if not needed later) */}
        {/*
        <span>Designed & Developed by Pankaj Kumar</span>
        */}

        {/* ✅ PROFESSIONAL VERSION */}
        <span>Built with ❤️ for Pankaj Kumar</span>
      </footer>
    </div>
  );
}

export default Home;
