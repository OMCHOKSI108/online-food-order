import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { orderService } from "../services/orderService";

export default function OrderHistory() {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && token) {
      loadOrders();
    }
  }, [token, authLoading]);

  const loadOrders = async () => {
    try {
      if (!token) {
        console.error("No auth token available");
        return;
      }
      console.log("Loading orders for user");
      const res = await orderService.getMyOrders(token);
      console.log("Orders data:", res.data);
      setOrders(res.data);
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
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">📦 My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders yet</div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div className="col-md-6 mb-3" key={order._id}>
              <div className="card">
                <div className="card-body">
                  <h5>Order #{order._id.slice(-6).toUpperCase()}</h5>
                  <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Status:</strong> <span className="badge bg-info">{order.status}</span></p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
