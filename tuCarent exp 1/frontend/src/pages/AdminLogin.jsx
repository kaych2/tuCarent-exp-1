// frontend/src/pages/AdminLogin.jsx
import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await api.adminLogin(form);

    if (res.detail) {
      setError(res.detail);
      return;
    }

    // Save admin token
    localStorage.setItem("admin_token", res.token);

    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-white">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Admin Login</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Admin Email"
            type="email"
            className="w-full p-3 rounded bg-gray-700"
            onChange={handleChange}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            className="w-full p-3 rounded bg-gray-700"
            onChange={handleChange}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
