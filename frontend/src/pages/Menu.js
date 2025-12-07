import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useToast } from "../components/Toast";
import { BsStar, BsClock, BsDash, BsPlus, BsHeart, BsHeartFill } from "react-icons/bs";

export default function Menu() {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const loadMenu = useCallback(async () => {
    try {
      console.log("Loading menu for restaurant:", restaurantId);
      const res = await restaurantService.getRestaurantMenu(restaurantId);
      console.log("Menu data:", res.data);
      setMenuItems(res.data);
    } catch (error) {
      console.error("Error loading menu:", error);
      alert("Failed to load menu. Please check console for details.");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const handleAddToCart = (item) => {
    const quantity = parseInt(quantities[item._id]) || 1;
    addToCart(item, quantity);
    setQuantities({ ...quantities, [item._id]: 1 });
    addToast(`${item.name} added to cart!`, "success");
  };

  const incrementQuantity = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1
    }));
  };

  const decrementQuantity = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) - 1)
    }));
  };

  if (loading) return <div className="text-center p-5">Loading menu...</div>;

  return (
    <div className="container my-5">
      <div className="mb-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>&lt; Back</button>
      </div>

      <h2 className="mb-4">🍽️ Restaurant Menu</h2>

      {menuItems.length === 0 ? (
        <div className="alert alert-info">No menu items available</div>
      ) : (
        <div className="row">
          {menuItems.map(item => (
            <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
              <div className="card h-100 position-relative">
                {/* Favorite Button */}
                {user && user.role === "customer" && (
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
                      width: '35px',
                      height: '35px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                  >
                    {isFavorite(item._id) ? (
                      <BsHeartFill size={16} className="text-danger" />
                    ) : (
                      <BsHeart size={16} className="text-muted" />
                    )}
                  </button>
                )}

                {item.image && (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    height="200"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted">{item.description}</p>
                  <p className="text-primary fw-bold">₹{item.price}</p>
                  <p className="text-sm"><BsClock className="me-1" /> {item.preparationTime} mins</p>
                  {item.rating > 0 && (
                    <p className="text-warning"><BsStar className="me-1" /> {item.rating.toFixed(1)}</p>
                  )}
                </div>
                <div className="card-footer">
                  {user ? (
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => decrementQuantity(item._id)}
                          disabled={(quantities[item._id] || 1) <= 1}
                        >
                          <BsDash />
                        </button>
                        <span className="mx-3 fw-bold">{quantities[item._id] || 1}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => incrementQuantity(item._id)}
                        >
                          <BsPlus />
                        </button>
                      </div>
                      <button
                        className="btn btn-success"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? "Add to Cart" : "Not Available"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate("/login")}
                    >
                      Login to Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
