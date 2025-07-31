import React, { useState } from 'react'
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('Sign Up');

  return (
    <div>
      <img src={assets.logo} alt="" className='absolute left' />
    </div>
  )
}

export default Login
