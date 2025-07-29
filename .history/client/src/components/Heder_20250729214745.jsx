import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <img src={assets.header_img} alt=""
      className='w-36 h-36 rounded-full mb-6' />
      <h1>Hey Developer<img className='w-8 aspect-square' 
                        src={assets.hand_wave} /></h1>
        <h2>Welcome to AuthCodeLab</h2>
        <p>Let's start witha quick product tour and we will have you up and running in no time</p>
        <button>Get Started</button>
    </div>
  )
}

export default Header