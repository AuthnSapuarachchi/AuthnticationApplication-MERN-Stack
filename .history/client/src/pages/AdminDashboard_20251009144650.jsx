import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import NavBar from '../components/NavBar.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContext);

  const [adminData, setAdminData] = useState(null);
  const [moderatorData, setModeratorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    // Check if user has admin or moderator role
    if (userData?.role !== 'admin' && userData?.role !== 'moderator') {
      toast.error('Access denied. Admin or Moderator role required.');
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [isLoggedIn, userData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Try to fetch admin data
      if (userData?.role === 'admin') {
        try {
          const { data } = await axios.get(backendUrl + '/api/user/admin-data');
          if (data.success) {
            setAdminData(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch admin data:', error);
        }
      }

      // Try to fetch moderator data (available to both admin and moderator)
      if (userData?.role === 'admin' || userData?.role === 'moderator') {
        try {
          const { data } = await axios.get(backendUrl + '/api/user/moderator-data');
          if (data.success) {
            setModeratorData(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch moderator data:', error);
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-400">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-slate-900 rounded-lg shadow-lg p-8 text-white">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">
              {userData?.role === 'admin' ? 'Admin Dashboard' : 'Moderator Dashboard'}
            </h1>
            <p className="text-gray-400">
              Welcome, {userData?.name}! You have{' '}
              <span className="text-indigo-400 font-semibold capitalize">{userData?.role}</span> access.
            </p>
          </div>

          {/* Admin Only Section */}
          {userData?.role === 'admin' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg border border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👑</span>
                <h2 className="text-2xl font-semibold">Admin Only Section</h2>
              </div>
              
              {adminData ? (
                <div className="space-y-4">
                  <p className="text-gray-300">{adminData}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-indigo-400">1,234</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Active Sessions</p>
                      <p className="text-3xl font-bold text-green-400">567</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">2FA Enabled</p>
                      <p className="text-3xl font-bold text-yellow-400">89%</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold">Admin Privileges:</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>✓ Full system access</li>
                      <li>✓ User management</li>
                      <li>✓ Security settings configuration</li>
                      <li>✓ View all analytics and reports</li>
                      <li>✓ Manage roles and permissions</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No admin data available</p>
              )}
            </div>
          )}

          {/* Moderator Section (Both Admin and Moderator can see) */}
          {(userData?.role === 'admin' || userData?.role === 'moderator') && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg border border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛡️</span>
                <h2 className="text-2xl font-semibold">Moderator Section</h2>
              </div>

              {moderatorData ? (
                <div className="space-y-4">
                  <p className="text-gray-300">{moderatorData}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Pending Reviews</p>
                      <p className="text-3xl font-bold text-yellow-400">23</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Reports Handled</p>
                      <p className="text-3xl font-bold text-blue-400">145</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold">Moderator Privileges:</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>✓ Content moderation</li>
                      <li>✓ User reports review</li>
                      <li>✓ Limited user management</li>
                      <li>✓ View moderation logs</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No moderator data available</p>
              )}
            </div>
          )}

          {/* Role Information */}
          <div className="p-6 bg-[#333A5C] rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Role-Based Access Control (RBAC)</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-purple-400">Admin Role</p>
                  <p className="text-sm text-gray-400">
                    Full system access with all privileges including user management and system configuration.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-blue-400">Moderator Role</p>
                  <p className="text-sm text-gray-400">
                    Content moderation access with limited user management capabilities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-green-400">User Role</p>
                  <p className="text-sm text-gray-400">
                    Standard user access with personal account management only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
            >
              Account Settings
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
