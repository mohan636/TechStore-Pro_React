import { createContext, useContext, useState, useEffect, useCallback, useLayoutEffect } from "react";
import products from "../data";

const ShopContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function sanitizeWishlistIds(ids) {
  const validProductIds = new Set(products.map((p) => p.id));
  return ids.filter((id) => validProductIds.has(id));
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() =>
    loadFromStorage("cartItems", []),
  );
  const [wishlistItems, setWishlistItems] = useState(() =>
    sanitizeWishlistIds(loadFromStorage("wishlistItems", [])),
  );
  const [theme, setTheme] = useState(() =>
    loadFromStorage("theme", "light"),
  );
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const addToCart = useCallback(
    (product) => {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      showToast(`${product.name} added to cart`);
    },
    [showToast],
  );

  const increaseQuantity = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i.id === productId);
      if (!item) return;

      setCartItems((prev) => prev.filter((i) => i.id !== productId));
      showToast(`${item.name} removed from cart`, "info");
    },
    [cartItems, showToast],
  );

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    showToast("Cart cleared", "info");
  }, [cartItems.length, showToast]);

  const addToWishlist = useCallback(
    (product) => {
      if (wishlistItems.includes(product.id)) {
        showToast(`${product.name} is already in your wishlist`, "info");
        return;
      }

      setWishlistItems((prev) => [...prev, product.id]);
      showToast(`${product.name} added to wishlist`);
    },
    [wishlistItems, showToast],
  );

  const removeFromWishlist = useCallback(
    (product) => {
      if (!wishlistItems.includes(product.id)) return;

      setWishlistItems((prev) => prev.filter((id) => id !== product.id));
      showToast(`${product.name} removed from wishlist`, "info");
    },
    [wishlistItems, showToast],
  );

  const onToggleWishlist = useCallback(
    (product) => {
      if (wishlistItems.includes(product.id)) {
        removeFromWishlist(product);
      } else {
        addToWishlist(product);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist],
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const wishlistProducts = products.filter((p) =>
    wishlistItems.includes(p.id),
  );

  const wishlistCount = wishlistProducts.length;

  const placeOrder = useCallback(() => {
    setCartItems([]);
    showToast("Order placed successfully!", "success");
  }, [showToast]);

  const value = {
    cartItems,
    wishlistItems,
    wishlistProducts,
    wishlistCount,
    theme,
    toasts,
    isCartOpen,
    isWishlistOpen,
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsWishlistOpen,
    toggleTheme,
    showToast,
    removeToast,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    onToggleWishlist,
    placeOrder,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
