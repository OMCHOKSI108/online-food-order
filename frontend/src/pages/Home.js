import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import { GiHamburger } from "react-icons/gi";
import { BsGeoAlt, BsStar, BsSearch, BsHeart, BsHeartFill } from "react-icons/bs";
import PopularDishes from "../components/PopularDishes";
import '../FeaturedRestaurants.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Surat"
  ];

  useEffect(() => {
    // Redirect authenticated users to their appropriate dashboard
    if (user) {
      if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin/dashboard");
      } else if (user.role === "restaurant") {
        navigate("/restaurant/dashboard");
      }
      // Customers stay on home page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Removed navigate from dependencies

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log("Loading data...");
      const [restaurantsRes, foodItemsRes] = await Promise.all([
        restaurantService.getAllRestaurants(),
        restaurantService.getAllFoodItems()
      ]);
      console.log("Restaurants data:", restaurantsRes.data);
      console.log("Food items data:", foodItemsRes.data);
      setFoodItems(foodItemsRes.data);
      setFilteredRestaurants(restaurantsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (userAddress.trim()) {
      // Store address in localStorage or context
      localStorage.setItem("userAddress", userAddress);
      localStorage.setItem("userCity", selectedCity);
      // Could navigate to restaurants or show success message
    }
  };

  const scrollRef = useRef();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Landing Section with Dark Blue Background */}
      <section
        className="py-5 position-relative"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
          minHeight: '85vh'
        }}
      >
        <div className="container-fluid px-4">
          <div className="row align-items-center justify-content-center">
            {/* Left Image */}
            <div className="col-lg-2 d-none d-lg-block pe-3">
              <div className="text-center">
                <img
                  src="/assets/left.avif"
                  alt="Food delivery"
                  className="img-fluid rounded shadow-lg"
                  style={{
                    maxHeight: '550px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) hue-rotate(15deg) saturate(1.2) brightness(1.1)',
                    transform: 'translateX(-10px)'
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/350x500/1a237e/ffffff?text=Left+Image";
                  }}
                />
              </div>
            </div>

            {/* Center Content */}
            <div className="col-lg-8 text-center text-white py-4">
              <h1 className="display-4 fw-bold mb-4">
                <GiHamburger className="me-3" />
                Delicious Food Delivered Fast
              </h1>
              <p className="lead mb-4">
                Order from your favorite restaurants and get it delivered to your doorstep
              </p>

              {/* Address Input Form */}
              <div className="bg-white rounded p-5 shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleAddressSubmit}>
                  <div className="mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <BsGeoAlt className="text-primary" />
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg border-start-0"
                        placeholder="Enter your complete delivery address"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        required
                        style={{ fontSize: '1.1rem' }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <select
                      className="form-select form-select-lg"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      required
                      style={{ fontSize: '1.1rem' }}
                    >
                      <option value="">Select your city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold">
                    <BsSearch className="me-2" size={20} />
                    Find Restaurants Near You
                  </button>
                </form>
              </div>
            </div>

            {/* Right Image */}
            <div className="col-lg-2 d-none d-lg-block ps-3">
              <div className="text-center">
                <img
                  src="/assets/right.avif"
                  alt="Food variety"
                  className="img-fluid rounded shadow-lg"
                  style={{
                    maxHeight: '550px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) hue-rotate(-15deg) saturate(1.3) brightness(1.05)',
                    transform: 'translateX(10px)'
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/350x500/1a237e/ffffff?text=Right+Image";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PopularDishes />

      {/* Food Items Showcase Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Popular Dishes</h2>
          
          {foodItems.length > 0 && (
            <div className="row">
              {foodItems.map(item => (
                <div className="col-lg-2 col-md-4 col-sm-6 mb-4" key={item._id}>
                  <div className="card h-100 shadow-sm food-item-card position-relative">
                    {/* Favorite Button */}
                    <button
                      className="btn position-absolute top-0 end-0 m-2 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}
                    >
                      {isFavorite(item._id) ? (
                        <BsHeartFill size={14} className="text-danger" />
                      ) : (
                        <BsHeart size={14} className="text-muted" />
                      )}
                    </button>

                    {item.image && (
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.name}
                        height="150"
                        style={{ objectFit: "contain", padding: '10px' }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200x150/1a237e/ffffff?text=No+Image";
                        }}
                      />
                    )}
                    <div className="card-body text-center">
                      <h6 className="card-title text-white">{item.name}</h6>
                      <p className="text-warning fw-bold">₹{item.price}</p>
                      <p className="text-light small">{item.restaurant?.name}</p>
                      {item.rating > 0 && (
                        <p className="text-warning small">
                          <BsStar className="me-1" />
                          {item.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <div className="card-footer bg-transparent p-2">
                      <button
                        className="btn btn-warning btn-sm w-100"
                        onClick={() => navigate(`/menu/${item.restaurant._id}`)}
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="featured-restaurants-section">
        <div className="container">
          <h2 className="featured-title">Discover best restaurants near you</h2>
          <div className="restaurants-scroll-container">
            <div className="restaurants-carousel" ref={scrollRef}>
              {filteredRestaurants.map(restaurant => (
                <div key={restaurant._id} className="restaurant-card-carousel">
                  {restaurant.image && (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200/1a237e/ffffff?text=No+Image";
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text text-muted">{restaurant.description}</p>
                    <p className="text-sm">
                      <BsGeoAlt className="me-1" />
                      {restaurant.address}
                    </p>
                    {restaurant.rating > 0 && (
                      <p className="text-warning">
                        <BsStar className="me-1" />
                        {restaurant.rating.toFixed(1)}
                      </p>
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
              ))}
            </div>
            <button className="restaurants-arrow-button left" onClick={scrollLeft}>&lt;</button>
            <button className="restaurants-arrow-button right" onClick={scrollRight}>&gt;</button>
          </div>
        </div>
      </section>
    </div>
  );
}
