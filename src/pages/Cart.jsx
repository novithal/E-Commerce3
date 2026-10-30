import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../data/products";

export default function Cart() {
  const { cart, products, updateCartQuantity, removeFromCart } = useShop();
  const navigate = useNavigate();

  const items = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id),
  })).filter((item) => item.product);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <main className="container-shop py-20 text-center">
        <ShoppingBag size={52} className="mx-auto text-[#819681]" />
        <h1 className="mt-5 text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-gray-500">Discover something you'll love.</p>
        <Link to="/products" className="shop-button mt-7">Start shopping</Link>
      </main>
    );
  }

  return (
    <main className="container-shop py-10">
      <h1 className="section-title">Shopping cart</h1>
      <p className="mt-2 text-gray-500">{items.length} different products in your cart</p>

      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {items.map(({ product, quantity }) => (
            <article key={product.id} className="flex gap-4 rounded-2xl border border-[#e8e7df] bg-white p-4 sm:gap-6 sm:p-5">
              <img src={product.image} alt={product.name} className="h-28 w-28 rounded-xl bg-gray-100 object-cover sm:h-36 sm:w-36" />

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-500">{product.category}</p>
                <Link to={`/products/${product.id}`} className="mt-2 block font-bold hover:text-[#628268]">
                  {product.name}
                </Link>
                <p className="mt-2 font-extrabold">{money(product.price)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      aria-label={`Decrease ${product.name} quantity`}
                      className="p-2"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-8 text-center text-sm">{quantity}</span>
                    <button
                      disabled={quantity >= product.stock}
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      aria-label={`Increase ${product.name} quantity`}
                      className="p-2 disabled:opacity-30"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center gap-1 text-sm text-red-600"
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Item total: {money(product.price * quantity)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-2xl border border-[#e8e7df] bg-white p-6">
          <h2 className="text-lg font-bold">Order summary</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Delivery</span>
              <span className="font-semibold">{delivery === 0 ? "FREE" : money(delivery)}</span>
            </div>
            {subtotal > 0 && subtotal < 2000 && (
              <p className="rounded-lg bg-[#f0f2eb] p-3 text-xs leading-5 text-[#45674b]">
                Add {money(2000 - subtotal)} more to qualify for free delivery.
              </p>
            )}
            <div className="border-t pt-4">
              <div className="flex justify-between gap-3 text-base font-extrabold">
                <span>Total</span><span>{money(total)}</span>
              </div>
            </div>
          </div>

          <button onClick={() => navigate("/checkout")} className="shop-button mt-6 w-full">
            Buy Now
          </button>

          <Link to="/products" className="mt-4 block text-center text-sm font-semibold text-gray-600">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}