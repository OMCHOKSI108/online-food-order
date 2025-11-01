import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Checkout() {
  const { cart, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-info text-center">
          Your cart is empty. <button className="btn btn-link" onClick={() => navigate("/")}>Start shopping</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const items = cart.map(item => ({
        foodItem: item.foodItem._id,
        quantity: item.quantity,
        price: item.foodItem.price
      }));

      const res = await axios.post("http://localhost:5000/api/orders", {
        items,
        deliveryAddress,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("Order created:", res.data);
      console.log("Order ID:", res.data.order?._id || res.data._id);
      clearCart();
      navigate(`/payment/${res.data.order?._id || res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">🛒 Checkout</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.foodItem._id}>
                        <td>{item.foodItem.name}</td>
                        <td>₹{item.foodItem.price}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.foodItem.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Delivery Details</h5>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>

                <div className="mb-3">
                  <p className="mb-1"><strong>Total Amount:</strong> ₹{getTotalAmount().toFixed(2)}</p>
                  <p className="text-muted small">Free delivery</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}