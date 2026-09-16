import { useState, useEffect } from "react";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { Calendar, User, MapPin, RefreshCw, Navigation, CheckCircle } from "lucide-react";

export default function ChauffeurTrips() {
    const [data, setData] = useState({ active: [], history: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTrips = async () => {
        setLoading(true);
        setError("");
        try {
            const resp = await api.getChauffeurTrips();
            if (resp.detail) throw new Error(resp.detail);
            setData(resp);
        } catch (err) {
            setError(err.message || "Failed to load trips");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (tripId) => {
        if (!confirm("Are you sure you want to mark this trip as completed?")) return;
        try {
            const res = await api.completeChauffeurTrip(tripId);
            if (res.detail) throw new Error(res.detail);
            loadTrips(); // Refresh the list
        } catch (err) {
            alert(err.message || "Failed to mark as complete");
        }
    };

    useEffect(() => {
        loadTrips();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    const TripCard = ({ trip, isActive }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl bg-white dark:bg-gray-800 border ${isActive ? "border-blue-200 dark:border-blue-900/50" : "border-gray-200 dark:border-gray-700"
                } shadow-sm hover:shadow-md transition`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${trip.status === "confirmed" || trip.status === "pending"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : trip.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                        {trip.status}
                    </span>
                    <h3 className="text-xl font-bold mt-3 text-gray-900 dark:text-white">
                        Booking #{trip.id}
                    </h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center min-w-[100px]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase mb-1">Total Payout</div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">${trip.total_cost || 0}</div>
                </div>
            </div>

            <div className="space-y-3 mt-5">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="font-medium">{trip.user?.name || `User #${trip.user_id}`}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Navigation className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Vehicle: <span className="font-medium text-gray-900 dark:text-white">{trip.vehicle?.make} {trip.vehicle?.model}</span> (ID: {trip.vehicle_id})</span>
                </div>
                <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 gap-y-2 lg:gap-0">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm">{trip.start_date}</span>
                        <span className="text-gray-400 mx-1">➜</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm">{trip.end_date}</span>
                    </div>
                </div>
            </div>

            {isActive && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={() => handleComplete(trip.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> Mark Completed
                    </button>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Trips</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your active assignments and view past history.</p>
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="space-y-12">
                    {/* Active Trips */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Active Assignments ({data.active.length})
                        </h2>
                        {data.active.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
                                <p className="text-gray-500 dark:text-gray-400">No active trips right now.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {data.active.map((trip) => (
                                    <TripCard key={trip.id} trip={trip} isActive={true} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* History */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            History ({data.history.length})
                        </h2>
                        {data.history.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No past trips yet.</p>
                        ) : (
                            <div className="grid gap-6">
                                {data.history.map((trip) => (
                                    <TripCard key={trip.id} trip={trip} isActive={false} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
