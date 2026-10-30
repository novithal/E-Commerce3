import { useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, ShoppingBag } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Profile() {
  const { user, updateProfile } = useShop();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });
  const [message, setMessage] = useState("");

  function submit(e) {
    e.preventDefault();

    if (form.name.trim().length < 2) {
      setMessage("Please enter a valid name.");
      return;
    }

    updateProfile(form);
    setMessage("Profile updated successfully.");
  }

  return (
    <main className="container-shop py-10">
      <h1 className="section-title">My profile</h1>
      <p className="mt-2 text-gray-500">Manage your personal information.</p>

      <div className="mt-8 grid items-start gap-7 md:grid-cols-[250px_1fr]">
        <aside className="rounded-2xl border bg-white p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8ecdf] text-[#294b37]">
            <UserRound size={38} />
          </div>
          <h2 className="mt-4 text-lg font-bold">{user?.name}</h2>
          <p className="mt-1 break-all text-sm text-gray-500">{user?.email}</p>
          <div className="mt-5 border-t pt-5 text-left">
            <Link to="/orders" className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag size={17} /> My orders
            </Link>
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-2xl border bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Personal information</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="profileName" className="mb-2 block text-sm font-semibold">Full name</label>
              <input id="profileName" className="shop-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="profileEmail" className="mb-2 block text-sm font-semibold">Email address</label>
              <input id="profileEmail" className="shop-input bg-gray-50" value={user?.email ?? ""} readOnly />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed here.</p>
            </div>
            <div>
              <label htmlFor="profilePhone" className="mb-2 block text-sm font-semibold">Mobile number</label>
              <input id="profilePhone" className="shop-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number" />
            </div>
            <div>
              <label htmlFor="profileAddress" className="mb-2 block text-sm font-semibold">Default address</label>
              <textarea id="profileAddress" rows="3" className="shop-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your delivery address" />
            </div>
          </div>

          {message && (
            <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>
          )}

          <button className="shop-button mt-6">Save changes</button>
        </form>
      </div>
    </main>
  );
}