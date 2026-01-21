import React, { createContext, useContext, useReducer, useEffect } from "react";

/* =========================
   CART CONTEXT
========================= */
const CartContext = createContext();

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  cartItems: [],
};

/* =========================
   REDUCER
========================= */
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existItem = state.cartItems.find(
        (item) => item.product._id === action.payload.product._id
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.product._id === existItem.product._id
              ? action.payload
              : item
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product._id !== action.payload
        ),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

/* =========================
   PROVIDER
========================= */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // ✅ Load from localStorage (Professional)
    const localData = localStorage.getItem("cart");
    return localData ? JSON.parse(localData) : init;
  });

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

/* =========================
   HOOK (SAFE)
========================= */
export const useCart = () => {
  const context = useContext(CartContext);

  // 🔥 IMPORTANT: Error if not inside Provider
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
