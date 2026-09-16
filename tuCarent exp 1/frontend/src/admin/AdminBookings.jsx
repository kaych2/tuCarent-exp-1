import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.adminGetBookings().then(setBookings);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      <table className="w-full bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3">Booking ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Dates</th>
            <th className="p-3">Total Cost</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-gray-700">
              <td className="p-3">{b.id}</td>
              <td className="p-3">{b.user?.name}</td>
              <td className="p-3">{b.vehicle?.brand} {b.vehicle?.model}</td>
              <td className="p-3">{b.start_date} → {b.end_date}</td>
              <td className="p-3">${b.total_cost}</td>
              <td className="p-3">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
