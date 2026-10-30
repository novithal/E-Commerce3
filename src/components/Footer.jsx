
import { Link } from "react-router-dom";
import { ShoppingBag, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#203a2b] text-white">
      <div className="container-shop grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag size={23} />
            EverCart
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
            Thoughtfully selected everyday essentials for your lifestyle.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Explore</h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <Link to="/">Home</Link>
            <Link to="/products">All products</Link>
            <Link to="/cart">Shopping cart</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Your account</h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <Link to="/profile">My profile</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Stay connected</h3>

          <p className="flex items-center gap-2 text-sm text-white/70">
            <Mail size={17} />
            hello@evercart.example
          </p>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="mt-3 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded border border-current text-[10px] font-bold">
              IG
            </span>
            Follow our store
          </a>
        </div>
      </div>

      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} EverCart. Demo e-commerce application.
      </div>
    </footer>
  );
}
