import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { BsCart } from "react-icons/bs";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-info text-center">
          Your cart is empty. <button className="btn btn-link" onClick={() => navigate("/")}>Start shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <BsCart className="me-2" />
        Shopping Cart
      </h2>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.foodItem._id}>
                      <td>{item.foodItem.name}</td>
                      <td>₹{item.foodItem.price}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "60px" }}
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.foodItem._id, parseInt(e.target.value))}
                        />
                      </td>
                      <td>₹{(item.foodItem.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeFromCart(item.foodItem._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="mb-3">
                <p className="mb-2">
                  <strong>Subtotal:</strong> ₹{getTotalAmount().toFixed(2)}
                </p>
                <p className="mb-2">
                  <strong>Delivery:</strong> Free
                </p>
                <hr />
                <h5>
                  <strong>Total:</strong> ₹{getTotalAmount().toFixed(2)}
                </h5>
              </div>

              <button
                className="btn btn-success w-100 mb-2"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  clearCart();
                  navigate("/");
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
