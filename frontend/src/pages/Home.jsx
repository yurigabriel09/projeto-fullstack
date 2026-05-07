import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">MINHA LOJA</h1>
          <p className="text-zinc-500 text-sm mt-2">Plataforma de gestão para sellers</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-white text-zinc-950 font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Entrar
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-transparent border border-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            Criar conta
          </button>
        </div>

      </div>
    </div>
  );
}