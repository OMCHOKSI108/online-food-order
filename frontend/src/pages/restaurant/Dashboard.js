import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import restaurantService from "../../services/restaurantService";

export default function RestaurantDashboard() {
  const { user } = useAuth();
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
      setRestaurant(response.data.restaurant);
      setRecentOrders(response.data.recentOrders || []);
    } catch (err) {
      setError("Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/restaurant/setup")}
        >
          Setup Restaurant
        </button>
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
    <div className="container-fluid my-4">
      <div className="row mb-4">
        <div className="col">
          <h2>🍴 Restaurant Dashboard</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/restaurant/menu")}
          >
            📋 Manage Menu
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/restaurant/orders")}
          >
            📦 View Orders
          </button>
        </div>
      </div>

      {restaurant && (
        <>
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h4>{restaurant.name}</h4>
                  <p className="text-muted">{restaurant.description}</p>
                  <p>
                    <strong>Address:</strong> {restaurant.address}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge bg-${getApprovalBadge(
                        restaurant.approvalStatus
                      )}`}
                    >
                      {restaurant.approvalStatus?.toUpperCase()}
                    </span>
                  </p>

                  {restaurant.approvalStatus === "rejected" && (
                    <div className="alert alert-danger mt-3">
                      <strong>Rejection Reason:</strong>{" "}
                      {restaurant.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-lg">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">Rating & Performance</h6>
                </div>
                <div className="card-body text-center">
                  <h3 className="text-warning">
                    ⭐ {restaurant.rating || 0}
                  </h3>
                  <p className="text-muted">Customer Rating</p>
                  <hr />
                  <p>
                    <strong>Total Orders:</strong> {restaurant.totalOrders}
                  </p>
                  <p>
                    <strong>Total Earnings:</strong> ₹
                    {restaurant.totalEarnings || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center shadow">
                <div className="card-body">
                  <h2 className="text-success">₹{restaurant.totalEarnings || 0}</h2>
                  <p className="text-muted">Total Earnings</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow">
                <div className="card-body">
                  <h2 className="text-primary">{restaurant.totalOrders}</h2>
                  <p className="text-muted">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow">
                <div className="card-body">
                  <h2 className="text-warning">⭐{restaurant.rating || 0}</h2>
                  <p className="text-muted">Rating</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow">
                <div className="card-body">
                  <h2 className="text-info">
                    {restaurant.isActive ? "✓" : "✗"}
                  </h2>
                  <p className="text-muted">
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">📋 Quick Actions</h5>
                </div>
                <div className="card-body d-grid gap-2">
                  <Link to="/restaurant/menu" className="btn btn-success">
                    ➕ Add New Dish
                  </Link>
                  <Link to="/restaurant/menu" className="btn btn-info">
                    📝 Edit Menu
                  </Link>
                  <Link to="/restaurant/orders" className="btn btn-warning">
                    📦 Incoming Orders
                  </Link>
                  <button className="btn btn-outline-primary">
                    📊 View Analytics
                  </button>
                  <button className="btn btn-outline-secondary">
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">📈 This Month</h5>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Orders:</strong> {restaurant.totalOrders || 0}
                  </p>
                  <p>
                    <strong>Revenue:</strong> ₹{restaurant.totalEarnings || 0}
                  </p>
                  <p>
                    <strong>Avg Rating:</strong> ⭐
                    {restaurant.rating || 0}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge bg-${getApprovalBadge(
                        restaurant.approvalStatus
                      )}`}
                    >
                      {restaurant.approvalStatus?.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {recentOrders.length > 0 && (
            <div className="card shadow-lg">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">📦 Recent Orders</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
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
                          <td>{order._id.substring(0, 8)}</td>
                          <td>{order.customer?.name}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                order.status === "delivered"
                                  ? "success"
                                  : "warning"
                              }`}
                            >
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
                <Link to="/restaurant/orders" className="btn btn-primary">
                  View All Orders
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
