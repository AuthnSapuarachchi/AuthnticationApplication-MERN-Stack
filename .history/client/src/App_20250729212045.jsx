import React from 'react'
import { Routes, Router, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={} />
        <Route path='/email-verify' element={<EmailVerify />} />
      </Routes>
    </div>
  )
}

export default App
