// ============================================================
// App.jsx — Pokkher mul routing file
// Ekhane sob page er route define kora ache.
// Admin ba student jei login koruk, seta dekhe tai route pathabe.
// ============================================================

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth';
import { UserProvider } from './context/UserContext';
import { LayoutProvider } from './context/LayoutContext';
import { Navbar, Footer, ScrollToTop, Loader } from './components';
import { useTheme } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// React.lazy diye pages load kora hocche — prottekta page alada alada chunk e thakbe.
// Eite initial load fast hoy karon sob page ekbar e download hoy na.

const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword/ResetPassword'));
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage'));
const Participants = React.lazy(() => import('./pages/Participants'));

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
const Leaderboard = React.lazy(() => import('./pages/Student').then(module => ({ default: module.Leaderboard })));

// Page load hote time lagle ei FallbackLoader spinner show korbe - Suspense er jonno dorkar
const FallbackLoader = () => (
  <Loader fullPage text="Configuring Scholastic Environment..." />
);

function App() {
  const { isDarkMode } = useTheme();

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme={isDarkMode ? "dark" : "colored"} 
      />
      <UserProvider>
        <LayoutProvider>
          <Navbar />
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <Suspense fallback={<FallbackLoader />}>
              <Routes>
                {/* Public Routes — Login na korleo dekhano jabe */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/participants" element={<Participants />} />
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

                {/* Shared Protected Routes — Accessible by both Students and Admins */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                  <Route path="/student/contests/:id" element={<ContestDetails />} />
                </Route>

                {/* Protected Student Routes — Sudhu student role e login thakle access pabe */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/contests" element={<AllContests />} />
                  <Route path="/student/submissions" element={<StudentSubmission />} />
                  <Route path="/student/leaderboard/:id" element={<Leaderboard />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        </LayoutProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
