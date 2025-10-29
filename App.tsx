import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import CoursesPage from './pages/public/CoursesPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import TimetablePreviewPage from './pages/public/TimetablePreviewPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentCoursesPage from './pages/student/StudentCoursesPage';
import StudentLecturesPage from './pages/student/StudentLecturesPage';
import StudentPaymentsPage from './pages/student/StudentPaymentsPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import StudentTimetablePage from './pages/student/StudentTimetablePage';
import StudentCertificatesPage from './pages/student/StudentCertificatesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Admin Pages (Staff & Super Admin)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminLecturesPage from './pages/admin/AdminLecturesPage';
import AdminTimetablePage from './pages/admin/AdminTimetablePage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage'; // New placeholder
import AdminSettingsPage from './pages/admin/AdminSettingsPage'; // New placeholder

import { UserRole } from './types';

// Helper component for role-based redirection from root
const RedirectToDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    if (user.role === UserRole.STUDENT) {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === UserRole.STAFF || user.role === UserRole.SUPER_ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  return <Navigate to="/login" replace />; // Default to login if not authenticated or role not recognized
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/timetable-preview" element={<TimetablePreviewPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Root redirect based on auth status */}
          <Route path="/dashboard" element={<RedirectToDashboard />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]} />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/courses/:courseId/lectures" element={<StudentLecturesPage />} />
            <Route path="/student/payments" element={<StudentPaymentsPage />} />
            <Route path="/student/attendance" element={<StudentAttendancePage />} />
            <Route path="/student/timetable" element={<StudentTimetablePage />} />
            <Route path="/student/certificates" element={<StudentCertificatesPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>

          {/* Admin Routes (Staff & Super Admin) */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.SUPER_ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/lectures" element={<AdminLecturesPage />} />
            <Route path="/admin/timetable" element={<AdminTimetablePage />} />
            <Route path="/admin/attendance" element={<AdminAttendancePage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
          </Route>

          {/* Super Admin Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;