import React, { useState } from 'react'
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('Sign Up');

  return (
    <div>
      <img src={assets.logo} alt="" className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 curs' />
    </div>
  )
}

export default Login
