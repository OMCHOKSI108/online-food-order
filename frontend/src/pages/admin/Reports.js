import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/adminService";

export default function AdminReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      if (activeTab === "revenue") {
        const response = await adminService.getRevenueReport();
        setRevenueReport(response.data.report);
      } else if (activeTab === "restaurants") {
        const response = await adminService.getTopRestaurants();
        setTopRestaurants(response.data.restaurants || []);
      } else if (activeTab === "dishes") {
        const response = await adminService.getTopDishes();
        setTopDishes(response.data.dishes || []);
      } else if (activeTab === "stats") {
        const response = await adminService.getStatistics();
        setStats(response.data.stats);
      }
    } catch (err) {
      setError("Failed to load reports");
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
          <h2>📊 Reports & Analytics</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/dashboard")}
          >
            ⬅️ Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-lg mb-4">
        <div className="card-body">
          <div
            className="btn-group btn-group-lg"
            role="group"
          >
            <button
              type="button"
              className={`btn ${
                activeTab === "revenue" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setActiveTab("revenue");
                fetchReports();
              }}
            >
              💰 Revenue Report
            </button>
            <button
              type="button"
              className={`btn ${
                activeTab === "restaurants"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => {
                setActiveTab("restaurants");
                fetchReports();
              }}
            >
              🏪 Top Restaurants
            </button>
            <button
              type="button"
              className={`btn ${
                activeTab === "dishes" ? "btn-info" : "btn-outline-info"
              }`}
              onClick={() => {
                setActiveTab("dishes");
                fetchReports();
              }}
            >
              🍽️ Top Dishes
            </button>
            <button
              type="button"
              className={`btn ${
                activeTab === "stats" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => {
                setActiveTab("stats");
                fetchReports();
              }}
            >
              📈 Statistics
            </button>
          </div>
        </div>
      </div>

      {activeTab === "revenue" && revenueReport && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">💰 Revenue Report</h5>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="text-center">
                      <h2 className="text-success">
                        ₹{revenueReport.totalRevenue || 0}
                      </h2>
                      <p className="text-muted">Total Revenue</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h2 className="text-info">
                        ₹{revenueReport.thisMonthRevenue || 0}
                      </h2>
                      <p className="text-muted">This Month</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h2 className="text-primary">
                        {revenueReport.totalOrders || 0}
                      </h2>
                      <p className="text-muted">Total Orders</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h2 className="text-warning">
                        ₹{revenueReport.avgOrderValue || 0}
                      </h2>
                      <p className="text-muted">Avg Order Value</p>
                    </div>
                  </div>
                </div>

                <hr />

                <h5>Revenue by Restaurant</h5>
                {revenueReport.byRestaurant &&
                  revenueReport.byRestaurant.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Restaurant</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueReport.byRestaurant.map((r, idx) => (
                          <tr key={idx}>
                            <td>{r.restaurantName}</td>
                            <td>{r.orderCount}</td>
                            <td>₹{r.revenue}</td>
                            <td>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${
                                      (r.revenue /
                                        revenueReport.totalRevenue) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "restaurants" && (
        <div className="row">
          {topRestaurants.length > 0 ? (
            topRestaurants.map((restaurant, idx) => (
              <div key={idx} className="col-md-4 mb-4">
                <div className="card shadow-lg">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">
                      #{idx + 1} {restaurant.name}
                    </h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Rating:</strong> ⭐{restaurant.rating}
                    </p>
                    <p>
                      <strong>Orders:</strong> {restaurant.orderCount}
                    </p>
                    <p>
                      <strong>Revenue:</strong> ₹{restaurant.revenue}
                    </p>
                    <p>
                      <strong>Avg Order Value:</strong> ₹
                      {(restaurant.revenue / restaurant.orderCount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">No data available</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "dishes" && (
        <div className="row">
          {topDishes.length > 0 ? (
            <div className="col-12">
              <div className="card shadow-lg">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">🍽️ Top 10 Dishes</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Dish Name</th>
                          <th>Restaurant</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topDishes.map((dish, idx) => (
                          <tr key={idx}>
                            <td>
                              <strong>{idx + 1}</strong>
                            </td>
                            <td>{dish.name}</td>
                            <td>{dish.restaurantName}</td>
                            <td>{dish.orderCount}</td>
                            <td>₹{dish.revenue}</td>
                            <td>⭐{dish.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-12">
              <div className="alert alert-info">No data available</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "stats" && stats && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-warning text-white">
                <h5 className="mb-0">📈 System Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-primary">{stats.totalUsers}</h3>
                        <p className="text-muted">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-success">
                          {stats.totalRestaurants}
                        </h3>
                        <p className="text-muted">Restaurants</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-info">{stats.totalOrders}</h3>
                        <p className="text-muted">Total Orders</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-warning">
                          ₹{stats.totalRevenue}
                        </h3>
                        <p className="text-muted">Total Revenue</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-danger">
                          ₹{stats.platformCommission}
                        </h3>
                        <p className="text-muted">Platform Commission</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3>₹{stats.avgOrderValue}</h3>
                        <p className="text-muted">Avg Order Value</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <h5>Additional Statistics</h5>
                <ul>
                  <li>
                    <strong>Active Users:</strong> {stats.activeUsers}
                  </li>
                  <li>
                    <strong>Active Restaurants:</strong>{" "}
                    {stats.activeRestaurants}
                  </li>
                  <li>
                    <strong>Pending Restaurants:</strong>{" "}
                    {stats.pendingRestaurants}
                  </li>
                  <li>
                    <strong>Completed Orders This Month:</strong>{" "}
                    {stats.completedOrdersThisMonth}
                  </li>
                  <li>
                    <strong>Revenue This Month:</strong> ₹
                    {stats.revenueThisMonth}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
