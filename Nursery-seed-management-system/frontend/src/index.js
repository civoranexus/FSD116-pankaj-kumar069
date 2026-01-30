import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Context Providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

/*
----------------------------------------------------
🔴 OLD STRUCTURE (Tumhara code – perfectly fine)
----------------------------------------------------
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
----------------------------------------------------
❌ Problem:
- Agar Auth loading me ho → UI flicker ho sakta
- Global UX loader ka control nahi
----------------------------------------------------
*/

/*
----------------------------------------------------
✅ NEW PROFESSIONAL STRUCTURE
----------------------------------------------------
✔ Context order clear
✔ Future-ready (Theme, Toast, Loader add kar sakte ho)
✔ Clean & readable
----------------------------------------------------
*/

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* 🔐 Auth sabse upar (kyunki poori app isi pe dependent hai) */}
    <AuthProvider>

      {/* 👤 User profile related data */}
      <UserProvider>

        {/* 🛒 Cart should depend on user */}
        <CartProvider>

          {/* 🚀 Main Application */}
          <App />

        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

/*
----------------------------------------------------
📊 Performance Monitoring (Optional but Professional)
----------------------------------------------------
- Production me 'console.log' ya API bhej sakte ho
*/
reportWebVitals();
