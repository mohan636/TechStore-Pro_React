import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { ShopProvider } from "./context/ShopContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import ToastContainer from "./components/ToastContainer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import LoadingSpinner from "./components/LoadingSpinner";
import Home from "./pages/Home";

const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppLayout() {
  return (
    <div className="app">
      <ScrollToHash />
      <Navbar />
      <main>
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </Suspense>
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <ToastContainer />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <ShopProvider>
      <AppLayout />
    </ShopProvider>
  );
}

export default App;
