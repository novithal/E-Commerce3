import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart } = useShop();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const product = products.find((item) => String(item.id) === id);

  if (!product) {
    return (
      <main className="container-shop py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="shop-button mt-5">Back to shop</Link>
      </main>
    );
  }

  function handleAdd() {
    addToCart(product, quantity);
    setMessage("Product added to your cart.");
  }

  return (
    <main className="container-shop py-10">
      <Link to="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#294b37]">
        <ArrowLeft size={17} /> Back to products
      </Link>

      <div className="mt-7 grid items-start gap-9 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-3xl bg-white">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="py-3">
          <p className="text-sm font-bold uppercase tracking-widest text-[#71866e]">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-amber-600">
            <Star size={18} fill="currentColor" />
            <strong>{product.rating}</strong>
            <span className="text-sm text-gray-500">
              ({product.reviews} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-extrabold">{money(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {money(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-7 text-gray-600">{product.description}</p>

          <p className={`mt-5 text-sm font-semibold ${product.stock > 0 ? "text-green-700" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-10 text-center font-semibold">{quantity}</span>
              <button
                disabled={quantity >= product.stock}
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-3 disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button disabled={product.stock <= 0} onClick={handleAdd} className="shop-button mt-7 w-full sm:w-auto">
            <ShoppingCart size={18} /> Add to cart
          </button>

          {message && (
            <div role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              {message}
              <button onClick={() => navigate("/cart")} className="ml-2 font-bold underline">
                View cart
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}