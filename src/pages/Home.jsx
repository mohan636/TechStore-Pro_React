import { useEffect, useMemo, useState } from "react";
import { useShop } from "../context/ShopContext";
import { useProducts } from "../hooks/useProducts";
import { priceRanges, sortOptions } from "../utils/productFilters";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_SIZE = 8;

export default function Home() {
  const { wishlistItems, addToCart, onToggleWishlist, recentlyViewedProducts, showToast } = useShop();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      searchTerm,
      selectedCategory,
      selectedBrand,
      selectedPrice,
      sortBy,
    }),
    [searchTerm, selectedCategory, selectedBrand, selectedPrice, sortBy],
  );

  const {
    filteredProducts,
    categories,
    brands,
    loading,
    error,
  } = useProducts(filters);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, selectedPrice, sortBy]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, page * PAGE_SIZE),
    [filteredProducts, page],
  );

  const hasMore = page * PAGE_SIZE < filteredProducts.length;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedPrice("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedBrand !== "All" ||
    selectedPrice !== "all" ||
    sortBy !== "newest";

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">Premium Tech, Fast Delivery</p>
          <h1 className="hero-title">
            Build your next project with
            <br />
            <span className="hero-highlight">smart devices.</span>
          </h1>
          <p className="hero-description">
            Browse handpicked gadgets, refined electronics, and modern workflows for confident online shopping.
          </p>
          <div className="hero-cta">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Browse collection
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => showToast("Save your favorites, compare prices, and checkout faster.", "info")}
            >
              Why TechStore?
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">24K+</span>
            <span className="stat-label">Orders Delivered</span>
          </div>
          <div className="stat">
            <span className="stat-number">220+</span>
            <span className="stat-label">Premium Brands</span>
          </div>
          <div className="stat">
            <span className="stat-number">4.8/5</span>
            <span className="stat-label">Average rating</span>
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-header">
          <div>
            <p className="eyebrow">Shop by Category</p>
            <h2 className="section-title">Latest tech for work and play</h2>
          </div>
          <p className="section-subtitle">
            Refine results with smart filters, search, or sorting options for the best match.
          </p>
        </div>

        <div className="controls-panel">
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search gadgets, laptops, headphones..."
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

          <div className="filter-grid">
            <label className="filter-group">
              <span>Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-group">
              <span>Brand</span>
              <select
                value={selectedBrand}
                onChange={(event) => setSelectedBrand(event.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-group">
              <span>Price</span>
              <select
                value={selectedPrice}
                onChange={(event) => setSelectedPrice(event.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-group">
              <span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {hasActiveFilters && (
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Reset filters
            </button>
          )}
        </div>

        <p className="results-count">
          Showing {displayedProducts.length} of {filteredProducts.length} results
        </p>

        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : error ? (
          <div className="empty-state empty-state-page">
            <div className="empty-state-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 9l6 6m0-6l-6 6" />
              </svg>
            </div>
            <h3 className="empty-state-title">Unable to load products</h3>
            <p className="empty-state-desc">Please refresh the page to try again.</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  rating={product.rating}
                  image={product.image}
                  brand={product.brand}
                  category={product.category}
                  isBestSeller={product.isBestSeller}
                  isWishlisted={wishlistItems.includes(product.id)}
                  onAddToCart={() => addToCart(product)}
                  onToggleWishlist={() => onToggleWishlist(product)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="load-more-wrap">
                <button type="button" className="btn btn-primary" onClick={() => setPage((current) => current + 1)}>
                  Load more products
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {recentlyViewedProducts.length > 0 && (
        <section className="recently-section">
          <div className="section-header">
            <h2 className="section-title">Recently viewed</h2>
            <p className="section-subtitle">Continue shopping items you've looked at before.</p>
          </div>
          <div className="recent-grid">
            {recentlyViewedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating}
                image={product.image}
                brand={product.brand}
                category={product.category}
                isBestSeller={product.isBestSeller}
                isWishlisted={wishlistItems.includes(product.id)}
                onAddToCart={() => addToCart(product)}
                onToggleWishlist={() => onToggleWishlist(product)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
