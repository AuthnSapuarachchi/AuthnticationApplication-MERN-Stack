import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn} = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if(state === 'Sign Up') {
        await
      }else {

      }
    } catch (error) {

    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200 to-purple-400 relative'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg top-5 w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold mb-4 text-white text-center '>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6 text-gray-400'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className=' mb-4 flex items-center gap-4 w-full px-5 py-2.5 bg-[#333A5C] rounded-full shadow-md'>
            <img src={assets.person_icon} alt="" />
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Full Name' className='bg-transparent outline-none' required/>
          </div>
          )}

          <div className=' mb-4 flex items-center gap-4 w-full px-5 py-2.5 bg-[#333A5C] rounded-full shadow-md'>
            <img src={assets.mail_icon} alt="" />
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} type="email" placeholder='Email Id' 
              className='bg-transparent outline-none' required/>
          </div>

          <div className=' mb-4 flex items-center gap-4 w-full px-5 py-2.5 bg-[#333A5C] rounded-full shadow-md'>
            <img src={assets.lock_icon} alt="" />
            <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} type="email" placeholder='Password' 
            className='bg-transparent outline-none' required/>
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgoet Password</p>

          <button className='w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2 rounded-full hover:bg-indigo-900 transition-all cursor-pointer' >{state}</button>
        </form>

        { state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account? {' '}
          <span className='text-blue-400 cursor-pointer underline' onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}>
            Login here
          </span>
          </p>
          ) 
          : (<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
          <span className='text-blue-400 cursor-pointer underline' onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}>
            Sign up
          </span>
          </p> )}

        

        

      </div>
    </div>
  )
}

export default Login
