import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /* =====================================================
     LOAD CART FROM LOCALSTORAGE (ON APP LOAD)
  ===================================================== */
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setCart([]);
    }
  }, []);

  /* =====================================================
     SAVE CART TO LOCALSTORAGE (ON CART CHANGE)
  ===================================================== */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =====================================================
     ADD TO CART
  ===================================================== */
  const addToCart = (product) => {
    /* ❌ OLD (stale state risk)
    const existing = cart.find((c) => c._id === product._id);
    */

    /* ✅ NEW: functional update (safe) */
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c._id === product._id);

      if (existing) {
        return prevCart.map((c) =>
          c._id === product._id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  /* =====================================================
     REMOVE FROM CART
  ===================================================== */
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((c) => c._id !== id));
  };

  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */
  const updateQty = (id, qty) => {
    /* ❌ OLD
    if (qty < 1) return;
    */

    /* ✅ NEW: auto remove if qty <= 0 */
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((c) =>
        c._id === id ? { ...c, quantity: qty } : c
      )
    );
  };

  /* =====================================================
     CLEAR CART
  ===================================================== */
  const clearCart = () => {
    setCart([]);
  };

  /* =====================================================
     DERIVED VALUES (IMPORTANT FOR ORDER SUMMARY)
  ===================================================== */

  /* ✅ Total items in cart */
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  /* ✅ Total price */
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,

        /* ✅ NEW exports */
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =====================================================
   CUSTOM HOOK
===================================================== */

/* ❌ OLD
export const useCart = () => {
  return useContext(CartContext);
};
*/

/* ✅ NEW: safety check */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
