import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h3 className="text-center mb-4">🍴 Restaurants</h3>
      <div className="row">
        {restaurants.map(rest => (
          <div className="col-md-4 mb-4" key={rest._id}>
            <div className="card h-100 shadow-sm">
              {rest.image && (
                <img
                  src={rest.image}
                  className="card-img-top"
                  alt={rest.name}
                  height="180"
                />
              )}
              <div className="card-body text-center">
                <h5 className="card-title">{rest.name}</h5>
                <p>{rest.description}</p>
                <Link
                  to={`/menu/${rest._id}`}
                  className="btn btn-outline-primary"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
