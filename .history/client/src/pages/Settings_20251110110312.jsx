import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import NavBar from '../components/NavBar.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodesCount, setBackupCodesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regeneratePassword, setRegeneratePassword] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    get2FAStatus();
  }, [isLoggedIn]);

  const get2FAStatus = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/2fa/status');
      if (data.success) {
        setTwoFactorEnabled(data.data.enabled);
        setBackupCodesCount(data.data.backupCodesRemaining || 0);
      }
    } catch (error) {
      console.error('Failed to get 2FA status:', error);
    }
  };

  const handleEnable2FA = () => {
    navigate('/2fa-setup');
  };

  const handleDisable2FA = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + '/api/2fa/disable', { password });

      if (data.success) {
        toast.success('2FA disabled successfully');
        setTwoFactorEnabled(false);
        setBackupCodesCount(0);
        setShowDisableModal(false);
        setPassword('');
        await getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCodes = async () => {
    if (!regeneratePassword) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + '/api/2fa/regenerate-codes', {
        password: regeneratePassword
      });

      if (data.success) {
        toast.success('Backup codes regenerated successfully');
        setNewBackupCodes(data.backupCodes);
        setBackupCodesCount(data.backupCodes.length);
        setRegeneratePassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to regenerate codes');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = newBackupCodes.join('\n');
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '2fa-backup-codes-new.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Backup codes downloaded');
  };

  const closeRegenerateModal = () => {
    setShowRegenerateModal(false);
    setRegeneratePassword('');
    setNewBackupCodes([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-400">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-slate-900 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>

          {/* User Info Section */}
          <div className="mb-8 p-6 bg-[#333A5C] rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="font-medium">{userData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="font-medium">{userData?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className="font-medium capitalize bg-indigo-600 px-3 py-1 rounded-full text-sm">
                  {userData?.role || 'user'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Status:</span>
                <span className={`font-medium ${userData?.isAccountVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {userData?.isAccountVerified ? '✓ Verified' : '⚠ Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* 2FA Section */}
          <div className="mb-8 p-6 bg-[#333A5C] rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">
                  Status: {' '}
                  <span className={twoFactorEnabled ? 'text-green-400' : 'text-gray-400'}>
                    {twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                  </span>
                </p>
                {twoFactorEnabled && (
                  <p className="text-sm text-gray-400 mt-1">
                    Backup codes remaining: {backupCodesCount}
                  </p>
                )}
              </div>
              
              {!twoFactorEnabled ? (
                <button
                  onClick={handleEnable2FA}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition-all"
                >
                  Enable 2FA
                </button>
              ) : (
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all"
                >
                  Disable 2FA
                </button>
              )}
            </div>

            {twoFactorEnabled && (
              <div className="mt-4">
                <button
                  onClick={() => setShowRegenerateModal(true)}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full transition-all"
                >
                  Regenerate Backup Codes
                </button>
              </div>
            )}

            <div className="mt-4 p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-gray-400">
                ℹ️ Two-factor authentication adds an extra layer of security to your account by requiring a code from your authenticator app when you sign in.
              </p>
            </div>
          </div>

          {/* Security Tips */}
          <div className="p-6 bg-[#333A5C] rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Security Tips</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Use a strong, unique password</li>
              <li>✓ Enable two-factor authentication for extra security</li>
              <li>✓ Keep your backup codes in a safe place</li>
              <li>✓ Never share your authentication codes with anyone</li>
              <li>✓ Review your account activity regularly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-white">Disable Two-Factor Authentication</h3>
            <p className="text-gray-400 mb-6">
              Enter your password to confirm disabling 2FA. This will make your account less secure.
            </p>
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 mb-4 bg-[#333A5C] text-white rounded-lg outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDisableModal(false);
                  setPassword('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-full transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                disabled={loading || !password}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-full transition-all disabled:opacity-50"
              >
                {loading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Backup Codes Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-white">Regenerate Backup Codes</h3>
            
            {newBackupCodes.length === 0 ? (
              <>
                <p className="text-gray-400 mb-6">
                  This will invalidate your old backup codes and generate new ones. Enter your password to continue.
                </p>
                
                <input
                  type="password"
                  value={regeneratePassword}
                  onChange={(e) => setRegeneratePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 mb-4 bg-[#333A5C] text-white rounded-lg outline-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={closeRegenerateModal}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-full transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegenerateCodes}
                    disabled={loading || !regeneratePassword}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-full transition-all disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Regenerate'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  Here are your new backup codes. Save them securely!
                </p>
                
                <div className="mb-4 p-4 bg-[#333A5C] rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    {newBackupCodes.map((code, index) => (
                      <div key={index} className="bg-slate-800 p-2 rounded text-center font-mono text-white">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadBackupCodes}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full transition-all"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={closeRegenerateModal}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full transition-all"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
