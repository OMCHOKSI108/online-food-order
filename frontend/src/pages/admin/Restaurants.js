import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { BsArrowLeft, BsStar, BsCheck, BsPause, BsX } from "react-icons/bs";
import { toast } from "react-toastify";

export default function AdminRestaurants() {
  const navigate = useNavigate();
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      console.log("Fetching all restaurants...");
      const response = await adminService.getAllRestaurants();
      console.log("All restaurants response:", response);
      console.log("All restaurants data:", response.data);
      setAllRestaurants(response.data || []);
      console.log("Set all restaurants to:", response.data || []);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      console.log("Approving restaurant:", restaurantId);
      await adminService.approveRestaurant(restaurantId);
      console.log("Restaurant approved successfully");
      toast.success("Restaurant approved successfully!");
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      console.error("Error approving restaurant:", err);
      toast.error("Failed to approve restaurant");
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        console.log("Rejecting restaurant:", restaurantId);
        await adminService.rejectRestaurant(restaurantId, { rejectionReason: reason });
        console.log("Restaurant rejected successfully");
        toast.success("Restaurant rejected successfully!");
        fetchRestaurants(); // Refresh the list
      } catch (err) {
        console.error("Error rejecting restaurant:", err);
        toast.error("Failed to reject restaurant");
      }
    }
  };

  const handleToggleStatus = async (restaurantId) => {
    try {
      console.log("Toggling restaurant status:", restaurantId);
      const response = await adminService.toggleRestaurantStatus(restaurantId);
      console.log("Restaurant status toggled successfully:", response.data);
      toast.success(response.data.message);
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
      toast.error("Failed to toggle restaurant status");
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
            <BsArrowLeft className="me-2" />
            Back to Dashboard
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
                filterStatus === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilterStatus("all")}
            >
              📋 All ({allRestaurants.length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "pending" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFilterStatus("pending")}
            >
              ⏳ Pending ({allRestaurants.filter(r => r.approvalStatus === "pending").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "approved" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilterStatus("approved")}
            >
              <BsCheck className="me-2" />
              Approved ({allRestaurants.filter(r => r.approvalStatus === "approved").length})
            </button>
            <button
              type="button"
              className={`btn ${
                filterStatus === "rejected" ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setFilterStatus("rejected")}
            >
              <BsX className="me-2" />
              Rejected ({allRestaurants.filter(r => r.approvalStatus === "rejected").length})
            </button>
          </div>
        </div>
      </div>

      {allRestaurants.length > 0 ? (
        <div className="row">
          {allRestaurants
            .filter((r) => filterStatus === "all" || r.approvalStatus === filterStatus)
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
                      <strong>Rating:</strong> <BsStar className="me-1" />{restaurant.rating || 0}
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
                            <BsCheck className="me-2" />
                            Approve Restaurant
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(restaurant._id)}
                          >
                            <BsX className="me-2" />
                            Reject Restaurant
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
                            className={`btn btn-sm ${restaurant.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(restaurant._id)}
                          >
                            {restaurant.isActive ? <BsPause className="me-2" /> : <BsCheck className="me-2" />}
                            {restaurant.isActive ? 'Deactivate' : 'Activate'}
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
