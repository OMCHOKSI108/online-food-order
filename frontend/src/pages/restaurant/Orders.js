import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { BsBox, BsArrowLeft, BsCheck, BsX, BsTruck } from "react-icons/bs";
import { GiChefToque } from "react-icons/gi";

export default function RestaurantOrders() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const restaurantRes = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantRes.data);
      if (restaurantRes.data.approvalStatus === "approved") {
        const ordersRes = await restaurantService.getRestaurantOrders();
        setOrders(ordersRes.data.orders || []);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await restaurantService.acceptOrder(orderId);
      alert("Order accepted!");
      fetchData();
    } catch (err) {
      alert("Failed to accept order");
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        await restaurantService.rejectOrder(orderId, { reason });
        alert("Order rejected!");
        fetchData();
      } catch (err) {
        alert("Failed to reject order");
      }
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await restaurantService.updateOrderStatus(orderId, { status });
      alert("Order status updated!");
      fetchData();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      preparing: "warning",
      on_the_way: "primary",
      delivered: "success",
      cancelled: "danger",
      rejected: "danger",
    };
    return colors[status] || "secondary";
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

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
          <h2>
            <BsBox className="me-2" />
            Order Management
          </h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/restaurant/dashboard")}
          >
            <BsArrowLeft className="me-1" />
            Back
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
              className={`btn ${
                filterStatus === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilterStatus("all")}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "pending" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFilterStatus("pending")}
            >
              Pending (
              {orders.filter((o) => o.status === "pending").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "confirmed"
                  ? "btn-info"
                  : "btn-outline-info"
              }`}
              onClick={() => setFilterStatus("confirmed")}
            >
              Confirmed (
              {orders.filter((o) => o.status === "confirmed").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "preparing"
                  ? "btn-warning"
                  : "btn-outline-warning"
              }`}
              onClick={() => setFilterStatus("preparing")}
            >
              Preparing (
              {orders.filter((o) => o.status === "preparing").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "delivered" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered (
              {orders.filter((o) => o.status === "delivered").length})
            </button>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card shadow-lg">
                <div
                  className={`card-header bg-${getStatusColor(
                    order.status
                  )} text-white`}
                >
                  <h6 className="mb-0">
                    Order #{order._id.substring(0, 8)} •{" "}
                    <span className="badge bg-light text-dark">
                      {order.status.toUpperCase()}
                    </span>
                  </h6>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Customer:</strong> {order.customer?.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customer?.phone}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.items.length}
                  </p>

                  <hr />

                  <h6>Items:</h6>
                  <ul className="small">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.foodItem?.name} x {item.quantity} = ₹
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>

                  <hr />

                  <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                  </p>
                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {order.deliveryAddress}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-3 d-grid gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAcceptOrder(order._id)}
                        >
                          <BsCheck className="me-1" />
                          Accept Order
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRejectOrder(order._id)}
                        >
                          <BsX className="me-1" />
                          Reject Order
                        </button>
                      </>
                    )}

                    {order.status === "confirmed" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          handleUpdateStatus(order._id, "preparing")
                        }
                      >
                        <GiChefToque className="me-1" />
                        Mark as Preparing
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleUpdateStatus(order._id, "on_the_way")
                        }
                      >
                        <BsTruck className="me-1" />
                        Mark as On The Way
                      </button>
                    )}

                    {order.status === "on_the_way" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          handleUpdateStatus(order._id, "delivered")
                        }
                      >
                        <BsCheck className="me-1" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>

                  {order.status === "rejected" && (
                    <div className="alert alert-danger mt-2">
                      <small>
                        <strong>Rejection Reason:</strong>{" "}
                        {order.rejectionReason}
                      </small>
                    </div>
                  )}
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
