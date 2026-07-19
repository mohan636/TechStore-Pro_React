import { Link } from "react-router-dom";
import fallbackImage from "../assets/image-fallback.svg";
import "./ProductCard.css";

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  discount,
  rating,
  brand,
  category,
  isBestSeller,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) {
  const handleImageError = (event) => {
    event.currentTarget.src = fallbackImage;
  };

  return (
    <div className="product-card">
      {discount && <span className="discount-badge">{discount}</span>}

      <button
        className={`wishlisted ${isWishlisted ? "active" : ""}`}
        onClick={onToggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? "❤️" : "♡"}
      </button>

      <div className="image-container">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={handleImageError}
          className="product-image"
        />
      </div>

      <div className="card-content">
        <p className="product-meta">
          {brand} · {category}
        </p>
        <h3 className="product-name">{name}</h3>

        <div className="rating">
          <span className="stars">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </span>
          <span className="rating-value">{rating.toFixed(1)}</span>
          {isBestSeller && <span className="bestseller-tag">Best Seller</span>}
        </div>

        <div className="price-row">
          <span className="price">₹{price.toLocaleString("en-IN")}</span>
          {originalPrice && (
            <span className="original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="card-actions">
          <Link to={`/product/${id}`} className="details-btn">
            View details
          </Link>
          <button className="add-btn" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
