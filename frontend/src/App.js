import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Restaurants from "./components/Restaurants";
import AdminPanel from "./components/AdminPanel";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h2 className="text-center mb-4">🍔 Online Food Ordering System</h2>
        <nav className="text-center mb-4">
          <Link className="btn btn-primary mx-1" to="/register">Register</Link>
          <Link className="btn btn-success mx-1" to="/login">Login</Link>
          <Link className="btn btn-warning mx-1" to="/restaurants">Restaurants</Link>
          <Link className="btn btn-secondary mx-1" to="/dashboard">Dashboard</Link>
          <Link className="btn btn-dark mx-1" to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu/:id" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
