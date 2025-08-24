import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp });
      
      if (data.success) {
        toast.success('Email verified successfully!');
        getUserData(); // Refresh user data
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

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Redirect if already verified
  if (userData && userData.isAccountVerified) {
    navigate('/');
    return null;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 relative'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center justify-center gap-4'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-4'>Verify Your Email</h2>
          <div className='text'>

          </div>
          <input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500' 
            disabled={isSubmitting}
            maxLength={6}
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !otp.trim()}
            className={`w-full p-3 rounded transition-colors ${
              isSubmitting || !otp.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmailVerify
