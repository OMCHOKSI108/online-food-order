import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
    const sum = stored.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, []);

  const removeItem = id => {
    const updated = cart.filter(item => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    setTotal(updated.reduce((acc, i) => acc + i.price * i.quantity, 0));
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const items = cart.map(item => ({
        foodItem: item._id,
        quantity: item.quantity,
      }));
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { items, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      localStorage.removeItem("cart");
      setCart([]);
      setTotal(0);
    } catch (err) {
      alert("Order failed");
    }
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
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="btn btn-danger btn-sm"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h5>Total: ₹{total}</h5>
          <button onClick={placeOrder} className="btn btn-success">
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
