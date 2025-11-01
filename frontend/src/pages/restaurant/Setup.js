import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import restaurantService from "../../services/restaurantService";

export default function RestaurantSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    cuisineType: "",
    image: "",
  });

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
      setError(null);

      const response = await restaurantService.registerRestaurant(formData);
      alert(
        "Restaurant registered successfully! Awaiting admin approval."
      );
      navigate("/restaurant/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">🍴 Restaurant Registration</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Restaurant Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your restaurant"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cuisine Type *</label>
                  <select
                    className="form-control"
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select cuisine type</option>
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Continental">Continental</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Multi-Cuisine">Multi-Cuisine</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter restaurant address"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Restaurant Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="alert alert-info">
                  <strong>Note:</strong> Your restaurant will be reviewed by our
                  admin team before going live. You'll be notified once
                  approved.
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "✓ Register Restaurant"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg w-100 mt-2"
                  onClick={() => navigate("/restaurant/dashboard")}
                >
                  Back
                </button>
              </form>
            </div>
          </div>

          <div className="alert alert-warning mt-4">
            <h6>📋 Required Information</h6>
            <ul>
              <li>Valid restaurant name and description</li>
              <li>Accurate address for food delivery</li>
              <li>Phone number for customer contact</li>
              <li>Cuisine type (helps customers search)</li>
              <li>Restaurant image (optional, improves visibility)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
