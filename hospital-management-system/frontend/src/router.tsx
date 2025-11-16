import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import AuthLayout from '@layouts/AuthLayout'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
