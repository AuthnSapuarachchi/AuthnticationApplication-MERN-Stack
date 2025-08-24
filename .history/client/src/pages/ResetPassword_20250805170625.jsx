import React, { useState, useContext } from 'react'
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
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Send OTP to email
  const sendResetOtp = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      
      if (data.success) {
        toast.success('Reset OTP sent to your email!');
        setIsOtpSent(true);
      } else {
        toast.error(data.message || 'Failed to send reset OTP');
      }
    } catch (error) {
      console.error('Failed to send reset OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password with OTP
  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
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
        otp,
        newPassword
      });
      
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (isOtpSent) {
      setIsOtpSent(false);
      setOtp('');
      setNewPassword('');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative'>
      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="Logo"
        className='absolute left-5 sm:left-10 top-5 w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform z-10' 
      />

      {/* Main Card */}
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full -translate-y-16 translate-x-16 opacity-10'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-blue-400 rounded-full translate-y-12 -translate-x-12 opacity-10'></div>

        {/* Header */}
        <div className='text-center mb-8 relative z-10'>
          <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>Reset Password</h2>
          <p className='text-gray-600 leading-relaxed'>
            {!isOtpSent 
              ? 'Enter your registered email to receive a password reset code.'
              : 'Enter the OTP sent to your email and your new password.'
            }
          </p>
        </div>

        {!isOtpSent ? (
          // Step 1: Email Input
          <form onSubmit={sendResetOtp} className='space-y-6'>
            <div>
              <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-12'
                  disabled={isSubmitting}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                isSubmitting || !email.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Sending OTP...
                </div>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </form>
        ) : (
          // Step 2: OTP and New Password Input
          <form onSubmit={resetPassword} className='space-y-6'>
            <div>
              <label htmlFor="otp" className='block text-sm font-semibold text-gray-700 mb-2'>
                Verification Code
              </label>
              <div className='relative'>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder='Enter 6-digit OTP'
                  maxLength="6"
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-12 text-center text-lg font-mono tracking-widest'
                  disabled={isSubmitting}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className='block text-sm font-semibold text-gray-700 mb-2'>
                New Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-12 pr-12'
                  disabled={isSubmitting}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>Password must be at least 6 characters long</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !otp.trim() || !newPassword.trim()}
              className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                isSubmitting || !otp.trim() || !newPassword.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        {/* Navigation */}
        <div className='text-center mt-6 pt-6 border-t border-gray-100 space-y-3'>
          <button
            onClick={goBack}
            className='text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center justify-center gap-2 mx-auto'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {isOtpSent ? 'Back to Email' : 'Back to Login'}
          </button>
          
          <p className='text-sm text-gray-500'>
            Remember your password? 
            <button onClick={() => navigate('/login')} className='text-blue-600 hover:underline ml-1 font-medium'>
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className='absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse'></div>
      <div className='absolute bottom-10 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 right-5 w-8 h-8 bg-yellow-300 rounded-full opacity-30 animate-bounce delay-500'></div>
    </div>
  )
}

export default ResetPassword
