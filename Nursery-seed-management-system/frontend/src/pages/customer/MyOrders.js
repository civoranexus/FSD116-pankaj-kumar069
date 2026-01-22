import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
// import { formatDate } from "../../utils/formatDate"; 
// 🔴 Future improvement ke liye (abhi direct JS date use kar rahe hain)

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

        // 🔥 SAFETY CHECK (NEW)
        // Agar backend se galat response aaye
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        // 🔥 Professional error handling (tumhara code — best practice)
        const msg =
          err?.response?.data?.message ||
          "Unable to fetch orders. Please try again later.";
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

      {/* 🔥 EMPTY STATE (Customer ke liye clean UX) */}
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p><b>No orders found.</b></p>
          <p>
            You haven’t placed any order yet.  
            Please visit the <b>Seeds</b> page to place your first order.
          </p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              
              {/* 🔹 ORDER HEADER */}
              <div className="order-card-header">
                <p>
                  <b>Order ID:</b>{" "}
                  {order.orderNumber || order._id}
                  {/* 🔥 fallback added */}
                </p>

                <p>
                  <b>Placed At:</b>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                  {/* 🔴 Later: formatDate(order.createdAt) */}
                </p>
              </div>

              {/* 🔹 ORDER BODY */}
              <div className="order-card-body">
                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`status-badge ${order.status?.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </p>

                <p>
                  <b>Total Amount:</b>{" "}
                  ₹{order.totalAmount}
                </p>

                <p>
                  <b>Total Items:</b>{" "}
                  {order.items?.length || 0}
                  {/* 🔥 safety added */}
                </p>

                {/* ❌ CUSTOMER CANNOT EDIT / CANCEL */}
                {/* <button>Cancel Order</button> */}
                {/* 🔴 intentionally disabled for customer */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
