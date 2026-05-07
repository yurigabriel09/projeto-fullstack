import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
const validarCodigo = (codigo) => /^\d{4}$/.test(codigo);

const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";
const labelClass = "text-zinc-400 text-sm mb-1.5 block";

export default function Verify() {
  const [form, setForm] = useState({ email: "", senha: "", codigo: "" });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const validarTudo = () => {
    const novosErros = {};
    if (!validarEmail(form.email)) novosErros.email = "Email inválido.";
    if (form.senha.length < 6) novosErros.senha = "Mínimo 6 caracteres.";
    if (!validarCodigo(form.codigo)) novosErros.codigo = "Digite os 4 números do WhatsApp.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleVerify = async () => {
    if (!validarTudo()) return;
    try {
      const res = await fetch("http://localhost:5000/seller/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Conta ativada com sucesso!");
        localStorage.setItem("token", data.token);
        navigate("/seller/products");
      } else {
        alert(data.message || "Código inválido");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-bold text-white tracking-tight">MINHA LOJA</h1>
          <p className="text-zinc-400 text-sm mt-1">Verificação de conta</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-2">Ativar conta</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Digite o código de 4 dígitos enviado no seu WhatsApp.
          </p>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => atualizar("email", e.target.value.toLowerCase())}
                className={inputClass}
              />
              {erros.email && <p className="text-red-400 text-xs mt-1">{erros.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => atualizar("senha", e.target.value)}
                className={inputClass}
              />
              {erros.senha && <p className="text-red-400 text-xs mt-1">{erros.senha}</p>}
            </div>

            <div>
              <label className={labelClass}>Código do WhatsApp</label>
              <input
                placeholder="0000"
                value={form.codigo}
                maxLength={4}
                onChange={(e) => atualizar("codigo", e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`}
              />
              {erros.codigo && <p className="text-red-400 text-xs mt-1">{erros.codigo}</p>}
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full mt-6 bg-white text-zinc-950 font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Confirmar
          </button>

          <p className="text-zinc-500 text-sm text-center mt-4">
            Já ativou?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white hover:underline cursor-pointer"
            >
              Fazer login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}