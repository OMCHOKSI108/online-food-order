import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const restaurantService = {
  getAllRestaurants: () =>
    axios.get(`${API_URL}/restaurants`),

  getRestaurantMenu: (restaurantId) =>
    axios.get(`${API_URL}/restaurants/${restaurantId}/menu`),

  registerRestaurant: (data, token) =>
    axios.post(`${API_URL}/restaurants/register`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyRestaurant: (token) =>
    axios.get(`${API_URL}/restaurants/my-restaurant`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateRestaurant: (data, token) =>
    axios.put(`${API_URL}/restaurants/my-restaurant`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  addFoodItem: (data, token) =>
    axios.post(`${API_URL}/restaurants/menu`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyMenu: (token) =>
    axios.get(`${API_URL}/restaurants/menu`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateFoodItem: (itemId, data, token) =>
    axios.put(`${API_URL}/restaurants/menu/${itemId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  deleteFoodItem: (itemId, token) =>
    axios.delete(`${API_URL}/restaurants/menu/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default restaurantService;
