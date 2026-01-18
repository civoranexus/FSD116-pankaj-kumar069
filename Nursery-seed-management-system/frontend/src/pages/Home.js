import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* ================= HERO SECTION ================= */}
      <section className="hero">

        <div className="hero-content">

          {/* Optional badge for professional SaaS feel */}
          <span className="hero-badge">
            🌱 Smart Agriculture Platform
          </span>

          <h1 className="hero-title">
            🌱 Smart Nursery & Seed <br />
            <span>Management System</span>
          </h1>

          <p className="hero-subtitle">
            A modern digital platform to efficiently manage nursery inventory,
            seed procurement, customer orders, sales analytics, and plant health
            — all from one centralized system.
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

        {/* ================= HERO VIDEO SECTION ================= */}
        <div className="hero-visual">

          <div className="placeholder-box">
            🌿 Animation / Video Area

            {/* ❌ OLD WRONG CODE (FOLDER PATH — NOT ALLOWED) */}
            {/*
            <video
              className="videos"
              src="frontend/public/videos"
              autoPlay
              loop
              muted
            />
            */}

            {/* ✅ NEW CORRECT CODE */}
            {/* 
              NOTE:
              Video file location:
              frontend/public/videos/nursery.mp4

              public folder = root (/)
            */}
            <video
              className="videos"
              src="/videos/nursery.mp4"
              autoPlay
              loop
              muted
              playsInline
            />

          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features">

        <h2 className="section-title">✨ Features</h2>

        <p className="section-subtitle">
          Everything you need to run and manage a modern nursery business
          efficiently and digitally.
        </p>

        <div className="feature-grid">

          <div className="card">
            <h3>📦 Inventory Management</h3>
            <p>
              Track seeds, saplings, plants, and stock levels in real-time
              to avoid shortages and wastage.
            </p>
          </div>

          <div className="card">
            <h3>🤝 Supplier & Procurement</h3>
            <p>
              Maintain supplier records, manage procurement cycles,
              and streamline purchase operations.
            </p>
          </div>

          <div className="card">
            <h3>🛒 Order Management</h3>
            <p>
              Easily place, monitor, and manage customer orders
              with complete order lifecycle tracking.
            </p>
          </div>

          <div className="card">
            <h3>📊 Sales & Analytics</h3>
            <p>
              Gain insights through sales reports, performance metrics,
              and data-driven analytics.
            </p>
          </div>

          <div className="card">
            <h3>🌿 Plant Health Monitoring</h3>
            <p>
              Record plant health data, treatments, and maintenance
              history to ensure quality growth.
            </p>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        © 2026 Smart Nursery & Seed Management System | Designed for Pankaj Sharma
      </footer>

    </div>
  );
}

export default Home;
