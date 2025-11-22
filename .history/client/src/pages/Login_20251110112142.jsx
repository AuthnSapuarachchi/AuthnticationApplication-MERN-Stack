import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'signup' || location.pathname === '/signup') {
      setState('Sign Up');
    } else {
      setState('Login');
    }
  }, [location]);
  
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if(state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password});
        
        if(data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        }else {
          toast.error(data.message);
        }
      }else {
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password});
        if(data.success) {
          if(data.requires2FA) {
            toast.info('Please enter your 2FA code');
            navigate('/2fa-verify', { 
              state: { 
                email: email,
                tempToken: data.tempToken 
              } 
            });
          } else {
            setIsLoggedIn(true)
            getUserData()
            navigate('/')
          }
        }else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Branding/Info Section */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>
        
        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center items-center w-full p-12 text-white'>
          <div className='max-w-md text-center'>
            <div className='mb-8'>
              <div className='w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm'>
                <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </div>
              <h1 className='text-5xl font-bold mb-4'>Welcome to AuthBuilder</h1>
              <p className='text-xl text-purple-100'>
                Secure authentication made simple. Protect your account with advanced security features.
              </p>
            </div>
            
            <div className='space-y-6 mt-12'>
              <div className='flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                  </svg>
                </div>
                <div className='text-left'>
                  <h3 className='font-semibold text-lg'>Two-Factor Authentication</h3>
                  <p className='text-sm text-purple-100'>Enhanced security for your account</p>
                </div>
              </div>
              
              <div className='flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='text-left'>
                  <h3 className='font-semibold text-lg'>Fast & Reliable</h3>
                  <p className='text-sm text-purple-100'>Quick access to your dashboard</p>
                </div>
              </div>
              
              <div className='flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <div className='text-left'>
                  <h3 className='font-semibold text-lg'>Encrypted Data</h3>
                  <p className='text-sm text-purple-100'>Your privacy is our priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50'>
        <div className='w-full max-w-md'>
          {/* Logo for mobile */}
          <div className='lg:hidden mb-8 text-center'>
            <div onClick={() => navigate('/')} className='inline-flex items-center gap-2 cursor-pointer'>
              <div className='w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                AuthBuilder
              </span>
            </div>
          </div>

          {/* Back button for desktop */}
          <div className='hidden lg:block mb-8'>
            <button 
              onClick={() => navigate('/')} 
              className='flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group'
            >
              <svg className='w-5 h-5 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
              <span className='font-medium'>Back to Home</span>
            </button>
          </div>

          {/* Form Header */}
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className='text-gray-600'>
              {state === 'Sign Up' 
                ? 'Sign up to get started with your account' 
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Tabs */}
          <div className='flex gap-2 mb-8 bg-gray-200 p-1 rounded-lg'>
            <button
              onClick={() => {
                setState('Login');
                navigate('/login');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                state === 'Login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setState('Sign Up');
                navigate('/signup');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                state === 'Sign Up'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className='space-y-5'>
            {state === 'Sign Up' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type='text'
                    placeholder='John Doe'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type='email'
                  placeholder='you@example.com'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {state === 'Login' && (
              <div className='flex items-center justify-between'>
                <label className='flex items-center'>
                  <input type='checkbox' className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500' />
                  <span className='ml-2 text-sm text-gray-600'>Remember me</span>
                </label>
                <button
                  type='button'
                  onClick={() => navigate('/reset-password')}
                  className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            {state === 'Sign Up' ? (
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setState('Login');
                    navigate('/login');
                  }}
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setState('Sign Up');
                    navigate('/signup');
                  }}
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Sign up for free
                </button>
              </p>
            )}
          </div>

          {/* Divider */}
          <div className='mt-8 mb-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-gray-50 text-gray-500'>Secure authentication</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className='flex items-center justify-center gap-2 text-xs text-gray-500'>
            <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span>Protected by SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
