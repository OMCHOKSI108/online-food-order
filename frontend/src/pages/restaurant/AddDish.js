import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { BsArrowLeft, BsPlus, BsImage, BsCheck, BsX, BsStar, BsFire, BsTree, BsInfoCircle, BsEnvelope, BsPhone, BsGeoAlt, BsClock } from "react-icons/bs";
import "./AddDish.css";

export default function AddDish() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    image: "",
    calories: "",
    isVegetarian: true,
    isVegan: false,
    spiceLevel: "Medium",
    allergens: []
  });

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const response = await restaurantService.getMyRestaurant();
      setRestaurant(response.data);
    } catch (err) {
      setError("Failed to load restaurant data");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAllergenChange = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime) || 30,
        calories: formData.calories ? parseInt(formData.calories) : undefined
      };

      await restaurantService.addFoodItem(submitData);
      setSuccess(true);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        preparationTime: "",
        image: "",
        calories: "",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Medium",
        allergens: []
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add dish");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Appetizers", "Main Course", "Desserts", "Beverages",
    "Snacks", "Salads", "Soups", "Pizza", "Burger", "Pasta"
  ];

  const spiceLevels = ["None", "Low", "Medium", "Medium-High", "High"];

  const commonAllergens = [
    "Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Fish", "Shellfish", "Sesame"
  ];

  return (
    <div className="add-dish-container">
      <div className="add-dish-header">
        <div className="header-content">
          <button
            className="back-button"
            onClick={() => navigate('/restaurant/dashboard')}
          >
            <BsArrowLeft /> Back to Dashboard
          </button>
          <div className="header-title">
            <BsPlus className="title-icon" />
            <h1>Add New Dish</h1>
          </div>
        </div>
      </div>

      <div className="add-dish-content">
        {/* Restaurant Info Sidebar */}
        {restaurant && (
          <div className="restaurant-info-card">
            <div className="info-header">
              <BsInfoCircle className="info-icon" />
              <h3>Restaurant Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <BsGeoAlt className="item-icon" />
                <div>
                  <strong>Restaurant</strong>
                  <p>{restaurant.name}</p>
                </div>
              </div>
              <div className="info-item">
                <BsEnvelope className="item-icon" />
                <div>
                  <strong>Email</strong>
                  <p>{restaurant.email}</p>
                </div>
              </div>
              <div className="info-item">
                <BsPhone className="item-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>{restaurant.phone}</p>
                </div>
              </div>
              <div className="info-item">
                <BsClock className="item-icon" />
                <div>
                  <strong>Status</strong>
                  <p className={`status-${restaurant.approvalStatus}`}>
                    {restaurant.approvalStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="dish-form-card">
          <div className="form-header">
            <h2>Add New Dish</h2>
          </div>

          <div className="form-content">
            {/* Success Message */}
            {success && (
              <div className="success-message">
                <BsCheck className="success-icon" />
                <span>Dish added successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dish Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter dish name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe your dish..."
                  />
                </div>
              </div>

              {/* Pricing & Timing */}
              <div className="form-section">
                <h3 className="section-title">Pricing & Timing</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preparation Time (minutes) *</label>
                    <input
                      type="number"
                      name="preparationTime"
                      className="form-input"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Information */}
              <div className="form-section">
                <h3 className="section-title">Dietary Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Spice Level</label>
                    <select
                      name="spiceLevel"
                      className="form-select"
                      value={formData.spiceLevel}
                      onChange={handleChange}
                    >
                      {spiceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Calories (optional)</label>
                    <input
                      type="number"
                      name="calories"
                      className="form-input"
                      value={formData.calories}
                      onChange={handleChange}
                      min="0"
                      placeholder="250"
                    />
                  </div>
                </div>

                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                    />
                    <BsTree className="checkbox-icon veg" />
                    Vegetarian
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleChange}
                    />
                    <BsTree className="checkbox-icon vegan" />
                    Vegan
                  </label>
                </div>
              </div>

              {/* Allergens */}
              <div className="form-section allergens-section">
                <h3 className="section-title">Allergens (optional)</h3>
                <div className="allergens-grid">
                  {commonAllergens.map(allergen => (
                    <label key={allergen} className={`allergen-tag ${formData.allergens.includes(allergen) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={() => handleAllergenChange(allergen)}
                      />
                      {allergen}
                    </label>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="form-section">
                <h3 className="section-title">Dish Image</h3>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    type="url"
                    name="image"
                    className="form-input"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/restaurant/dashboard')}>
                  <BsX /> Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner" />
                      Adding Dish...
                    </>
                  ) : (
                    <>
                      <BsPlus /> Add Dish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}