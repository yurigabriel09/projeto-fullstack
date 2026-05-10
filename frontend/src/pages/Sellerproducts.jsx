import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, PlusCircle, Pencil, Trash2, Loader2, AlertCircle, LayoutDashboard, ShoppingCart, LogOut, Menu } from "lucide-react";

const navLinks = [
  { label: "Dashboard",  icon: LayoutDashboard, path: "/seller/dashboard" },
  { label: "Produtos",   icon: Package,          path: "/seller/products"  },
  { label: "Vendas",     icon: ShoppingCart,     path: "/seller/sales"     },
];

function Sidebar({ current, onNavigate, onLogout, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col
        transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <h1 className="text-white font-bold text-lg tracking-tight">MINHA LOJA</h1>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navLinks.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => { onNavigate(path); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                current === path
                  ? "bg-white text-zinc-950"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default function SellerProducts() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/seller/products/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/login"); return; }
      const data = await res.json();
      setProducts(data.produtos || []);
    } catch {
      setError("Não foi possível carregar seus produtos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/seller/product/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
      else alert("Erro ao excluir produto.");
    } catch {
      alert("Erro de conexão.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatPrice = (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar
        current="/seller/products"
        onNavigate={navigate}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-white font-bold tracking-tight">MINHA LOJA</h1>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Meus Produtos</h2>
              <p className="text-sm text-zinc-500 mt-1">Gerencie seus produtos cadastrados</p>
            </div>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Novo produto
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center gap-3 rounded-lg border border-red-900/40 bg-red-900/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="h-12 w-12 text-zinc-700 mb-4" />
              <p className="font-medium text-zinc-300">Nenhum produto cadastrado</p>
              <p className="text-sm text-zinc-600 mt-1 mb-6">Comece adicionando seu primeiro produto.</p>
              <button
                onClick={() => navigate("/seller/add-product")}
                className="flex items-center gap-2 h-10 px-6 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar produto
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-colors"
                >
                  <div className="aspect-[4/3] bg-zinc-800 overflow-hidden">
                    {p.foto ? (
                      <img
                        src={`http://localhost:5000/${p.foto}`}
                        alt={p.nome}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-700">
                        <Package className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {p.status === 0 && (
                    <div className="absolute top-3 left-3 bg-zinc-950/80 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                      Inativo
                    </div>
                  )}

                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">{p.marca}</p>
                    <h3 className="font-semibold mt-0.5 line-clamp-1 text-white">{p.nome}</h3>
                    <p className="text-sm font-bold mt-1 text-white">{formatPrice(p.preco)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.quantidade === 0
                          ? "bg-red-900/20 text-red-400"
                          : p.quantidade <= 5
                          ? "bg-yellow-900/20 text-yellow-500"
                          : "bg-green-900/20 text-green-500"
                      }`}>
                        {p.quantidade === 0 ? "Esgotado" : `${p.quantidade} em estoque`}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/seller/edit-product/${p.id}`)}
                          className="p-1.5 rounded-md hover:bg-zinc-800 cursor-pointer text-zinc-500 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-md hover:bg-red-900/20 cursor-pointer text-zinc-500 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          {deletingId === p.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}