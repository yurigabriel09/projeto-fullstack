import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
const validarNome = (nome) => /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(nome.trim());
const validarCelular = (celular) => /^\(\d{2}\) 9\d{4}-\d{4}$/.test(celular);
const validarCNPJ = (cnpj) => {
  const limpo = cnpj.replace(/\D/g, "");
  if (limpo.length !== 14) return false;
  if (/^(\d)\1+$/.test(limpo)) return false;
  const calc = (c) => {
    let soma = 0, pos = c.length - 7;
    for (let i = c.length; i >= 1; i--) {
      soma += parseInt(c[c.length - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11);
  };
  return (
    calc(limpo.substring(0, 12)) === parseInt(limpo[12]) &&
    calc(limpo.substring(0, 13)) === parseInt(limpo[13])
  );
};
const mascaraCelular = (valor) => {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return `(${nums}`;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
};
const mascaraCNPJ = (valor) => {
  const nums = valor.replace(/\D/g, "").slice(0, 14);
  if (nums.length <= 2) return nums;
  if (nums.length <= 5) return `${nums.slice(0, 2)}.${nums.slice(2)}`;
  if (nums.length <= 8) return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5)}`;
  if (nums.length <= 12) return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8)}`;
  return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8, 12)}-${nums.slice(12)}`;
};

const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";
const labelClass = "text-zinc-400 text-sm mb-1.5 block";

export default function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", celular: "", cnpj: "" });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();

  const atualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const validarTudo = () => {
    const novosErros = {};
    if (!validarNome(form.nome)) novosErros.nome = "Use apenas letras.";
    if (!validarEmail(form.email)) novosErros.email = "Email inválido.";
    if (form.senha.length < 6) novosErros.senha = "Mínimo 6 caracteres.";
    if (!validarCelular(form.celular)) novosErros.celular = "Celular inválido.";
    if (!validarCNPJ(form.cnpj)) novosErros.cnpj = "CNPJ inválido.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleRegister = async () => {
    if (!validarTudo()) return;
    try {
      const res = await fetch("http://localhost:5000/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email.toLowerCase(),
          celular: form.celular.replace(/\D/g, ""),
          cnpj: form.cnpj.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Cadastro realizado! Verifique seu WhatsApp");
        navigate("/verify");
      } else {
        alert(data.message || "Erro no cadastro");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-bold text-white tracking-tight">MINHA LOJA</h1>
          <p className="text-zinc-400 text-sm mt-1">Crie sua conta de vendedor</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Cadastro</h2>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={(e) => atualizar("nome", e.target.value)}
                className={inputClass}
              />
              {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome}</p>}
            </div>

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
              <label className={labelClass}>Celular</label>
              <input
                placeholder="(11) 91234-5678"
                value={form.celular}
                onChange={(e) => atualizar("celular", mascaraCelular(e.target.value))}
                className={inputClass}
              />
              {erros.celular && <p className="text-red-400 text-xs mt-1">{erros.celular}</p>}
            </div>

            <div>
              <label className={labelClass}>CNPJ</label>
              <input
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={(e) => atualizar("cnpj", mascaraCNPJ(e.target.value))}
                className={inputClass}
              />
              {erros.cnpj && <p className="text-red-400 text-xs mt-1">{erros.cnpj}</p>}
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full mt-6 bg-white text-zinc-950 font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Cadastrar
          </button>

          <p className="text-zinc-500 text-sm text-center mt-4">
            Já tem conta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white hover:underline cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}