import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Plus, X, Car } from "lucide-react";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New vehicle form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    type: "Sedan",
    color: "",
    daily_rate: "",
    mileage: 0,
    img: ""
  });

  const loadVehicles = () => {
    api.adminGetVehicles().then(setVehicles);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Formatting data for backend
    const payload = {
      make: formData.make,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : null,
      type: formData.type,
      color: formData.color,
      daily_rate: parseFloat(formData.daily_rate),
      mileage: parseInt(formData.mileage) || 0,
      img: formData.img || null
    };

    try {
      const res = await api.adminAddVehicle(payload);
      if (!res.detail) {
        setShowModal(false);
        setFormData({
          make: "", model: "", year: "", type: "Sedan", color: "", daily_rate: "", mileage: 0, img: ""
        });
        loadVehicles(); // refresh list
      } else {
        alert(res.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Car className="mr-3 text-blue-600" /> All Vehicles
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-md transition"
        >
          <Plus size={20} className="mr-2" /> Add Vehicle
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">ID</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Make</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Model</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Type</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Price/Day</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-4 font-medium text-gray-900 dark:text-white">#{v.id}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{v.make}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{v.model}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {v.type || "N/A"}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-900 dark:text-white">${v.daily_rate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${v.availability === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      v.availability === 'rented' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {v.availability}
                  </span>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD VEHICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Vehicle</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Make / Brand</label>
                  <input required name="make" value={formData.make} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                  <input required name="model" value={formData.model} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Camry" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2023" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                  <input name="color" value={formData.color} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate ($)</label>
                  <input required type="number" step="0.01" name="daily_rate" value={formData.daily_rate} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mileage</label>
                  <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. 15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL (optional)</label>
                  <input name="img" value={formData.img} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition disabled:bg-blue-400">
                  {loading ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
