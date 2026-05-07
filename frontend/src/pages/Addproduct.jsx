import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2, ImagePlus } from "lucide-react";

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";
const labelClass = "text-zinc-400 text-sm mb-1.5 block";

export default function AddProduct() {
  const { id } = useParams(); // se tiver id, é edição
  const isEdit = !!id;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nome: "",
    marca: "",
    preco: "",
    quantidade: "",
    categoria: "",
    descricao: "",
  });
  const [foto, setFoto] = useState(null);       // File object
  const [preview, setPreview] = useState(null); // URL de preview
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (isEdit) loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/seller/product/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { navigate("/seller/products"); return; }
      const data = await res.json();
      const p = data.produto;
      setForm({
        nome: p.nome || "",
        marca: p.marca || "",
        preco: p.preco?.toString() || "",
        quantidade: p.quantidade?.toString() || "",
        categoria: p.categoria || "",
        descricao: p.descricao || "",
      });
      if (p.foto) setPreview(`http://localhost:5000/${p.foto}`);
    } catch {
      navigate("/seller/products");
    } finally {
      setLoadingData(false);
    }
  };

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setErros((prev) => ({ ...prev, foto: "" }));
  };

  const removerFoto = () => {
    setFoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.marca.trim()) novosErros.marca = "Marca é obrigatória.";
    if (!form.preco || isNaN(Number(form.preco.replace(",", "."))) || Number(form.preco.replace(",", ".")) <= 0)
      novosErros.preco = "Preço inválido.";
    if (!form.quantidade || isNaN(Number(form.quantidade)) || Number(form.quantidade) < 0)
      novosErros.quantidade = "Quantidade inválida.";
    if (!form.categoria.trim()) novosErros.categoria = "Categoria é obrigatória.";
    if (!isEdit && !foto) novosErros.foto = "Selecione uma foto.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        body.append(k, k === "preco" ? v.replace(",", ".") : v);
      });
      if (foto) body.append("foto", foto);

      const url = isEdit
        ? `http://localhost:5000/seller/product/edit/${id}`
        : "http://localhost:5000/seller/product/register";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await res.json();

      if (res.ok) {
        alert(isEdit ? "Produto atualizado!" : "Produto cadastrado!");
        navigate("/seller/products");
      } else {
        alert(data.message || "Erro ao salvar produto.");
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4">
          <button
            onClick={() => navigate("/seller/products")}
            className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">MINHA LOJA</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{isEdit ? "Editar produto" : "Novo produto"}</h2>
          <p className="text-zinc-400 text-sm mt-1">
            {isEdit ? "Atualize as informações do produto." : "Preencha os dados do produto que deseja vender."}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">

          {/* Foto */}
          <div>
            <label className={labelClass}>Foto do produto</label>
            {preview ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={removerFoto}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-3 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <ImagePlus className="h-10 w-10 text-zinc-500" />
                <span className="text-sm text-zinc-500">Clique para selecionar uma foto</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
            {erros.foto && <p className="text-red-400 text-xs mt-1">{erros.foto}</p>}
          </div>

          {/* Nome */}
          <div>
            <label className={labelClass}>Nome do produto</label>
            <input
              placeholder="Ex: Camiseta Básica Premium"
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              className={inputClass}
            />
            {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome}</p>}
          </div>

          {/* Marca e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Marca</label>
              <input
                placeholder="Ex: Nike"
                value={form.marca}
                onChange={(e) => atualizar("marca", e.target.value)}
                className={inputClass}
              />
              {erros.marca && <p className="text-red-400 text-xs mt-1">{erros.marca}</p>}
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <input
                placeholder="Ex: Roupas"
                value={form.categoria}
                onChange={(e) => atualizar("categoria", e.target.value)}
                className={inputClass}
              />
              {erros.categoria && <p className="text-red-400 text-xs mt-1">{erros.categoria}</p>}
            </div>
          </div>

          {/* Preço e Quantidade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço (R$)</label>
              <input
                placeholder="Ex: 99,90"
                value={form.preco}
                onChange={(e) => atualizar("preco", e.target.value)}
                className={inputClass}
              />
              {erros.preco && <p className="text-red-400 text-xs mt-1">{erros.preco}</p>}
            </div>
            <div>
              <label className={labelClass}>Quantidade em estoque</label>
              <input
                placeholder="Ex: 50"
                value={form.quantidade}
                onChange={(e) => atualizar("quantidade", e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
              {erros.quantidade && <p className="text-red-400 text-xs mt-1">{erros.quantidade}</p>}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>Descrição <span className="text-zinc-600">(opcional)</span></label>
            <textarea
              placeholder="Descreva o produto, tamanhos disponíveis, material, etc."
              value={form.descricao}
              onChange={(e) => atualizar("descricao", e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              isEdit ? "Salvar alterações" : "Cadastrar produto"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}