import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/Toast";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Payment from "./pages/Payment";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Favorites from "./pages/Favorites";

// Restaurant Pages
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantMenu from "./pages/restaurant/Menu";
import RestaurantOrders from "./pages/restaurant/Orders";
import RestaurantSetup from "./pages/restaurant/Setup";
import AddDish from "./pages/restaurant/AddDish";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetail from "./pages/admin/UserDetail";
import AdminReports from "./pages/admin/Reports";
import AdminOrders from "./pages/admin/Orders";

import { FavoritesProvider } from "./context/FavoritesContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu/:restaurantId" element={<Menu />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredRole="customer">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute requiredRole={["customer", "admin", "superadmin"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:orderId"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Restaurant Routes */}
            <Route
              path="/restaurant/setup"
              element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/dashboard"
              element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/menu"
              element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/orders"
              element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/add-dish"
              element={
                <ProtectedRoute requiredRole="restaurant">
                  <AddDish />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminRestaurants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:userId"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminUserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
            </FavoritesProvider>
        </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
