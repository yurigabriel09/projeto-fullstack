import { useEffect, useState, Link } from "react";

export default function Api() {
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => setMensagem(data.mensagem));
  }, []);

  return (
    <div>
      <h1>Resposta da API</h1>
      <p>{mensagem}</p>
      <a href="/login">Ir para Login</a>
    </div>
  );
}