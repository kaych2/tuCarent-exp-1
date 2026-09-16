import { useState, useEffect } from "react";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { CheckCircle, Clock, MapPin, AlertCircle, RefreshCw } from "lucide-react";

export default function ChauffeurDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getChauffeurDashboard();
            if (data.detail) throw new Error(data.detail);
            setStats(data);
        } catch (err) {
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <RefreshCw className="animate-spin text-blue-500 w-12 h-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-xl flex items-center shadow-sm">
                <AlertCircle className="mr-3" /> {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome to your overview for today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Trips Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Active / Pending</p>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                                {stats?.active_trips || 0}
                            </h2>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                            <Clock size={28} />
                        </div>
                    </div>
                </motion.div>

                {/* Completed Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-green-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold tracking-wider text-green-600 dark:text-green-400 uppercase">Completed</p>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                                {stats?.completed_trips || 0}
                            </h2>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                            <CheckCircle size={28} />
                        </div>
                    </div>
                </motion.div>

                {/* Total Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-purple-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">Total Assignments</p>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                                {stats?.total_assignments || 0}
                            </h2>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                            <MapPin size={28} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
