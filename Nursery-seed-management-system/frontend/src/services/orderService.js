import API from "../api";

/* =====================================================
   ORDER SERVICE (Customer + Staff + Admin)
   Backend base: /api/orders
===================================================== */

/* ================= PLACE ORDER ================= */
const placeOrder = async (orderData) => {
  try {
    const response = await API.post("/orders", orderData);
    return response.data;
  } catch (error) {
    /* ❌ OLD:
    const response = await API.post("/orders", orderData);
    return response.data;
    */

    /* ✅ NEW: consistent error handling */
    throw (
      error.response?.data ||
      new Error("Failed to place order")
    );
  }
};

/* ================= CUSTOMER: GET MY ORDERS ================= */
const getMyOrders = async () => {
  try {
    const response = await API.get("/orders/my-orders");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to fetch my orders")
    );
  }
};

/* ================= CUSTOMER: GET SINGLE ORDER ================= */
const getMyOrderById = async (orderId) => {
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to fetch order")
    );
  }
};

/* ================= ADMIN / STAFF: GET ALL ORDERS ================= */
const getAllOrders = async () => {
  try {
    const response = await API.get("/orders");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to fetch orders")
    );
  }
};

/* ================= ADMIN / STAFF: GET ORDER BY ID ================= */
const getOrderById = async (orderId) => {
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to fetch order")
    );
  }
};

/* ================= ADMIN / STAFF: UPDATE ORDER STATUS ================= */
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await API.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to update order status")
    );
  }
};

/* ================= ADMIN: DELETE ORDER ================= */
const deleteOrder = async (orderId) => {
  try {
    const response = await API.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Failed to delete order")
    );
  }
};

/* ================= EXPORTS ================= */
export {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

/* =====================================================
   ❌ OLD / NOTES (KEPT FOR LEARNING)
===================================================== */
/*
- Earlier functions had no try/catch
- Errors were silently failing in UI
- Now UI can show proper toast / alert messages
*/
