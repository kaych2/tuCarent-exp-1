// frontend/src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { Calendar, Clock, X } from "lucide-react";

const USD_TO_KSH = 130;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMyBookings();
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setError("Failed to load bookings. Response: " + JSON.stringify(data));
          setBookings([]);
        }
      } catch (err) {
        setError("Error loading bookings: " + err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await api.cancelBooking(bookingId);
      if (res && res.id) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      } else {
        alert(res.detail || "Failed to cancel booking");
      }
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-extrabold text-center mb-10">My Bookings</h1>
        <div className="bg-red-600 text-white p-4 rounded-lg max-w-md text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-10">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-xl">No bookings found.</p>
          <p className="mt-2">Try booking a vehicle from the car list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {bookings.map((b) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 rounded-xl shadow-xl p-5 border border-gray-700">
              <div className="h-44 overflow-hidden rounded-lg mb-4">
                <img
                  src={b.vehicle.img ? (b.vehicle.img.startsWith('/') || b.vehicle.img.startsWith('http')) ? b.vehicle.img : `/images/${b.vehicle.img}` : "/images/toyotavitz.jpg"}
                  alt={b.vehicle.model}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/teslamodels.jpg";
                  }}
                />

              </div>

              <h2 className="text-2xl font-bold mb-2">{b.vehicle.make} {b.vehicle.model}</h2>

              <div className="flex items-center text-gray-300 mb-2">
                <Calendar size={18} className="mr-2 text-blue-400" />
                <span>{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-gray-300 mb-2">
                <span className="mr-2 text-green-400">KSH</span>
                Daily: {Math.round(b.vehicle.daily_rate * USD_TO_KSH).toLocaleString()}
              </div>

              <div className="flex items-center text-green-400 mb-2 font-semibold">
                <span className="mr-2">KSH</span>
                Total: {Math.round(b.total_cost * USD_TO_KSH).toLocaleString()}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-yellow-400" />
                  <span className={`font-semibold ${b.status === 'confirmed' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                  </span>
                </div>
                {b.status === 'confirmed' && (
                  <button onClick={() => handleCancel(b.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1">
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
