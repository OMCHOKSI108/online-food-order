import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BsTruck, BsShieldCheck, BsClock, BsCreditCard, BsGeoAlt, BsCheckCircle } from "react-icons/bs";

export default function Checkout() {
  const { cart, getTotalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
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

    if (!token) {
      setError("Please login to place an order");
      setLoading(false);
      return;
    }

    try {
      const items = cart.map(item => ({
        foodItem: item.foodItem._id,
        quantity: item.quantity,
        price: item.foodItem.price
      }));

      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders`, {
        items,
        deliveryAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Order created:", res.data);
      console.log("Order ID:", res.data.order?._id || res.data._id);
      clearCart();

      // Always redirect to payment page for payment method selection
      navigate(`/payment/${res.data.order?._id || res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 0; // Free delivery
  const taxAmount = getTotalAmount() * 0.05; // 5% tax
  const finalTotal = getTotalAmount() + taxAmount + deliveryFee;

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">
                <BsTruck className="me-3" />
                Secure Checkout
              </h1>
              <p className="lead text-muted">Complete your order with confidence</p>
            </div>

            <div className="row">
              {/* Order Summary */}
              <div className="col-lg-8 mb-4">
                <div className="card shadow-lg border-0">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <BsCheckCircle className="me-2" />
                      Order Summary
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Restaurant Info */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <h6 className="text-primary mb-2">Restaurant</h6>
                      <p className="mb-0 fw-bold">{cart[0]?.foodItem?.restaurant?.name}</p>
                      <small className="text-muted">{cart[0]?.foodItem?.restaurant?.address}</small>
                    </div>

                    {/* Items */}
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead className="table-light">
                          <tr>
                            <th>Item</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map(item => (
                            <tr key={item.foodItem._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={item.foodItem.image || "https://via.placeholder.com/50x50"}
                                    alt={item.foodItem.name}
                                    className="rounded me-3"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <strong>{item.foodItem.name}</strong>
                                    <br />
                                    <small className="text-muted">₹{item.foodItem.price} each</small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-primary">{item.quantity}</span>
                              </td>
                              <td className="text-end">₹{item.foodItem.price}</td>
                              <td className="text-end fw-bold">₹{(item.foodItem.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Total Breakdown */}
                    <div className="mt-4 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax (5%):</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Delivery:</span>
                        <span className="text-success">FREE</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total:</span>
                        <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment Section */}
              <div className="col-lg-4">
                {/* Delivery Address */}
                <div className="card shadow-lg border-0 mb-4">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <BsGeoAlt className="me-2" />
                      Delivery Address
                    </h5>
                  </div>
                  <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Delivery Address</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Enter your complete delivery address..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required
                        />
                        <div className="form-text">
                          Make sure the address is accurate for timely delivery
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <BsCreditCard className="me-2" />
                            Proceed to Payment
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Features & Rules */}
                <div className="card shadow-lg border-0">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                      <BsShieldCheck className="me-2" />
                      Why Choose Us?
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <BsShieldCheck className="text-success me-2" />
                        <span className="fw-bold">Secure Payment</span>
                      </div>
                      <small className="text-muted">256-bit SSL encryption for all transactions</small>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <BsClock className="text-warning me-2" />
                        <span className="fw-bold">Fast Delivery</span>
                      </div>
                      <small className="text-muted">30-45 minutes delivery guarantee</small>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <BsCheckCircle className="text-primary me-2" />
                        <span className="fw-bold">Quality Assured</span>
                      </div>
                      <small className="text-muted">Fresh ingredients, hygienic preparation</small>
                    </div>

                    <hr />

                    <div className="mb-2">
                      <h6 className="text-primary">Order Rules:</h6>
                      <ul className="list-unstyled small">
                        <li className="mb-1">• Minimum order value: ₹100</li>
                        <li className="mb-1">• Delivery within 5km radius</li>
                        <li className="mb-1">• Cash on Delivery available</li>
                        <li className="mb-1">• Free cancellation within 2 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}