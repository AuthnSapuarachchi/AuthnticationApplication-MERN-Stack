import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const {userData} = useContext(AppContext);
  const navigate = useNavigate();


  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt=""
      className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl 
      font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}! <img className='w-8 aspect-square' 
        src={assets.hand_wave} /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to AuthCodeLab</h2>
        <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time</p>
        
        <div className='flex gap-4'>
          {!userData ? (
            <button className='border border-gray-500 rounded-full px-8 py-2.5
            hover:bg-gray-100 transition-all' 
            onClick={() => navigate('/login')}>Get Started</button>
          ) : (
            <>
              <button className='border border-gray-500 rounded-full px-8 py-2.5
              hover:bg-gray-100 transition-all' 
              onClick={() => navigate('/settings')}>⚙️ Settings</button>
              
              {(userData.role === 'admin' || userData.role === 'moderator') && (
                <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full px-8 py-2.5
                hover:opacity-90 transition-all' 
                onClick={() => navigate('/admin-dashboard')}>
                  👑 {userData.role === 'admin' ? 'Admin' : 'Moderator'} Dashboard
                </button>
              )}
            </>
          )}
        </div>
    </div>
  )
}

export default Header