import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/adminService";

export default function AdminRestaurants() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingRestaurants();
      setPendingRestaurants(response.data.restaurants || []);
    } catch (err) {
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      await adminService.approveRestaurant(restaurantId);
      alert("Restaurant approved successfully!");
      fetchRestaurants();
    } catch (err) {
      alert("Failed to approve restaurant");
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        await adminService.rejectRestaurant(restaurantId, { reason });
        alert("Restaurant rejected!");
        fetchRestaurants();
      } catch (err) {
        alert("Failed to reject restaurant");
      }
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

  return (
    <div className="container-fluid my-4">
      <div className="row mb-4">
        <div className="col">
          <h2>🏪 Restaurant Management</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/dashboard")}
          >
            ⬅️ Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-lg mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Filter Restaurants</h5>
        </div>
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${
                filterStatus === "pending" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFilterStatus("pending")}
            >
              ⏳ Pending ({pendingRestaurants.length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "approved" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilterStatus("approved")}
            >
              ✓ Approved
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "rejected" ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setFilterStatus("rejected")}
            >
              ✗ Rejected
            </button>
          </div>
        </div>
      </div>

      {pendingRestaurants.length > 0 ? (
        <div className="row">
          {pendingRestaurants
            .filter(
              (r) => filterStatus === "pending" || r.approvalStatus === filterStatus
            )
            .map((restaurant) => (
              <div key={restaurant._id} className="col-md-6 mb-4">
                <div className="card shadow-lg">
                  <div
                    className={`card-header ${
                      restaurant.approvalStatus === "pending"
                        ? "bg-warning"
                        : restaurant.approvalStatus === "approved"
                        ? "bg-success"
                        : "bg-danger"
                    } text-white`}
                  >
                    <h6 className="mb-0">
                      {restaurant.name} •{" "}
                      <span className="badge bg-light text-dark">
                        {restaurant.approvalStatus.toUpperCase()}
                      </span>
                    </h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Owner:</strong> {restaurant.owner?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {restaurant.owner?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {restaurant.owner?.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {restaurant.address}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {restaurant.description.substring(0, 100)}...
                    </p>

                    <hr />

                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge bg-${
                          restaurant.isActive ? "success" : "danger"
                        }`}
                      >
                        {restaurant.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                    <p>
                      <strong>Rating:</strong> ⭐{restaurant.rating || 0}
                    </p>
                    <p>
                      <strong>Total Orders:</strong> {restaurant.totalOrders}
                    </p>
                    <p>
                      <strong>Total Earnings:</strong> ₹{restaurant.totalEarnings}
                    </p>

                    {restaurant.approvalStatus === "rejected" && (
                      <div className="alert alert-danger mt-3">
                        <small>
                          <strong>Rejection Reason:</strong>{" "}
                          {restaurant.rejectionReason}
                        </small>
                      </div>
                    )}

                    <div className="mt-3 d-grid gap-2">
                      {restaurant.approvalStatus === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(restaurant._id)}
                          >
                            ✓ Approve Restaurant
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(restaurant._id)}
                          >
                            ✗ Reject Restaurant
                          </button>
                        </>
                      )}

                      {restaurant.approvalStatus === "approved" && (
                        <>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() =>
                              alert("View restaurant details coming soon")
                            }
                          >
                            👁️ View Details
                          </button>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              alert("Deactivate functionality coming soon")
                            }
                          >
                            ⏸️ Deactivate
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <h5>No restaurants found</h5>
          <p>There are no restaurants with the selected status.</p>
        </div>
      )}
    </div>
  );
}
