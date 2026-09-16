import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icons issue in React
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function LocationMarker({ position, setPosition, setLocationName }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse geocode
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setLocationName(data.display_name);
          } else {
            setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        })
        .catch(err => {
          console.error(err);
          setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = state?.car;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!car) navigate("/");
  }, [car, navigate]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  const [serviceType, setServiceType] = useState("self-drive");
  const [chauffeurs, setChauffeurs] = useState([]);
  const [chauffeurId, setChauffeurId] = useState("");

  const [pickupPosition, setPickupPosition] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [customColor, setCustomColor] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const USD_TO_KSH = 130;

  // Load Booked Dates
  useEffect(() => {
    if (car) {
      api.getVehicleBookedDates(car.id)
        .then((res) => {
          if (res.booked_dates) {
            setBookedDates(res.booked_dates.map(d => parseISO(d)));
          }
        })
        .catch(err => console.error("Could not load booked dates"));
    }
  }, [car]);

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    return diff >= 0 ? Math.ceil(diff) + 1 : 0; // inclusive of both start and end dates
  };

  const days = calcDays();

  const carDaily = car?.daily_rate ?? car?.price_per_day ?? car?.basePrice ?? 0;

  // Fetch available chauffeurs if user selects chauffeur option
  useEffect(() => {
    const loadChauffeurs = async () => {
      try {
        const list = await api.getAvailableChauffeurs();
        if (Array.isArray(list)) setChauffeurs(list);
      } catch (e) {
        // non-blocking; user can still book self-drive
      }
    };

    if (serviceType === "chauffeur") loadChauffeurs();
  }, [serviceType]);

  const selectedChauffeur = chauffeurs.find((c) => String(c.id) === String(chauffeurId));
  const chauffeurDaily = selectedChauffeur?.daily_rate ?? 0;

  const customColorFee = customColor ? 50 : 0;
  const totalUSD =
    (serviceType === "chauffeur"
      ? days * (carDaily + chauffeurDaily)
      : days * carDaily) + customColorFee;

  const totalKSH = Math.round(totalUSD * USD_TO_KSH);

  const handleConfirm = async (e) => {
    e.preventDefault();KT
    setError("");

    if (!startDate || !endDate) {
      setError("Select start and end dates.");
      return;
    }
    if (days <= 0) {
      setError("End date must be at or after start date.");
      return;
    }

    // Check if any date in range is booked
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const isBooked = bookedDates.some(bDate =>
        bDate.getDate() === currentDate.getDate() &&
        bDate.getMonth() === currentDate.getMonth() &&
        bDate.getFullYear() === currentDate.getFullYear()
      );
      if (isBooked) {
        setError("One or more selected dates are already booked.");
        return;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (!pickupLocation || !pickupTime) {
      setError("Select pickup location and time.");
      return;
    }
    if (serviceType === "chauffeur" && !chauffeurId) {
      setError("Select a chauffeur or switch to self-drive.");
      return;
    }

    setLoading(true);
    try {
      const formatYMD = d => {
        const offset = d.getTimezoneOffset()
        d = new Date(d.getTime() - (offset * 60 * 1000))
        return d.toISOString().split('T')[0]
      };

      const payload = {
        vehicle_id: car.id,
        start_date: formatYMD(startDate),
        end_date: formatYMD(endDate),
        service_type: serviceType,
        chauffeur_id: serviceType === "chauffeur" ? Number(chauffeurId) : null,
        pickup_location: pickupLocation,
        pickup_time: pickupTime,
        custom_color: customColor || null,
      };

      const res = await api.createBooking(payload);

      if (res && res.id) {
        navigate("/mybookings");
      } else if (res && res.detail) {
        setError(typeof res.detail === 'string' ? res.detail : JSON.stringify(res.detail));
      } else {
        setError("Unexpected response from server.");
        console.error("Booking response:", res);
      }
    } catch (err) {
      console.error(err);
      setError("Network or server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  if (!car) return null;

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">
          Book: {car.make ?? car.brand} {car.model}
        </h1>

        <div className="mb-4">
          {car.img ? (
            <img
              src={car.img}
              alt={`${car.make ?? car.brand} ${car.model}`}
              className="w-full h-64 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-64 rounded-md mb-3 bg-gray-700 flex items-center justify-center text-gray-300">
              No image
            </div>
          )}

          <p className="font-semibold text-lg text-blue-400">Daily: ${carDaily}</p>
          <p className="text-gray-300 text-sm mt-1">
            {car.type ? `${car.type} • ` : ""}
            {car.color ? `${car.color} • ` : ""}
            {car.mileage != null ? `${car.mileage.toLocaleString()} miles` : ""}
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="p-4 bg-gray-700 rounded space-y-4 relative z-50">
            <h3 className="text-xl font-bold text-gray-100 flex items-center mb-2">1. Select Dates</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">Start date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  excludeDates={bookedDates}
                  className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select start date"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">End date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  excludeDates={bookedDates}
                  className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select end date"
                />
              </div>
            </div>
            <p className="text-sm text-yellow-400 mt-2">
              Greyed out dates are already booked and cannot be selected.
            </p>
          </div>

          <div className="p-4 bg-gray-700 rounded space-y-4">
            <h3 className="text-xl font-bold text-gray-100 flex items-center mb-2">2. Pickup Details</h3>

            <div className="w-full h-[300px] rounded overflow-hidden z-10 border-2 border-gray-600 mb-3 relative">
              <p className="absolute top-2 left-2 z-[1000] bg-white text-black text-xs px-2 py-1 rounded shadow-md pointer-events-none">
                Click on the map to set pickup location
              </p>
              <MapContainer center={[-1.286389, 36.817223]} zoom={12} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={pickupPosition} setPosition={setPickupPosition} setLocationName={setPickupLocation} />
              </MapContainer>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-[2]">
                <label className="block text-sm text-gray-300 mb-1">Pickup Location Name</label>
                <input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  type="text"
                  placeholder="Click on map or type e.g. Airport, Hotel..."
                  className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">Pickup Time</label>
                <input
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  type="time"
                  className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded">
              <label className="block text-sm text-gray-300 mb-1">Custom Color (Optional)</label>
              <select
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Keep Original Color --</option>
                <option value="Red">Red</option>
                <option value="Matte Black">Matte Black</option>
                <option value="White">White</option>
                <option value="Blue">Blue</option>
              </select>
              {customColor && (
                <p className="text-sm text-yellow-300 mt-2 font-medium bg-yellow-400/10 p-2 rounded">
                  Info: It will take 3 days to change its color and have the car ready for delivery. ($50 Fee added)
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-700 rounded">
              <label className="block text-sm text-gray-300 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => {
                  setServiceType(e.target.value);
                  setChauffeurId("");
                }}
                className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="self-drive">Self-drive</option>
                <option value="chauffeur">With Chauffeur</option>
              </select>
              <p className="text-xs text-gray-300 mt-2">
                Self-drive uses car daily rate only. Chauffeur adds a daily fee.
              </p>
            </div>
          </div>

          {serviceType === "chauffeur" && (
            <div className="p-4 bg-gray-700 rounded">
              <label className="block text-sm text-gray-300 mb-1">Select Chauffeur</label>
              <select
                value={chauffeurId}
                onChange={(e) => setChauffeurId(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border-none text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose --</option>
                {chauffeurs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ( ${c.daily_rate}/day ) • {c.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold mb-3 border-b border-gray-600 pb-2">Booking Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Days:</span>
                <span className="font-bold">{days} {days === 1 ? 'day' : 'days'}</span>
              </div>
              {customColor && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Custom Color Fee:</span>
                  <span className="font-bold text-yellow-400">+$50.00</span>
                </div>
              )}
              <div className="flex justify-between text-lg mt-2 pt-2 border-t border-gray-600">
                <span className="text-gray-300">Total (USD):</span>
                <span className="font-extrabold text-green-400">${Number.isFinite(totalUSD) ? totalUSD.toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total (KSH):</span>
                <span className="font-boldtext-gray-400">KSH {totalKSH.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg font-medium break-words">{error}</div>}

          <div className="flex gap-4 pt-4">
            <button
              disabled={loading || days === 0}
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 py-4 rounded-lg font-bold shadow-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
