import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    };
    fetchData();
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      try {
        const response = await axios.delete(`/api/admin/users/${userId}`);
        if (response.data.success) {
          // Fix the filter condition (was using === instead of !==)
          setUsers(users.filter(user => user._id !== userId));
          setStats(prev => ({
            ...prev,
            totalUsers: Math.max((prev.totalUsers || 0) - 1, 0),
            activeUsers: Math.max((prev.activeUsers || 0) - 1, 0)
          }));
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Admin Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Admin Benefits</h3>
          <ul className="list-disc pl-5">
            <li>View all user tasks</li>
            <li>Manage user accounts</li>
            <li>Access analytics</li>
            <li>System configuration</li>
          </ul>
        </div>
        <div className="p-4 bg-blue-100 rounded">
          <h3>Total Users</h3>
          <p className="text-2xl">{stats.totalUsers || 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3>Total Tasks</h3>
          <p className="text-2xl">{stats.totalTasks || 0}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3>Active Users</h3>
          <p className="text-2xl">{stats.activeUsers || 0}</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.taskCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleView(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.email)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Name:</span> {selectedUser.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selectedUser.email}
              </p>
              <p>
                <span className="font-medium">Total Tasks:</span>{' '}
                {selectedUser.taskCount}
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
