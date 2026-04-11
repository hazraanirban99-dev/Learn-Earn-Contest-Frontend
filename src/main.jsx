// ============================================================
// main.jsx — Application er entry point
// Ekhane React root create kora hoy r App component render kora hoy.
// Global providers (Auth, AdminDashboard) ekhane wrap kora ache.
// Toast notifications system (Toastify) ekhane setup kora.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AdminDashboardProvider } from './context/AdminDashboardContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminDashboardProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </AdminDashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
