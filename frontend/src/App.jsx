import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ProtectedRoute from "./ProtectedRoute";
import SellerProducts from "./pages/Sellerproducts";
import AddProduct from "./pages/Addproduct";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

        <Route path="/seller/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/seller/products"         element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />
        <Route path="/seller/add-product"      element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/seller/edit-product/:id" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/seller/sales"            element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;