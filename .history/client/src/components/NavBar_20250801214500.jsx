import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {

    const navigate = useNavigate();
    const {userData} = React.useContext(AppContext);

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='w-28 sm:w-32 cursor-pointer'/>
      <div className='flex items-center gap-4'>
        <button onClick={() => navigate('/login')} 
        className='flex items-center gap-2 border border-gray-500 
        rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100
        transition-all'>Login <img src={assets.arrow_icon} alt='' /> </button>
        
        <button onClick={() => navigate('/signup')} 
        className='flex items-center gap-2 bg-blue-600 border border-blue-600
        rounded-full px-6 py-2 text-white hover:bg-blue-700
        transition-all'>Sign Up</button>
      </div>
    </div>
  )
}

export default NavBar
