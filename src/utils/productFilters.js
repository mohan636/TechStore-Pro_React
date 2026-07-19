export const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "under-50000", label: "Under ₹50,000", min: 0, max: 50000 },
  { value: "50000-150000", label: "₹50,000 - ₹150,000", min: 50000, max: 150000 },
  { value: "above-150000", label: "Above ₹150,000", min: 150000, max: Infinity },
];

export const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
];

export function getUniqueValues(items, key) {
  return Array.from(new Set(items.map((item) => item[key]).filter(Boolean))).sort();
}

export function filterProducts(products, filters) {
  const {
    searchTerm = "",
    selectedCategory = "All",
    selectedBrand = "All",
    selectedPrice = "all",
    sortBy = "",
  } = filters;

  const lowerSearch = searchTerm.trim().toLowerCase();
  const priceFilter = priceRanges.find((range) => range.value === selectedPrice);

  return products
    .filter((product) => {
      const matchesSearch =
        lowerSearch === "" ||
        product.name.toLowerCase().includes(lowerSearch) ||
        product.brand.toLowerCase().includes(lowerSearch) ||
        product.category.toLowerCase().includes(lowerSearch);

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      const matchesPrice =
        !priceFilter ||
        priceFilter.value === "all" ||
        (product.price >= priceFilter.min && product.price <= priceFilter.max);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "rating-desc") {
        return b.rating - a.rating;
      }
      if (sortBy === "newest") {
        return b.id - a.id;
      }
      return a.id - b.id;
    });
}
