import React, { useState } from 'react'
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('Sign Up');

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400 relative'>
      <img src={assets.logo} alt="" className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer' />
      <div>
        <h2>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
        <form>
          <div className='flex flex-col gap-4 mt-4'>
            <img src="" alt="" />
            <input type="text" placeholder='Email' className='border border-gray-300 px-4 py-2 rounded-md' />
            <input type="password" placeholder='Password' className='border border-gray-300 px-4 py-2 rounded-md' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
