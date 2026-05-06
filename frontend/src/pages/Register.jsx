import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [celular, setCelular] = useState("");
  const [cnpj, setCnpj] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/seller/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          celular,
          cnpj,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado! Verifique seu WhatsApp");
        localStorage.setItem("verify_email", email);

        navigate("/verify");
      } else {
        alert(data.message || "Erro no cadastro");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>

      <input
        placeholder="Nome"
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
      />

      <input
        placeholder="Celular"
        onChange={(e) => setCelular(e.target.value)}
      />

      <input
        placeholder="CNPJ"
        onChange={(e) => setCnpj(e.target.value)}
      />

      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
}