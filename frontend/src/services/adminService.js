import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const adminService = {
  getAllUsers: (token) =>
    axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  deleteUser: (userId, token) =>
    axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  editUser: (userId, data, token) =>
    axios.put(`${API_URL}/admin/users/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getPendingRestaurants: (token) =>
    axios.get(`${API_URL}/admin/restaurants/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  approveRestaurant: (restaurantId, token) =>
    axios.put(`${API_URL}/admin/restaurants/${restaurantId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  rejectRestaurant: (restaurantId, data, token) =>
    axios.put(`${API_URL}/admin/restaurants/${restaurantId}/reject`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getAllOrders: (token) =>
    axios.get(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getAllPayments: (token) =>
    axios.get(`${API_URL}/admin/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getRevenueReport: (token) =>
    axios.get(`${API_URL}/admin/reports/revenue`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getTopRestaurants: (token) =>
    axios.get(`${API_URL}/admin/reports/top-restaurants`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getTopDishes: (token) =>
    axios.get(`${API_URL}/admin/reports/top-dishes`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getStatistics: (token) =>
    axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default adminService;
