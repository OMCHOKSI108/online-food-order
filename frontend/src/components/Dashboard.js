import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="card p-4 mx-auto mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-3">Welcome, {user.name}!</h3>
      <p className="text-center">Email: {user.email}</p>
      <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
