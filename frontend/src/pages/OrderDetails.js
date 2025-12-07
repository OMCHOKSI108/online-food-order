import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import { BsBox, BsBuilding, BsStar, BsCreditCard, BsX, BsArrowLeft, BsFileText, BsCheck, BsClipboard, BsTruck } from "react-icons/bs";
import { GiChefToque } from "react-icons/gi";

export default function OrderDetails() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
    type: "food",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching order details for ID:", orderId);
      const response = await orderService.getOrderDetails(orderId);
      console.log("Order details response:", response);
      setOrder(response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    console.log("=== ORDER DETAILS COMPONENT ===");
    console.log("Order ID from params:", orderId);
    console.log("Order ID type:", typeof orderId);
    console.log("Order ID length:", orderId?.length);
    
    if (!orderId || orderId === 'undefined') {
      console.error("Invalid order ID:", orderId);
      setError("Invalid order ID");
      setLoading(false);
      return;
    }
    
    fetchOrderDetails();
  }, [orderId, fetchOrderDetails]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setLoading(true);
        await orderService.cancelOrder(orderId);
        setOrder({ ...order, status: "cancelled" });
        alert("Order cancelled successfully. Refund will be processed.");
        fetchOrderDetails();
      } catch (err) {
        setError("Failed to cancel order");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitReview = async (foodItemId) => {
    try {
      setSubmittingReview(true);
      await orderService.submitReview(orderId, {
        ...reviewData,
        foodItem: foodItemId,
      });
      alert("Review submitted successfully!");
      fetchOrderDetails();
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
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

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      preparing: "info",
      on_the_way: "primary",
      delivered: "success",
      cancelled: "danger",
      rejected: "danger",
    };
    return colors[status] || "secondary";
  };

  const canCancelOrder =
    order.status !== "delivered" &&
    order.status !== "cancelled" &&
    order.status !== "rejected";
  const canReview = order.status === "delivered" && !order.rating;

  return (
    <div className="container my-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <BsBox className="me-2" />
                Order #{order._id.substring(0, 8)}
              </h3>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6>Order Date</h6>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  <h6>Status</h6>
                  <span
                    className={`badge bg-${getStatusColor(order.status)}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <hr />

              <h5>Items Ordered</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.foodItem?.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr />

              <div className="row">
                <div className="col-md-6">
                  <h6>Subtotal</h6>
                  <p>₹{order.totalAmount * 0.9}</p>
                </div>
                <div className="col-md-6">
                  <h6>Taxes & Fees</h6>
                  <p>₹{order.totalAmount * 0.1}</p>
                </div>
              </div>

              <div className="alert alert-info">
                <h6>
                  <strong>Total Amount: ₹{order.totalAmount}</strong>
                </h6>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6>Payment Status</h6>
                  <span
                    className={`badge bg-${
                      order.paymentStatus === "paid" ? "success" : "warning"
                    }`}
                  >
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </div>
                <div className="col-md-6">
                  <h6>Payment Method</h6>
                  <p>{order.paymentMethod || "Not specified"}</p>
                </div>
              </div>

              {order.refundAmount && (
                <div className="alert alert-success mt-3">
                  Refund Amount: ₹{order.refundAmount} - Status:{" "}
                  <strong>{order.refundStatus}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-lg mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <BsBuilding className="me-2" />
                Delivery Details
              </h5>
            </div>
            <div className="card-body">
              <h6>Restaurant</h6>
              <p>{order.restaurant?.name}</p>

              <h6>Delivery Address</h6>
              <p>{order.deliveryAddress || "Not specified"}</p>

              {order.status === "rejected" && (
                <div className="alert alert-danger">
                  <strong>Rejection Reason:</strong> {order.rejectionReason}
                </div>
              )}
            </div>
          </div>

          {canReview && (
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <BsStar className="me-2" />
                  Rate Your Order
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label>Rating (1-5)</label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        rating: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="text-center">
                    {Array.from({ length: reviewData.rating }).map((_, i) => (
                      <span key={i} className="text-warning">
                        <BsStar />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                  ></textarea>
                </div>

                <button
                  className="btn btn-success"
                  onClick={() =>
                    handleSubmitReview(order.items[0].foodItem?._id)
                  }
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Actions</h5>
            </div>
            <div className="card-body d-grid gap-2">
              {order.paymentStatus === "pending" && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/payment/${orderId}`)}
                >
                  <BsCreditCard className="me-1" />
                  Complete Payment
                </button>
              )}

              {canCancelOrder && (
                <button
                  className="btn btn-danger"
                  onClick={handleCancelOrder}
                  disabled={loading}
                >
                  <BsX className="me-1" />
                  Cancel Order
                </button>
              )}

              <button
                className="btn btn-info"
                onClick={() => navigate("/orders")}
              >
                <BsArrowLeft className="me-1" />
                Back to Orders
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={async () => {
                  try {
                    const response = await orderService.getReceipt(orderId);
                    alert(`Receipt saved:\n${JSON.stringify(response.data)}`);
                  } catch (err) {
                    alert("Failed to get receipt");
                  }
                }}
              >
                <BsFileText className="me-1" />
                Download Receipt
              </button>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h6>Order Timeline</h6>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="badge bg-success">
                    <BsCheck />
                  </div>
                  <span>Order Placed</span>
                </div>
                <div
                  className={`timeline-item ${
                    order.status !== "pending" ? "completed" : ""
                  }`}
                >
                  <div className="badge bg-info">
                    <BsClipboard />
                  </div>
                  <span>Confirmed</span>
                </div>
                <div
                  className={`timeline-item ${
                    order.status === "on_the_way" ||
                    order.status === "delivered"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="badge bg-warning">
                    <GiChefToque />
                  </div>
                  <span>Preparing</span>
                </div>
                <div
                  className={`timeline-item ${
                    order.status === "delivered" ? "completed" : ""
                  }`}
                >
                  <div className="badge bg-primary">
                    <BsTruck />
                  </div>
                  <span>On The Way</span>
                </div>
                <div
                  className={`timeline-item ${
                    order.status === "delivered" ? "completed" : ""
                  }`}
                >
                  <div className="badge bg-success">
                    <BsCheck />
                  </div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
