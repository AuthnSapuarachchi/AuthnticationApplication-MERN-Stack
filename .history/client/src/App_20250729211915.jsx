import React from 'react'
import { Routes, Router, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/login' element={Login} />
        <Route path='/resetpassword' element={ResetPassword} />
        <Route path='/' element={Home} />
      </Routes>
    </div>
  )
}

export default App
