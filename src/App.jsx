import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import { CreateContest, ManageContests, ReviewSubmissions, DeclareWinners } from './pages/Contests';
import { ManageUsers } from './pages/Users';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AllContests from './pages/Contests/AllContests';
import ContestDetails from './pages/Contests/ContestDetails';
import LandingPage from './pages/LandingPage/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  console.log("App checking contests route");
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/contests" element={<ManageContests />} />
            <Route path="/admin/contests/create" element={<CreateContest />} />
            <Route path="/admin/submissions" element={<ReviewSubmissions />} />
            <Route path="/admin/winners" element={<DeclareWinners />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            {/* Redirect old dashboard path to the new admin path */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<UserDashboard />} />
            <Route path="/student/contests" element={<AllContests />} />
            <Route path="/student/contests/:id" element={<ContestDetails />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
