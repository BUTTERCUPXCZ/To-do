import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './page/Login'
import Register from './page/Register'
import Dashboard from './page/Dashboard.jsx'
import Navbar from './components/navbar.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App  