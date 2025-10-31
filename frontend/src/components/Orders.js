import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h3 className="text-center mb-4">📜 My Orders</h3>
      {orders.length === 0 ? (
        <h5 className="text-center">No orders found</h5>
      ) : (
        orders.map(order => (
          <div className="card mb-3" key={order._id}>
            <div className="card-body">
              <h6>Order ID: {order._id}</h6>
              <p>Status: <strong>{order.status}</strong></p>
              <ul>
                {order.items.map((i, idx) => (
                  <li key={idx}>
                    {i.foodItem?.name || "Item"} × {i.quantity}
                  </li>
                ))}
              </ul>
              <p className="fw-bold">Total: ₹{order.total}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
