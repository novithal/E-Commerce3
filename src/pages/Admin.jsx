import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit2, Package, Plus, Search, Trash2, X } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../data/products";

const emptyForm = {
  name: "",
  category: "Fashion",
  price: "",
  originalPrice: "",
  rating: "4.5",
  reviews: "0",
  stock: "10",
  description: "",
  image: "",
  featured: false,
};

const categories = ["Fashion", "Electronics", "Accessories", "Home"];

export default function Admin() {
  const { products, addProduct, editProduct, deleteProduct } = useShop();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || product.category === category)
  ), [products, search, category]);

  function startAdd() {
    setEditing("new");
    setForm(emptyForm);
    setErrors({});
    setMessage("");
  }

  function startEdit(product) {
    setEditing(product.id);
    setForm({
      ...product,
      price: String(product.price),
      originalPrice: String(product.originalPrice ?? product.price),
      rating: String(product.rating),
      reviews: String(product.reviews),
      stock: String(product.stock),
    });
    setErrors({});
    setMessage("");
  }

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submit(e) {
    e.preventDefault();

    const nextErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = "Enter a product name.";
    if (!form.description.trim()) nextErrors.description = "Enter a description.";
    if (!form.image.trim()) nextErrors.image = "Enter an image URL.";

    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      nextErrors.price = "Price must be greater than zero.";
    }

    if (
      !Number.isFinite(Number(form.originalPrice)) ||
      Number(form.originalPrice) < Number(form.price)
    ) {
      nextErrors.originalPrice = "Original price must be at least the selling price.";
    }

    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      nextErrors.stock = "Stock must be a non-negative whole number.";
    }

    if (!Number.isFinite(Number(form.rating)) ||
        Number(form.rating) < 0 ||
        Number(form.rating) > 5) {
      nextErrors.rating = "Rating must be between 0 and 5.";
    }

    if (!Number.isInteger(Number(form.reviews)) || Number(form.reviews) < 0) {
      nextErrors.reviews = "Reviews must be a non-negative whole number.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const product = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      stock: Number(form.stock),
    };

    if (editing === "new") {
      addProduct(product);
      setMessage("Product added successfully.");
    } else {
      editProduct(editing, product);
      setMessage("Product updated successfully.");
    }

    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  }

  function confirmDelete() {
    deleteProduct(deleteId);
    setDeleteId(null);
    setMessage("Product deleted successfully.");
  }

  const field = (name, label, type = "text") => (
    <div>
      <label htmlFor={`admin-${name}`} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={`admin-${name}`}
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        className="shop-input"
        required
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <main className="container-shop py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#71866e]">
            Store administration
          </p>
          <h1 className="section-title mt-2">Product management</h1>
          <p className="mt-2 text-gray-500">Manage your catalog and inventory.</p>
        </div>

        <button onClick={startAdd} className="shop-button">
          <Plus size={18} /> Add product
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Total products", value: products.length },
          { title: "Available stock", value: products.reduce((sum, p) => sum + p.stock, 0) },
          { title: "Out of stock", value: products.filter((p) => p.stock === 0).length },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-[#e8e7df] bg-white p-5">
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="mt-2 text-3xl font-extrabold">{item.value}</p>
          </div>
        ))}
      </div>

      {message && (
        <div role="status" className="mt-5 flex items-center justify-between rounded-lg bg-green-50 p-4 text-sm text-green-800">
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss message"><X size={17} /></button>
        </div>
      )}

      {editing !== null && (
        <form onSubmit={submit} noValidate className="mt-7 rounded-2xl border border-[#e8e7df] bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              {editing === "new" ? "Add new product" : "Edit product"}
            </h2>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close form">
              <X />
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {field("name", "Product name")}
            <div>
              <label htmlFor="admin-category" className="mb-1.5 block text-sm font-semibold">Category</label>
              <select id="admin-category" name="category" value={form.category} onChange={update} className="shop-input">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {field("price", "Selling price (₹)", "number")}
            {field("originalPrice", "Original price (₹)", "number")}
            {field("stock", "Stock quantity", "number")}
            {field("rating", "Rating (0–5)", "number")}
            {field("reviews", "Review count", "number")}
            <div className="sm:col-span-2 lg:col-span-3">
              {field("image", "Image URL", "url")}
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="admin-description" className="mb-1.5 block text-sm font-semibold">Description</label>
              <textarea id="admin-description" name="description" rows="3" value={form.description} onChange={update} className="shop-input" required />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="featured" checked={Boolean(form.featured)} onChange={update} />
              Feature this product on the home page
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="shop-button" type="submit">
              {editing === "new" ? "Create product" : "Save changes"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-5 py-3 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#e8e7df] bg-white">
        <div className="flex flex-wrap gap-3 border-b p-5">
          <div className="relative min-w-48 flex-1">
            <Search size={17} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              className="shop-input pl-10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="shop-input w-auto min-w-40">
            <option value="All">All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead className="bg-[#f5f5ef] text-gray-600">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <Link to={`/products/${product.id}`} className="mt-1 block text-xs text-[#628268]">
                          View product
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 font-semibold">{money(product.price)}</td>
                  <td className="p-4">
                    <span className={product.stock === 0 ? "font-bold text-red-600" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(product)} aria-label={`Edit ${product.name}`} className="rounded-lg border p-2 hover:bg-gray-50">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} aria-label={`Delete ${product.name}`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <Package size={30} className="mx-auto mb-3" />
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {deleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="delete-title" className="text-xl font-bold">Delete product?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              This will remove the product from the catalog and remove it from any current cart.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-lg border px-4 py-3 font-semibold">
                Cancel
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700">
                Delete product
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}