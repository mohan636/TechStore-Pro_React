import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, placeOrder } = useShop();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checking out.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid 10-digit phone";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    placeOrder();
    navigate("/order-success", {
      state: {
        orderTotal: cartTotal,
        itemCount: cartItems.reduce((t, i) => t + i.quantity, 0),
        customerName: form.fullName,
        orderId: `TS-${Date.now().toString().slice(-8)}`,
      },
    });
  };

  const shipping = cartTotal > 50000 ? 0 : 99;
  const total = cartTotal + shipping;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/" className="checkout-back">
            ← Back to Shop
          </Link>
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your order details below</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
            <section className="checkout-section">
              <h2 className="checkout-section-title">Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "input-error" : ""}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={errors.phone ? "input-error" : ""}
                    placeholder="9876543210"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    className={errors.address ? "input-error" : ""}
                    placeholder="Street, building, apartment"
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className={errors.city ? "input-error" : ""}
                    placeholder="Mumbai"
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={form.pincode}
                    onChange={handleChange}
                    className={errors.pincode ? "input-error" : ""}
                    placeholder="400001"
                  />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span className="payment-icon" aria-hidden="true">{method.icon}</span>
                    <span className="payment-label">{method.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <button type="submit" className="btn btn-primary btn-block checkout-submit">
              Place Order — ₹{total.toLocaleString("en-IN")}
            </button>
          </form>

          <aside className="order-summary">
            <h2 className="order-summary-title">Order Summary</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-info">
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="order-item-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="order-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="order-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="order-row order-total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
