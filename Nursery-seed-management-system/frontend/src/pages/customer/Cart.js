import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const removeHandler = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  return (
    <div className="container">
      <h2>🛒 My Cart</h2>

      {state.cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {state.cartItems.map((item) => (
            <div key={item.product._id} className="card">
              <h4>{item.product.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>

              <button onClick={() => removeHandler(item.product._id)}>
                Remove
              </button>
            </div>
          ))}

          <hr />

          <h3>
            Total: ₹
            {state.cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </h3>

          <button onClick={checkoutHandler}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
