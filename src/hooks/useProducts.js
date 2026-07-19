import { useState, useEffect, useMemo } from "react";
import productsData from "../data";
import {
  filterProducts,
  getUniqueValues,
  priceRanges,
  sortOptions,
} from "../utils/productFilters";

export function useProducts(filters) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setAllProducts(productsData);
      } catch {
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  const categories = useMemo(
    () => ["All", ...getUniqueValues(allProducts, "category")],
    [allProducts],
  );

  const brands = useMemo(
    () => ["All", ...getUniqueValues(allProducts, "brand")],
    [allProducts],
  );

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  );

  return {
    allProducts,
    filteredProducts,
    categories,
    brands,
    priceRanges,
    sortOptions,
    loading,
    error,
  };
}
