import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      console.log("Loading restaurants...");
      const res = await restaurantService.getAllRestaurants();
      console.log("Restaurants data:", res.data);
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      alert("Failed to load restaurants. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredRestaurants(
      restaurants.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.address.toLowerCase().includes(term)
      )
    );
  };

  if (loading) return <div className="text-center p-5">Loading restaurants...</div>;

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <h2 className="text-center mb-4">🍔 Browse Restaurants</h2>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search restaurants by name, location..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="alert alert-info text-center">
          No restaurants found. Try a different search.
        </div>
      ) : (
        <div className="row">
          {filteredRestaurants.map(restaurant => (
            <div className="col-md-6 col-lg-4 mb-4" key={restaurant._id}>
              <div className="card h-100 shadow-sm restaurant-card">
                {restaurant.image && (
                  <img
                    src={restaurant.image}
                    className="card-img-top"
                    alt={restaurant.name}
                    height="200"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text text-muted">{restaurant.description}</p>
                  <p className="text-sm">📍 {restaurant.address}</p>
                  {restaurant.rating > 0 && (
                    <p className="text-warning">⭐ {restaurant.rating.toFixed(1)}</p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/menu/${restaurant._id}`)}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
