import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import orderService from "../services/orderService";
import { BsEye, BsXCircle, BsCheckCircle, BsClock, BsTruck } from "react-icons/bs";

export default function OrderHistory() {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      if (!token) {
        console.error("No auth token available");
        return;
      }
      console.log("Loading orders for user");
      const res = await orderService.getMyOrders();
      console.log("Orders response:", res);
      console.log("Orders data:", res.data);
      console.log("Orders data type:", typeof res.data);
      console.log("Orders data length:", res.data?.length);
      if (res.data && res.data.length > 0) {
        console.log("First order:", res.data[0]);
        console.log("First order ID:", res.data[0]?._id);
        console.log("First order keys:", Object.keys(res.data[0]));
      }
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error loading orders:", error?.response?.data || error.message);
      if (error?.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        alert("Failed to load orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? You will get a full refund.")) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      alert("Order cancelled successfully! Refund will be processed within 3-5 business days.");
      loadOrders(); // Reload orders to reflect the change
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <BsClock className="text-warning" />;
      case 'confirmed':
        return <BsCheckCircle className="text-info" />;
      case 'preparing':
        return <BsCheckCircle className="text-primary" />;
      case 'ready':
        return <BsCheckCircle className="text-success" />;
      case 'delivered':
        return <BsTruck className="text-success" />;
      case 'cancelled':
        return <BsXCircle className="text-danger" />;
      default:
        return <BsClock className="text-secondary" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge bg-warning';
      case 'confirmed':
        return 'badge bg-info';
      case 'preparing':
        return 'badge bg-primary';
      case 'ready':
        return 'badge bg-success';
      case 'delivered':
        return 'badge bg-success';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const canCancelOrder = (status) => {
    return ['pending', 'accepted'].includes(status.toLowerCase());
  };

  useEffect(() => {
    if (!authLoading && token) {
      loadOrders();
    }
  }, [token, authLoading, loadOrders]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <BsTruck className="me-2" />
          My Orders
        </h2>
        <span className="badge bg-primary fs-6">{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <BsTruck size={48} className="text-muted mb-3" />
          <h4>No orders yet</h4>
          <p className="mb-0">Start exploring restaurants and place your first order!</p>
        </div>
      ) : (
        <div className="card shadow-lg">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="border-0">Order ID</th>
                    <th className="border-0">Restaurant</th>
                    <th className="border-0">Items</th>
                    <th className="border-0">Total</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Date</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="align-middle">
                      <td>
                        <strong className="text-primary">
                          #{order._id.slice(-8).toUpperCase()}
                        </strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.restaurant?.name}</strong>
                          <br />
                          <small className="text-muted">{order.restaurant?.address}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td>
                        <strong className="text-success">₹{order.totalAmount}</strong>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)} d-flex align-items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              console.log("=== CLICKING VIEW DETAILS ===");
                              console.log("Order object:", order);
                              console.log("Order ID:", order._id);
                              console.log("Order ID type:", typeof order._id);
                              console.log("Order ID length:", order._id?.length);
                              console.log("Navigating to:", `/orders/${order._id}`);
                              if (!order._id) {
                                console.error("Order ID is missing! Cannot navigate.");
                                alert("Order ID is missing! Please try refreshing the page.");
                                return;
                              }
                              navigate(`/orders/${order._id}`);
                            }}
                            title="View Details"
                          >
                            <BsEye />
                          </button>
                          {canCancelOrder(order.status) && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancellingOrderId === order._id}
                              title="Cancel Order & Get Refund"
                            >
                              {cancellingOrderId === order._id ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              ) : (
                                <BsXCircle />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="mb-2">Order Status Legend:</h6>
        <div className="row">
          <div className="col-md-6">
            <small className="d-block mb-1">
              <BsClock className="text-warning me-1" />
              <strong>Pending:</strong> Order received, awaiting confirmation
            </small>
            <small className="d-block mb-1">
              <BsCheckCircle className="text-info me-1" />
              <strong>Confirmed:</strong> Order confirmed by restaurant
            </small>
          </div>
          <div className="col-md-6">
            <small className="d-block mb-1">
              <BsCheckCircle className="text-primary me-1" />
              <strong>Preparing:</strong> Food is being prepared
            </small>
            <small className="d-block mb-1">
              <BsTruck className="text-success me-1" />
              <strong>Delivered:</strong> Order completed successfully
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
