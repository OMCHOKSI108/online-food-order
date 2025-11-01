import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Update profile endpoint would be called here
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      setMessage({
        type: "danger",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">👤 My Profile</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-4 text-center">
                  <div className="profile-avatar">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: "120px", height: "120px", margin: "auto" }}
                    >
                      <span style={{ fontSize: "48px" }}>
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3">
                    <strong>{user?.role?.toUpperCase()}</strong>
                  </p>
                </div>

                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                      <small className="text-muted">
                        Email cannot be changed
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter your full address"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "✓ Update Profile"}
                    </button>
                  </form>
                </div>
              </div>

              <hr />

              <h5 className="mt-4">Account Statistics</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h6 className="text-muted">Total Orders</h6>
                      <h3>{user?.totalOrders || 0}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h6 className="text-muted">Total Spent</h6>
                      <h3>₹{user?.totalSpent || 0}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h6 className="text-muted">Member Since</h6>
                      <p>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="mt-4">Account Actions</h5>
              <div className="row">
                <div className="col-md-6">
                  <button
                    className="btn btn-info w-100"
                    onClick={() => navigate("/order-history")}
                  >
                    📦 View Orders
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    🔐 Change Password
                  </button>
                </div>
              </div>

              {showPassword && (
                <div className="card mt-3 border-warning">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-warning w-100"
                        onClick={() => setShowPassword(false)}
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <hr />

              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
