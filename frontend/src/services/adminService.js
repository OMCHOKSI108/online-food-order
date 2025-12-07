import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const adminService = {
  getAllUsers: () =>
    axios.get(`${API_URL}/admin/users`),

  deleteUser: (userId) =>
    axios.delete(`${API_URL}/admin/users/${userId}`),

  editUser: (userId, data) =>
    axios.put(`${API_URL}/admin/users/${userId}`, data),

  getUserDetails: (userId) =>
    axios.get(`${API_URL}/admin/users/${userId}/details`),

  toggleUserStatus: (userId) =>
    axios.put(`${API_URL}/admin/users/${userId}/toggle-status`),

  sendUserNotification: (userId, data) =>
    axios.post(`${API_URL}/admin/users/${userId}/notify`, data),

  sendBroadcastNotification: (data) =>
    axios.post(`${API_URL}/admin/notifications/broadcast`, data),

  getPendingRestaurants: () =>
    axios.get(`${API_URL}/admin/restaurants/pending`),

  getAllRestaurants: () =>
    axios.get(`${API_URL}/admin/restaurants`),

  approveRestaurant: (restaurantId) =>
    axios.put(`${API_URL}/admin/restaurants/${restaurantId}/approve`, {}),

  rejectRestaurant: (restaurantId, data) =>
    axios.put(`${API_URL}/admin/restaurants/${restaurantId}/reject`, data),

  toggleRestaurantStatus: (restaurantId) =>
    axios.put(`${API_URL}/admin/restaurants/${restaurantId}/toggle-status`),

  getAllOrders: () =>
    axios.get(`${API_URL}/admin/orders`),

  getAllPayments: () =>
    axios.get(`${API_URL}/admin/payments`),

  getRevenueReport: () =>
    axios.get(`${API_URL}/admin/reports/revenue`),

  getTopRestaurants: () =>
    axios.get(`${API_URL}/admin/reports/top-restaurants`),

  getTopDishes: () =>
    axios.get(`${API_URL}/admin/reports/top-dishes`),

  getStatistics: () => {
    console.log("Making API call to getStatistics");
    return axios.get(`${API_URL}/admin/stats`);
  }
};

export default adminService;
