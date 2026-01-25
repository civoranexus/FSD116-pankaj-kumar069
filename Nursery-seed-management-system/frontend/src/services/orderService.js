import API from "../api";

/* =====================================================
   ORDER SERVICE (Customer + Staff + Admin)
   Backend base: /api/orders
===================================================== */

/* ================= PLACE ORDER ================= */
const placeOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

/* ================= CUSTOMER: GET MY ORDERS ================= */
const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");
  return response.data;
};

/* ================= CUSTOMER: GET SINGLE ORDER ================= */
const getMyOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

/* ================= ADMIN / STAFF: GET ALL ORDERS ================= */
const getAllOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

/* ================= ADMIN / STAFF: GET ORDER BY ID ================= */
const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

/* ================= ADMIN / STAFF: UPDATE ORDER STATUS ================= */
const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

/* ================= ADMIN: DELETE ORDER ================= */
const deleteOrder = async (orderId) => {
  const response = await API.delete(`/orders/${orderId}`);
  return response.data;
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
