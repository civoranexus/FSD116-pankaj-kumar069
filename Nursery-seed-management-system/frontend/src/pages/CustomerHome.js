import React from "react";
import SeedList from "../components/SeedList";

function CustomerHome() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Welcome to Nursery Seed System
      </h1>

      {/* ✅ Card section for info */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginBottom: "30px" }}>
        <div style={{
          flex: "1 1 200px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          textAlign: "center"
        }}>
          <h3>Total Seeds</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>120</p>
        </div>
        <div style={{
          flex: "1 1 200px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          textAlign: "center"
        }}>
          <h3>My Orders</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>5</p>
        </div>
      </div>

      {/* ✅ Seed list */}
      <SeedList />

      {/* ✅ Optional: Commented old code */}
      {/*
      <div>
        <h1>Customer Home</h1>
        <SeedList />
      </div>
      */}
    </div>
  );
}

export default CustomerHome;
