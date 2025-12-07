import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const orderService = {
  placeOrder: (data) =>
    axios.post(`${API_URL}/orders`, data),

  processPayment: (orderId, data) =>
    axios.post(`${API_URL}/orders/${orderId}/payment`, data),

  getMyOrders: () =>
    axios.get(`${API_URL}/orders`),

  getOrderDetails: (orderId) =>
    axios.get(`${API_URL}/orders/${orderId}`),

  cancelOrder: (orderId) =>
    axios.put(`${API_URL}/orders/${orderId}/cancel`, {}),

  submitReview: (orderId, data) =>
    axios.post(`${API_URL}/orders/${orderId}/review`, data),

  getReceipt: (orderId) =>
    axios.get(`${API_URL}/orders/${orderId}/receipt`)
};

export default orderService;
