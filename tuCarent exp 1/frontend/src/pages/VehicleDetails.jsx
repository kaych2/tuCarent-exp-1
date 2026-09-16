import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Gauge, Star, ShieldCheck, TrendingUp, Shield, Wrench, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VehicleDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = state?.car;

  const [activeTab, setActiveTab] = useState("transparency");

  // Fallback if accessed directly without state
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No vehicle selected.</p>
          <button onClick={() => navigate("/cars")} className="px-4 py-2 bg-blue-600 text-white rounded">
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  // Mock data to match UI
  const details = {
    make: car.make || car.name?.split(" ")[0] || "Toyota",
    model: car.model || car.name?.substring(car.name?.indexOf(" ") + 1) || "Camry",
    year: car.year || 2023,
    type: car.type || "Sedan",
    color: car.color || "Silver",
    mileage: car.mileage || 12500,
    rating: car.history?.rating === "Excellent" ? "4.8 / 5.0" : "4.5 / 5.0",
    dailyRate: car.daily_rate || car.basePrice || 45,
    accidents: car.history?.accidents || "None",
    serviceQuality: "5 / 5"
  };

  const tabs = [
    { id: "transparency", label: "Vehicle Transparency", icon: Shield },
    { id: "accident", label: "Accident History", icon: ShieldCheck },
    { id: "maintenance", label: "Maintenance Records", icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Back Navigation Header */}
        <div className="flex items-center mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
            >
                <ArrowLeft className="mr-2" size={24} /> tuCarent
            </button>
        </div>

        {/* Top Card: Details & Image */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row mb-8">
            {/* Image Section */}
            <div className="w-full md:w-[55%] h-64 md:h-auto relative">
                <img 
                    src={car.img || "/images/bmwm4.jpg"} 
                    alt={`${details.year} ${details.make} ${details.model}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-[45%] p-6 lg:p-8 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {details.year} {details.make} {details.model}
                        </h1>
                        <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                            Excellent
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        {details.type} • {details.color}
                    </p>

                    {/* 4 Grid Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Mileage */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500">
                                <Gauge size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Mileage</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{details.mileage.toLocaleString()} mi</p>
                            </div>
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-500">
                                <Star size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Rating</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{details.rating}</p>
                            </div>
                        </div>
                        {/* Accidents */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-500">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Accidents</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{details.accidents}</p>
                            </div>
                        </div>
                        {/* Service Quality */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Service Quality</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{details.serviceQuality}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & CTA */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[11px] text-gray-400 uppercase font-semibold">Daily Rate</p>
                            <div className="flex items-end">
                                <span className="text-3xl font-bold text-blue-600">${details.dailyRate}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 mb-1">per day</span>
                            </div>
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                            Available
                        </span>
                    </div>
                    
                    <Link
                        to="/booking"
                        state={{ car }}
                        className="block w-full bg-[#0a0f25] hover:bg-[#151c38] text-white text-center font-semibold py-3 rounded-lg transition-colors"
                    >
                        Continue to Customize
                    </Link>
                </div>
            </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                                isActive 
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800" 
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="p-6 lg:p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === "transparency" && (
                        <motion.div
                            key="trans"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Complete Vehicle History</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    At tuCarent, we believe in complete transparency. See the full condition and history of this vehicle before making your booking decision.
                                </p>
                            </div>

                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-gray-900 dark:text-white">Trust Score: 100/100</h3>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                    Based on accident history, maintenance frequency, and service quality
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-100 dark:border-blue-800/30">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Accident History</span>
                                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> Clean</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-100 dark:border-blue-800/30">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Maintenance Records</span>
                                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> 2 records</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-100 dark:border-blue-800/30">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Service Quality</span>
                                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> 5/5 Rating</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Current Condition</span>
                                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> Excellent</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3">Why Transparency Matters</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Unlike traditional rental platforms that hide vehicle history, tuCarent shows you everything. This reduces disputes, builds trust, and helps you make informed decisions. Every accident has been professionally repaired, and all maintenance is up to date.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "accident" && (
                        <motion.div
                            key="acc"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Accident History</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Complete record of any incidents involving this vehicle
                                </p>
                            </div>

                            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-400 mb-2">Clean Accident History</h3>
                                <p className="text-sm text-emerald-600 dark:text-emerald-500 max-w-md">
                                    This vehicle has never been involved in any accidents. It's in pristine condition and ready for your trip.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "maintenance" && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Maintenance Records</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Complete service history showing regular maintenance and care
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Oil Change</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Regular oil change and filter replacement</p>
                                        <div className="flex gap-4 text-xs text-gray-400">
                                            <span>📅 2025/12/10</span>
                                            <span>⏱ 12,000 mi</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Cost</span>
                                        <p className="font-bold text-gray-900 dark:text-white">$75</p>
                                    </div>
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Tire Rotation</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Rotated all four tires and checked alignment</p>
                                        <div className="flex gap-4 text-xs text-gray-400">
                                            <span>📅 2025/09/15</span>
                                            <span>⏱ 10,000 mi</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Cost</span>
                                        <p className="font-bold text-gray-900 dark:text-white">$50</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex gap-3">
                                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-1">Well-Maintained Vehicle</h4>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500">
                                        This vehicle has 2 documented maintenance records, showing consistent care and professional service. All maintenance has been performed on schedule.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}
