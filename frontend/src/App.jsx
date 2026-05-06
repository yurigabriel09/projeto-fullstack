import { BrowserRouter, Routes, Route } from "react-router-dom";
import Api from "./pages/Api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/verify";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Api />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;