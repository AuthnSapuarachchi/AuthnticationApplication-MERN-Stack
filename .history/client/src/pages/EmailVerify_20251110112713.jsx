import React, { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp: otpString });
      
      if (data.success) {
        toast.success('Email verified successfully!');
        await getUserData(); // Refresh user data
        navigate('/'); // Redirect to home
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsResending(true);
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      
      if (data.success) {
        toast.success('Verification OTP sent successfully!');
        setOtp(['', '', '', '', '', '']); // Clear current OTP
        inputRefs.current[0].focus(); // Focus first input
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Redirect if already verified
  useEffect(() => {
    if (userData && userData.isAccountVerified) {
      navigate('/');
    }
  }, [userData, navigate]);

  if (!isLoggedIn || (userData && userData.isAccountVerified)) {
    return null;
  }

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
          <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>Verify Your Email</h2>
          <p className='text-gray-600 leading-relaxed'>
            We've sent a 6-digit verification code to your email address. 
            <br />Please enter the code below to verify your account.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={onSubmitHandler} className='space-y-6'>
          {/* OTP Input Fields */}
          <div className='flex justify-center gap-3 mb-8'>
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
                className='w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-400'
                disabled={isSubmitting}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting || otp.join('').length !== 6}
            className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              isSubmitting || otp.join('').length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className='text-center mt-6 pt-6 border-t border-gray-100'>
          <p className='text-gray-600 mb-3'>Didn't receive the code?</p>
          <button
            type='button'
            onClick={resendOtp}
            disabled={isResending || isSubmitting}
            className={`text-blue-600 font-semibold hover:text-blue-700 transition-colors ${
              isResending || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
            }`}
          >
            {isResending ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                Resending...
              </div>
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500'>
            Need help? <button onClick={() => navigate('/')} className='text-blue-600 hover:underline'>Contact Support</button>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className='absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse'></div>
      <div className='absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-5 w-8 h-8 bg-indigo-300 rounded-full opacity-30 animate-bounce delay-500'></div>
    </div>
  )
}

export default EmailVerify
