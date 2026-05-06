import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

    <Link to="/register">Ir para cadastrar</Link>
    <br />
    <Link to="/login">Ir para Login</Link>
  </div>
  );
}