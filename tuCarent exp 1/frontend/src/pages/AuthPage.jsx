// frontend/src/pages/AuthPage.jsx
import { useState } from 'react';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATED LOGIN HANDLER (ADMIN + USER)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      let res;

      if (isLogin) {
        // LOGIN
        res = await api.login({ email: form.email, password: form.password });

        if (res.detail) {
          setError(res.detail);
          return;
        }

        // ⭐ ADMIN LOGIN CHECK
        if (res.role === "admin" && res.token) {
          localStorage.setItem("admin_token", res.token);
          setMessage("Admin login successful! Redirecting...");
          setTimeout(() => navigate("/admin"), 1200);
          return;
        }

        // ⭐ CHAUFFEUR LOGIN CHECK
        if (res.role === "chauffeur" && res.token) {
          localStorage.setItem("token", res.token);
          setMessage("Chauffeur login successful! Redirecting...");
          setTimeout(() => navigate("/chauffeur"), 1200);
          return;
        }

        // ⭐ NORMAL USER LOGIN
        if (res.token) {
          localStorage.setItem("token", res.token);
          setMessage("Login successful! Redirecting...");
          setTimeout(() => navigate("/"), 1200);
          return;
        }

        setError("Invalid login response.");
        return;
      }

      // REGISTER
      res = await api.register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      if (res.detail) {
        setError(res.detail);
        return;
      }

      if (res.id) {
        setMessage("Registration successful! Please login.");
        setIsLogin(true);
        setForm({ name: "", email: form.email, password: "" });
      }

    } catch (err) {
      console.error(err);
      setError("Server connection error. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 dark:bg-gray-800 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-4 text-sm flex items-center">
            <AlertTriangle size={16} className='mr-2' /> {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mb-4 text-sm">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-md"
          >
            {isLogin ? <><LogIn size={20} className="mr-2" /> Login</> : <><UserPlus size={20} className="mr-2" /> Register</>}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline transition"
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
