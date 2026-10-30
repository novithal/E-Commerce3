import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Search, UserRound, Menu, X, LogOut, Package
} from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const { cart, user, logout } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-[#294b37]" : "text-gray-600 hover:text-[#294b37]"
    }`;

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e7df] bg-[#faf9f6]/95 backdrop-blur">
      <div className="container-shop flex h-[76px] items-center justify-between gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#294b37] text-white">
            <ShoppingBag size={21} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Ever<span className="text-[#66866b]">Cart</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Shop</NavLink>
          <NavLink to="/orders" className={linkClass}>My Orders</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/products")}
            aria-label="Search products"
            className="rounded-lg p-2 hover:bg-[#eeeee7]"
          >
            <Search size={20} />
          </button>

          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            aria-label="My account"
            className="rounded-lg p-2 hover:bg-[#eeeee7]"
          >
            <UserRound size={20} />
          </button>

          <button
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
            className="relative rounded-lg p-2 hover:bg-[#eeeee7]"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d49a58] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            className="rounded-lg p-2 hover:bg-[#eeeee7] md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t bg-white p-4 md:hidden">
          <div className="container-shop flex flex-col gap-4">
            <Link onClick={() => setMenuOpen(false)} to="/products">Shop products</Link>
            <Link onClick={() => setMenuOpen(false)} to="/orders">My orders</Link>
            <Link onClick={() => setMenuOpen(false)} to={user ? "/profile" : "/login"}>
              My profile
            </Link>
            {user?.role === "admin" && (
              <Link onClick={() => setMenuOpen(false)} to="/admin">Admin dashboard</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-left text-red-600">
                <LogOut size={17} /> Sign out
              </button>
            ) : (
              <Link onClick={() => setMenuOpen(false)} to="/login">Sign in / Register</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}