import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData, logout, isAuthenticated, isAdminAuthenticated } = useContext(AppContext)

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          isAuthenticated && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image || assets.default_profile} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-56 bg-gray-50 rounded-lg shadow-lg p-3'>
                  {/* User Section */}
                  <div className='pb-2 mb-2 border-b border-gray-200'>
                    <p onClick={() => {navigate('/dashboard'); setShowMenu(false)}} className='hover:text-black cursor-pointer py-2 px-3 rounded-md hover:bg-gray-100 transition-colors'>
                      📊 Dashboard
                    </p>
                    <p onClick={() => {navigate('/my-profile'); setShowMenu(false)}} className='hover:text-black cursor-pointer py-2 px-3 rounded-md hover:bg-gray-100 transition-colors'>
                      👤 My Profile
                    </p>
                    <p onClick={() => {navigate('/my-appointments'); setShowMenu(false)}} className='hover:text-black cursor-pointer py-2 px-3 rounded-md hover:bg-gray-100 transition-colors'>
                      📅 My Appointments
                    </p>
                  </div>

                  {/* Admin Section */}
                  {(userData?.role === 'super_admin' || userData?.role === 'admin') && (
                    <div className='pb-2 mb-2 border-b border-gray-200'>
                      <p className='text-xs text-gray-500 uppercase tracking-wider px-3 py-1 font-semibold'>Admin Panel</p>
                      <p onClick={() => {navigate(userData?.role === 'super_admin' ? '/super-admin-dashboard' : '/admin-dashboard'); setShowMenu(false)}} className='hover:text-black cursor-pointer py-2 px-3 rounded-md hover:bg-blue-50 transition-colors font-medium text-blue-600'>
                        {userData?.role === 'super_admin' ? '⚡ Super Admin Panel' : '🏥 Admin Panel'}
                      </p>
                    </div>
                  )}

                  {/* Development Section */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className='pb-2 mb-2 border-b border-gray-200'>
                      <p className='text-xs text-gray-500 uppercase tracking-wider px-3 py-1 font-semibold'>Development</p>
                      <div className='space-y-1'>
                        <p onClick={() => {
                          const testUserData = { ...userData, role: 'super_admin' };
                          localStorage.setItem('userData', JSON.stringify(testUserData));
                          window.location.reload();
                        }} className='text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 cursor-pointer py-1 px-3 rounded transition-colors'>
                          🎯 Switch to Super Admin
                        </p>
                        <p onClick={() => {
                          const testUserData = { ...userData, role: 'admin' };
                          localStorage.setItem('userData', JSON.stringify(testUserData));
                          window.location.reload();
                        }} className='text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer py-1 px-3 rounded transition-colors'>
                          👨‍⚕️ Switch to Admin
                        </p>
                        <p onClick={() => {
                          const testUserData = { ...userData, role: 'patient' };
                          localStorage.setItem('userData', JSON.stringify(testUserData));
                          window.location.reload();
                        }} className='text-xs text-green-600 hover:text-green-800 hover:bg-green-50 cursor-pointer py-1 px-3 rounded transition-colors'>
                          🧑 Switch to Patient
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Logout Section */}
                  <div>
                    <p onClick={handleLogout} className='text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer py-2 px-3 rounded-md transition-colors font-medium'>
                      🚪 Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
            {isAuthenticated && (
              <>
                {/* User Section */}
                <div className='pb-2 mb-2 border-b border-gray-200'>
                  <p className='text-xs text-gray-500 uppercase tracking-wider px-5 py-1 font-semibold'>User Menu</p>
                  <NavLink onClick={() => setShowMenu(false)} to='/dashboard'><p className='px-5 py-2 rounded inline-block hover:bg-gray-100 transition-colors'>📊 Dashboard</p></NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-profile'><p className='px-5 py-2 rounded inline-block hover:bg-gray-100 transition-colors'>👤 My Profile</p></NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-appointments'><p className='px-5 py-2 rounded inline-block hover:bg-gray-100 transition-colors'>📅 My Appointments</p></NavLink>
                </div>

                {/* Admin Section */}
                {(userData?.role === 'super_admin' || userData?.role === 'admin') && (
                  <div className='pb-2 mb-2 border-b border-gray-200'>
                    <p className='text-xs text-gray-500 uppercase tracking-wider px-5 py-1 font-semibold'>Admin Panel</p>
                    <NavLink onClick={() => setShowMenu(false)} to={userData?.role === 'super_admin' ? '/super-admin-dashboard' : '/admin-dashboard'}>
                      <p className='px-5 py-2 rounded inline-block hover:bg-blue-50 transition-colors font-medium text-blue-600'>
                        {userData?.role === 'super_admin' ? '⚡ Super Admin Panel' : '🏥 Admin Panel'}
                      </p>
                    </NavLink>
                  </div>
                )}

                {/* Development Section */}
                {process.env.NODE_ENV === 'development' && (
                  <div className='pb-2 mb-2 border-b border-gray-200'>
                    <p className='text-xs text-gray-500 uppercase tracking-wider px-5 py-1 font-semibold'>Development</p>
                    <div className='space-y-1'>
                      <p onClick={() => {
                        const testUserData = { ...userData, role: 'super_admin' };
                        localStorage.setItem('userData', JSON.stringify(testUserData));
                        window.location.reload();
                      }} className='text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 cursor-pointer px-5 py-2 rounded transition-colors'>
                        🎯 Switch to Super Admin
                      </p>
                      <p onClick={() => {
                        const testUserData = { ...userData, role: 'admin' };
                        localStorage.setItem('userData', JSON.stringify(testUserData));
                        window.location.reload();
                      }} className='text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer px-5 py-2 rounded transition-colors'>
                        👨‍⚕️ Switch to Admin
                      </p>
                      <p onClick={() => {
                        const testUserData = { ...userData, role: 'patient' };
                        localStorage.setItem('userData', JSON.stringify(testUserData));
                        window.location.reload();
                      }} className='text-xs text-green-600 hover:text-green-800 hover:bg-green-50 cursor-pointer px-5 py-2 rounded transition-colors'>
                        🧑 Switch to Patient
                      </p>
                    </div>
                  </div>
                )}

                {/* Logout Section */}
                <div>
                  <p onClick={() => {handleLogout(); setShowMenu(false)}} className='px-5 py-2 rounded inline-block cursor-pointer hover:bg-red-50 text-red-600 font-medium transition-colors'>🚪 Logout</p>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <NavLink onClick={() => setShowMenu(false)} to='/login'><p className='px-4 py-2 rounded full inline-block bg-primary text-white'>LOGIN</p></NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar