import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { money } from "../data/products";
import { useShop } from "../context/ShopContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useShop();
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState("");

  function handleAdd() {
    if (product.stock <= 0) return;
    addToCart(product);
    setMessage("Added to cart");
    window.setTimeout(() => setMessage(""), 1800);
  }

  return (
    <article className="product-card group overflow-hidden rounded-2xl border border-[#eae9e1] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-[#f0efe9]">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-image aspect-[4/3] w-full object-cover"
          />
        </Link>

        {product.originalPrice > product.price && (
          <span className="absolute left-3 top-3 rounded-md bg-[#294b37] px-2.5 py-1 text-xs font-bold text-white">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        )}

        <button
          onClick={() => setFavorite((value) => !value)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm ${
            favorite ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#788b76]">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mt-2 min-h-12 font-bold leading-6 text-[#26342a] hover:text-[#628268]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-sm text-amber-600">
          <Star size={15} fill="currentColor" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-lg font-extrabold">{money(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {money(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="shop-button mt-4 w-full text-sm"
        >
          <ShoppingCart size={16} />
          {product.stock <= 0 ? "Out of stock" : "Add to cart"}
        </button>

        {message && (
          <p role="status" className="mt-2 text-center text-xs font-semibold text-green-700">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}