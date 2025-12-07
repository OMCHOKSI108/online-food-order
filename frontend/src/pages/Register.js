import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GiHamburger, GiForkKnifeSpoon } from "react-icons/gi";
import { BsPerson } from "react-icons/bs";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.phone,
        form.address
      );

      // Redirect based on role
      if (data.user.role === "restaurant") {
        navigate("/restaurant/setup");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4">
            <GiHamburger className="me-2" />
            Register
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Register as</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="customer">
                  <BsPerson className="me-1" />
                  Customer
                </option>
                <option value="restaurant">
                  <GiForkKnifeSpoon className="me-1" />
                  Restaurant Owner
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                type="text"
                name="address"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
