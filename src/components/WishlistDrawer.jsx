import { useShop } from "../context/ShopContext";

export default function WishlistDrawer() {
  const {
    wishlistProducts,
    wishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    removeFromWishlist,
  } = useShop();

  return (
    <>
      {isWishlistOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsWishlistOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`wishlist-drawer ${isWishlistOpen ? "open" : ""}`}
        aria-label="Wishlist"
        aria-hidden={!isWishlistOpen}
      >
        <div className="drawer-header">
          <h3 className="drawer-title">
            Wishlist
            <span className="drawer-count">({wishlistCount})</span>
          </h3>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            ✕
          </button>
        </div>

        {wishlistCount === 0 ? (
          <div className="drawer-empty empty-state">
            <div className="empty-state-icon wishlist-empty-icon" aria-hidden="true">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h4 className="empty-state-title">Your wishlist is empty</h4>
            <p className="empty-state-desc">
              Save products you love by tapping the heart icon on any item.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsWishlistOpen(false);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="wishlist-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-item-image"
                />
                <div className="wishlist-item-details">
                  <p className="wishlist-item-name">{product.name}</p>
                  <p className="wishlist-item-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <div className="wishlist-item-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeFromWishlist(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
