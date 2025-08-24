import React from 'react'
import { assets } from '../assets/assets'

const ResetPassword = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <img onClick={() => navigate('/')} src={assets.logo} alt=""
      className='absolu' />
    </div>
  )
}

export default ResetPassword
