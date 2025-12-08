import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { BsBox, BsArrowLeft, BsCheck, BsX, BsTruck, BsFilter, BsPerson, BsPhone, BsGeoAlt, BsClock, BsCurrencyRupee } from "react-icons/bs";
import { GiChefToque } from "react-icons/gi";
import "./RestaurantOrders.css";

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
      <div className="restaurant-orders-container">
        <div className="restaurant-orders-wrapper">
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-orders-container">
      <div className="restaurant-orders-wrapper">
        {/* Header Section */}
        <div className="orders-header">
          <h1>
            <BsBox />
            Order Management
          </h1>
          <div className="orders-stats">
            <div className="order-stat-item">
              <span className="order-stat-value">{orders.length}</span>
              <span className="order-stat-label">Total Orders</span>
            </div>
            <div className="order-stat-item">
              <span className="order-stat-value">{orders.filter(o => o.status === 'pending').length}</span>
              <span className="order-stat-label">Pending</span>
            </div>
            <div className="order-stat-item">
              <span className="order-stat-value">{orders.filter(o => o.status === 'delivered').length}</span>
              <span className="order-stat-label">Delivered</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="orders-error-state">
            <BsX size={64} />
            <h3>Unable to Load Orders</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="orders-filters">
          <div className="filter-group">
            <span className="filter-label">Filter by Status:</span>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</option>
              <option value="confirmed">Confirmed ({orders.filter(o => o.status === 'confirmed').length})</option>
              <option value="preparing">Preparing ({orders.filter(o => o.status === 'preparing').length})</option>
              <option value="ready">Ready ({orders.filter(o => o.status === 'ready').length})</option>
              <option value="on_the_way">On The Way ({orders.filter(o => o.status === 'on_the_way').length})</option>
              <option value="delivered">Delivered ({orders.filter(o => o.status === 'delivered').length})</option>
              <option value="cancelled">Cancelled ({orders.filter(o => o.status === 'cancelled').length})</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className={`order-card ${order.status}`}>
                <div className="order-header">
                  <h3 className="order-id">Order #{order._id.substring(0, 8)}</h3>
                  <span className={`order-status ${order.status}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="order-customer-info">
                  <div className="customer-detail">
                    <BsPerson />
                    <div>
                      <div className="customer-label">Customer</div>
                      <div className="customer-value">{order.customer?.name || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="customer-detail">
                    <BsPhone />
                    <div>
                      <div className="customer-label">Phone</div>
                      <div className="customer-value">{order.customer?.phone || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="customer-detail">
                    <BsGeoAlt />
                    <div>
                      <div className="customer-label">Delivery Address</div>
                      <div className="customer-value">{order.deliveryAddress || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="customer-detail">
                    <BsClock />
                    <div>
                      <div className="customer-label">Order Time</div>
                      <div className="customer-value">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <div className="order-items-header">
                    <BsBox />
                    <h4>Order Items ({order.items.length})</h4>
                  </div>
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="order-item-name">{item.foodItem?.name || 'Unknown Item'}</div>
                      <div className="order-item-quantity">x{item.quantity}</div>
                      <div className="order-item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === "pending" && (
                    <>
                      <button
                        className="order-action-btn accept"
                        onClick={() => handleAcceptOrder(order._id)}
                      >
                        <BsCheck />
                        Accept Order
                      </button>
                      <button
                        className="order-action-btn reject"
                        onClick={() => handleRejectOrder(order._id)}
                      >
                        <BsX />
                        Reject Order
                      </button>
                    </>
                  )}

                  {order.status === "confirmed" && (
                    <button
                      className="order-action-btn ready"
                      onClick={() => handleUpdateStatus(order._id, "preparing")}
                    >
                      <GiChefToque />
                      Start Preparing
                    </button>
                  )}

                  {order.status === "preparing" && (
                    <button
                      className="order-action-btn ready"
                      onClick={() => handleUpdateStatus(order._id, "ready")}
                    >
                      <BsCheck />
                      Mark as Ready
                    </button>
                  )}

                  {order.status === "ready" && (
                    <button
                      className="order-action-btn ready"
                      onClick={() => handleUpdateStatus(order._id, "on_the_way")}
                    >
                      <BsTruck />
                      Out for Delivery
                    </button>
                  )}

                  {order.status === "on_the_way" && (
                    <button
                      className="order-action-btn complete"
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                    >
                      <BsCheck />
                      Mark Delivered
                    </button>
                  )}

                  {order.status === "rejected" && order.rejectionReason && (
                    <div style={{
                      background: '#fed7d7',
                      color: '#742a2a',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #f56565',
                      marginTop: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      <strong>Rejection Reason:</strong> {order.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="orders-empty-state">
            <BsBox size={64} />
            <h3>No Orders Found</h3>
            <p>
              {filterStatus === 'all'
                ? "You haven't received any orders yet. Start by adding delicious items to your menu!"
                : `No orders with status "${filterStatus}". Try selecting a different filter.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
