import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { BsClipboard, BsBox, BsStar, BsCheck, BsX, BsPlus, BsGear, BsGraphUp, BsFileText, BsBarChart, BsClock, BsCurrencyRupee, BsPeople, BsShop, BsArrowUp, BsGeoAlt, BsPhone, BsEnvelope } from "react-icons/bs";
import "./RestaurantDashboard.css";

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getMyRestaurant();
      setRestaurant(response.data);
      setRecentOrders([]); // For now, not fetching orders
    } catch (err) {
      setError("Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-admin-container">
        <div className="restaurant-admin-wrapper">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your restaurant dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-admin-container">
        <div className="restaurant-admin-wrapper">
          <div className="error-state">
            <BsX size={64} />
            <h3>Unable to Load Dashboard</h3>
            <p>{error}</p>
            <button
              className="action-button primary"
              onClick={() => navigate("/restaurant/setup")}
            >
              Setup Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (restaurant && restaurant.approvalStatus === "pending") {
    return (
      <div className="restaurant-admin-container">
        <div className="restaurant-admin-wrapper">
          <div className="pending-state">
            <BsClock size={80} />
            <h2>Restaurant Registration Pending</h2>
            <p>
              Your restaurant registration is under review by our admin team.
              You will be notified once it's approved and your dashboard becomes active.
            </p>
            <div className="pending-meta">
              <small>Submitted on: {new Date(restaurant.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getApprovalBadge = (status) => {
    const colors = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return colors[status] || "secondary";
  };

  return (
    <div className="restaurant-admin-container">
      <div className="restaurant-admin-wrapper">
        {/* Header Section */}
        <div className="restaurant-header">
          <h1>
            <GiForkKnifeSpoon />
            Restaurant Dashboard
          </h1>
          {restaurant && (
            <div className={`restaurant-status status-${restaurant.approvalStatus}`}>
              <BsCheck />
              {restaurant.approvalStatus?.toUpperCase()}
            </div>
          )}
        </div>

        {restaurant && (
          <>
            {/* Stats Cards Grid */}
            <div className="restaurant-stats-grid">
              <div className="stat-card revenue">
                <div className="stat-card-icon">
                  <BsCurrencyRupee />
                </div>
                <div className="stat-card-value">₹{restaurant.totalEarnings || 0}</div>
                <div className="stat-card-label">Total Earnings</div>
                <div className="stat-card-change positive">
                  <BsArrowUp />
                  +12% from last month
                </div>
              </div>

              <div className="stat-card orders">
                <div className="stat-card-icon">
                  <BsBox />
                </div>
                <div className="stat-card-value">{restaurant.totalOrders || 0}</div>
                <div className="stat-card-label">Total Orders</div>
                <div className="stat-card-change positive">
                  <BsArrowUp />
                  +8% from last month
                </div>
              </div>

              <div className="stat-card rating">
                <div className="stat-card-icon">
                  <BsStar />
                </div>
                <div className="stat-card-value">
                  {restaurant.rating || 0}
                  <BsStar style={{fontSize: '1rem', marginLeft: '0.25rem'}} />
                </div>
                <div className="stat-card-label">Average Rating</div>
                <div className="stat-card-change positive">
                  <BsArrowUp />
                  +0.2 from last month
                </div>
              </div>

              <div className="stat-card status">
                <div className="stat-card-icon">
                  {restaurant.isActive ? <BsCheck /> : <BsX />}
                </div>
                <div className="stat-card-value">
                  {restaurant.isActive ? "Active" : "Inactive"}
                </div>
                <div className="stat-card-label">Restaurant Status</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="restaurant-content-grid">
              {/* Restaurant Info Card */}
              <div className="restaurant-info-card">
                <div className="restaurant-info-header">
                  <div className="restaurant-info-avatar">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="restaurant-info-details">
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description}</p>
                  </div>
                </div>

                <div className="restaurant-info-meta">
                  <div className="info-meta-item">
                    <BsGeoAlt />
                    <div>
                      <div className="info-meta-label">Address</div>
                      <div className="info-meta-value">{restaurant.address}</div>
                    </div>
                  </div>
                  <div className="info-meta-item">
                    <BsPhone />
                    <div>
                      <div className="info-meta-label">Phone</div>
                      <div className="info-meta-value">{restaurant.phone || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="info-meta-item">
                    <BsEnvelope />
                    <div>
                      <div className="info-meta-label">Email</div>
                      <div className="info-meta-value">{restaurant.email || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="info-meta-item">
                    <BsShop />
                    <div>
                      <div className="info-meta-label">Category</div>
                      <div className="info-meta-value">{restaurant.category || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="quick-actions-card">
                <div className="quick-actions-header">
                  <BsGear />
                  <h4>Quick Actions</h4>
                </div>
                <div className="quick-actions-grid">
                  <Link to="/restaurant/add-dish" className="action-button primary">
                    <div className="action-button-icon">
                      <BsPlus />
                    </div>
                    <div>
                      <div style={{fontWeight: '600'}}>Add New Dish</div>
                      <small style={{opacity: '0.9'}}>Expand your menu</small>
                    </div>
                  </Link>

                  <Link to="/restaurant/menu" className="action-button secondary">
                    <div className="action-button-icon">
                      <BsFileText />
                    </div>
                    <div>
                      <div style={{fontWeight: '600'}}>Edit Menu</div>
                      <small style={{opacity: '0.9'}}>Update existing items</small>
                    </div>
                  </Link>

                  <Link to="/restaurant/orders" className="action-button warning">
                    <div className="action-button-icon">
                      <BsBox />
                    </div>
                    <div>
                      <div style={{fontWeight: '600'}}>View Orders</div>
                      <small style={{opacity: '0.9'}}>Manage incoming orders</small>
                    </div>
                  </Link>

                  <button className="action-button">
                    <div className="action-button-icon">
                      <BsBarChart />
                    </div>
                    <div>
                      <div style={{fontWeight: '600'}}>View Analytics</div>
                      <small style={{opacity: '0.9'}}>Performance insights</small>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="performance-card">
              <div className="performance-header">
                <BsGraphUp />
                <h4>This Month's Performance</h4>
              </div>
              <div className="performance-metrics">
                <div className="performance-metric">
                  <div className="performance-metric-value">{restaurant.totalOrders || 0}</div>
                  <div className="performance-metric-label">Orders</div>
                </div>
                <div className="performance-metric">
                  <div className="performance-metric-value">₹{restaurant.totalEarnings || 0}</div>
                  <div className="performance-metric-label">Revenue</div>
                </div>
                <div className="performance-metric">
                  <div className="performance-metric-value">
                    {restaurant.rating || 0} <BsStar style={{fontSize: '0.75rem'}} />
                  </div>
                  <div className="performance-metric-label">Rating</div>
                </div>
                <div className="performance-metric">
                  <div className="performance-metric-value">
                    {restaurant.approvalStatus === "approved" ? "Active" : "Pending"}
                  </div>
                  <div className="performance-metric-label">Status</div>
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            {recentOrders.length > 0 && (
              <div className="recent-orders-card">
                <div className="recent-orders-header">
                  <h4>
                    <BsBox />
                    Recent Orders
                  </h4>
                  <Link to="/restaurant/orders" className="action-button secondary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>
                    View All
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(0, 8)}</td>
                          <td>{order.customer?.name || "N/A"}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <span className={`order-status ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
