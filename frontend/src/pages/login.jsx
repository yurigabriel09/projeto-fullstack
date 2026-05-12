import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validarEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
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
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async () => {
    if (!validarTudo()) return;
    try {
      const res = await fetch("http://localhost:5000/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/seller/products");
      } else if (res.status === 403) {
        alert("Conta não ativada. Verifique seu WhatsApp.");
        navigate("/verify");
      } else {
        alert(data.erro || data.mensagem || "Erro no login");
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
        <div
          className="text-center mb-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">MINHA LOJA</h1>
          <p className="text-zinc-400 text-sm mt-1">Bem-vindo de volta</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Entrar</h2>

          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-sm mb-1.5 block">Email</label>
              <input
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => atualizar("email", e.target.value.toLowerCase())}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {erros.email && <p className="text-red-400 text-xs mt-1">{erros.email}</p>}
            </div>

            <div>
              <label className="text-zinc-400 text-sm mb-1.5 block">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => atualizar("senha", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {erros.senha && <p className="text-red-400 text-xs mt-1">{erros.senha}</p>}
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-6 bg-white text-zinc-950 font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Entrar
          </button>

          <p className="text-zinc-500 text-sm text-center mt-4">
            Não tem conta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-white hover:underline cursor-pointer"
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}