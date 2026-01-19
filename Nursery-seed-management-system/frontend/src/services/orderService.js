import API from "./api";

// Order place karne ke liye
const placeOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

// Customer ke orders fetch karne ke liye
const getMyOrders = async () => {
  const response = await API.get("/orders/myorders");
  return response.data;
};

// Admin/Staff ke liye all orders
const getAllOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export { placeOrder, getMyOrders, getAllOrders };
