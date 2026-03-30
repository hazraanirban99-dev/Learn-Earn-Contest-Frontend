import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import { CreateContest } from './pages/Contests';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/contests/create" element={<CreateContest />} />
          {/* Redirect old dashboard path to the new admin path */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Redirect root to admin dashboard (if authenticated) or login */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
