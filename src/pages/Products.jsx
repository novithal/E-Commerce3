import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { products } = useShop();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState("0");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = useMemo(() => {
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || product.category === category) &&
      product.price <= maxPrice &&
      product.rating >= Number(minRating)
    );

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") result.sort((a, b) => Number(b.featured) - Number(a.featured));

    return result;
  }, [products, search, category, sort, maxPrice, minRating]);

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSort("featured");
    setMaxPrice(10000);
    setMinRating("0");
  }

  return (
    <main className="container-shop py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-[#71866e]">
        Discover something good
      </p>
      <h1 className="section-title mt-2">Shop all products</h1>
      <p className="mt-2 text-gray-500">Find the right products for your everyday needs.</p>

      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[245px_1fr]">
        <aside className="rounded-2xl border border-[#e8e7df] bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <SlidersHorizontal size={18} /> Filters
          </h2>

          <label className="mt-5 block text-sm font-semibold">Search</label>
          <div className="relative mt-2">
            <Search size={17} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              className="shop-input pl-10"
              placeholder="Find products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className="mt-5 block text-sm font-semibold">Category</label>
          <select
            className="shop-input mt-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-semibold">
            Maximum price: ₹{maxPrice.toLocaleString("en-IN")}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-[#294b37]"
          />

          <label className="mt-5 block text-sm font-semibold">Minimum rating</label>
          <select
            className="shop-input mt-2"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="0">All ratings</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>

          <button onClick={resetFilters} className="mt-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50">
            Reset filters
          </button>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing <strong>{filtered.length}</strong> of {products.length} products
            </p>

            <select
              aria-label="Sort products"
              className="shop-input w-auto min-w-48"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Highest rated</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <h2 className="text-lg font-bold">No products found</h2>
              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
              <button onClick={resetFilters} className="shop-button mt-5">
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}