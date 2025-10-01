import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// ✅ Correct imports
import { AdminProvider } from './admin/src/context/AdminContext.jsx'
import { DoctorProvider } from './admin/src/context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <AdminProvider>
        <DoctorProvider>
          <App />
        </DoctorProvider>
      </AdminProvider>
    </AppContextProvider>
  </BrowserRouter>
)
