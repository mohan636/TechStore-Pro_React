export function formatPrice(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ratingStars(rating = 0) {
  const fullStars = Math.floor(rating);
  const emptyStars = Math.max(0, 5 - fullStars);
  return `${"★".repeat(fullStars)}${"☆".repeat(emptyStars)}`;
}
