import React from 'react'

const EmailVerify = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 relative'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20
            top-5 w-28 sm:w-32 cursor-pointer' />
          <form action="">
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
              <h2 className='text-2xl font-bold mb-4'>Verify Your Email</h2>
              <p className='text-gray-600 mb-6'>Please enter the OTP sent to your email to verify your account.</p>
              <input type="text" placeholder="Enter OTP" className='w-full p-3 border border-gray-300 rounded mb-4' />
              <button type="submit" className='w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600'>Verify</button>
            </div>
          </form>
    </div>
  )
}

export default EmailVerify
