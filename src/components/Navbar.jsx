import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartCount,
    wishlistCount,
    theme,
    toggleTheme,
    setIsCartOpen,
    setIsWishlistOpen,
    showToast,
  } = useShop();

  const scrollToProducts = () => {
    if (location.pathname !== "/") {
      navigate("/#products");
      return;
    }
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavLink = (label) => {
    setMobileOpen(false);
    if (label === "Products") {
      scrollToProducts();
    } else {
      showToast(`${label} section coming soon`, "info");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-icon" aria-hidden="true" />
          TechStore
        </Link>

        <button
          type="button"
          className={`mobile-menu-toggle ${mobileOpen ? "active" : ""}`}
          onClick={() => setMobileOpen((state) => !state)}
          aria-label="Toggle mobile navigation"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu ${mobileOpen ? "open" : ""}`}>
          <ul className="nav-links">
            {[
              { label: "Products" },
              { label: "Deals" },
              { label: "About" },
            ].map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => handleNavLink(item.label)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            type="button"
            className="nav-icon-btn wishlist-nav-btn"
            onClick={() => {
              setIsWishlistOpen(true);
              setMobileOpen(false);
            }}
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="nav-badge">{wishlistCount}</span>
            )}
          </button>

          <button
            type="button"
            className="nav-icon-btn cart-nav-btn"
            onClick={() => {
              setIsCartOpen(true);
              setMobileOpen(false);
            }}
            aria-label={`Cart, ${cartCount} items`}
          >
            <CartIcon />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
