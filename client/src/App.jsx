import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import TrackOrder from './pages/customer/TrackOrder';
import AgentDashboard from './pages/agent/Dashboard';
import AgentOrders from './pages/agent/Orders';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public tracking page — anyone with a tracking ID can view */}
          <Route path="/track/:trackingId" element={<TrackOrder />} />

          {/* Customer routes */}
          <Route
            path="/customer/dashboard"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />

          {/* Agent routes */}
          <Route
            path="/agent/dashboard"
            element={
              <PrivateRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/orders"
            element={
              <PrivateRoute allowedRoles={['agent']}>
                <AgentOrders />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
