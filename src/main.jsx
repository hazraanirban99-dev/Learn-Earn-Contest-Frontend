import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AdminDashboardProvider } from './context/AdminDashboardContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminDashboardProvider>
        <App />
      </AdminDashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
