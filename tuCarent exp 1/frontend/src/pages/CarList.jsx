// frontend/src/pages/CarList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Info } from "lucide-react";

export default function CarList() {
    const [filter, setFilter] = useState("all");
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import("../services/api").then(({ api }) => {
            api.getVehicles().then((data) => {
                if (Array.isArray(data)) {
                    // Transform backend data to match expected frontend structure
                    const formattedCars = data.map(v => ({
                        id: v.id,
                        name: `${v.make} ${v.model}`,
                        type: v.type || "Sedan",
                        basePrice: v.daily_rate,
                        mileage: v.mileage || 0,
                        nextService: (v.mileage || 0) + 5000,
                        co2: Math.floor(Math.random() * 200) + 50, // mock co2
                        img: v.img ? (v.img.startsWith('/') || v.img.startsWith('http')) ? v.img : `/images/${v.img}` : "/images/bmwm4.jpg",
                        history: {
                            owners: 1,
                            lastService: "Recent",
                            accidents: "None",
                            rating: "Excellent"
                        }
                    }));
                    setCars(formattedCars);
                }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        });
    }, []);

    // Predictive pricing logic
    const getDynamicPrice = (base) => {
        const hour = new Date().getHours();
        // Adjust price based on simulated demand
        if (hour >= 18 || hour < 6) return base * 0.9;
        if (hour >= 6 && hour < 10) return base * 1.2;
        return base;
    };

    const filterCategories = ["all", "SUV", "Trucks", "Vans/MPVs", "Sports", "Luxury", "Economy", "Electric", "Hybrid"];

    const filteredCars =
        filter === "all" ? cars : cars.filter((c) => c.type === filter);

    const checkMaintenance = (car) =>
        car.nextService - car.mileage <= 5000 ? ( // Adjusted threshold slightly
            <div className="flex items-center text-yellow-600 text-sm mt-1 dark:text-yellow-400">
                <Wrench size={16} className="mr-1" /> Service soon
            </div>
        ) : null;

    const ecoBadge = (co2) => {
        if (co2 <= 50) return <span className="text-green-600 font-semibold">🌿 Eco-Friendly</span>;
        if (co2 <= 100) return <span className="text-yellow-500 font-semibold">⚡ Moderate Emission</span>;
        return <span className="text-red-500 font-semibold">🔥 High Emission</span>;
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 transition-colors duration-700 p-6 pt-32">
            <h1 className="text-4xl font-light text-gray-800 dark:text-white mb-10 text-center tracking-wide">
                Select Your Vehicle
            </h1>

            {/* Filter Buttons */}
            <div className="mb-8 flex flex-wrap justify-center gap-3">
                {filterCategories.map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full font-medium text-sm md:text-base ${filter === type
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            } transition`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Car Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-10">Loading vehicles...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCars.slice(0, 4).map((car) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 transition relative flex flex-col"
                        >
                            <img
                                src={car.img}
                                alt={car.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/images/bmwm4.jpg"; }}
                            />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                {car.name}
                            </h2>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{car.type}</p>
                            <p className="text-xl font-extrabold mt-2 text-gray-800 dark:text-white">
                                ${getDynamicPrice(car.basePrice).toFixed(0)} / day
                            </p>
                            {checkMaintenance(car)}
                            <div className="mt-1 text-xs md:text-sm">{ecoBadge(car.co2)}</div>

                            <div className="flex justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                    to={`/cars/${car.id}`}
                                    state={{
                                        car: {
                                            id: car.id,
                                            make: car.name.split(" ")[0],
                                            model: car.name.slice(car.name.indexOf(" ") + 1),
                                            daily_rate: car.basePrice,
                                            type: car.type,
                                            img: car.img,
                                            mileage: car.mileage,
                                            history: car.history
                                        }
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-200 transition"
                                >
                                    <Info size={16} /> Details
                                </Link>
                                <Link
                                    to="/booking"
                                    state={{
                                        car: {
                                            id: car.id,
                                            make: car.name.split(" ")[0],
                                            model: car.name.slice(car.name.indexOf(" ") + 1),
                                            daily_rate: car.basePrice,
                                            type: car.type,
                                            img: car.img
                                        }
                                    }}
                                    className="px-4 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

        </div>
    );
}