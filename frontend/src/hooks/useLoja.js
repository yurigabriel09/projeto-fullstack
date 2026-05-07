import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export function useLoja() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["Todos"]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [favoritos, setFavoritos] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  const isLogado = !!localStorage.getItem("token");

  // Persistir carrinho
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Buscar produtos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/products`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setAllProducts(data);
        const cats = ["Todos", ...new Set(data.map((p) => p.categoria).filter(Boolean))];
        setCategories(cats);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar por categoria
  useEffect(() => {
    if (activeCategory === "Todos") {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter((p) => p.categoria === activeCategory));
    }
  }, [activeCategory, allProducts]);

  // Carrinho
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.preco * item.qty, 0);

  const addToCart = (product) => {
    if (!isLogado) return false;
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    return true;
  };

  const removeFromCart = (productId, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === productId);
      if (!exists) return prev;
      if (exists.qty <= qty) return prev.filter((i) => i.id !== productId);
      return prev.map((i) =>
        i.id === productId ? { ...i, qty: i.qty - qty } : i
      );
    });
  };

  const clearCart = () => setCartItems([]);

  // Favoritos
  const toggleFavorito = (id) => {
    if (!isLogado) return false;
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    return true;
  };

  // Auth
  const logout = () => {
    localStorage.removeItem("token");
    setFavoritos([]);
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // Formato de preço
  const formatPrice = (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return {
    products,
    loading,
    error,
    categories,
    activeCategory,
    setActiveCategory,
    cartCount,
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    toggleFavorito,
    favoritos,
    formatPrice,
    isLogado,
    logout,
  };
}