import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import { BsCreditCard, BsCash, BsWallet, BsPhone } from "react-icons/bs";
import { useAuth } from "../hooks/useAuth";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }
    try {
      setLoading(true);
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    if (token) {
      fetchOrderDetails();
    } else {
      navigate("/login");
    }
  }, [fetchOrderDetails, token, navigate]);

  const handlePayment = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // For Cash on Delivery, process through payment endpoint
    if (paymentMethod === "cod") {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.processPayment(orderId, {
          paymentMethod: "cod"
        });

        if (response.data.success) {
          setMessage({
            type: "success",
            text: `Order confirmed! Transaction ID: ${response.data.transactionId}`,
          });
          // Add green tick animation with random delay (0-5 seconds)
          const delay = Math.random() * 5000;
          setTimeout(() => {
            setMessage({
              type: "success",
              text: `✅ Order confirmed! Transaction ID: ${response.data.transactionId}`,
              showTick: true
            });
            setTimeout(() => navigate("/orders"), 2000);
          }, delay);
        } else {
          setError(response.data.message || "COD confirmation failed");
        }
      } catch (err) {
        setError(err.response?.data?.message || "COD processing failed");
      } finally {
        setLoading(false);
      }
      return;
    }

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
          text: `Payment successful! Transaction ID: ${response.data.transactionId}`,
        });
        // Add green tick animation with random delay (0-5 seconds)
        const delay = Math.random() * 5000;
        setTimeout(() => {
          setMessage({
            type: "success",
            text: `✅ Payment successful! Transaction ID: ${response.data.transactionId}`,
            showTick: true
          });
          setTimeout(() => navigate("/orders"), 2000);
        }, delay);
      } else {
        setError(response.data.message || "Payment failed. Please try again.");
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
              <h3 className="mb-0">
                <BsCreditCard className="me-2" />
                Payment Processing
              </h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.showTick && <span className="success-checkmark"></span>}
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
                <div className="row">
                  <div className="col-md-6">
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
                        <BsCreditCard className="me-2" />
                        Credit/Debit Card
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
                        <BsPhone className="me-2" />
                        UPI
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
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
                        <BsWallet className="me-2" />
                        Digital Wallet
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="cod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        <BsCash className="me-2" />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod !== "cod" && (
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
              )}

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
                  paymentMethod === "cod" ? "Confirm Order" : `Pay ₹${order.totalAmount}`
                )}
              </button>

              <button
                className="btn btn-secondary btn-lg w-100 mt-2"
                onClick={() => navigate("/orders")}
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
