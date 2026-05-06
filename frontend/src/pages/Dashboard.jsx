import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMensagem(data.message))
      .catch((err) => console.error(err));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Dashboard 🔐</h1>

      <p>{mensagem}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}