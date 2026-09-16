// frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CarFront, Sun, Moon, LogOut } from "lucide-react";

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // detect admin
  const isAdmin = !!localStorage.getItem("admin_token");

  // detect user login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 20);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const navItemClass = (path) =>
    `transition ${
      location.pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-white/30 dark:bg-gray-900/30 backdrop-blur-2xl shadow-md"
          : "bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400 hover:scale-[1.02] transition"
        >
          <CarFront size={28} />
          tuCarent
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-gray-800 dark:text-gray-200 font-medium">


          <Link to="/vehicles" className={navItemClass("/vehicles")}>
            Vehicles
          </Link>

          {/* Book Now → goes to Vehicles */}
          <Link to="/vehicles" className={navItemClass("/booking")}>
            Book
          </Link>

          {/* My Bookings (Only for logged in user) */}
          {isLoggedIn && (
            <Link to="/mybookings" className={navItemClass("/mybookings")}>
              My Bookings
            </Link>
          )}

          {/* Admin Panel */}
          {isAdmin && (
            <Link to="/admin" className={navItemClass("/admin")}>
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-4">


          {/* Priority: Admin > User > Login */}
          {isAdmin ? (
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition shadow-md"
            >
              <LogOut size={18} /> Admin Logout
            </button>
          ) : isLoggedIn ? (
            <button
              onClick={handleUserLogout}
              className="flex items-center gap-2 px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-full font-semibold transition shadow-md"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}