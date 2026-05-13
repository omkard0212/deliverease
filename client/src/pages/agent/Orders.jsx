import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';

// The statuses an agent can set (in order)
const NEXT_STATUSES = {
  assigned:   { value: 'picked_up',  label: 'Mark as Picked Up' },
  picked_up:  { value: 'in_transit', label: 'Mark as In Transit' },
  in_transit: { value: 'delivered',  label: 'Mark as Delivered' },
};

export default function AgentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // orderId being updated
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/agent');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // Update the order in local state so the UI reflects the change immediately
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>
          <p className="text-gray-500 text-sm mt-1">Update the status of your assigned orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">📭</span>
            <p className="mt-4 font-medium">No orders assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const nextAction = NEXT_STATUSES[order.status];
              const isUpdating = updating === order._id;

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-mono text-gray-400">{order.trackingId}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-semibold text-gray-800 mt-1">{order.packageDescription}</p>

                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p>📦 Pickup: {order.pickupAddress?.label}</p>
                        <p>📍 Deliver to: {order.deliveryAddress?.label}</p>
                        {order.customerId && (
                          <p>
                            👤 {order.customerId.name}
                            {order.customerId.phone && (
                              <a href={`tel:${order.customerId.phone}`} className="ml-2 text-blue-500 hover:underline">
                                {order.customerId.phone}
                              </a>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action button — only shown if there's a next status */}
                    {nextAction && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, nextAction.value)}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isUpdating ? 'Updating…' : nextAction.label}
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-green-600 font-semibold text-sm">✅ Delivered</span>
                    )}
                  </div>

                  {/* Status history */}
                  {order.statusHistory?.length > 0 && (
                    <details className="mt-4">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                        View history ({order.statusHistory.length} events)
                      </summary>
                      <ol className="mt-2 space-y-1">
                        {order.statusHistory.map((h, i) => (
                          <li key={i} className="text-xs text-gray-500 flex gap-2">
                            <span className="text-gray-300">
                              {new Date(h.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-medium capitalize">{h.status.replace('_', ' ')}</span>
                            {h.note && <span className="text-gray-400">— {h.note}</span>}
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
