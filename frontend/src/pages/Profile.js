import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BsCheck, BsBox, BsShieldLock, BsDoorOpen } from "react-icons/bs";
import '../Profile.css';

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
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="rounded-circle d-flex align-items-center justify-content-center">
              <span>
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <p>{user?.role?.toUpperCase()}</p>
          </div>
          <div className="profile-info">
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
            <small>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</small>
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type} mb-4`}>
            {message.text}
          </div>
        )}

        <form className="profile-form-grid" onSubmit={handleSubmit}>
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
            <small className="text-muted">Email cannot be changed</small>
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
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Updating..." : (
              <>
                <BsCheck className="me-1" />
                Update Profile
              </>
            )}
          </button>
        </form>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <h6>Total Orders</h6>
            <h3>{user?.totalOrders || 0}</h3>
          </div>
          <div className="profile-stat-card">
            <h6>Total Spent</h6>
            <h3>₹{user?.totalSpent || 0}</h3>
          </div>
          <div className="profile-stat-card">
            <h6>Member Since</h6>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>

        <div className="profile-actions">
          <h5>Account Actions</h5>
          <div>
            <button
              className="btn-outline"
              onClick={() => navigate("/orders")}
            >
              <BsBox className="me-1" />
              View Orders
            </button>
            <button
              className="btn-outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              <BsShieldLock className="me-1" />
              Change Password
            </button>
          </div>

          {showPassword && (
            <div className="password-form">
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
          )}

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            <BsDoorOpen className="me-1" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
