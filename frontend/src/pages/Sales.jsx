import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, Menu,
  PlusCircle, Loader2, AlertCircle, Receipt, ArrowLeft
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/seller/dashboard" },
  { label: "Produtos",  icon: Package,          path: "/seller/products"  },
  { label: "Vendas",    icon: ShoppingCart,      path: "/seller/sales"     },
];

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";
const labelClass = "text-zinc-400 text-sm mb-1.5 block";

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
                path === "/seller/sales"
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

// ── Listagem ──────────────────────────────────────────────────────────────────
function SalesList({ token, navigate, onAddSale }) {
  const [sales, setSales]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/seller/sales/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/login"); return; }
      const data = await res.json();
      setSales(data.vendas ?? []);
    } catch {
      setError("Não foi possível carregar suas vendas.");
    } finally {
      setLoading(false);
    }
  };

  const fmt  = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const fmtD = (iso) => new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const totalVendido = sales.reduce((acc, s) => acc + Number(s.preco_unitario) * Number(s.quantidade), 0);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Vendas</h2>
          <p className="text-sm text-zinc-500 mt-1">Histórico de todas as suas vendas</p>
        </div>
        <button
          onClick={onAddSale}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Nova venda
        </button>
      </div>

      {!loading && !error && sales.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Total vendido</p>
            <p className="text-xl font-bold text-white mt-0.5">{fmt(totalVendido)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Transações</p>
            <p className="text-xl font-bold text-white mt-0.5">{sales.length}</p>
          </div>
        </div>
      )}

      {loading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>}

      {error && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-red-900/40 bg-red-900/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
        </div>
      )}

      {!loading && !error && sales.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Receipt className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="font-medium text-zinc-300">Nenhuma venda registrada</p>
          <p className="text-sm text-zinc-600 mt-1 mb-6">Registre sua primeira venda.</p>
          <button onClick={onAddSale} className="flex items-center gap-2 h-10 px-6 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 cursor-pointer">
            <PlusCircle className="h-4 w-4" />Nova venda
          </button>
        </div>
      )}

      {!loading && !error && sales.length > 0 && (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="text-left px-4 py-3 text-zinc-500 font-medium">Produto</th>
                <th className="text-right px-4 py-3 text-zinc-500 font-medium">Qtd</th>
                <th className="text-right px-4 py-3 text-zinc-500 font-medium">Preço unit.</th>
                <th className="text-right px-4 py-3 text-zinc-500 font-medium">Total</th>
                <th className="text-right px-4 py-3 text-zinc-500 font-medium hidden sm:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
              {[...sales].reverse().map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{s.produto_nome ?? `Produto #${s.produto_id}`}</td>
                  <td className="px-4 py-3 text-zinc-300 text-right">{s.quantidade}</td>
                  <td className="px-4 py-3 text-zinc-300 text-right">{fmt(s.preco_unitario)}</td>
                  <td className="px-4 py-3 text-white font-semibold text-right">{fmt(Number(s.preco_unitario) * Number(s.quantidade))}</td>
                  <td className="px-4 py-3 text-zinc-500 text-right whitespace-nowrap hidden sm:table-cell">{s.data_venda ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Formulário nova venda ──────────────────────────────────────────────────────
function AddSaleForm({ token, navigate, onBack, onSuccess }) {
  const [products, setProducts]               = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [form, setForm]                       = useState({ produto_id: "", quantidade: "" });
  const [erros, setErros]                     = useState({});
  const [loading, setLoading]                 = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/seller/products/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/login"); return; }
      const data = await res.json();
      // ← troca essa linha:
      // setProducts(data.filter((p) => p.status !== "Inativo" && p.quantidade > 0));
      // por essa:
      setProducts((data.produtos ?? []).filter((p) => p.status !== "Inativo" && p.quantidade > 0));
    } catch {
      alert("Erro ao carregar produtos.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const selectedProduct = products.find((p) => String(p.id) === String(form.produto_id));

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const validar = () => {
    const novosErros = {};
    if (!form.produto_id) novosErros.produto_id = "Selecione um produto.";
    const qty = Number(form.quantidade);
    if (!form.quantidade || isNaN(qty) || qty <= 0)
      novosErros.quantidade = "Quantidade inválida.";
    else if (selectedProduct && qty > selectedProduct.quantidade)
      novosErros.quantidade = `Estoque disponível: ${selectedProduct.quantidade}.`;
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/seller/sales/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ produto_id: Number(form.produto_id), quantidade: Number(form.quantidade) }),
      });
      const data = await res.json();
      if (res.ok) { alert("Venda registrada com sucesso!"); onSuccess(); }
      else alert(data.message || "Erro ao registrar venda.");
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const totalPreview = selectedProduct && form.quantidade
    ? Number(selectedProduct.preco) * Number(form.quantidade)
    : null;

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Nova venda</h2>
          <p className="text-sm text-zinc-500 mt-1">Informe o produto e a quantidade vendida.</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">

          <div>
            <label className={labelClass}>Produto</label>
            {loadingProducts ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando produtos...
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 text-sm text-zinc-500">
                <Package className="h-4 w-4 flex-shrink-0" />
                Nenhum produto ativo com estoque disponível.
              </div>
            ) : (
              <select
                value={form.produto_id}
                onChange={(e) => atualizar("produto_id", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {fmt(p.preco)} ({p.quantidade} em estoque)
                  </option>
                ))}
              </select>
            )}
            {erros.produto_id && <p className="text-red-400 text-xs mt-1">{erros.produto_id}</p>}
          </div>

          <div>
            <label className={labelClass}>Quantidade</label>
            <input
              placeholder="Ex: 2"
              value={form.quantidade}
              onChange={(e) => atualizar("quantidade", e.target.value.replace(/\D/g, ""))}
              className={inputClass}
            />
            {erros.quantidade && <p className="text-red-400 text-xs mt-1">{erros.quantidade}</p>}
          </div>

          {totalPreview !== null && (
            <div className="rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total da venda</span>
              <span className="text-lg font-bold text-white">{fmt(totalPreview)}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || products.length === 0}
            className="w-full h-11 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</> : "Registrar venda"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function Sales() {
  const [view, setView]             = useState("list");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => { if (!token) navigate("/login"); }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar
        onNavigate={navigate}
        onLogout={() => { localStorage.removeItem("token"); navigate("/login"); }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-white font-bold tracking-tight">MINHA LOJA</h1>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
          {view === "list"
            ? <SalesList token={token} navigate={navigate} onAddSale={() => setView("add")} />
            : <AddSaleForm token={token} navigate={navigate} onBack={() => setView("list")} onSuccess={() => setView("list")} />
          }
        </main>
      </div>
    </div>
  );
}