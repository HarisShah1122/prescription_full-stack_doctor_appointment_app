import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// global components
import Navbar from './components/Navbar'
import Sidebar from "./admin/src/components/Sidebar"
import Footer from './components/Footer'

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

// admin pages
import AdminDashboard from './admin/src/pages/Admin/Dashboard.jsx'
import AllAppointments from './admin/src/pages/Admin/AllAppointments.jsx'
import AddDoctor from './admin/src/pages/Admin/AddDoctor.jsx'
import DoctorList from './admin/src/pages/Admin/DoctorsList.jsx'

// doctor pages
import DoctorDashboard from './admin/src/pages/Doctor/DoctorDashboard.jsx'  // if exists
import DoctorAppointments from './admin/src/pages/Doctor/DoctorAppointments.jsx'
import DoctorProfile from './admin/src/pages/Doctor/DoctorProfile.jsx'  // if exists

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />

      <Routes>
        {/* ✅ user routes */}
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />

        {/* ✅ admin routes */}
        <Route path="/admin-dashboard" element={<><Sidebar /><AdminDashboard /></>} />
        <Route path="/all-appointments" element={<><Sidebar /><AllAppointments /></>} />
        <Route path="/add-doctor" element={<><Sidebar /><AddDoctor /></>} />
        <Route path="/doctor-list" element={<><Sidebar /><DoctorList /></>} />

        {/* ✅ doctor routes */}
        <Route path="/doctor-dashboard" element={<><Sidebar /><DoctorDashboard /></>} />
        <Route path="/doctor-appointments" element={<><Sidebar /><DoctorAppointments /></>} />
        <Route path="/doctor-profile" element={<><Sidebar /><DoctorProfile /></>} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
