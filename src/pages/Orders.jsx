import { Link, useLocation } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../data/products";

export default function Orders() {
  const { user, orders } = useShop();
  const location = useLocation();

  const myOrders = orders.filter((order) => order.userId === user?.id);

  return (
    <main className="container-shop py-10">
      <h1 className="section-title">My orders</h1>
      <p className="mt-2 text-gray-500">Review your purchases and order details.</p>

      {location.state?.orderId && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <div className="flex items-center gap-2 font-bold">
            <PackageCheck size={21} /> Order placed successfully!
          </div>
          <p className="mt-1 text-sm">Order number: {location.state.orderId}</p>
        </div>
      )}

      {myOrders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <PackageCheck size={42} className="mx-auto text-[#819681]" />
          <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-500">Your completed checkout orders will appear here.</p>
          <Link to="/products" className="shop-button mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {myOrders.map((order) => (
            <article key={order.id} className="overflow-hidden rounded-2xl border border-[#e8e7df] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-[#f5f5ef] p-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Order number</p>
                  <p className="mt-1 font-bold">{order.id}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                    {order.status}
                  </span>
                  <p className="mt-2 font-extrabold">{money(order.total)}</p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold">{money(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 text-sm text-gray-500">
                  Deliver to: {order.address}
                  <br />
                  Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Online demo payment"}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}