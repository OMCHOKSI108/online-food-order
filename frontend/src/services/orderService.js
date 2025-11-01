import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const orderService = {
  placeOrder: (data, token) =>
    axios.post(`${API_URL}/orders`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  processPayment: (orderId, data, token) =>
    axios.post(`${API_URL}/orders/${orderId}/payment`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyOrders: (token) =>
    axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getOrderDetails: (orderId, token) =>
    axios.get(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  cancelOrder: (orderId, token) =>
    axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  submitReview: (orderId, data, token) =>
    axios.post(`${API_URL}/orders/${orderId}/review`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getReceipt: (orderId, token) =>
    axios.get(`${API_URL}/orders/${orderId}/receipt`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default orderService;
