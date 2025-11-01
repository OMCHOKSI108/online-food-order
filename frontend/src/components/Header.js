import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🍔 FoodHub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {user.role === "customer" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">My Orders</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        🛒 Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                  </>
                )}

                {user.role === "restaurant" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/menu">Menu</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/orders">Orders</Link>
                    </li>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/restaurants">Restaurants</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">Users</Link>
                    </li>
                  </>
                )}

                <li className="nav-item dropdown">
                  <button
                    className="nav-link btn btn-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">Profile</Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
