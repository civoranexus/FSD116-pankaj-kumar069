import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Context Providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext"; // <-- Add this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* ✅ Wrap all contexts */}
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
