import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
import Orders from "./components/Orders";
import Suppliers from "./components/Suppliers";
import Procurement from "./components/Procurement";
import Health from "./components/Health";
import Admin from "./components/Admin";
import SalesReport from "./components/SalesReport";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/procurements" element={<Procurement />} />
        <Route path="/health" element={<Health />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/sales-report" element={<SalesReport />} />

      </Routes>
    </Router>
  );
}

export default App;