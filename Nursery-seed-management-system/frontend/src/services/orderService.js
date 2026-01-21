import API from "./api";

/* =====================================================
   ORDER SERVICE (CUSTOMER + STAFF + ADMIN)
   - Backend: /api/orders
===================================================== */

/* =====================================================
   PLACE ORDER
   - Customer: apne liye
   - Staff/Admin: customer ke liye
===================================================== */
const placeOrder = async (orderData) => {
  /*
  orderData example:
  {
    items: [
      { product: productId, quantity: 2 }
    ]
  }

  Staff/Admin case:
  {
    customer: customerId,
    items: [...]
  }
  */
  const response = await API.post("/orders", orderData);
  return response.data;
};

/* =====================================================
   CUSTOMER: GET MY ORDERS
===================================================== */
const getMyOrders = async () => {
  const response = await API.get("/orders/myorders");
  return response.data;
};

/* =====================================================
   CUSTOMER: GET SINGLE ORDER (future use)
===================================================== */
const getMyOrderById = async (orderId) => {
  /*
  ❌ OLD (not allowed – customer security issue)
  const response = await API.get(`/orders/${orderId}`);
  */

  // ✅ NEW (safe – backend checks customer ownership)
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

/* =====================================================
   ADMIN / STAFF: GET ALL ORDERS
===================================================== */
const getAllOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

/* =====================================================
   ADMIN / STAFF: GET ORDER BY ID
===================================================== */
const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

/* =====================================================
   ADMIN / STAFF: UPDATE ORDER STATUS
===================================================== */
const updateOrderStatus = async (orderId, status) => {
  /*
  status must be one of:
  "Pending"
  "Confirmed"
  "Packed"
  "Shipped"
  "Completed"
  "Cancelled"
  */
  const response = await API.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

/* =====================================================
   ADMIN: DELETE ORDER
===================================================== */
const deleteOrder = async (orderId) => {
  const response = await API.delete(`/orders/${orderId}`);
  return response.data;
};

/* =====================================================
   EXPORTS
==================================================== */

// ❌ OLD EXPORT STYLE (kept for reference)
/*
export { placeOrder, getMyOrders, getAllOrders };
*/

// ✅ NEW COMPLETE EXPORT (A to Z)
export {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
