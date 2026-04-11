// ============================================================
// App.jsx — Pokkher mul routing file
// Ekhane sob page er route define kora ache.
// Admin ba student jei login koruk, seta dekhe tai route pathabe.
// ============================================================

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth';
import { UserProvider } from './context/UserContext';
import { Navbar, Footer } from './components';

// React.lazy diye pages load kora hocche — prottekta page alada alada chunk e thakbe.
// Eite initial load fast hoy karon sob page ekbar e download hoy na.

const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword/ResetPassword'));
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage'));

// --- Admin er sob page alada alada lazy load e define kora ---
const AdminDashboard = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.AdminDashboard })));
const CreateContest = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.CreateContest })));
const ManageContests = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.ManageContests })));
const ReviewSubmissions = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.ReviewSubmissions })));
const DeclareWinners = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.DeclareWinners })));
const ManageUsers = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.ManageUsers })));
const ContestReports = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.ContestReports })));
const ParticipantsDirectory = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.ParticipantsDirectory })));

// --- Student der jonno sob page ---
const StudentDashboard = React.lazy(() => import('./pages/Student').then(module => ({ default: module.StudentDashboard })));
const AllContests = React.lazy(() => import('./pages/Student').then(module => ({ default: module.AllContests })));
const ContestDetails = React.lazy(() => import('./pages/Student').then(module => ({ default: module.ContestDetails })));
const StudentSubmission = React.lazy(() => import('./pages/Student').then(module => ({ default: module.StudentSubmission })));

// Page load hote time lagle ei FallbackLoader spinner show korbe - Suspense er jonno dorkar
const FallbackLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf2]">
    <div className="w-12 h-12 border-4 text-[#8cc63f] rounded-full spinner-dual mb-4"></div>
    <span className="text-[#a68945] text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Environment...</span>
  </div>
);

function App() {
  return (
    <Router>
      <UserProvider>
        <Suspense fallback={<FallbackLoader />}>
          <Routes>
            {/* Public Routes — Login na korleo dekhano jabe */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />

            {/* Protected Admin Routes — Sudhu admin role e login thakle dekhabe, nahole redirect */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/contests" element={<ManageContests />} />
              <Route path="/admin/contests/create" element={<CreateContest />} />
              <Route path="/admin/submissions" element={<ReviewSubmissions />} />
              <Route path="/admin/winners" element={<DeclareWinners />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/reports" element={<ContestReports />} />
              <Route path="/admin/participants" element={<ParticipantsDirectory />} />
              {/* Redirect old dashboard path to the new admin path */}
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Protected Student Routes — Sudhu student role e login thakle access pabe */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/contests" element={<AllContests />} />
              <Route path="/student/contests/:id" element={<ContestDetails />} />
              <Route path="/student/submissions" element={<StudentSubmission />} />
            </Route>
          </Routes>
        </Suspense>
      </UserProvider>
    </Router>
  );
}

export default App;
