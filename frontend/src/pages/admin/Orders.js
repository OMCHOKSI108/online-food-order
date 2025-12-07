import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { BsArrowLeft, BsEye } from "react-icons/bs";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching all orders...");
      const response = await adminService.getAllOrders();
      console.log("Orders response:", response);
      console.log("Orders data:", response.data);
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pending" },
      accepted: { class: "bg-info", text: "Accepted" },
      preparing: { class: "bg-primary", text: "Preparing" },
      ready: { class: "bg-secondary", text: "Ready" },
      out_for_delivery: { class: "bg-info", text: "Out for Delivery" },
      delivered: { class: "bg-success", text: "Delivered" },
      cancelled: { class: "bg-danger", text: "Cancelled" }
    };
    const config = statusConfig[status] || { class: "bg-secondary", text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
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

  return (
    <div className="container-fluid my-4">
      <div className="row mb-4">
        <div className="col">
          <h2>📦 Order Management</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/dashboard")}
          >
            <BsArrowLeft className="me-2" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-lg mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Filter Orders</h5>
        </div>
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filterStatus === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("all")}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              className={`btn ${filterStatus === "pending" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({orders.filter(o => o.status === "pending").length})
            </button>
            <button
              type="button"
              className={`btn ${filterStatus === "preparing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("preparing")}
            >
              Preparing ({orders.filter(o => o.status === "preparing").length})
            </button>
            <button
              type="button"
              className={`btn ${filterStatus === "delivered" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered ({orders.filter(o => o.status === "delivered").length})
            </button>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Order #{order._id.slice(-8)}</h6>
                  {getStatusBadge(order.status)}
                </div>
                <div className="card-body">
                  <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                  <p><strong>Restaurant:</strong> {order.restaurant?.name || 'N/A'}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Payment:</strong> {order.paymentStatus} ({order.paymentMethod})</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

                  <div className="mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => navigate(`/orders/${order._id}`)}
                      title="View Order Details"
                    >
                      <BsEye className="me-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <h5>No orders found</h5>
          <p>There are no orders with the selected status.</p>
        </div>
      )}
    </div>
  );
}