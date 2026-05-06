import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/seller/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
          codigo
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Conta ativada com sucesso!");

        localStorage.removeItem("verify_email");
        localStorage.removeItem("verify_senha");

        navigate("/login");
      } else {
        alert(data.message || "Código inválido");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Verificação</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
        />

      <input
        placeholder="Código do WhatsApp"
        onChange={(e) => setCodigo(e.target.value)}
      />

      <button onClick={handleVerify}>Confirmar</button>
    </div>
  );
}