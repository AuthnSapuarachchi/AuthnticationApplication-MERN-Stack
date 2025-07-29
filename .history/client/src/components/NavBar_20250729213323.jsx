import React from 'react'
import { assets } from '../assets/assets'

const NavBar = () => {
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute'>
      <img src={assets.logo} alt='' className='w-28 sm:w-32'/>
      <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Login </button>
    </div>
  )
}

export default NavBar
