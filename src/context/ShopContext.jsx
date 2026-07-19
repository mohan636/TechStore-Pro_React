import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import products from "../data";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ShopContext = createContext(null);

function sanitizeIds(ids) {
  const validProductIds = new Set(products.map((product) => product.id));
  return ids.filter((id) => validProductIds.has(id));
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useLocalStorage("cartItems", []);
  const [wishlistItems, setWishlistItems] = useLocalStorage(
    "wishlistItems",
    [],
  );
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage(
    "recentlyViewed",
    [],
  );
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const toastTimers = useRef([]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      toastTimers.current = toastTimers.current.filter((item) => item !== timer);
    }, 3200);

    toastTimers.current.push(timer);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

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
    [showToast, setCartItems],
  );

  const increaseQuantity = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, [setCartItems]);

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
  }, [setCartItems]);

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const item = prev.find((i) => i.id === productId);
        if (!item) return prev;
        showToast(`${item.name} removed from cart`, "info");
        return prev.filter((i) => i.id !== productId);
      });
    },
    [showToast, setCartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    showToast("Cart cleared", "info");
  }, [showToast, setCartItems]);

  const addToWishlist = useCallback(
    (product) => {
      setWishlistItems((prev) => {
        if (prev.includes(product.id)) {
          showToast(`${product.name} is already in your wishlist`, "info");
          return prev;
        }
        showToast(`${product.name} added to wishlist`);
        return [...prev, product.id];
      });
    },
    [showToast, setWishlistItems],
  );

  const removeFromWishlist = useCallback(
    (product) => {
      setWishlistItems((prev) => {
        if (!prev.includes(product.id)) return prev;
        showToast(`${product.name} removed from wishlist`, "info");
        return prev.filter((id) => id !== product.id);
      });
    },
    [showToast, setWishlistItems],
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

  const addRecentlyViewed = useCallback(
    (productId) => {
      setRecentlyViewed((prev) => {
        const next = [productId, ...prev.filter((id) => id !== productId)];
        return sanitizeIds(next).slice(0, 6);
      });
    },
    [setRecentlyViewed],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistItems.includes(product.id)),
    [wishlistItems],
  );

  const recentlyViewedProducts = useMemo(
    () =>
      products
        .filter((product) => recentlyViewed.includes(product.id))
        .sort(
          (a, b) => recentlyViewed.indexOf(b.id) - recentlyViewed.indexOf(a.id),
        ),
    [recentlyViewed],
  );

  const wishlistCount = wishlistProducts.length;

  const placeOrder = useCallback(() => {
    setCartItems([]);
    showToast("Order placed successfully!", "success");
  }, [showToast, setCartItems]);

  const value = useMemo(
    () => ({
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
      addRecentlyViewed,
      recentlyViewedProducts,
      placeOrder,
    }),
    [
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
      addRecentlyViewed,
      recentlyViewedProducts,
      placeOrder,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
