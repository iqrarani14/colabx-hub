import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/variables.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Rooms from './pages/Rooms';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Messages from './pages/Messages';
import Files from './pages/Files';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import RoomDetail from './pages/RoomDetail';
import ProjectDetail from './pages/ProjectDetail';
import FileDetail from './pages/FileDetail';

// Layout
import Sidebar from './components/Sidebar';

// Auth Guard
import { isLoggedIn, getUser } from './utils/storage';

// ===== AUTH GUARD =====
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// ===== ROLE GUARD =====
const RoleRoute = ({ children, allowedRoles }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// ===== LAYOUT =====
const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px', padding: '40px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== ALL ROLES ===== */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <DashboardLayout><Tasks /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <DashboardLayout><Messages /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/calendar" element={
          <ProtectedRoute>
            <DashboardLayout><Calendar /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout><Settings /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* ===== LEARNER + MENTOR + ADMIN ===== */}
        <Route path="/rooms" element={
          <RoleRoute allowedRoles={['Learner', 'Mentor', 'Admin']}>
            <DashboardLayout><Rooms /></DashboardLayout>
          </RoleRoute>
        } />

        <Route path="/rooms/:id" element={
          <RoleRoute allowedRoles={['Learner', 'Mentor', 'Admin']}>
            <DashboardLayout><RoomDetail /></DashboardLayout>
          </RoleRoute>
        } />

        <Route path="/projects" element={
          <RoleRoute allowedRoles={['Learner', 'Mentor', 'Admin']}>
            <DashboardLayout><Projects /></DashboardLayout>
          </RoleRoute>
        } />

        <Route path="/projects/:id" element={
          <RoleRoute allowedRoles={['Learner', 'Mentor', 'Admin']}>
            <DashboardLayout><ProjectDetail /></DashboardLayout>
          </RoleRoute>
        } />

        {/* ===== MENTOR + ADMIN ONLY ===== */}
        <Route path="/files" element={
          <RoleRoute allowedRoles={['Mentor', 'Admin']}>
            <DashboardLayout><Files /></DashboardLayout>
          </RoleRoute>
        } />

        <Route path="/files/:id" element={
          <RoleRoute allowedRoles={['Mentor', 'Admin']}>
            <DashboardLayout><FileDetail /></DashboardLayout>
          </RoleRoute>
        } />

        {/* ===== ADMIN ONLY ===== */}
        <Route path="/admin" element={
          <RoleRoute allowedRoles={['Admin']}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </RoleRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;