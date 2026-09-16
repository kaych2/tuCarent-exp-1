import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Plus, X, Users } from "lucide-react";

export default function AdminChauffeurs() {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New chauffeur form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license_number: "",
    experience_years: 0,
    daily_rate: 20.0,
    status: "available"
  });

  const loadChauffeurs = async () => {
    try {
      const res = await api.adminGetChauffeurs();
      setChauffeurs(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadChauffeurs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      license_number: formData.license_number,
      experience_years: parseInt(formData.experience_years) || 0,
      daily_rate: parseFloat(formData.daily_rate) || 20.0,
      status: formData.status
    };

    try {
      const res = await api.adminAddChauffeur(payload);
      if (!res.detail) {
        setShowModal(false);
        setFormData({
          name: "", email: "", password: "", license_number: "", experience_years: 0, daily_rate: 20.0, status: "available"
        });
        loadChauffeurs(); 
      } else {
        alert(res.detail || "Failed to add chauffeur");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add chauffeur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="mr-3 text-blue-600" /> All Chauffeurs
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-md transition"
        >
          <Plus size={20} className="mr-2" /> Add Chauffeur
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">ID</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Name</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">License</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Experience</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Daily Rate</th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {chauffeurs.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-4 font-medium text-gray-900 dark:text-white">#{c.id}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{c.name}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{c.license_number}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{c.experience_years} years</td>
                <td className="p-4 font-bold text-gray-900 dark:text-white">${c.daily_rate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${c.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      c.status === 'assigned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {chauffeurs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No chauffeurs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD CHAUFFEUR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Chauffeur</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Chauffeur Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Number</label>
                  <input required name="license_number" value={formData.license_number} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. DL123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Minimum 6 chars" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                  <input type="number" name="experience_years" value={formData.experience_years} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate ($)</label>
                  <input required type="number" step="0.01" name="daily_rate" value={formData.daily_rate} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. 20.00" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition disabled:bg-blue-400">
                  {loading ? "Adding..." : "Add Chauffeur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
