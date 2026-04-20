// ============================================================
// main.jsx — Application er entry point
// Ekhane React root create kora hoy r App component render kora hoy.
// Global providers (Auth, AdminDashboard) ekhane wrap kora ache.
// Toast notifications system (Toastify) setup move to App.jsx.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AdminDashboardProvider } from './context/AdminDashboardContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AdminDashboardProvider>
          <App />
        </AdminDashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
