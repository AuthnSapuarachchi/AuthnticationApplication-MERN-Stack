import React, { useState, useContext, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Handle input changes for OTP
  const handleInputChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  // Auto-focus first OTP input when OTP form is shown
  useEffect(() => {
    if (isOtpSent && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOtpSent]);

  // Send OTP to email
  const sendResetOtp = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      
      if (data.success) {
        toast.success('Reset OTP sent to your email!');
        setIsOtpSent(true);
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      } else {
        toast.error(data.message || 'Failed to send reset OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setIsResending(true);
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      
      if (data.success) {
        toast.success('Reset OTP sent again!');
        setOtp(['', '', '', '', '', '']); // Clear current OTP
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus(); // Focus first input
        }
      } else {
        toast.error(data.message || 'Failed to resend reset OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend reset OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Reset password with OTP
  const resetPassword = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    if (!newPassword.trim()) {
      toast.error('Please enter your new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp: otpString,
        newPassword
      });
      
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Password reset failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400 relative'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold mb-4 text-white text-center'>
          {!isOtpSent ? 'Reset Password' : 'Enter New Password'}
        </h2>
        <p className='text-center text-sm mb-6 text-gray-400'>
          {!isOtpSent 
            ? 'Enter your email to receive reset code' 
            : 'Enter the OTP and your new password'
          }
        </p>

        {!isOtpSent ? (
          // Step 1: Email Input Form
          <form onSubmit={sendResetOtp}>
            <div className='mb-4 flex items-center gap-4 w-full px-5 py-2.5 bg-[#333A5C] rounded-full shadow-md'>
              <img src={assets.mail_icon} alt="" />
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                placeholder='Enter your email' 
                className='bg-transparent outline-none w-full'
                disabled={isSubmitting}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className='w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2 rounded-full hover:bg-indigo-900 transition-all cursor-pointer disabled:opacity-50'
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          // Step 2: OTP and New Password Form
          <form onSubmit={resetPassword} className="space-y-6">
            {/* Email Display */}
            <div className='mb-6 p-3 bg-[#2a2f47] rounded-lg border-l-4 border-indigo-500'>
              <p className='text-sm text-gray-300'>
                <span className='text-indigo-400 font-medium'>Reset code sent to:</span>
                <br />
                <span className='text-white'>{email}</span>
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className='mb-6'>
              <p className='text-center text-sm mb-4 text-gray-400'>Enter the 6-digit code</p>
              <div className='flex justify-center gap-2 mb-4'>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type='text'
                    maxLength='1'
                    value={data}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    onChange={(e) => handleInputChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className='w-12 h-12 text-center text-xl font-bold bg-[#333A5C] border-2 border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-white'
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* New Password Input */}
            <div className='mb-6 flex items-center gap-4 w-full px-5 py-2.5 bg-[#333A5C] rounded-full shadow-md'>
              <img src={assets.lock_icon} alt="" />
              <input 
                onChange={(e) => setNewPassword(e.target.value)} 
                value={newPassword} 
                type="password" 
                placeholder='Enter new password' 
                className='bg-transparent outline-none w-full'
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6}
              className={`w-full py-3 rounded-full font-semibold transition-all ${
                isSubmitting || otp.join('').length !== 6
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-800 text-white'
              }`}
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Resetting...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Resend OTP */}
            <div className='text-center pt-4 border-t border-gray-700'>
              <p className='text-gray-400 text-sm mb-3'>Didn't receive the code?</p>
              <button
                type='button'
                onClick={resendOtp}
                disabled={isResending || isSubmitting}
                className={`text-indigo-400 font-medium hover:text-indigo-300 transition-colors ${
                  isResending || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
                }`}
              >
                {isResending ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin'></div>
                    Resending...
                  </div>
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>
          </form>
        )}

        <div className='text-center mt-4 space-y-2'>
          {isOtpSent && (
            <p 
              onClick={() => setIsOtpSent(false)} 
              className='text-indigo-500 cursor-pointer hover:underline'
            >
              Back to Email
            </p>
          )}
          <p className='text-gray-400 text-xs'>
            Remember your password?{' '}
            <span 
              className='text-blue-400 cursor-pointer underline' 
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
