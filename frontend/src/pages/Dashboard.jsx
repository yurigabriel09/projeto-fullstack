import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, Menu,
  TrendingUp, DollarSign, Archive, AlertTriangle, Loader2
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/seller/dashboard" },
  { label: "Produtos",  icon: Package,          path: "/seller/products"  },
  { label: "Vendas",    icon: ShoppingCart,      path: "/seller/sales"     },
];

function Sidebar({ onNavigate, onLogout, mobileOpen, onClose }) {
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
                path === "/seller/dashboard"
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

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    green:  { bg: "bg-green-900/20",  text: "text-green-400"  },
    blue:   { bg: "bg-blue-900/20",   text: "text-blue-400"   },
    yellow: { bg: "bg-yellow-900/20", text: "text-yellow-400" },
    red:    { bg: "bg-red-900/20",    text: "text-red-400"    },
  };
  const c = colors[color] ?? colors.blue;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [sales, setSales]         = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSales, resProducts] = await Promise.all([
        fetch("http://localhost:5000/seller/sales/list",    { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/seller/products/list", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resSales.status === 401 || resProducts.status === 401) { navigate("/login"); return; }
      const [salesData, productsData] = await Promise.all([resSales.json(), resProducts.json()]);
      setSales(salesData.vendas ?? []);
      setProducts(productsData.produtos ?? []);
    } catch {
      // silently fail — cards mostrarão zero
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // Métricas
  const totalVendido    = sales.reduce((acc, s) => acc + Number(s.preco_unitario) * Number(s.quantidade), 0);
  const totalTransacoes = sales.length;
  const totalEstoque    = products.reduce((acc, p) => acc + Number(p.quantidade), 0);
  const semEstoque      = products.filter((p) => p.quantidade === 0).length;
  const estoquebaixo    = products.filter((p) => p.quantidade > 0 && p.quantidade <= 5).length;
  const recentSales     = [...sales].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar
        onNavigate={navigate}
        onLogout={() => { localStorage.removeItem("token"); navigate("/login"); }}
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-zinc-500 mt-1">Visão geral do seu negócio</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          ) : (
            <>
              {/* Cards de métricas */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                  icon={DollarSign}
                  label="Total vendido"
                  value={formatPrice(totalVendido)}
                  sub={`${totalTransacoes} transação${totalTransacoes !== 1 ? "ões" : ""}`}
                  color="green"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Vendas realizadas"
                  value={totalTransacoes}
                  sub="total de registros"
                  color="blue"
                />
                <StatCard
                  icon={Archive}
                  label="Itens em estoque"
                  value={totalEstoque}
                  sub={`${products.length} produto${products.length !== 1 ? "s" : ""} cadastrado${products.length !== 1 ? "s" : ""}`}
                  color="yellow"
                />
                <StatCard
                  icon={AlertTriangle}
                  label="Alertas de estoque"
                  value={semEstoque + estoquebaixo}
                  sub={`${semEstoque} esgotado${semEstoque !== 1 ? "s" : ""} · ${estoquebaixo} crítico${estoquebaixo !== 1 ? "s" : ""}`}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Últimas vendas */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Últimas vendas</h3>
                    <button
                      onClick={() => navigate("/seller/sales")}
                      className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Ver todas →
                    </button>
                  </div>
                  {recentSales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-600">
                      <ShoppingCart className="h-8 w-8 mb-2" />
                      <p className="text-sm">Nenhuma venda ainda</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-zinc-800">
                      {recentSales.map((s) => (
                        <li key={s.id} className="flex items-center justify-between px-5 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {s.produto_nome ?? `Produto #${s.produto_id}`}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {s.quantidade} un · {s.created_at ? formatDate(s.created_at) : "—"}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-white ml-4 flex-shrink-0">
                            {formatPrice(Number(s.preco_unitario) * Number(s.quantidade))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Situação do estoque */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Situação do estoque</h3>
                    <button
                      onClick={() => navigate("/seller/products")}
                      className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Ver produtos →
                    </button>
                  </div>
                  {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-600">
                      <Package className="h-8 w-8 mb-2" />
                      <p className="text-sm">Nenhum produto cadastrado</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-zinc-800">
                      {[...products]
                        .sort((a, b) => a.quantidade - b.quantidade)
                        .slice(0, 5)
                        .map((p) => (
                          <li key={p.id} className="flex items-center justify-between px-5 py-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{p.nome}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{p.marca} · {p.categoria}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-4 ${
                              p.quantidade === 0
                                ? "bg-red-900/20 text-red-400"
                                : p.quantidade <= 5
                                ? "bg-yellow-900/20 text-yellow-500"
                                : "bg-green-900/20 text-green-500"
                            }`}>
                              {p.quantidade === 0 ? "Esgotado" : `${p.quantidade} un`}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}