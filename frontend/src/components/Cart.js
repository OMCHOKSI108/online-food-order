import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsX } from "react-icons/bs";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
    const sum = stored.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
    setTotal(sum);
  }, []);

  const removeItem = id => {
    const updated = cart.filter(item => item.foodItem._id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    setTotal(updated.reduce((acc, i) => acc + i.foodItem.price * i.quantity, 0));
  };

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Navigate to checkout page instead of placing order directly
    navigate("/checkout");
  };

  return (
    <div className="container">
      <h3 className="text-center mb-4">🛍️ Your Cart</h3>
      {cart.length === 0 ? (
        <h5 className="text-center">Cart is empty</h5>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.foodItem._id}>
                  <td>{item.foodItem.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.foodItem.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeItem(item.foodItem._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <BsX />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h5>Total: ₹{total}</h5>
          <button onClick={placeOrder} className="btn btn-success">
            {user ? "Proceed to Checkout" : "Sign In to Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
