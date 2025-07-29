import React from 'react'
import { Routes, Router, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/login' element={Login} />
        <Route path='/resetpassword' element={HoRme} />
        <Route path='/' element={Home} />
      </Routes>
    </div>
  )
}

export default App
