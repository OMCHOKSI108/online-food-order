import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { BsArrowLeft, BsPeople, BsTrash, BsPause } from "react-icons/bs";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(userId);
        alert("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await adminService.editUser(userId, { isActive: false });
      alert("User deactivated successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to deactivate user");
    }
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

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="container-fluid my-4">
      <div className="row mb-4">
        <div className="col">
          <h2><BsPeople className="me-2" /> User Management</h2>
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
          <h5 className="mb-0">Search & Filter</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-control"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="restaurant">Restaurants</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${
                filterRole === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilterRole("all")}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterRole === "customer" ? "btn-info" : "btn-outline-info"
              }`}
              onClick={() => setFilterRole("customer")}
            >
              Customers ({users.filter((u) => u.role === "customer").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterRole === "restaurant"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => setFilterRole("restaurant")}
            >
              Restaurants ({users.filter((u) => u.role === "restaurant").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterRole === "admin" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFilterRole("admin")}
            >
              Admins ({users.filter((u) => u.role === "admin").length})
            </button>
          </div>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Users ({filteredUsers.length})</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || "N/A"}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            u.role === "admin"
                              ? "danger"
                              : u.role === "restaurant"
                              ? "success"
                              : "info"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            u.isActive ? "success" : "danger"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() =>
                            alert(
                              `User Details:\nName: ${u.name}\nEmail: ${u.email}\nRole: ${u.role}\nPhone: ${u.phone}\nAddress: ${u.address}`
                            )
                          }
                        >
                          👁️
                        </button>
                        {u.isActive && (
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleDeactivateUser(u._id)}
                          >
                            <BsPause />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <h5>No users found</h5>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
