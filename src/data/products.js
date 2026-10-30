export const initialProducts = [
  {
    id: 1,
    name: "Classic Everyday Sneakers",
    category: "Fashion",
    price: 1899,
    originalPrice: 2499,
    rating: 4.6,
    reviews: 124,
    stock: 25,
    featured: true,
    description:
      "Comfortable everyday sneakers with a clean, versatile design and cushioned soles.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 3299,
    originalPrice: 4299,
    rating: 4.8,
    reviews: 215,
    stock: 18,
    featured: true,
    description:
      "Enjoy immersive audio, comfortable ear cushions, and wireless listening for everyday use.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Minimal Leather Backpack",
    category: "Accessories",
    price: 1599,
    originalPrice: 1999,
    rating: 4.4,
    reviews: 87,
    stock: 14,
    featured: true,
    description:
      "A practical backpack with a minimalist look, spacious compartments, and durable construction.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Modern Table Lamp",
    category: "Home",
    price: 1299,
    originalPrice: 1699,
    rating: 4.5,
    reviews: 68,
    stock: 12,
    featured: true,
    description:
      "A modern decorative lamp that adds warm, comfortable lighting to your living space.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Classic Analog Watch",
    category: "Accessories",
    price: 2199,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 146,
    stock: 20,
    featured: false,
    description:
      "A timeless analog watch with a clean dial and a design suitable for everyday outfits.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Cotton Casual Shirt",
    category: "Fashion",
    price: 999,
    originalPrice: 1399,
    rating: 4.3,
    reviews: 52,
    stock: 30,
    featured: false,
    description:
      "A versatile cotton shirt designed for comfortable daily wear and casual occasions.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 1799,
    originalPrice: 2299,
    rating: 4.5,
    reviews: 104,
    stock: 16,
    featured: false,
    description:
      "A compact wireless speaker for music at home, outdoors, and on the go.",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 699,
    originalPrice: 899,
    rating: 4.2,
    reviews: 39,
    stock: 22,
    featured: false,
    description:
      "A stylish ceramic mug set for your morning coffee, tea, and everyday kitchen use.",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
  },
];

export const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);