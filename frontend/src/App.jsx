import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// global components
import Navbar from './components/Navbar'
import Sidebar from "./admin/src/components/Sidebar"
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import ProtectedRoute from './components/ProtectedRoute'
import AuthGuard from './components/AuthGuard'

// user pages
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Verify from './pages/Verify'
import TestConnection from './pages/TestConnection'
import AdminLoginTest from './components/AdminLoginTest'

// admin pages
import AdminDashboard from './components/AdminDashboard'
import AllAppointments from './admin/src/pages/Admin/AllAppointments.jsx'
import AddDoctor from './admin/src/pages/Admin/AddDoctor.jsx'
import DoctorList from './admin/src/pages/Admin/DoctorsList.jsx'

// doctor pages
import DoctorDashboard from './components/DoctorDashboard'  
import DoctorAppointments from './admin/src/pages/Doctor/DoctorAppointments.jsx'
import DoctorProfile from './admin/src/pages/Doctor/DoctorProfile.jsx'  

const App = () => {
  return (
    <AuthGuard>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <Navbar />

        <Routes>
          {/* ✅ Public routes */}
          <Route path="/admin-login-test" element={<AdminLoginTest />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ✅ Protected user routes */}
          <Route path="/" element={<ProtectedRoute requiredRole={null}><Home /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute requiredRole={null}><Doctors /></ProtectedRoute>} />
          <Route path="/doctors/:speciality" element={<ProtectedRoute requiredRole={null}><Doctors /></ProtectedRoute>} />
          <Route path="/appointment/:docId" element={<ProtectedRoute requiredRole={null}><Appointment /></ProtectedRoute>} />
          <Route path="/my-appointments" element={<ProtectedRoute requiredRole={null}><MyAppointments /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute requiredRole={null}><MyProfile /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute requiredRole={null}><Verify /></ProtectedRoute>} />

          {/* ✅ Protected admin routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/all-appointments" element={<ProtectedRoute adminOnly><><Sidebar /><AllAppointments /></></ProtectedRoute>} />
          <Route path="/add-doctor" element={<ProtectedRoute adminOnly><><Sidebar /><AddDoctor /></></ProtectedRoute>} />
          <Route path="/doctor-list" element={<ProtectedRoute adminOnly><><Sidebar /><DoctorList /></></ProtectedRoute>} />

          {/* ✅ Protected doctor routes */}
          <Route path="/doctor-dashboard" element={<ProtectedRoute requiredRole={null}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor-appointments" element={<ProtectedRoute requiredRole={null}><><Sidebar /><DoctorAppointments /></></ProtectedRoute>} />
          <Route path="/doctor-profile" element={<ProtectedRoute requiredRole={null}><><Sidebar /><DoctorProfile /></></ProtectedRoute>} />
        </Routes>

        <Footer />
        <AIChatbot />
      </div>
    </AuthGuard>
  )
}

export default App
