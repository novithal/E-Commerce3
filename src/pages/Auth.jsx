import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Auth() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const { login, register } = useShop();

  const isRegister = pathname === "/register";

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function update(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (isRegister && form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (isRegister) {
      if (form.password.length < 8) {
        nextErrors.password = "Use at least 8 characters.";
      } else if (!/[A-Z]/.test(form.password) ||
                 !/[a-z]/.test(form.password) ||
                 !/\d/.test(form.password)) {
        nextErrors.password = "Include uppercase, lowercase and a number.";
      }

      if (form.confirmPassword !== form.password) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }
    } else if (!form.password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length) return;

    const result = isRegister
      ? register(form)
      : login(form.email, form.password);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate(state?.from || (result.user.role === "admin" ? "/admin" : "/profile"), {
      replace: true,
    });
  }

  const inputClass = "shop-input";

  return (
    <main className="container-shop grid min-h-[70vh] items-center gap-10 py-12 md:grid-cols-2">
      <div className="hidden rounded-3xl bg-[#e8ecdf] p-10 md:block lg:p-14">
        <ShoppingBag size={42} className="text-[#294b37]" />
        <h1 className="mt-8 text-4xl font-extrabold leading-tight text-[#294b37]">
          A better way to shop for everyday life.
        </h1>
        <p className="mt-5 leading-7 text-[#58665a]">
          Sign in to view your orders, manage your profile and enjoy a simpler shopping experience.
        </p>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
          alt="Lifestyle retail store"
          className="mt-8 h-52 w-full rounded-2xl object-cover"
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-[#71866e]">
          Welcome to EverCart
        </p>
        <h2 className="mt-3 text-3xl font-extrabold">
          {isRegister ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          {isRegister ? "Fill in your details to get started." : "Sign in to continue shopping."}
        </p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          {isRegister && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">Full name</label>
              <input id="name" name="name" value={form.name} onChange={update} className={inputClass} placeholder="Your name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email address</label>
            <input id="email" type="email" name="email" value={form.email} onChange={update} className={inputClass} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={update}
                className={`${inputClass} pr-12`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {isRegister && (
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">Confirm password</label>
              <input id="confirmPassword" type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={update} className={inputClass} placeholder="Repeat your password" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          )}

          {message && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>
          )}

          <button className="shop-button w-full" type="submit">
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isRegister ? "Already have an account?" : "New to EverCart?"}{" "}
          <Link className="font-bold text-[#294b37]" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>

        {!isRegister && (
          <div className="mt-6 rounded-xl bg-[#f0f2eb] p-4 text-xs leading-6 text-gray-600">
            <strong>Demo admin account</strong>
            <br />Email: admin@shop.com
            <br />Password: Admin@123
          </div>
        )}
      </div>
    </main>
  );
}