import React, { createContext, useContext, useEffect, useState } from "react";

/* 
----------------------------------------
1️⃣ Auth Context Create
----------------------------------------
*/
export const AuthContext = createContext();

/*
----------------------------------------
2️⃣ Auth Provider (Professional Version)
----------------------------------------
*/
export const AuthProvider = ({ children }) => {
  /*
  🔴 OLD STATE (tumhara code)
  ----------------------------------------
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });
  ----------------------------------------
  ❌ Problem:
  - Page refresh ke baad data chala jaata
  - Navbar ko pata nahi chalta user login hai ya nahi
  */

  /*
  ✅ NEW STATE (Improved & Professional)
  - localStorage se data uthata hai
  - refresh ke baad bhi login bana rehta hai
  */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // UX improvement

  /*
  ----------------------------------------
  3️⃣ App load hone par auth restore
  ----------------------------------------
  */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // auth check complete
  }, []);

  /*
  ----------------------------------------
  4️⃣ Login Function
  ----------------------------------------
  */
  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);

    setToken(jwtToken);
    setUser(userData);
  };

  /*
  ----------------------------------------
  5️⃣ Logout Function
  ----------------------------------------
  */
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  /*
  ----------------------------------------
  6️⃣ Context Value (Clean & Readable)
  ----------------------------------------
  */
  const value = {
    user,        // logged in user object
    token,       // JWT token
    loading,     // UX ke liye
    isAuth: !!token, // true / false
    login,
    logout,
  };

  /*
  ----------------------------------------
  7️⃣ Loader (Professional UX)
  ----------------------------------------
  */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/*
----------------------------------------
8️⃣ Custom Hook (Best Practice)
----------------------------------------
*/
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
