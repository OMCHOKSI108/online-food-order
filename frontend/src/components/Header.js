import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useFavorites } from "../hooks/useFavorites";
import { GiHamburger } from "react-icons/gi";
import { BsCart, BsHeart, BsPerson, BsBox, BsGear, BsPower, BsPeople } from "react-icons/bs";

export default function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  return (
    <nav className={`navbar navbar-expand-lg ${isHomePage ? 'navbar-transparent' : 'navbar-dark bg-dark'} sticky-top`}>
      <div className="container">
        {/* Logo - always show */}
        <Link className="navbar-brand" to="/" onClick={closeDropdown}>
          <GiHamburger className="me-2" />
          FoodPlaza
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
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary text-white px-3 py-2" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {/* Show different navigation based on user role and page */}
                {user.role === "customer" && !isHomePage && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/" onClick={closeDropdown}>Home</Link>
                    </li>
                  </>
                )}

                {user.role === "restaurant" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/dashboard" onClick={closeDropdown}>Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/menu" onClick={closeDropdown}>Menu</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/restaurant/orders" onClick={closeDropdown}>Orders</Link>
                    </li>
                  </>
                )}

                {(user.role === "admin" || user.role === "superadmin") && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard" onClick={closeDropdown}>Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/restaurants" onClick={closeDropdown}>Restaurants</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users" onClick={closeDropdown}>Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/reports" onClick={closeDropdown}>Reports</Link>
                    </li>
                  </>
                )}

                {/* Cart - show only for customers */}
                {user.role === "customer" && (
                  <li className="nav-item">
                    <Link className="nav-link position-relative" to="/cart" onClick={closeDropdown}>
                      <BsCart className="me-1" />
                      Cart
                      {getTotalItems() > 0 && (
                        <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Profile Circle Dropdown - show for all authenticated users */}
                <li className="nav-item dropdown position-relative">
                  <button
                    className={`btn btn-link nav-link p-0 d-flex align-items-center profile-circle-btn ${isHomePage ? 'navbar-transparent-profile' : ''}`}
                    onClick={toggleDropdown}
                    style={{ border: 'none !important', background: 'none', borderRadius: '50%', width: '40px', height: '40px' }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: user.profilePicture
                          ? `url(${user.profilePicture})`
                          : '#667eea',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '50%',
                        fontSize: '16px',
                        boxShadow: isHomePage ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      {!user.profilePicture && getInitials(user.name)}
                    </div>
                  </button>

                  {showDropdown && (
                    <div className="dropdown-menu dropdown-menu-end show position-absolute"
                         style={{ top: '100%', right: '0', zIndex: 1050 }}>
                      <div className="dropdown-header d-flex align-items-center">
                        <div
                          className="me-2 d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '32px',
                            height: '32px',
                            background: user.profilePicture
                              ? `url(${user.profilePicture})`
                              : '#667eea',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '50%',
                            fontSize: '14px'
                          }}
                        >
                          {!user.profilePicture && getInitials(user.name)}
                        </div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>

                      {user.role === "customer" && (
                        <>
                          <Link className="dropdown-item d-flex align-items-center" to="/profile" onClick={closeDropdown}>
                            <BsPerson className="me-2" />
                            Profile
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/favorites" onClick={closeDropdown}>
                            <BsHeart className="me-2" />
                            Favorites
                            {getFavoritesCount() > 0 && (
                              <span className="badge bg-primary ms-auto">{getFavoritesCount()}</span>
                            )}
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/orders" onClick={closeDropdown}>
                            <BsBox className="me-2" />
                            My Orders
                          </Link>
                        </>
                      )}

                      {user.role === "restaurant" && (
                        <>
                          <Link className="dropdown-item d-flex align-items-center" to="/restaurant/dashboard" onClick={closeDropdown}>
                            <BsPerson className="me-2" />
                            Restaurant Profile
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/restaurant/menu" onClick={closeDropdown}>
                            <BsGear className="me-2" />
                            Menu Settings
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/restaurant/orders" onClick={closeDropdown}>
                            <BsBox className="me-2" />
                            Order Management
                          </Link>
                        </>
                      )}

                      {(user.role === "admin" || user.role === "superadmin") && (
                        <>
                          <Link className="dropdown-item d-flex align-items-center" to="/admin/dashboard" onClick={closeDropdown}>
                            <BsPerson className="me-2" />
                            Admin Profile
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/admin/users" onClick={closeDropdown}>
                            <BsPeople className="me-2" />
                            User Management
                          </Link>
                          <Link className="dropdown-item d-flex align-items-center" to="/admin/restaurants" onClick={closeDropdown}>
                            <BsGear className="me-2" />
                            Restaurant Approvals
                          </Link>
                        </>
                      )}

                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item d-flex align-items-center text-danger"
                        onClick={handleLogout}
                      >
                        <BsPower className="me-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040 }}
          onClick={closeDropdown}
        ></div>
      )}
    </nav>
  );
}
