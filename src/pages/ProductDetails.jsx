import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import products from "../data";
import { formatPrice, ratingStars } from "../utils/format";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";
import fallbackImage from "../assets/image-fallback.svg";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    onToggleWishlist,
    wishlistItems,
    addRecentlyViewed,
    recentlyViewedProducts,
  } = useShop();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const product = useMemo(
    () => products.find((item) => item.id === Number(productId)),
    [productId],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!product) {
        setHasError(true);
      }
      setLoading(false);
      if (product) {
        addRecentlyViewed(product.id);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [product, addRecentlyViewed]);

  const handleImageError = (event) => {
    event.currentTarget.src = fallbackImage;
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (hasError || !product) {
    return (
      <div className="page-error">
        <div className="empty-state empty-state-page">
          <div className="empty-state-icon" aria-hidden="true">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M9.5 9.5l5 5m0-5l-5 5" />
            </svg>
          </div>
          <h3 className="empty-state-title">Product not found</h3>
          <p className="empty-state-desc">
            The product you are looking for does not exist or may have been removed.
          </p>
          <div className="empty-state-actions">
            <button className="btn btn-primary" type="button" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <Link to="/" className="btn btn-outline">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-header">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: product.category, to: `/?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />
        <div className="details-topline">
          <span className="details-label">Product details</span>
          <h1 className="details-title">{product.name}</h1>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-media">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="details-image"
          />
        </div>

        <section className="details-summary">
          <div className="details-badges">
            {product.discount && <span className="badge badge-accent">{product.discount}</span>}
            {product.isBestSeller && <span className="badge badge-success">Best Seller</span>}
          </div>
          <p className="details-category">{product.brand} · {product.category}</p>
          <div className="details-rating">
            <span className="rating-stars">{ratingStars(product.rating)}</span>
            <span className="rating-value">{product.rating.toFixed(1)}</span>
          </div>
          <p className="details-price">{formatPrice(product.price)}</p>
          <p className="details-description">
            {product.description ||
              `Discover the premium ${product.brand} ${product.category.toLowerCase()} with modern design, fast performance, and exceptional value for everyday use.`}
          </p>

          <div className="details-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className={`btn ${wishlistItems.includes(product.id) ? "btn-outline-active" : "btn-outline"}`}
              onClick={() => onToggleWishlist(product)}
            >
              {wishlistItems.includes(product.id) ? "Remove from Wishlist" : "Save for later"}
            </button>
          </div>

          <div className="details-meta">
            <div>
              <span className="meta-label">Brand</span>
              <p>{product.brand}</p>
            </div>
            <div>
              <span className="meta-label">Category</span>
              <p>{product.category}</p>
            </div>
            <div>
              <span className="meta-label">Available</span>
              <p>{product.isBestSeller ? "In stock" : "Limited stock"}</p>
            </div>
          </div>
        </section>
      </div>

      {recentlyViewedProducts.length > 0 && (
        <section className="recently-viewed">
          <div className="section-heading">
            <h2>Recently viewed</h2>
            <p>Continue shopping the items you visited earlier.</p>
          </div>
          <div className="recently-grid">
            {recentlyViewedProducts.map((item) => (
              <article key={item.id} className="recent-card">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={handleImageError}
                  className="recent-image"
                />
                <div className="recent-info">
                  <p className="recent-name">{item.name}</p>
                  <span className="recent-price">{formatPrice(item.price)}</span>
                </div>
                <Link to={`/product/${item.id}`} className="btn btn-small btn-secondary">
                  View
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
