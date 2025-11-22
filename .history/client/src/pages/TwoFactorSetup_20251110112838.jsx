import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const TwoFactorSetup = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, getUserData } = useContext(AppContext);

  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1: QR, 2: Verify, 3: Backup Codes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    setupTwoFactor();
  }, [isLoggedIn]);

  const setupTwoFactor = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/2fa/setup');
      
      console.log('2FA Setup Response:', data); // Debug log
      
      if (data.success) {
        // Backend returns data in nested structure: data.data.qrCode
        setQrCode(data.data.qrCode);
        setSecret(data.data.secret);
        setStep(1);
      } else {
        toast.error(data.message);
        navigate('/settings');
      }
    } catch (error) {
      console.error('2FA Setup Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to setup 2FA');
      navigate('/settings');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/2fa/verify', {
        token: verificationCode
      });

      if (data.success) {
        setBackupCodes(data.backupCodes);
        setStep(3);
        toast.success('2FA enabled successfully!');
        await getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '2fa-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Backup codes downloaded');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const finishSetup = () => {
    navigate('/settings');
  };

  if (loading && step === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-400">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400">
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" 
      />

      <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-[600px] text-white">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-600'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Scan QR Code */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-center">Setup Two-Factor Authentication</h2>
            <p className="text-gray-400 text-center mb-6">
              Scan this QR code with Google Authenticator app
            </p>

            <div className="flex justify-center mb-6">
              {qrCode ? (
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-64 h-64 border-4 border-white rounded-lg"
                  onError={() => {
                    console.error('QR Code failed to load');
                    toast.error('QR Code failed to load. Use manual entry code below.');
                  }}
                />
              ) : (
                <div className="w-64 h-64 border-4 border-gray-600 rounded-lg flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">Loading QR Code...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 p-4 bg-[#333A5C] rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Manual Entry Code:</p>
              <div className="flex items-center justify-between">
                <code className="text-indigo-300 break-all">{secret}</code>
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="ml-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                <strong>📱 Step 1:</strong> Download Google Authenticator app
              </p>
              <p className="text-sm text-gray-400">
                <strong>📷 Step 2:</strong> Scan the QR code above
              </p>
              <p className="text-sm text-gray-400">
                <strong>✅ Step 3:</strong> Click Next to verify
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all"
            >
              Next: Verify Code
            </button>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-center">Verify Your Code</h2>
            <p className="text-gray-400 text-center mb-6">
              Enter the 6-digit code from your authenticator app
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-5 py-3 bg-[#333A5C] text-white text-center text-2xl tracking-widest rounded-lg outline-none"
                maxLength="6"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-full transition-all"
              >
                Back
              </button>
              <button
                onClick={verifyAndEnable}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-center">Save Your Backup Codes</h2>
            <p className="text-gray-400 text-center mb-6">
              Store these codes safely. You can use them if you lose access to your authenticator app.
            </p>

            <div className="mb-6 p-4 bg-[#333A5C] rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-slate-800 p-2 rounded text-center font-mono">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-900 border border-yellow-600 p-4 rounded-lg mb-6">
              <p className="text-yellow-200 text-sm">
                ⚠️ <strong>Important:</strong> Each code can only be used once. Download and store them securely!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadBackupCodes}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full transition-all"
              >
                📥 Download Codes
              </button>
              <button
                onClick={finishSetup}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all"
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
