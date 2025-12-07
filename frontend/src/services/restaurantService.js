import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const restaurantService = {
  getAllRestaurants: () =>
    axios.get(`${API_URL}/restaurants`),

  getAllFoodItems: () =>
    axios.get(`${API_URL}/restaurants/food-items/all`),

  getRestaurantMenu: (restaurantId) =>
    axios.get(`${API_URL}/restaurants/${restaurantId}/menu`),

  registerRestaurant: (data) =>
    axios.post(`${API_URL}/restaurants/register`, data),

  getMyRestaurant: () =>
    axios.get(`${API_URL}/restaurants/my-restaurant`),

  updateRestaurant: (data) =>
    axios.put(`${API_URL}/restaurants/my-restaurant`, data),

  addFoodItem: (data) =>
    axios.post(`${API_URL}/restaurants/menu`, data),

  getMyMenu: () =>
    axios.get(`${API_URL}/restaurants/menu`),

  updateFoodItem: (itemId, data) =>
    axios.put(`${API_URL}/restaurants/menu/${itemId}`, data),

  deleteFoodItem: (itemId) =>
    axios.delete(`${API_URL}/restaurants/menu/${itemId}`),

  getRestaurantOrders: () =>
    axios.get(`${API_URL}/restaurants/orders`),

  acceptOrder: (orderId) =>
    axios.put(`${API_URL}/restaurants/orders/${orderId}/accept`),

  rejectOrder: (orderId, data) =>
    axios.put(`${API_URL}/restaurants/orders/${orderId}/reject`, data),

  updateOrderStatus: (orderId, data) =>
    axios.put(`${API_URL}/restaurants/orders/${orderId}/status`, data)
};

export default restaurantService;
