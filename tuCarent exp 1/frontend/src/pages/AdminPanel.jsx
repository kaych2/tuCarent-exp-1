// frontend/src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedUserBookings, setSelectedUserBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // require admin token
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }
    loadAll();
  }, []);

  const loadAll = async () => {
    const [u, v, b] = await Promise.all([
      api.adminGetUsers(),
      api.adminGetVehicles(),
      api.adminGetBookings(),
    ]);
    setUsers(Array.isArray(u) ? u : []);
    setVehicles(Array.isArray(v) ? v : []);
    setBookings(Array.isArray(b) ? b : []);
  };

  const viewUserBookings = async (userId) => {
    const res = await api.adminGetUserBookings(userId);
    setSelectedUserBookings(Array.isArray(res) ? res : []);
    setTab("userBookings");
  };

  const adminLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={() => setTab("users")} className={`px-4 py-2 rounded ${tab==="users"?"bg-blue-600 text-white":"bg-gray-200"}`}>Users</button>
            <button onClick={() => setTab("vehicles")} className={`px-4 py-2 rounded ${tab==="vehicles"?"bg-blue-600 text-white":"bg-gray-200"}`}>Vehicles</button>
            <button onClick={() => setTab("bookings")} className={`px-4 py-2 rounded ${tab==="bookings"?"bg-blue-600 text-white":"bg-gray-200"}`}>Bookings</button>
            <button onClick={adminLogout} className="px-4 py-2 rounded bg-red-600 text-white">Logout</button>
          </div>
        </div>

        {tab === "users" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{u.email}</p>
                    </div>
                    <div>
                      <button onClick={() => viewUserBookings(u.id)} className="px-3 py-1 bg-blue-600 text-white rounded">View Bookings</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "vehicles" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Vehicles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map(v => (
                <div key={v.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <p className="font-semibold">{v.brand} {v.model}</p>
                  <p className="text-sm">Year: {v.year ?? "N/A"}</p>
                  <p className="text-sm">Price/day: ${v.price_per_day}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <p><strong>User:</strong> {b.user?.name ?? b.user_id}</p>
                      <p><strong>Vehicle:</strong> {b.vehicle?.brand} {b.vehicle?.model}</p>
                      <p><strong>Dates:</strong> {new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> ${b.total_cost}</p>
                      <p><strong>Status:</strong> {b.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "userBookings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">User Bookings</h2>
            <button onClick={() => setTab("users")} className="mb-4 px-3 py-1 bg-gray-200 rounded">Back to users</button>
            <div className="space-y-3">
              {selectedUserBookings.map(b => (
                <div key={b.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <p><strong>Vehicle:</strong> {b.vehicle?.brand} {b.vehicle?.model}</p>
                  <p><strong>Dates:</strong> {new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${b.total_cost}</p>
                </div>
              ))}
              {selectedUserBookings.length === 0 && <p className="text-gray-500">No bookings for this user.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
