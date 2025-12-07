import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService from "../../services/adminService";
import { BsClipboard, BsBarChart, BsGear, BsGraphUp, BsPeople, BsCheck, BsBox } from "react-icons/bs";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching admin stats...");
      const response = await adminService.getStatistics();
      console.log("Admin stats response:", response);
      console.log("Admin stats data:", response.data);
      setStats(response.data.stats);
      console.log("Stats set to state:", response.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load statistics");
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

  return (
    <div className="container-fluid my-4">
      <div className="row mb-4">
        <div className="col">
          <h2>👑 Admin Dashboard</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          {console.log("Rendering stats:", stats)}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card shadow-lg text-center">
                <div className="card-body">
                  <h2 className="text-primary">
                    {stats.totalUsers || 0}
                  </h2>
                  <p className="text-muted">Total Users</p>
                  <Link to="/admin/users" className="btn btn-sm btn-primary">
                    Manage
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-lg text-center">
                <div className="card-body">
                  <h2 className="text-success">
                    {stats.totalRestaurants || 0}
                  </h2>
                  <p className="text-muted">Restaurants</p>
                  <Link
                    to="/admin/restaurants"
                    className="btn btn-sm btn-success"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-lg text-center">
                <div className="card-body">
                  <h2 className="text-info">
                    {stats.totalOrders || 0}
                  </h2>
                  <p className="text-muted">Total Orders</p>
                  <Link to="/admin/orders" className="btn btn-sm btn-info">
                    View
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-lg text-center">
                <div className="card-body">
                  <h2 className="text-warning">
                    ₹{stats.totalRevenue || 0}
                  </h2>
                  <p className="text-muted">Total Revenue</p>
                  <Link
                    to="/admin/reports"
                    className="btn btn-sm btn-warning"
                  >
                    Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">🏪 Quick Actions</h5>
                </div>
                <div className="card-body d-grid gap-2">
                  <Link to="/admin/restaurants" className="btn btn-success">
                    <BsCheck className="me-2" />
                    Approve Pending Restaurants
                  </Link>
                  <Link to="/admin/users" className="btn btn-info">
                    <BsPeople className="me-2" />
                    Manage Users
                  </Link>
                  <Link to="/admin/orders" className="btn btn-success">
                    <BsBox className="me-2" />
                    View All Orders
                  </Link>
                  <Link to="/admin/restaurants" className="btn btn-warning">
                    <BsClipboard className="me-2" />
                    Manage Restaurants
                  </Link>
                  <Link to="/admin/reports" className="btn btn-primary">
                    <BsBarChart className="me-2" />
                    View Reports
                  </Link>
                  <button className="btn btn-outline-secondary">
                    <BsGear className="me-2" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0"><BsGraphUp className="me-2" /> This Month</h5>
                </div>
                <div className="card-body">
                  <p>
                    <strong>New Users:</strong>{" "}
                    {stats.newUsersThisMonth || 0}
                  </p>
                  <p>
                    <strong>New Restaurants:</strong>{" "}
                    {stats.newRestaurantsThisMonth || 0}
                  </p>
                  <p>
                    <strong>Orders Completed:</strong>{" "}
                    {stats.completedOrdersThisMonth || 0}
                  </p>
                  <p>
                    <strong>Revenue:</strong> ₹
                    {stats.revenueThisMonth || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-warning text-white">
                  <h5 className="mb-0">
                    ⏳ Pending Approvals ({stats.pendingRestaurants || 0})
                  </h5>
                </div>
                <div className="card-body">
                  {stats.pendingRestaurants > 0 ? (
                    <>
                      <p className="text-muted">
                        You have {stats.pendingRestaurants} pending restaurant
                        approvals waiting for review.
                      </p>
                      <Link
                        to="/admin/restaurants"
                        className="btn btn-warning"
                      >
                        Review Now
                      </Link>
                    </>
                  ) : (
                    <p className="text-success">
                      <BsCheck className="me-2" />
                      All pending approvals are up to date!
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-lg">
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0">
                    🚨 Recent Issues ({stats.issues || 0})
                  </h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Monitor system health and user complaints
                  </p>
                  <button className="btn btn-danger">View Issues</button>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-lg">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0"><BsBarChart className="me-2" /> System Overview</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <h6>Active Users</h6>
                      <h4 className="text-primary">
                        {stats.activeUsers || 0}
                      </h4>
                    </div>
                    <div className="col-md-3">
                      <h6>Active Restaurants</h6>
                      <h4 className="text-success">
                        {stats.activeRestaurants || 0}
                      </h4>
                    </div>
                    <div className="col-md-3">
                      <h6>Avg Order Value</h6>
                      <h4 className="text-warning">
                        ₹{stats.avgOrderValue || 0}
                      </h4>
                    </div>
                    <div className="col-md-3">
                      <h6>Platform Commission</h6>
                      <h4 className="text-info">
                        ₹{stats.platformCommission || 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
