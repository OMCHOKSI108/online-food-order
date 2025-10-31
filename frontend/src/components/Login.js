import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" name="password" placeholder="Password" type="password" onChange={handleChange} />
        <button className="btn btn-success w-100">Login</button>
      </form>
      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
};

export default Login;
