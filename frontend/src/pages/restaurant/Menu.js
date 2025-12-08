import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { BsClipboard, BsStar, BsArrowLeft, BsPlus, BsPencil, BsCheck, BsTrash, BsX, BsImage } from "react-icons/bs";
import "./RestaurantMenu.css";

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    image: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const restaurantRes = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantRes.data);
      if (restaurantRes.data.approvalStatus === "approved") {
        const menuRes = await restaurantService.getMyMenu();
        setMenuItems(menuRes.data.items || []);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

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
      if (editingId) {
        await restaurantService.updateFoodItem(editingId, formData);
        alert("Item updated successfully!");
      } else {
        await restaurantService.addFoodItem(formData);
        alert("Item added successfully!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError("Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await restaurantService.deleteFoodItem(id);
        alert("Item deleted successfully!");
        fetchData();
      } catch (err) {
        setError("Failed to delete item");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      preparationTime: "",
      image: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="restaurant-menu-container">
        <div className="restaurant-menu-wrapper">
          <div className="menu-loading">
            <div className="spinner"></div>
            <p>Loading your menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (restaurant && restaurant.approvalStatus !== "approved") {
    return (
      <div className="restaurant-menu-container">
        <div className="restaurant-menu-wrapper">
          <div className="menu-empty-state">
            <BsClipboard size={64} />
            <h3>Restaurant Not Approved</h3>
            <p>Your restaurant must be approved by admin before you can manage your menu.</p>
            <div className="approval-status-notice">
              <small>
                Current status: {restaurant.approvalStatus?.toUpperCase()}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-menu-container">
      <div className="restaurant-menu-wrapper">
        {/* Header Section */}
        <div className="menu-header">
          <h1>
            <BsClipboard />
            Menu Management
          </h1>
          <div className="menu-stats">
            <div className="menu-stat-item">
              <span className="menu-stat-value">{menuItems.length}</span>
              <span className="menu-stat-label">Total Items</span>
            </div>
            <div className="menu-stat-item">
              <span className="menu-stat-value">{menuItems.filter(item => item.isAvailable).length}</span>
              <span className="menu-stat-label">Available</span>
            </div>
            <button
              className="add-item-button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <BsPlus />
              Add New Item
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Menu Items Grid */}
        {menuItems.length > 0 ? (
          <div className="menu-items-grid">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-status available">
                  {item.isAvailable ? "Available" : "Unavailable"}
                </div>
                <div className="menu-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <BsImage />
                  )}
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-title">{item.name}</h3>
                    <span className="menu-item-price">₹{item.price}</span>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-meta">
                    <span className="menu-item-category">{item.category}</span>
                    <div className="menu-item-rating">
                      <BsStar />
                      {item.rating || 0} ({item.totalRatings || 0})
                    </div>
                  </div>
                  <div className="menu-item-actions">
                    <button
                      className="menu-item-action-btn edit"
                      onClick={() => handleEdit(item)}
                      title="Edit item"
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="menu-item-action-btn delete"
                      onClick={() => handleDelete(item._id)}
                      title="Delete item"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="menu-empty-state">
            <BsClipboard size={64} />
            <h3>No menu items yet</h3>
            <p>Start building your menu by adding your first delicious dish!</p>
            <button
              className="add-item-button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <BsPlus />
              Add Your First Item
            </button>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="menu-form-overlay">
            <div className="menu-form-container">
              <div className="menu-form-header">
                <h2>
                  {editingId ? <BsPencil /> : <BsPlus />}
                  {editingId ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <button className="menu-form-close" onClick={resetForm}>
                  <BsX />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="menu-form-grid">
                  <div className="form-group">
                    <label className="form-label">Item Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter dish name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Side Dishes">Side Dishes</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Breads">Breads</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preparation Time (mins) *</label>
                    <input
                      type="number"
                      className="form-input"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      placeholder="15"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the dish, ingredients, and any special notes"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/dish-image.jpg"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="form-cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="form-submit-btn">
                    <BsCheck style={{marginRight: '0.5rem'}} />
                    {editingId ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
