import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build nav links based on the user's role
  const links = {
    customer: [{ to: '/customer/dashboard', label: 'My Orders' }],
    agent: [
      { to: '/agent/dashboard', label: 'Dashboard' },
      { to: '/agent/orders', label: 'My Deliveries' },
    ],
    admin: [{ to: '/admin/dashboard', label: 'Admin Panel' }],
  };

  const roleLinks = user ? (links[user.role] || []) : [];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-2xl">📦</span>
          DeliverEase
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-4">
          {roleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-blue-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-200 hidden sm:block">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
