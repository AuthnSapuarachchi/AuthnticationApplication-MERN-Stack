import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const TwoFactorVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');

  const email = location.state?.email;
  const tempToken = location.state?.tempToken;

  useEffect(() => {
    if (!email || !tempToken) {
      toast.error('Invalid access. Please login again.');
      navigate('/login');
    }
  }, [email, tempToken, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('');
    setCode([...newCode, ...Array(6 - newCode.length).fill('')]);
    
    if (pastedData.length === 6) {
      document.getElementById('code-5')?.focus();
    }
  };

  const verify2FA = async () => {
    const verificationCode = useBackupCode ? backupCode : code.join('');

    if (!useBackupCode && verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    if (useBackupCode && backupCode.length !== 8) {
      toast.error('Backup code must be 8 characters');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + '/api/2fa/verify-login',
        { 
          email: email,
          token: verificationCode,
          isBackupCode: useBackupCode
        }
      );

      if (data.success) {
        toast.success('Login successful!');
        setIsLoggedIn(true);
        await getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verify2FA();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/login')}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white">
        <h2 className="text-3xl font-semibold mb-4 text-center">Two-Factor Authentication</h2>
        <p className="text-center text-sm mb-6 text-gray-400">
          {useBackupCode 
            ? 'Enter your 8-character backup code' 
            : 'Enter the 6-digit code from your authenticator app'}
        </p>

        <form onSubmit={handleSubmit}>
          {!useBackupCode ? (
            // 6-digit code input
            <div className="flex justify-between mb-6 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-2xl bg-[#333A5C] text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength="1"
                />
              ))}
            </div>
          ) : (
            // Backup code input
            <div className="mb-6">
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="XXXXXXXX"
                className="w-full px-5 py-3 bg-[#333A5C] text-white text-center text-xl tracking-widest rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength="8"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!useBackupCode && code.join('').length !== 6) || (useBackupCode && backupCode.length !== 8)}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode(['', '', '', '', '', '']);
              setBackupCode('');
            }}
            className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
          >
            {useBackupCode ? '← Use authenticator code' : 'Use backup code instead →'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
          >
            ← Back to login
          </button>
        </div>

        <div className="mt-6 p-4 bg-[#333A5C] rounded-lg">
          <p className="text-xs text-gray-400">
            💡 <strong>Tip:</strong> If you lost access to your authenticator app, use one of your backup codes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerify;
