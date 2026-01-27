import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

/* NEW: Amazon/Flipkart style UX */
import "../../styles/customer/orders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Unable to fetch orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="orders-page">
      <h2 className="page-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h3>No orders found</h3>
          <p>
            You haven’t placed any order yet. Please visit <b>Seeds</b> page.
          </p>
        </div>
      ) : (
        orders.map((order) => {
          const status = order.status?.toLowerCase();

          const steps = [
            { key: "placed", label: "Placed" },
            { key: "packed", label: "Packed" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
          ];

          return (
            <div key={order._id} className="order-card">
              {/* HEADER */}
              <div className="order-top">
                <div>
                  <p className="order-id">
                    Order #{order.orderNumber || order._id.slice(-6)}
                  </p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className={`status-badge ${status}`}>
                  {order.status}
                </span>
              </div>

              {/* SUMMARY */}
              <div className="order-summary">
                <div className="summary-left">
                  <p className="summary-title">Total Amount</p>
                  <p className="summary-value">₹{order.totalAmount}</p>
                </div>
                <div className="summary-right">
                  <p className="summary-title">Items</p>
                  <p className="summary-value">
                    {order.items?.length || 0}
                  </p>
                </div>
              </div>

              {/* TRACKER */}
              <div className="tracker">
                {steps.map((step, idx) => {
                  const isDone =
                    steps.findIndex((s) => s.key === status) >= idx;
                  return (
                    <div
                      key={idx}
                      className={`tracker-step ${isDone ? "done" : ""}`}
                    >
                      <div className="tracker-dot"></div>
                      <p>{step.label}</p>
                      {idx !== steps.length - 1 && (
                        <div className="tracker-line"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DETAILS TOGGLE */}
              <button
                className="details-btn"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )
                }
              >
                {expandedOrder === order._id
                  ? "Hide Details"
                  : "View Details"}
              </button>

              {/* ITEMS */}
              {expandedOrder === order._id && (
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-left">
                        <div className="item-img">
                          {/* If you have image in item */}
                          {/* <img src={item.product.image} alt="item" /> */}
                        </div>
                        <div>
                          <p className="item-name">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="item-qty">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* OLD UI (commented) */}
              {/*
              <div className="order-header">
                <span className="order-id">
                  Order #{order.orderNumber || order._id}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              */}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
