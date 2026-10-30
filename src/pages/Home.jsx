import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products } = useShop();
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <main>
      <section className="container-shop py-7 sm:py-10">
        <div className="grid overflow-hidden rounded-3xl bg-[#e8ecdf] md:grid-cols-2">
          <div className="flex flex-col items-start justify-center p-7 sm:p-12 lg:p-16">
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#45674b]">
              Everyday essentials, elevated
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#253b2c] sm:text-5xl lg:text-6xl">
              Find your
              <br /> everyday
              <br />
              <span className="font-serif italic text-[#738c6c]">favorites.</span>
            </h1>

            <p className="mt-5 max-w-md leading-7 text-[#58665a]">
              Discover thoughtfully selected products for your home,
              wardrobe and everyday life.
            </p>

            <Link to="/products" className="shop-button mt-7">
              Explore collection <ArrowRight size={18} />
            </Link>

            <p className="mt-5 text-sm text-[#58665a]">
              Free delivery on orders above ₹2,000
            </p>
          </div>

          <div className="min-h-[300px] overflow-hidden bg-[#dfe5d6]">
           <img
  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=85"
  alt="Modern lifestyle shopping collection"
  className="h-full w-full object-cover"
/>
          </div>
        </div>
      </section>

      <section className="container-shop py-9">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#71866e]">
              Handpicked for you
            </p>
            <h2 className="section-title mt-2">Featured products</h2>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-[#294b37]">
            View all <ArrowRight size={17} />
          </Link>
        </div>

        {featured.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-gray-500">
            No featured products available.
          </p>
        )}
      </section>

      <section className="container-shop mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Reliable delivery", text: "Delivery charges calculated at checkout." },
          { icon: ShieldCheck, title: "Secure experience", text: "Simple, transparent demo checkout." },
          { icon: Headphones, title: "Customer first", text: "A straightforward shopping experience." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 rounded-xl border border-[#e9e8df] bg-white p-5">
            <Icon className="shrink-0 text-[#628268]" size={25} />
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}