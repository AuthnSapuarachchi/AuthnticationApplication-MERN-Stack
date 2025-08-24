import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <img onClick={() => navigate('/')} src={assets.logo} alt=""
      className='absolute top-4 left-4 sm:left-20 w-12 cursor-pointer' />

    <form action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h2 className='text-3xl font-bold text-gray-800 mb-2'>Reset Passw</h2>
          <p className='text-gray-600 leading-relaxed'>
            We've sent a 6-digit verification code to your email address. 
            <br />Please enter the code below to verify your account.
          </p>
    </form>

    </div>
  )
}

export default ResetPassword
