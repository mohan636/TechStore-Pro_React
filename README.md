# TechStore Pro

A modern React e-commerce storefront built with Vite. This project is a polished upgrade of a tech merch shop with a strong resume-ready structure, reusable components, responsive design, and shopping cart features.

## Overview

TechStore Pro is a front-end shopping experience for premium consumer electronics. It includes product discovery, search, filtering, sorting, a product details page, cart management, wishlist support, and a polished user interface.

## Features

- Product search and advanced filtering
- Category, brand, and price range filters
- Sort by price, rating, or newest arrivals
- Product details page with breadcrumbs and recent views
- Add to cart, quantity controls, remove items
- Wishlist with add/remove actions
- Cart and wishlist drawers with responsive navigation
- Persistent cart, wishlist, theme, and recently viewed saved in localStorage
- Dark/light theme toggle
- Load more pagination for product grid
- Toast notifications and scroll-to-top button
- Loading and empty states with clear feedback
- Responsive layout for mobile, tablet, and desktop

## Tech Stack

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite
- React Router DOM

## Folder Structure

```text
src/
  assets/
    image-fallback.svg
  components/
    Breadcrumb.jsx
    CartDrawer.jsx
    LoadingSpinner.jsx
    Navbar.jsx
    ProductCard.jsx
    ScrollToTopButton.jsx
    ToastContainer.jsx
    WishlistDrawer.jsx
  context/
    ShopContext.jsx
  hooks/
    useLocalStorage.js
    useProducts.js
  pages/
    Checkout.jsx
    Home.jsx
    OrderSuccess.jsx
    ProductDetails.jsx
  utils/
    format.js
    productFilters.js
  data.js
  App.jsx
  App.css
  main.jsx
  index.css
```

## Installation

```bash
cd "D:\React Tap\latest"
npm install
npm run dev
```

Open `http://localhost:5173` to view the app locally.

## Build

```bash
npm run build
```

## Screenshots

![Homepage](https://via.placeholder.com/900x450?text=TechStore+Pro+Homepage)

![Product details](https://via.placeholder.com/900x450?text=Product+Details+Page)

![Cart drawer](https://via.placeholder.com/900x450?text=Cart+Drawer)

## Notes

This project keeps the existing React and JavaScript stack and focuses on improving component reusability, state management, performance, and user experience without adding new frameworks or TypeScript.
