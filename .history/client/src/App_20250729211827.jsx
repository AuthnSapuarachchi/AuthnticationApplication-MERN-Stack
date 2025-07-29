import React from 'react'
import { Routes, Router, Route } from 'react-router-dom'
import Home from './pages/home'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/login' element={Home} />
        <Route path='/' element={Home} />
        <Route path='/' element={Home} />
      </Routes>
    </div>
  )
}

export default App
