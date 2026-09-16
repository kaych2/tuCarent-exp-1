import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const images = {
    left: "/images/mercedesbenzsclass.jpg",
    middleTop: "/images/bmw.jpg",
    middleBottom: "/images/mercedesbenzvclass.jpg",
    rightTop: "/images/mercedesbenzgle.jpg", // white SUV vibe if possible
    rightBottom: "/images/porsche911.jpg",
  };

  const ImageCard = ({ src, alt, className }) => (
    <Link 
      to="/cars" 
      className={`block overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 group ${className}`}
    >
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ECar Image Missing%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 transition-colors duration-700 pt-32 pb-16 px-6 font-sans flex flex-col items-center">
      {/* Top Text Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl text-center mb-16"
      >
        <p className="text-gray-500 dark:text-gray-300 text-lg md:text-xl font-light leading-relaxed">
          Discover our exclusive collection of luxury vehicles. From executive sedans to spacious
          SUVs and elegant sports cars, each vehicle is meticulously maintained to provide you with
          an exceptional driving experience.
        </p>
      </motion.div>

      {/* Modern Bento/Masonry Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-6 h-full">
          <ImageCard 
            src={images.left} 
            alt="Luxury Sedan" 
            className="h-[600px] md:h-[500px]" 
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <ImageCard 
            src={images.middleTop} 
            alt="Executive Sedan" 
            className="h-[300px] md:h-[240px]" 
          />
          <ImageCard 
            src={images.middleBottom} 
            alt="Luxury Van" 
            className="h-[300px] md:h-[400px]" 
          />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">
          <ImageCard 
            src={images.rightTop} 
            alt="Luxury SUV" 
            className="h-[300px] md:h-[240px]" 
          />
          <ImageCard 
            src={images.rightBottom} 
            alt="Sports Car" 
            className="h-[300px] md:h-[240px]" 
          />
        </div>
      </motion.div>

      {/* Footer Year */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="w-full max-w-6xl flex justify-end mt-12"
      >
        <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">
          PREMIUM VEHICLES - 2024
        </p>
      </motion.div>
    </div>
  );
}