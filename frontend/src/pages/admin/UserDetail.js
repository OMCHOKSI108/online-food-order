import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import {
  BsArrowLeft,
  BsPerson,
  BsEnvelope,
  BsPhone,
  BsGeoAlt,
  BsCalendar,
  BsCurrencyRupee,
  BsBox,
  BsToggleOn,
  BsToggleOff,
  BsBell,
  BsTrash,
  BsEye,
  BsGraphUp,
  BsShieldCheck,
  BsExclamationTriangle,
  BsCheckCircle,
  BsXCircle,
  BsClock
} from "react-icons/bs";

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info"
  });

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserDetails(userId);
      setUserData(response.data);
    } catch (err) {
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleToggleStatus = async () => {
    try {
      await adminService.toggleUserStatus(userId);
      alert(`User ${userData.user.isActive ? 'deactivated' : 'activated'} successfully!`);
      fetchUserDetails();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(userId);
        alert("User deleted successfully!");
        navigate("/admin/users");
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleSendNotification = async () => {
    try {
      await adminService.sendUserNotification(userId, notificationData);
      alert("Notification sent successfully!");
      setNotificationModal(false);
      setNotificationData({ title: "", message: "", type: "info" });
    } catch (err) {
      alert("Failed to send notification");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                {/* Header Skeleton */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <div className="loading-skeleton" style={{width: '250px', height: '32px', borderRadius: '4px', marginBottom: '8px'}}></div>
                    <div className="loading-skeleton" style={{width: '180px', height: '16px', borderRadius: '4px'}}></div>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="loading-skeleton" style={{width: '120px', height: '38px', borderRadius: '6px'}}></div>
                    <div className="loading-skeleton" style={{width: '100px', height: '38px', borderRadius: '6px'}}></div>
                    <div className="loading-skeleton" style={{width: '110px', height: '38px', borderRadius: '6px'}}></div>
                  </div>
                </div>

                {/* Profile and Contact Skeleton */}
                <div className="row mb-4">
                  <div className="col-lg-4 mb-3">
                    <div className="card shadow-lg border-0" style={{height: '300px'}}>
                      <div className="card-body text-center p-4">
                        <div className="loading-skeleton mx-auto mb-3" style={{width: '100px', height: '100px', borderRadius: '50%'}}></div>
                        <div className="loading-skeleton mb-2" style={{width: '150px', height: '24px', borderRadius: '4px', margin: '0 auto'}}></div>
                        <div className="loading-skeleton mb-3" style={{width: '120px', height: '16px', borderRadius: '4px', margin: '0 auto'}}></div>
                        <div className="d-flex justify-content-center gap-2">
                          <div className="loading-skeleton" style={{width: '80px', height: '24px', borderRadius: '12px'}}></div>
                          <div className="loading-skeleton" style={{width: '70px', height: '24px', borderRadius: '12px'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mb-3">
                    <div className="card shadow-lg border-0" style={{height: '300px'}}>
                      <div className="card-body p-4">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className="loading-skeleton mb-3" style={{width: '100%', height: '20px', borderRadius: '4px'}}></div>
                            <div className="loading-skeleton mb-3" style={{width: '100%', height: '20px', borderRadius: '4px'}}></div>
                          </div>
                          <div className="col-md-6">
                            <div className="loading-skeleton mb-3" style={{width: '100%', height: '20px', borderRadius: '4px'}}></div>
                            <div className="loading-skeleton" style={{width: '100%', height: '20px', borderRadius: '4px'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="row mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-md-3 mb-3">
                      <div className="card shadow-lg border-0" style={{height: '140px'}}>
                        <div className="card-body text-center p-4">
                          <div className="loading-skeleton mx-auto mb-3" style={{width: '32px', height: '32px', borderRadius: '50%'}}></div>
                          <div className="loading-skeleton mb-2" style={{width: '60px', height: '28px', borderRadius: '4px', margin: '0 auto'}}></div>
                          <div className="loading-skeleton" style={{width: '80px', height: '16px', borderRadius: '4px', margin: '0 auto'}}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orders Table Skeleton */}
                <div className="card shadow-lg border-0">
                  <div className="card-body p-0">
                    <div className="loading-skeleton mb-3" style={{width: '200px', height: '24px', borderRadius: '4px', margin: '20px'}}></div>
                    <div className="px-4 pb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="row mb-3">
                          <div className="col-2"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                          <div className="col-3"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                          <div className="col-2"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                          <div className="col-2"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                          <div className="col-2"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                          <div className="col-1"><div className="loading-skeleton" style={{width: '100%', height: '16px', borderRadius: '4px'}}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <div className="alert alert-danger d-flex align-items-center">
                  <BsExclamationTriangle className="me-3" size={24} />
                  <div>
                    <h5 className="alert-heading mb-1">Error Loading User</h5>
                    <p className="mb-0">{error || "User not found"}</p>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary btn-lg px-4"
                    onClick={() => navigate("/admin/users")}
                  >
                    <BsArrowLeft className="me-2" />
                    Back to Users
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, contribution } = userData;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'restaurant': return 'success';
      case 'superadmin': return 'warning';
      default: return 'info';
    }
  };

  const getStatusIcon = (isActive) => isActive ? <BsCheckCircle /> : <BsXCircle />;
  const getStatusColor = (isActive) => isActive ? 'success' : 'danger';

  return (
    <div className="container-fluid my-4">
      {/* Header Section */}
      <div className="row mb-4 animate-slide-down">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1 d-flex align-items-center gradient-text">
                <BsPerson className="me-3" size={32} />
                User Management
              </h1>
              <p className="text-muted mb-0">Detailed view of user information and activity</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => navigate("/admin/users")}
              >
                <BsArrowLeft className="me-2" />
                Back to Users
              </button>
              <button
                className="btn btn-info d-flex align-items-center"
                onClick={() => setNotificationModal(true)}
              >
                <BsBell className="me-2" />
                Send Notice
              </button>
              <button
                className={`btn btn-${user.isActive ? 'warning' : 'success'} d-flex align-items-center`}
                onClick={handleToggleStatus}
              >
                {user.isActive ? <BsToggleOff className="me-2" /> : <BsToggleOn className="me-2" />}
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                className="btn btn-danger d-flex align-items-center"
                onClick={handleDeleteUser}
              >
                <BsTrash className="me-2" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="card shadow-lg border-0 h-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
            <div className="card-body text-center p-4">
              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center text-white fw-bold avatar-container"
                style={{
                  width: '100px',
                  height: '100px',
                  background: user.profilePicture ? `url(${user.profilePicture})` : 'rgba(255,255,255,0.2)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '50%',
                  fontSize: '28px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {!user.profilePicture && user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h3 className="gradient-text mb-2">{user.name}</h3>
              <p className="mb-3 opacity-75">{user.email}</p>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className={`badge bg-${getRoleColor(user.role)} fs-6 px-3 py-2`}>
                  <BsShieldCheck className="me-1" />
                  {user.role.toUpperCase()}
                </span>
                <span className={`badge bg-${getStatusColor(user.isActive)} fs-6 px-3 py-2`}>
                  {getStatusIcon(user.isActive)}
                  <span className="ms-1">{user.isActive ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
              <div className="mt-4">
                <small className="opacity-75">
                  Member since {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0 d-flex align-items-center">
                <BsPerson className="me-2" />
                Contact Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <BsEnvelope className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email Address</small>
                      <strong>{user.email}</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <BsPhone className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Phone Number</small>
                      <strong>{user.phone || 'Not provided'}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <BsGeoAlt className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Address</small>
                      <strong>{user.address || 'Not provided'}</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <BsCalendar className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Join Date</small>
                      <strong>{new Date(userData.joinedDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-lg border-0 text-center h-100 stat-card animate-delay-1" style={{background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: 'white'}}>
            <div className="card-body p-4">
              <BsBox className="mb-3 icon-bounce" size={32} />
              <h2 className="mb-1 counter">{contribution.totalOrders}</h2>
              <p className="mb-0 opacity-75">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-lg border-0 text-center h-100 stat-card animate-delay-2" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'white'}}>
            <div className="card-body p-4">
              <BsCurrencyRupee className="mb-3 icon-bounce" size={32} />
              <h2 className="mb-1 counter">
                ₹{user.role === 'customer' ? contribution.totalSpent : contribution.totalEarnings}
              </h2>
              <p className="mb-0 opacity-75">
                {user.role === 'customer' ? 'Total Spent' : 'Total Earnings'}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-lg border-0 text-center h-100 stat-card animate-delay-3" style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: 'white'}}>
            <div className="card-body p-4">
              <BsClock className="mb-3 icon-bounce" size={32} />
              <h2 className="mb-1 counter">
                {user.role === 'customer' ? contribution.ordersAsCustomer.length : contribution.ordersAsRestaurant.length}
              </h2>
              <p className="mb-0 opacity-75">Recent Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-lg border-0 text-center h-100 stat-card animate-delay-4" style={{background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', color: 'white'}}>
            <div className="card-body p-4">
              <BsGraphUp className="mb-3 icon-bounce" size={32} />
              <h2 className="mb-1 counter">
                ₹{Math.round((user.role === 'customer' ? contribution.totalSpent : contribution.totalEarnings) / Math.max(contribution.totalOrders, 1))}
              </h2>
              <p className="mb-0 opacity-75">Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-success text-white">
              <h5 className="mb-0 d-flex align-items-center">
                <BsBox className="me-2" />
                Recent Orders ({user.role === 'customer' ? contribution.ordersAsCustomer.length : contribution.ordersAsRestaurant.length})
              </h5>
            </div>
            <div className="card-body p-0">
              {user.role === 'customer' && contribution.ordersAsCustomer.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Order ID</th>
                        <th className="border-0">Restaurant</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Date</th>
                        <th className="border-0 pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contribution.ordersAsCustomer.slice(0, 10).map((order) => (
                        <tr key={order._id} className="border-bottom border-light">
                          <td className="ps-4">
                            <code className="text-muted">#{order._id.substring(0, 8)}</code>
                          </td>
                          <td>
                            <strong>{order.restaurant?.name || 'Unknown'}</strong>
                          </td>
                          <td>
                            <span className="badge bg-success fs-6 px-3 py-2">
                              <BsCurrencyRupee className="me-1" />
                              {order.totalAmount}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} fs-6 px-3 py-1`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </small>
                          </td>
                          <td className="pe-4">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/orders/${order._id}`)}
                              title="View Order Details"
                            >
                              <BsEye className="me-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : user.role === 'restaurant' && contribution.ordersAsRestaurant.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Order ID</th>
                        <th className="border-0">Customer</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Date</th>
                        <th className="border-0 pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contribution.ordersAsRestaurant.slice(0, 10).map((order) => (
                        <tr key={order._id} className="border-bottom border-light">
                          <td className="ps-4">
                            <code className="text-muted">#{order._id.substring(0, 8)}</code>
                          </td>
                          <td>
                            <strong>{order.user?.name || 'Unknown'}</strong>
                          </td>
                          <td>
                            <span className="badge bg-success fs-6 px-3 py-2">
                              <BsCurrencyRupee className="me-1" />
                              {order.totalAmount}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} fs-6 px-3 py-1`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </small>
                          </td>
                          <td className="pe-4">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/orders/${order._id}`)}
                              title="View Order Details"
                            >
                              <BsEye className="me-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <BsBox size={64} className="text-muted mb-3" />
                  <h5 className="text-muted">No Orders Found</h5>
                  <p className="text-muted">This user hasn't placed or received any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Notification Modal */}
      {notificationModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gradient-primary text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <BsBell className="me-2" />
                  Send Notice to {user.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setNotificationModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold">Notification Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                    placeholder="Enter an attention-grabbing title"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Message Content</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                    placeholder="Write your message here..."
                    style={{resize: 'vertical'}}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Notification Type</label>
                  <select
                    className="form-select form-select-lg"
                    value={notificationData.type}
                    onChange={(e) => setNotificationData({...notificationData, type: e.target.value})}
                  >
                    <option value="info">📘 Information</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="success">✅ Success</option>
                    <option value="danger">🚨 Important</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 p-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => setNotificationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg px-4"
                  onClick={handleSendNotification}
                >
                  <BsBell className="me-2" />
                  Send Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        /* Grid Animations */
        .stat-card {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Icon Bounce Animation */
        .icon-bounce {
          animation: bounceIn 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Counter Animation */
        .counter {
          animation: countUp 2s ease-out forwards;
          animation-delay: 0.8s;
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Card Hover Effects */
        .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInScale 0.6s ease-out forwards;
          opacity: 0;
          transform: scale(0.95);
        }

        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
        .card:nth-child(5) { animation-delay: 0.5s; }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }

        /* Button Animations */
        .btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        /* Table Row Animations */
        .table tbody tr {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
          transform: translateX(-30px);
        }

        .table tbody tr:nth-child(1) { animation-delay: 0.1s; }
        .table tbody tr:nth-child(2) { animation-delay: 0.2s; }
        .table tbody tr:nth-child(3) { animation-delay: 0.3s; }
        .table tbody tr:nth-child(4) { animation-delay: 0.4s; }
        .table tbody tr:nth-child(5) { animation-delay: 0.5s; }
        .table tbody tr:nth-child(6) { animation-delay: 0.6s; }
        .table tbody tr:nth-child(7) { animation-delay: 0.7s; }
        .table tbody tr:nth-child(8) { animation-delay: 0.8s; }
        .table tbody tr:nth-child(9) { animation-delay: 0.9s; }
        .table tbody tr:nth-child(10) { animation-delay: 1.0s; }

        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Avatar Pulse Animation */
        .avatar-container {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
          }
        }

        /* Loading Animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .spinner-border {
          animation: spin 1s linear infinite;
        }

        /* Gradient Text Animation */
        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Header Animation */
        .animate-slide-down {
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhanced Loading Animation */
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Modal Animation */
        .modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Badge Animations */
        .badge {
          animation: badgePop 0.5s ease-out forwards;
          animation-delay: 1s;
          opacity: 0;
          transform: scale(0.8);
        }

        @keyframes badgePop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive Animations */
        @media (max-width: 768px) {
          .stat-card {
            animation: slideInUp 0.6s ease-out forwards;
          }

          .animate-delay-1 { animation-delay: 0.1s; }
          .animate-delay-2 { animation-delay: 0.15s; }
          .animate-delay-3 { animation-delay: 0.2s; }
          .animate-delay-4 { animation-delay: 0.25s; }
        }

        /* Staggered Grid Animation for Mobile */
        @media (max-width: 576px) {
          .card {
            animation: slideInUp 0.5s ease-out forwards;
          }

          .card:nth-child(odd) {
            animation-delay: 0.1s;
          }

          .card:nth-child(even) {
            animation-delay: 0.2s;
          }
        }
      `}</style>
    </div>
  );
}