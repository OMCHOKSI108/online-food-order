import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import orderService from "../services/orderService";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data.order);
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.processPayment(orderId, {
        paymentMethod,
        simulateFailure,
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Payment successful! Transaction ID: ${response.data.payment.transactionId}`,
        });
        setTimeout(() => navigate("/order-history"), 2000);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">💳 Payment Processing</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="mb-4">
                <h5>Order Summary</h5>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Restaurant:</strong> {order.restaurant?.name}
                </p>
                <p>
                  <strong>Items:</strong> {order.items.length} items
                </p>
                <hr />
                <h6>
                  <strong>Total Amount: ₹{order.totalAmount}</strong>
                </h6>
              </div>

              <div className="mb-4">
                <h5>Select Payment Method</h5>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="card"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="card">
                    💳 Credit/Debit Card
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="upi"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="upi">
                    📱 UPI
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="wallet"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="wallet">
                    👛 Digital Wallet
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="simulateFailure"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="simulateFailure">
                    🧪 Simulate Payment Failure (for testing)
                  </label>
                </div>
              </div>

              <button
                className="btn btn-success btn-lg w-100"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${order.totalAmount}`
                )}
              </button>

              <button
                className="btn btn-secondary btn-lg w-100 mt-2"
                onClick={() => navigate("/order-history")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <strong>Note:</strong> This is a simulated payment gateway. Enter
            any details to test. Payment has ~90% success rate.
          </div>
        </div>
      </div>
    </div>
  );
}
