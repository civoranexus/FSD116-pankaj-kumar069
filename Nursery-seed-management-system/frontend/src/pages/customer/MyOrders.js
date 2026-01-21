import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        // 🔥 Professional error handling
        const msg =
          err?.response?.data?.message || "Unable to fetch orders. Try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔥 Loading state
  if (loading) return <Loader />;

  // 🔥 Error state
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>No orders found.</p>
          <p>
            Place your first order from <b>Seeds</b> page.
          </p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <p>
                  <b>Order ID:</b> {order.orderNumber}
                </p>
                <p>
                  <b>Placed At:</b>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="order-card-body">
                <p>
                  <b>Status:</b>{" "}
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>

                <p>
                  <b>Total:</b> ₹{order.totalAmount}
                </p>

                <p>
                  <b>Items:</b> {order.items.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
