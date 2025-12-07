import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { BsClipboard,BsStar, BsArrowLeft, BsPlus, BsPencil, BsCheck, BsTrash } from "react-icons/bs";

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
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (restaurant && restaurant.approvalStatus !== "approved") {
    return (
      <div className="container my-5">
        <div className="alert alert-warning text-center">
          <h4>Restaurant Not Approved</h4>
          <p>Your restaurant must be approved by admin before you can manage your menu.</p>
          <p>Current status: <strong>{restaurant.approvalStatus}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h2>
            <BsClipboard className="me-2" />
            Menu Management
          </h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/restaurant/dashboard")}
          >
            <BsArrowLeft className="me-1" />
            Back
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <BsPlus className="me-1" />
            Add New Item
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              {editingId ? (
                <>
                  <BsPencil className="me-2" />
                  Edit Item
                </>
              ) : (
                <>
                  <BsPlus className="me-2" />
                  Add New Item
                </>
              )}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Item Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Preparation Time (mins) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    placeholder="15"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the dish"
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" className="btn btn-success">
                  {editingId ? (
                    <>
                      <BsCheck className="me-1" />
                      Update Item
                    </>
                  ) : (
                    <>
                      <BsCheck className="me-1" />
                      Add Item
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {menuItems.length > 0 ? (
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Menu Items ({menuItems.length})</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Prep Time</th>
                    <th>Rating</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.name}</strong>
                        <br />
                        <small className="text-muted">
                          {item.description.substring(0, 50)}...
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <strong>₹{item.price}</strong>
                      </td>
                      <td>{item.preparationTime} mins</td>
                      <td>
                        <BsStar className="me-1" />
                        {item.rating || 0} ({item.totalRatings || 0})
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            item.isAvailable ? "success" : "danger"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(item)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          <BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <h5>No menu items yet</h5>
          <p>Start by adding your first dish!</p>
          <button
            className="btn btn-success"
            onClick={() => setShowForm(true)}
          >
            <BsPlus className="me-1" />
            Add First Item
          </button>
        </div>
      )}
    </div>
  );
}
