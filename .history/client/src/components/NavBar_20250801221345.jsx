import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const NavBar = () => {

    const navigate = useNavigate();
    const {userData, setUserData, setIsLoggedIn} = useContext(AppContext);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='w-28 sm:w-32 cursor-pointer'/>
      
      {userData ? 
          <div className='w-8 h-8 flex items-center justify-center rounded-full bg-black text-white font-medium relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                {userData.isAccountVerified }
                <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
                <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10' >Logout</li>
              </ul>
            </div>
          </div>
        : 
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
      }
    </div>
  )
}

export default NavBar
