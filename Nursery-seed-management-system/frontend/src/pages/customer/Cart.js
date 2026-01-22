import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // 🔴 OLD FUNCTION (same as before)
  const removeHandler = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // 🔴 OLD FUNCTION (same as before)
  const checkoutHandler = () => {
    navigate("/checkout");
  };

  // ✅ NEW: total items count (for better UX)
  const totalItems = state.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // 🔴 OLD: total amount calculation (kept)
  const totalAmount = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h2>🛒 My Cart</h2>

      {/* ✅ NEW: small cart summary */}
      {state.cartItems.length > 0 && (
        <p>
          Items in Cart: <b>{totalItems}</b>
        </p>
      )}

      {state.cartItems.length === 0 ? (
        <div>
          <p>Cart is empty 🌱</p>
          {/* ✅ NEW: friendly CTA */}
          {/* <button onClick={() => navigate("/seeds")}>Browse Seeds</button> */}
        </div>
      ) : (
        <>
          {state.cartItems.map((item) => (
            <div key={item.product._id} className="card">
              <h4>{item.product.name}</h4>

              {/* 🔴 OLD DATA (kept) */}
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>

              {/* ✅ NEW: item total */}
              <p>
                <b>Item Total:</b> ₹{item.price * item.quantity}
              </p>

              {/* 🔴 OLD BUTTON (kept) */}
              <button onClick={() => removeHandler(item.product._id)}>
                Remove
              </button>

              {/* ❌ Customer cannot update quantity */}
              {/* <button>Update Quantity</button> */}
            </div>
          ))}

          <hr />

          {/* 🔴 OLD TOTAL (kept) */}
          <h3>Total Amount: ₹{totalAmount}</h3>

          {/* ❌ Coupon / Discount future scope */}
          {/* <CouponBox /> */}

          {/* 🔴 OLD CHECKOUT BUTTON (kept) */}
          <button onClick={checkoutHandler}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
