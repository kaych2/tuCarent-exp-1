// frontend/src/admin/AdminLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-6 shadow-xl">
        <h1 className="text-2xl font-bold text-blue-400">tuCarent Admin</h1>

        <nav className="flex flex-col space-y-3">
          <Link className="hover:text-blue-400" to="/admin">Dashboard</Link>
          <Link className="hover:text-blue-400" to="/admin/users">Users</Link>
          <Link className="hover:text-blue-400" to="/admin/vehicles">Vehicles</Link>
          <Link className="hover:text-blue-400" to="/admin/bookings">Bookings</Link>
          <Link className="hover:text-blue-400" to="/admin/chauffeurs">Chauffeurs</Link>
        </nav>

        <button
          onClick={logout}
          className="mt-10 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
