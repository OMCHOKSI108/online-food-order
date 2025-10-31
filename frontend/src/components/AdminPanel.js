import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));

    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="container">
      <h3 className="text-center mb-4">🛠️ Admin Panel</h3>

      <h5>Restaurants</h5>
      <ul className="list-group mb-4">
        {restaurants.map(r => (
          <li key={r._id} className="list-group-item">
            {r.name} - {r.address}
          </li>
        ))}
      </ul>

      <h5>Orders</h5>
      {orders.map(o => (
        <div className="card mb-2" key={o._id}>
          <div className="card-body">
            <p><strong>ID:</strong> {o._id}</p>
            <p>Status: {o.status}</p>
            <p>Total: ₹{o.total}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
