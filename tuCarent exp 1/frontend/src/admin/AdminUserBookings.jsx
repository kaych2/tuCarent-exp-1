import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function AdminUserBookings() {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.adminGetUserBookings(userId).then(setBookings);
  }, [userId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User #{userId} – Bookings</h1>

      {bookings.length === 0 && <p>No bookings found.</p>}

      <table className="w-full bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3">Booking ID</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Dates</th>
            <th className="p-3">Total Cost</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-gray-700">
              <td className="p-3">{b.id}</td>
              <td className="p-3">{b.vehicle?.brand} {b.vehicle?.model}</td>
              <td className="p-3">{b.start_date} → {b.end_date}</td>
              <td className="p-3">${b.total_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
