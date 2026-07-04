import { useState } from "react";
import products from "../data";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

export default function Home() {
  const { wishlistItems, addToCart, onToggleWishlist, showToast } = useShop();

  const allBrands = [...new Set(products.map((product) => product.brand))];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState("All");
  const [sortBy, setSortBy] = useState("");

  let filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSelectedBrands =
      selectedBrands === "All" || product.brand === selectedBrands;
    return matchesSearchTerm && matchesSelectedBrands;
  });

  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands("All");
    setSortBy("");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedBrands !== "All" || sortBy !== "";

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Arrival 2025</p>
          <h1 className="hero-title">
            The Future of Tech
            <br />
            <span className="hero-highlight">Is Here.</span>
          </h1>
          <p className="hero-description">
            Discover premium gadgets and next-generation technology products.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn btn-white" onClick={scrollToProducts}>
              Explore Products
            </button>
            <button
              type="button"
              className="btn btn-outline-white"
              onClick={() => showToast("Learn more about TechStore — premium tech since 2020", "info")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">300+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Our most popular products loved by customers
          </p>
        </div>

        <div className="controls-bar">
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select
              value={selectedBrands}
              onChange={(e) => setSelectedBrands(e.target.value)}
              className="filter-select"
              aria-label="Filter by brand"
            >
              <option value="All">All Brands</option>
              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
              aria-label="Sort products"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <p className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating}
                image={product.image}
                isBestSeller={product.isBestSeller}
                brand={product.brand}
                isWishlisted={wishlistItems.includes(product.id)}
                onAddToCart={() => addToCart(product)}
                onToggleWishlist={() => onToggleWishlist(product)}
              />
            ))
          ) : (
            <div className="no-results empty-state empty-state-page">
              <div className="empty-state-icon" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-desc">
                {searchTerm.trim()
                  ? `No results for "${searchTerm.trim()}". Try a different search term or brand.`
                  : "No products match your current filters. Try adjusting them."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
