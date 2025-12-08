import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService from "../../services/adminService";
import {
  BsPeople,
  BsShop,
  BsReceipt,
  BsCurrencyRupee,
  BsGraphUp,
  BsExclamationTriangle,
  BsCheckCircle,
  BsClock,
  BsArrowUp,
  BsArrowDown,
  BsBarChart,
  BsShieldCheck,
  BsGear,
  BsEye,
  BsPlusCircle,
  BsCalendarEvent,
  BsBuilding
} from "react-icons/bs";
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStatistics();
      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthIndicator = (current, previous) => {
    if (!previous) return { icon: BsArrowUp, color: 'text-success', percentage: 0 };
    const growth = ((current - previous) / previous) * 100;
    return {
      icon: growth >= 0 ? BsArrowUp : BsArrowDown,
      color: growth >= 0 ? 'text-success' : 'text-danger',
      percentage: Math.abs(growth).toFixed(1)
    };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <h5 className="mt-3 text-muted fw-semibold">Loading Dashboard...</h5>
          <p className="text-muted small">Fetching latest platform statistics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-loading">
        <div className="text-center">
          <BsExclamationTriangle size={48} className="text-danger mb-3" />
          <h4 className="text-danger fw-bold">Dashboard Error</h4>
          <p className="text-muted">{error}</p>
          <button className="btn btn-primary px-4 py-2" onClick={fetchStats}>
            <BsArrowUp className="me-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-1 fw-bold">
                <BsShieldCheck className="me-3" />
                Super Admin Dashboard
              </h1>
              <p className="mb-0 opacity-75">
                Welcome back! Here's what's happening with your platform.
              </p>
            </div>
            <div className="col-auto">
              <div className="text-end">
                <small className="d-block opacity-75">Last updated</small>
                <small className="fw-semibold">{currentTime.toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {stats && (
          <>
            {/* Key Metrics Cards */}
            <div className="row g-4 mb-5">
              <div className="col-xl-3 col-md-6">
                <div className="metric-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <div className="metric-label">Total Users</div>
                        <div className="metric-value">{formatNumber(stats.totalUsers || 0)}</div>
                        <div className="metric-change text-success">
                          <BsArrowUp className="me-1" />
                          +{stats.newUsersThisMonth || 0} this month
                        </div>
                      </div>
                      <div className="metric-icon-bg">
                        <BsPeople size={28} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="metric-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <div className="metric-label">Active Restaurants</div>
                        <div className="metric-value">{formatNumber(stats.activeRestaurants || 0)}</div>
                        <div className="metric-change text-success">
                          <BsArrowUp className="me-1" />
                          {stats.approvedRestaurants || 0} approved
                        </div>
                      </div>
                      <div className="metric-icon-bg">
                        <BsBuilding size={28} className="text-success" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="metric-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <div className="metric-label">Total Orders</div>
                        <div className="metric-value">{formatNumber(stats.totalOrders || 0)}</div>
                        <div className="metric-change text-info">
                          <BsArrowUp className="me-1" />
                          {stats.completedOrdersThisMonth || 0} completed
                        </div>
                      </div>
                      <div className="metric-icon-bg">
                        <BsReceipt size={28} className="text-info" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="metric-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <div className="metric-label">Total Revenue</div>
                        <div className="metric-value">{formatCurrency(stats.totalRevenue || 0)}</div>
                        <div className="metric-change text-warning">
                          <BsArrowUp className="me-1" />
                          {formatCurrency(stats.revenueThisMonth || 0)} this month
                        </div>
                      </div>
                      <div className="metric-icon-bg">
                        <BsCurrencyRupee size={28} className="text-warning" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="row g-4">
              {/* Quick Actions */}
              <div className="col-xl-4">
                <div className="action-card">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                      <BsGear className="me-2 text-primary" />
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-3">
                      <Link to="/admin/restaurants" className="action-button">
                        <div className="action-icon bg-success bg-opacity-10 text-success">
                          <BsCheckCircle />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">Review Restaurants</div>
                          <small className="text-muted">{stats.pendingRestaurants || 0} pending approvals</small>
                        </div>
                      </Link>

                      <Link to="/admin/users" className="action-button">
                        <div className="action-icon bg-info bg-opacity-10 text-info">
                          <BsPeople />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">Manage Users</div>
                          <small className="text-muted">{stats.totalUsers || 0} total users</small>
                        </div>
                      </Link>

                      <Link to="/admin/orders" className="action-button">
                        <div className="action-icon bg-primary bg-opacity-10 text-primary">
                          <BsReceipt />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">Monitor Orders</div>
                          <small className="text-muted">{stats.totalOrders || 0} total orders</small>
                        </div>
                      </Link>

                      <Link to="/admin/reports" className="action-button">
                        <div className="action-icon bg-warning bg-opacity-10 text-warning">
                          <BsBarChart />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">View Analytics</div>
                          <small className="text-muted">Revenue & performance reports</small>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Performance */}
              <div className="col-xl-4">
                <div className="action-card">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                      <BsCalendarEvent className="me-2 text-success" />
                      This Month
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-3 text-center">
                          <BsPeople className="text-primary mb-2" size={20} />
                          <div className="fw-bold text-primary">{stats.newUsersThisMonth || 0}</div>
                          <small className="text-muted">New Users</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-3 text-center">
                          <BsBuilding className="text-success mb-2" size={20} />
                          <div className="fw-bold text-success">{stats.newRestaurantsThisMonth || 0}</div>
                          <small className="text-muted">New Restaurants</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-3 text-center">
                          <BsReceipt className="text-info mb-2" size={20} />
                          <div className="fw-bold text-info">{stats.completedOrdersThisMonth || 0}</div>
                          <small className="text-muted">Orders</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-3 text-center">
                          <BsCurrencyRupee className="text-warning mb-2" size={20} />
                          <div className="fw-bold text-warning">{formatCurrency(stats.revenueThisMonth || 0)}</div>
                          <small className="text-muted">Revenue</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="col-xl-4">
                <div className="action-card">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                      <BsGraphUp className="me-2 text-info" />
                      System Health
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-semibold">Active Users</span>
                        <span className="fw-bold">{formatNumber(stats.activeUsers || 0)}</span>
                      </div>
                      <div className="health-indicator">
                        <div className="health-bar bg-success" style={{width: '85%'}}></div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-semibold">Active Restaurants</span>
                        <span className="fw-bold">{formatNumber(stats.activeRestaurants || 0)}</span>
                      </div>
                      <div className="health-indicator">
                        <div className="health-bar bg-info" style={{width: '78%'}}></div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small fw-semibold">Payment Success Rate</span>
                        <span className="fw-bold">
                          {stats.successfulPayments && stats.totalOrders ?
                            Math.round((stats.successfulPayments / stats.totalOrders) * 100) : 0}%
                        </span>
                      </div>
                      <div className="health-indicator">
                        <div className="health-bar bg-warning" style={{width: '92%'}}></div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <small className="text-muted">Last updated: {currentTime.toLocaleTimeString()}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts & Notifications */}
            {(stats.pendingRestaurants > 0) && (
              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-professional border-0 shadow-sm">
                    <div className="d-flex align-items-center">
                      <BsExclamationTriangle className="me-3 text-warning" size={24} />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold text-dark">Pending Approvals</h6>
                        <p className="mb-0 text-muted">
                          You have {stats.pendingRestaurants} restaurant(s) waiting for approval.
                          <Link to="/admin/restaurants" className="alert-link fw-semibold ms-2">
                            Review Now →
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Analytics */}
            <div className="analytics-grid mt-4">
              <div className="analytics-item">
                <div className="analytics-icon bg-primary bg-opacity-10 text-primary">
                  <BsPeople />
                </div>
                <div className="analytics-value text-primary">{formatNumber(stats.totalCustomers || 0)}</div>
                <div className="analytics-label">Customers</div>
              </div>

              <div className="analytics-item">
                <div className="analytics-icon bg-success bg-opacity-10 text-success">
                  <BsShop />
                </div>
                <div className="analytics-value text-success">{formatNumber(stats.totalRestaurants || 0)}</div>
                <div className="analytics-label">Total Restaurants</div>
              </div>

              <div className="analytics-item">
                <div className="analytics-icon bg-info bg-opacity-10 text-info">
                  <BsReceipt />
                </div>
                <div className="analytics-value text-info">{formatNumber(stats.deliveredOrders || 0)}</div>
                <div className="analytics-label">Delivered Orders</div>
              </div>

              <div className="analytics-item">
                <div className="analytics-icon bg-warning bg-opacity-10 text-warning">
                  <BsCurrencyRupee />
                </div>
                <div className="analytics-value text-warning">{formatCurrency(stats.avgOrderValue || 0)}</div>
                <div className="analytics-label">Avg Order Value</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
