import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout    from './layouts/AppLayout';

// Public pages
import Landing  from './pages/Landing';
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// User pages
import UserDashboard   from './pages/user/UserDashboard';
import EventsPage      from './pages/user/EventsPage';
import EventDetails    from './pages/user/EventDetails';
import MyRegistrations from './pages/user/MyRegistrations';
import Profile         from './pages/user/Profile';

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard';
import CreateEvent        from './pages/admin/CreateEvent';
import ManageEvents       from './pages/admin/ManageEvents';
import EventRegistrations from './pages/admin/EventRegistrations';
import ManageUsers        from './pages/admin/ManageUsers';

// Misc
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (redirect if logged in) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route element={<GuestRoute />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* ── Protected user routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"        element={<UserDashboard />} />
          <Route path="/events"           element={<EventsPage />} />
          <Route path="/events/:id"       element={<EventDetails />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/profile"          element={<Profile />} />

          {/* ── Admin-only routes ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard"                    element={<AdminDashboard />} />
            <Route path="/admin/create-event"                 element={<CreateEvent />} />
            <Route path="/admin/manage-events"                element={<ManageEvents />} />
            <Route path="/admin/event-registrations/:id"      element={<EventRegistrations />} />
            <Route path="/admin/manage-users"                 element={<ManageUsers />} />
          </Route>
        </Route>
      </Route>

      {/* ── Fallbacks ── */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*"    element={<NotFound />} />
    </Routes>
  );
}
