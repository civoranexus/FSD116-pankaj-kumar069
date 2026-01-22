import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Unable to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="order-details-page">
      <h2>Order Details</h2>

      <p><b>Order ID:</b> {order.orderNumber || order._id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
      <p>
        <b>Placed On:</b>{" "}
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <h3>Items</h3>
      {order.items.map((item) => (
        <div key={item._id} className="order-item">
          <p>{item.name}</p>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}

      {/* ❌ Customer cannot cancel / edit */}
      {/* <button>Cancel Order</button> */}
    </div>
  );
};

export default OrderDetails;
