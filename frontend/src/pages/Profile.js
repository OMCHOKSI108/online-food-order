import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  BsCheck,
  BsBox,
  BsShieldLock,
  BsDoorOpen,
  BsGeoAlt,
  BsPhone,
  BsEnvelope,
  BsCalendar,
  BsStar,
  BsCurrencyRupee,
  BsMap,
  BsPinMap,
  BsBuilding,
  BsClock,
  BsAward,
  BsGraphUp
} from "react-icons/bs";
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
  const [activeTab, setActiveTab] = useState('profile');
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

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

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/me/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      } else {
        console.error('Failed to fetch user statistics');
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'restaurant': return 'success';
      case 'superadmin': return 'warning';
      default: return 'info';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <BsShieldLock />;
      case 'restaurant': return <BsBuilding />;
      default: return <BsStar />;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-main">
        {/* Left Side - User Data */}
        <div className="profile-left">
          <div className="profile-card animate-slide-in-left">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    <span className="avatar-text">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="avatar-info">
                    <h3 className="user-name">{user?.name}</h3>
                    <span className={`role-badge bg-${getRoleColor(user?.role)}`}>
                      {getRoleIcon(user?.role)}
                      <span className="ms-1">{user?.role?.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="profile-tabs">
                <button
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <BsStar className="me-2" />
                  Profile
                </button>
                <button
                  className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  <BsGraphUp className="me-2" />
                  Statistics
                </button>
                <button
                  className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <BsShieldLock className="me-2" />
                  Security
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {message && (
                <div className={`alert alert-${message.type} animate-fade-in`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="profile-form-section animate-fade-in">
                  <h4 className="section-title">Personal Information</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          <BsStar className="me-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <BsEnvelope className="me-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-input disabled"
                          name="email"
                          value={formData.email}
                          disabled
                        />
                        <small className="form-hint">Email cannot be changed</small>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <BsPhone className="me-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-input"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          <BsGeoAlt className="me-2" />
                          Delivery Address
                        </label>
                        <textarea
                          className="form-textarea"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Enter your full delivery address"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary animate-pulse"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <BsCheck className="me-2" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="stats-section animate-fade-in">
                  <h4 className="section-title">Your Activity</h4>
                  {statsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner mx-auto"></div>
                      <p className="mt-2">Loading statistics...</p>
                    </div>
                  ) : (
                    <>
                      <div className="stats-grid">
                        <div className="stat-card animate-bounce-in">
                          <div className="stat-icon">
                            <BsBox />
                          </div>
                          <div className="stat-info">
                            <h3 className="stat-number">{userStats?.totalOrders || 0}</h3>
                            <p className="stat-label">Total Orders</p>
                          </div>
                        </div>

                        <div className="stat-card animate-bounce-in delay-1">
                          <div className="stat-icon">
                            <BsCurrencyRupee />
                          </div>
                          <div className="stat-info">
                            <h3 className="stat-number">₹{userStats?.totalSpent || 0}</h3>
                            <p className="stat-label">Total Spent</p>
                          </div>
                        </div>

                        <div className="stat-card animate-bounce-in delay-2">
                          <div className="stat-icon">
                            <BsAward />
                          </div>
                          <div className="stat-info">
                            <h3 className="stat-number">{userStats?.membershipLevel || 'Bronze'}</h3>
                            <p className="stat-label">Membership</p>
                          </div>
                        </div>

                        <div className="stat-card animate-bounce-in delay-3">
                          <div className="stat-icon">
                            <BsCalendar />
                          </div>
                          <div className="stat-info">
                            <p className="stat-number">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                            <p className="stat-label">Member Since</p>
                          </div>
                        </div>
                      </div>

                      <div className="quick-actions">
                        <button
                          className="action-btn"
                          onClick={() => navigate("/orders")}
                        >
                          <BsBox className="me-2" />
                          View All Orders
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="security-section animate-fade-in">
                  <h4 className="section-title">Account Security</h4>

                  {!showPassword ? (
                    <div className="security-options">
                      <button
                        className="security-btn"
                        onClick={() => setShowPassword(true)}
                      >
                        <BsShieldLock className="me-2" />
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <div className="password-form animate-slide-down">
                      <h5>Change Password</h5>
                      <form>
                        <div className="form-group">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-input"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-input"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirm Password</label>
                          <input
                            type="password"
                            className="form-input"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setShowPassword(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn-warning"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="danger-zone">
                    <h5 className="danger-title">Danger Zone</h5>
                    <button
                      className="btn-danger"
                      onClick={handleLogout}
                    >
                      <BsDoorOpen className="me-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Map Animation */}
        <div className="profile-right">
          <div className="map-container animate-slide-in-right">
            <div className="map-header">
              <h4>
                <BsMap className="me-2" />
                Delivery Locations
              </h4>
              <p className="map-subtitle">Your food journey across the city</p>
            </div>

            <div className="map-visualization">
              {/* Animated Map Background */}
              <div className="map-background">
                <div className="map-coordinates">
                  <span className="coord-label">Lat: 28.6139° N</span>
                  <span className="coord-label">Lng: 77.2090° E</span>
                  <span className="coord-label">Zoom: 12x</span>
                </div>
                <div className="map-grid">
                  {/* Horizontal grid lines with coordinates */}
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={`h-${i}`} className="grid-line horizontal" style={{
                      top: `${i * 10}%`,
                      width: '100%',
                      height: '1px',
                      background: 'rgba(44, 62, 80, 0.15)',
                      position: 'absolute'
                    }}></div>
                  ))}
                  {/* Vertical grid lines with coordinates */}
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={`v-${i}`} className="grid-line vertical" style={{
                      left: `${i * 10}%`,
                      height: '100%',
                      width: '1px',
                      background: 'rgba(44, 62, 80, 0.15)',
                      position: 'absolute'
                    }}></div>
                  ))}
                  {/* Animated moving grid lines */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={`anim-${i}`} className="grid-line animated" style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}></div>
                  ))}
                </div>

                {/* Animated Location Pins */}
                <div className="location-pins">
                  {/* Home location pin */}
                  <div className="pin home-pin animate-bounce-in">
                    <BsPinMap />
                    <span className="pin-label">Home</span>
                  </div>

                  {/* Favorite restaurant pin */}
                  {userStats?.favoriteRestaurant && (
                    <div className="pin restaurant-pin animate-bounce-in delay-1">
                      <BsBuilding />
                      <span className="pin-label">{userStats.favoriteRestaurant.name}</span>
                    </div>
                  )}

                  {/* Last delivery pin */}
                  {userStats?.recentDeliveries && userStats.recentDeliveries.length > 0 && (
                    <div className="pin delivery-pin animate-bounce-in delay-2">
                      <BsBox />
                      <span className="pin-label">Last Order</span>
                    </div>
                  )}

                  {/* Additional delivery location pins based on recent orders */}
                  {userStats?.recentDeliveries && userStats.recentDeliveries.slice(0, 2).map((delivery, i) => (
                    <div key={`delivery-${i}`} className={`pin delivery-location-${i + 1} animate-bounce-in`} style={{
                      top: `${40 + i * 20}%`,
                      left: `${20 + i * 25}%`,
                      animationDelay: `${(i + 3) * 0.2}s`
                    }}>
                      <BsGeoAlt />
                      <span className="pin-label">{delivery.restaurantName.substring(0, 10)}...</span>
                    </div>
                  ))}
                </div>

                {/* Animated Route Lines */}
                <div className="route-lines">
                  {/* Route from home to favorite restaurant */}
                  <div className="route-line animate-draw-line"></div>
                  {/* Route from restaurant to delivery location */}
                  <div className="route-line animate-draw-line delay-1"></div>
                  {/* Additional routes based on delivery history */}
                  {userStats?.recentDeliveries && userStats.recentDeliveries.length > 1 && (
                    <div className="route-line animate-draw-line delay-2" style={{
                      width: '25%',
                      top: '45%',
                      left: '50%',
                      transform: 'rotate(135deg)'
                    }}></div>
                  )}
                </div>

                {/* Floating Food Icons */}
                <div className="floating-food">
                  <div className="food-icon animate-float">🍕</div>
                  <div className="food-icon animate-float delay-1">🍔</div>
                  <div className="food-icon animate-float delay-2">🍜</div>
                  <div className="food-icon animate-float delay-3">🥗</div>
                </div>
              </div>

              {/* Map Statistics */}
              <div className="map-stats">
                <div className="map-stat">
                  <BsGeoAlt className="stat-icon" />
                  <div>
                    <h5>{userStats?.savedAddresses || 0}</h5>
                    <p>Saved Addresses</p>
                  </div>
                </div>
                <div className="map-stat">
                  <BsBuilding className="stat-icon" />
                  <div>
                    <h5>{userStats?.restaurantsVisited || 0}</h5>
                    <p>Restaurants Visited</p>
                  </div>
                </div>
                <div className="map-stat">
                  <BsClock className="stat-icon" />
                  <div>
                    <h5>~{userStats?.avgDeliveryTime || 0}min</h5>
                    <p>Avg Delivery Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery History Preview */}
            <div className="delivery-history">
              <h5>Recent Deliveries</h5>
              <div className="delivery-list">
                {userStats?.recentDeliveries && userStats.recentDeliveries.length > 0 ? (
                  userStats.recentDeliveries.map((delivery, i) => (
                    <div key={delivery.id} className="delivery-item animate-slide-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="delivery-icon">
                        <BsBox />
                      </div>
                      <div className="delivery-info">
                        <p className="restaurant-name">{delivery.restaurantName}</p>
                        <p className="delivery-time">
                          ₹{delivery.totalAmount} • {new Date(delivery.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="delivery-status">
                        <span className={`status-badge ${delivery.status === 'delivered' ? 'delivered' : 'pending'}`}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3 text-muted">
                    <BsBox className="mb-2" size={24} />
                    <p>No deliveries yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
