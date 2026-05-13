import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import api from '../../utils/api';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | sharing | error
  const socketRef = useSocket(); // Connect socket without joining a tracking room

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/agent');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch agent orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Start broadcasting the agent's GPS location every 5 seconds
  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('sharing');

    // Find the first active (non-delivered) order to associate location with
    const activeOrder = orders.find((o) => o.status !== 'delivered');

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;

          // Emit via socket (real-time broadcast to customer)
          socketRef.current?.emit('agent_location_update', {
            agentId: user.id,
            lat,
            lng,
            trackingId: activeOrder?.trackingId,
          });

          // Also persist via REST API as a fallback
          api.post('/location/update', { lat, lng }).catch(() => {});
        },
        () => setLocationStatus('error')
      );
    }, 5000);

    // Store interval ID so we could clear it later if needed
    window._locationInterval = intervalId;
  };

  const stopLocationSharing = () => {
    clearInterval(window._locationInterval);
    setLocationStatus('idle');
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const completedToday = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome + stats */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your delivery summary for today</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{activeOrders.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{completedToday}</p>
            <p className="text-sm text-gray-500 mt-1">Delivered</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-gray-700">{orders.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Assigned</p>
          </div>
        </div>

        {/* Location sharing toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-700">Live Location Sharing</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {locationStatus === 'sharing'
                ? 'Broadcasting your location every 5 seconds'
                : 'Share your location so customers can track you'}
            </p>
          </div>
          {locationStatus === 'sharing' ? (
            <button
              onClick={stopLocationSharing}
              className="bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={startLocationSharing}
              className="bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Sharing
            </button>
          )}
          {locationStatus === 'error' && (
            <p className="text-xs text-red-500">Location access denied</p>
          )}
        </div>

        {/* Active orders list */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-700">Active Deliveries</h2>
          <Link to="/agent/orders" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl">🎉</span>
            <p className="mt-3 font-medium">All deliveries complete!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-gray-400">{order.trackingId}</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{order.packageDescription}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {order.deliveryAddress?.label}</p>
                    {order.customerId && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Customer: {order.customerId.name} · {order.customerId.phone}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
