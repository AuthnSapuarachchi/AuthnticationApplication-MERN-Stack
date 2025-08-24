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
          <div className='text justify-between mb-8'>
            {Array(6).fill().map((_, index) => (
              <input type='text' maxLength='1' key={index} required
                className='w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                ref={(e) => {inputRefs.current[index] = e}}
                onInput={(e) => }
          </div>
          
        
        </div>
      </form>
    </div>
  )
}

export default EmailVerify
