import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { BsHeart, BsHeartFill, BsArrowLeft, BsStar } from "react-icons/bs";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <BsHeart size={64} className="text-muted mb-4" />
          <h2 className="text-muted mb-3">No Favorites Yet</h2>
          <p className="text-muted mb-4">
            Start exploring restaurants and add items to your favorites by clicking the heart icon!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/")}
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <BsArrowLeft />
        </button>
        <div>
          <h2 className="mb-0">
            <BsHeartFill className="text-danger me-2" />
            My Favorites ({favorites.length})
          </h2>
          <p className="text-muted mb-0">Your favorite dishes</p>
        </div>
      </div>

      <div className="row">
        {favorites.map(item => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm position-relative">
              {/* Favorite Button */}
              <button
                className="btn position-absolute top-0 end-0 m-2 p-1"
                onClick={() => toggleFavorite(item)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BsHeartFill
                  size={16}
                  className={isFavorite(item._id) ? "text-danger" : "text-muted"}
                />
              </button>

              {/* Item Image */}
              {item.image && (
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  height="180"
                  style={{ objectFit: "cover" }}
                />
              )}

              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold">{item.name}</h6>
                <p className="text-primary fw-bold mb-1">₹{item.price}</p>

                {item.restaurant && (
                  <p className="text-muted small mb-2">
                    {item.restaurant.name}
                  </p>
                )}

                {item.rating > 0 && (
                  <div className="mb-2">
                    <BsStar className="text-warning me-1" />
                    <span className="small">{item.rating.toFixed(1)}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-sm mt-auto"
                  onClick={() => navigate(`/menu/${item.restaurant._id}`)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}