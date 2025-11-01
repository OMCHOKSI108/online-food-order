import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import { useCart } from "../hooks/useCart";

export default function Menu() {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  const loadMenu = async () => {
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
  };

  const handleAddToCart = (item) => {
    const quantity = parseInt(quantities[item._id]) || 1;
    addToCart(item, quantity);
    setQuantities({ ...quantities, [item._id]: 1 });
    alert("Item added to cart!");
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
              <div className="card h-100">
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
                  <p className="text-sm">⏱️ {item.preparationTime} mins</p>
                  {item.rating > 0 && (
                    <p className="text-warning">⭐ {item.rating.toFixed(1)}</p>
                  )}
                </div>
                <div className="card-footer">
                  <div className="input-group mb-2">
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={quantities[item._id] || 1}
                      onChange={(e) => setQuantities({ ...quantities, [item._id]: e.target.value })}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? "Add to Cart" : "Not Available"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
