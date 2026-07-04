import { Link, useLocation, Navigate } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const { orderTotal, itemCount, customerName, orderId } = location.state || {};

  if (!customerName) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon" aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you, <strong>{customerName}</strong>! Your order has been confirmed.
        </p>

        <div className="success-details">
          <div className="success-detail-row">
            <span>Order ID</span>
            <span className="success-detail-value">{orderId}</span>
          </div>
          <div className="success-detail-row">
            <span>Items</span>
            <span className="success-detail-value">{itemCount}</span>
          </div>
          <div className="success-detail-row">
            <span>Total Paid</span>
            <span className="success-detail-value">
              ₹{orderTotal?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <p className="success-note">
          A confirmation email will be sent shortly. Your cart has been cleared.
        </p>

        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
