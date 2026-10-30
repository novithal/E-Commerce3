import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialProducts } from "../data/products";

const ShopContext = createContext(null);

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const demoAdmin = {
  id: "admin-demo",
  name: "EverCart Admin",
  email: "admin@shop.com",
  password: "Admin123",
  role: "admin",
  phone: "",
  address: "",
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() =>
    readStorage("evercart_products", initialProducts)
  );
  const [cart, setCart] = useState(() => readStorage("evercart_cart", []));
  const [users, setUsers] = useState(() => {
    const saved = readStorage("evercart_users", []);
    return saved.some((u) => u.email === demoAdmin.email) ? saved : [...saved, demoAdmin];
  });
  const [user, setUser] = useState(() => readStorage("evercart_user", null));
  const [orders, setOrders] = useState(() => readStorage("evercart_orders", []));

  useEffect(() => localStorage.setItem("evercart_products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("evercart_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("evercart_users", JSON.stringify(users)), [users]);
  useEffect(() => {
    if (user) localStorage.setItem("evercart_user", JSON.stringify(user));
    else localStorage.removeItem("evercart_user");
  }, [user]);
  useEffect(() => localStorage.setItem("evercart_orders", JSON.stringify(orders)), [orders]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock < 1) return { ok: false, message: "Product is out of stock." };
    const current = cart.find((item) => item.id === product.id)?.quantity || 0;
    if (current + quantity > product.stock) {
      return { ok: false, message: `Only ${product.stock} units are available.` };
    }
    setCart((prev) => {
      const found = prev.some((item) => item.id === product.id);
      return found
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { id: product.id, quantity }];
    });
    return { ok: true };
  };

  const updateCartQuantity = (id, quantity) => {
    const product = products.find((item) => item.id === id);
    if (!product || quantity < 1) return;
    setCart((prev) => prev.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(quantity, product.stock) } : item
    ));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const login = (email, password) => {
    const found = users.find((item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    );
    if (!found) return { ok: false, message: "Invalid email or password." };
    const { password: ignored, ...safeUser } = found;
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const register = (form) => {
    const email = form.email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === email)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      email,
      password: form.password,
      role: "customer",
      phone: "",
      address: "",
    };
    setUsers((prev) => [...prev, newUser]);
    const { password: ignored, ...safeUser } = newUser;
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const logout = () => setUser(null);

  const updateProfile = (changes) => {
    if (!user) return;
    const updated = { ...user, ...changes };
    setUser(updated);
    setUsers((prev) => prev.map((item) => item.id === user.id ? { ...item, ...changes } : item));
  };

  const addProduct = (product) => {
    const next = { ...product, id: Date.now() };
    setProducts((prev) => [next, ...prev]);
    return next;
  };

  const editProduct = (id, changes) => {
    setProducts((prev) => prev.map((item) => item.id === id ? { ...item, ...changes, id } : item));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = (details) => {
    if (!user) return { ok: false, message: "Please sign in before placing an order." };
    if (!cart.length) return { ok: false, message: "Your cart is empty." };
    const orderItems = cart.map((line) => {
      const product = products.find((item) => item.id === line.id);
      return product ? { ...product, quantity: line.quantity } : null;
    }).filter(Boolean);
    if (orderItems.length !== cart.length) return { ok: false, message: "A product in your cart is no longer available." };
    const unavailable = orderItems.find((item) => item.quantity > item.stock);
    if (unavailable) return { ok: false, message: `${unavailable.name} has insufficient stock.` };
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal >= 2000 ? 0 : 99;
    const order = {
      id: `EC${Date.now()}`,
      userId: user.id,
      items: orderItems,
      total: subtotal + delivery,
      subtotal,
      delivery,
      address: details.address,
      paymentMethod: details.paymentMethod,
      customer: { name: details.name, email: details.email, phone: details.phone },
      status: "Order placed",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    setProducts((prev) => prev.map((product) => {
      const ordered = orderItems.find((item) => item.id === product.id);
      return ordered ? { ...product, stock: product.stock - ordered.quantity } : product;
    }));
    setCart([]);
    return { ok: true, order };
  };

  const value = useMemo(() => ({
    products, cart, users, user, orders, addToCart, updateCartQuantity,
    removeFromCart, login, register, logout, updateProfile,
    addProduct, editProduct, deleteProduct, placeOrder,
  }), [products, cart, users, user, orders]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
