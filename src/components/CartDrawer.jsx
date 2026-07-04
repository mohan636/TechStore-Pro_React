import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    showToast,
  } = useShop();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "info");
      return;
    }
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
      >
        <div className="drawer-header">
          <h3 className="drawer-title">
            Your Cart
            <span className="drawer-count">({cartCount})</span>
          </h3>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="drawer-empty empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h4 className="empty-state-title">Your cart is empty</h4>
            <p className="empty-state-desc">
              Looks like you haven&apos;t added anything yet. Start shopping to
              fill it up!
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsCartOpen(false);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-unit-price">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="cart-total-price">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                className="btn btn-outline btn-block clear-cart-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
