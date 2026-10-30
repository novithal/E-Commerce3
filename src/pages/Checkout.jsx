import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../data/products";

export default function Checkout() {
  const { cart, products, user, placeOrder } = useShop();
  const navigate = useNavigate();

  const items = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.id),
  })).filter((item) => item.product);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  function update(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();

    const nextErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }
    if (form.address.trim().length < 8) {
      nextErrors.address = "Enter a complete delivery address.";
    }
    if (form.city.trim().length < 2) nextErrors.city = "Enter your city.";
    if (!/^\d{6}$/.test(form.pincode)) {
      nextErrors.pincode = "Enter a valid 6-digit PIN code.";
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (items.some((item) => item.quantity > item.product.stock)) {
      setErrorMessage("A product no longer has enough stock. Please update your cart.");
      return;
    }

    setErrors(nextErrors);
    setErrorMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const result = placeOrder({
        ...form,
        address: `${form.address.trim()}, ${form.city.trim()} - ${form.pincode}`,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      navigate("/orders", {
        state: { orderId: result.order.id },
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to place order.");
    }
  }

  if (!user) {
    return (
      <main className="container-shop py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-3 text-gray-500">You need an account to place an order.</p>
        <Link to="/login" state={{ from: "/checkout" }} className="shop-button mt-6">
          Sign in
        </Link>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="container-shop py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/products" className="shop-button mt-6">Browse products</Link>
      </main>
    );
  }

  const field = (name, label, placeholder, type = "text") => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        className="shop-input"
        placeholder={placeholder}
        required
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <main className="container-shop py-10">
      <h1 className="section-title">Checkout</h1>
      <p className="mt-2 text-gray-500">Enter your details to place your order.</p>

      <form onSubmit={submit} noValidate className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_350px]">
        <section className="rounded-2xl border border-[#e8e7df] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Delivery information</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {field("name", "Full name", "Your full name")}
            {field("email", "Email address", "you@example.com", "email")}
            {field("phone", "Mobile number", "10-digit mobile number", "tel")}
            {field("city", "City", "Your city")}
            <div className="sm:col-span-2">
              {field("address", "Street address", "House number, street, area")}
            </div>
            {field("pincode", "PIN code", "6-digit PIN code", "text")}
          </div>

          <h2 className="mt-8 text-xl font-bold">Payment method</h2>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={update}
              />
              <div>
                <p className="font-semibold">Cash on delivery</p>
                <p className="mt-1 text-xs text-gray-500">Demo payment option</p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="online-demo"
                checked={form.paymentMethod === "online-demo"}
                onChange={update}
              />
              <div>
                <p className="font-semibold">Online payment (demo)</p>
                <p className="mt-1 text-xs text-gray-500">No real payment will be processed.</p>
              </div>
            </label>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="shop-button mt-7 w-full">
            <CheckCircle2 size={18} /> Place order
          </button>
        </section>

        <aside className="rounded-2xl border border-[#e8e7df] bg-white p-6">
          <h2 className="text-lg font-bold">Your order</h2>
          <div className="mt-5 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-600">{product.name} × {quantity}</span>
                <span className="shrink-0 font-semibold">{money(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery ? money(delivery) : "FREE"}</span></div>
            <div className="flex justify-between border-t pt-4 text-base font-extrabold">
              <span>Total</span><span>{money(subtotal + delivery)}</span>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}