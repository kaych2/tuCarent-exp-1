// frontend/src/App.jsx
import AdminPanel from "./pages/AdminPanel";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CarList from "./pages/CarList";
import BookingPage from "./pages/BookingPage";
import AuthPage from "./pages/AuthPage";
import MyBookings from "./pages/MyBookings";
import { useState, useEffect } from "react";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminVehicles from "./admin/AdminVehicles";
import AdminBookings from "./admin/AdminBookings";
import AdminUserBookings from "./admin/AdminUserBookings";
import AdminChauffeurs from "./admin/AdminChauffeurs";

import ChauffeurLayout from "./chauffeur/ChauffeurLayout";
import ChauffeurDashboard from "./chauffeur/ChauffeurDashboard";
import ChauffeurTrips from "./chauffeur/ChauffeurTrips";
import VehicleDetails from "./pages/VehicleDetails";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      {/* Pass theme state and toggle function to Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {/* ThemeToggle is not used directly in App, its logic is now partially in App and Navbar */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:userId/bookings" element={<AdminUserBookings />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="chauffeurs" element={<AdminChauffeurs />} />
          </Route>

          <Route path="/chauffeur" element={<ChauffeurLayout />}>
            <Route index element={<ChauffeurDashboard />} />
            <Route path="trips" element={<ChauffeurTrips />} />
          </Route>

          {/* Note: The old path was /vehicles, changed to /cars for consistency with navbar/CarList component name */}
          <Route path="/vehicles" element={<CarList />} />
          <Route path="/cars/:id" element={<VehicleDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;