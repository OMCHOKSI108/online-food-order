import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/restaurants/${id}/menu`)
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = item => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(c => c._id === item._id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart`);
  };

  return (
    <div className="container">
      <h3 className="text-center mb-4">Menu</h3>
      <div className="row">
        {menu.map(item => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm text-center">
              {item.image && (
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  height="180"
                />
              )}
              <div className="card-body">
                <h5>{item.name}</h5>
                <p>{item.description}</p>
                <p className="fw-bold">₹{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/cart" className="btn btn-success">
          Go to Cart
        </Link>
      </div>
    </div>
  );
};

export default Menu;
