import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // pega email salvo no cadastro
  useEffect(() => {
    const savedEmail = localStorage.getItem("verify_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/seller/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          codigo,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Conta ativada com sucesso!");

        localStorage.removeItem("verify_email");

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
        value={email}
        disabled
      />

      <input
        placeholder="Código do WhatsApp"
        onChange={(e) => setCodigo(e.target.value)}
      />

      <button onClick={handleVerify}>Confirmar</button>
    </div>
  );
}