// frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");
const getAdminToken = () => localStorage.getItem("admin_token");

const apiFetch = async (endpoint, options = {}, isAdmin = false) => {
  const token = isAdmin ? getAdminToken() : getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const api = {
  // AUTH
  register: (data) =>
    apiFetch("/users/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data) =>
    apiFetch("/users/login", { method: "POST", body: JSON.stringify(data) }),

  // VEHICLES
  getVehicles: () => apiFetch("/vehicles/"),
  getVehicleBookedDates: (id) => apiFetch(`/vehicles/${id}/booked-dates`),


  getAvailableChauffeurs: () => apiFetch("/chauffeurs/available"),

  // BOOKINGS
  createBooking: (data) =>
    apiFetch("/bookings/", { method: "POST", body: JSON.stringify(data) }),

  getMyBookings: () => apiFetch("/bookings/me"),
  cancelBooking: (bookingId) =>
    apiFetch(`/bookings/${bookingId}/cancel`, { method: "PUT" }),

  // ADMIN
  adminLogin: (data) =>
    apiFetch("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),


  adminGetUsers: () => apiFetch("/admin/users", {}, true),
  adminGetVehicles: () => apiFetch("/admin/vehicles", {}, true),
  adminAddVehicle: (data) => apiFetch("/admin/vehicles", { method: "POST", body: JSON.stringify(data) }, true),
  adminGetBookings: () => apiFetch("/admin/bookings", {}, true),
  adminGetUserBookings: (userId) => apiFetch(`/admin/users/${userId}/bookings`, {}, true),
  adminGetChauffeurs: () => apiFetch("/admin/chauffeurs", {}, true),
  adminAddChauffeur: (data) => apiFetch("/admin/chauffeurs", { method: "POST", body: JSON.stringify(data) }, true),

  // CHAUFFEUR DASHBOARD
  getChauffeurDashboard: () => apiFetch("/chauffeur/dashboard"),
  getChauffeurTrips: () => apiFetch("/chauffeur/trips"),
  completeChauffeurTrip: (tripId) => apiFetch(`/chauffeur/trips/${tripId}/complete`, { method: "PUT" }),
};
