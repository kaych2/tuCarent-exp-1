// src/components/QuickBookFAB.jsx
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickBookFAB() {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/booking")}
      className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl flex items-center justify-center"
    >
      <Car size={24} />
    </motion.button>
  );
}