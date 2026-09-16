import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Home, Route as RouteIcon, Car } from "lucide-react";
import { motion } from "framer-motion";

export default function ChauffeurLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900 transition-colors duration-500">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block mt-16 shadow-lg z-10 p-6 space-y-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text flex items-center mb-8">
                    <Car className="mr-2 text-blue-600" />
                    Chauffeur
                </h2>
                <nav className="flex flex-col space-y-4">
                    <NavLink
                        to="/chauffeur"
                        end
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors font-medium ${isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`
                        }
                    >
                        <Home size={20} /> <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/chauffeur/trips"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors font-medium ${isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`
                        }
                    >
                        <RouteIcon size={20} /> <span>My Trips</span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-left mt-auto"
                    >
                        <LogOut size={20} /> <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* MOBILE NAV (Bottom Bar) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <NavLink
                    to="/chauffeur"
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        }`
                    }
                >
                    <Home size={24} /> <span className="text-xs mt-1">Dash</span>
                </NavLink>

                <NavLink
                    to="/chauffeur/trips"
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        }`
                    }
                >
                    <RouteIcon size={24} /> <span className="text-xs mt-1">Trips</span>
                </NavLink>

                <button onClick={handleLogout} className="flex flex-col items-center text-red-500">
                    <LogOut size={24} /> <span className="text-xs mt-1">Exit</span>
                </button>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 mt-16 overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 md:p-8 max-w-7xl mx-auto"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}
