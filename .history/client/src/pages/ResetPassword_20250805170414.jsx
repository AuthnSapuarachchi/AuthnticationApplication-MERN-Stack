import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <img onClick={() => navigate('/')} src={assets.logo} alt=""
      className='absolute top-4 left-4 sm:left-20 w-12 cursor-pointer' />

    <form action="" className='bg-whi-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h2 className='text-3xl font-bold text-gray mb-2'>Reset Password</h2>
          <p className='text-gray-600 leading-relaxed'>
            Enter your regitered email to receive a password reset link.
          </p>
      <div className='mt-6'>
        <label htmlFor="email" className='block text-gray-700 mb-2'>Email</label>
        <input type="email" id="email" placeholder='Enter your email' className='w-full p-2 border border-gray-300 rounded-md' />
      </div>
    </form>

    </div>
  )
}

export default ResetPassword
