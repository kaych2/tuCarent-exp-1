import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.adminGetUsers().then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      <table className="w-full text-left bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Bookings</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-700">
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <Link
                  to={`/admin/users/${u.id}/bookings`}
                  className="text-blue-400 hover:underline"
                >
                  View Bookings →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
