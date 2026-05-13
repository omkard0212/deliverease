import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import MapView from '../../components/MapView';
import StatusBadge from '../../components/StatusBadge';
import { useSocket } from '../../hooks/useSocket';
import { calculateETA } from '../../utils/distance';
import api from '../../utils/api';

// The full ordered list of statuses for the timeline
const STATUS_STEPS = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'];
const STEP_LABELS = {
  pending:    { label: 'Order Placed',  icon: '📋' },
  assigned:   { label: 'Agent Assigned', icon: '🧑‍💼' },
  picked_up:  { label: 'Picked Up',     icon: '📦' },
  in_transit: { label: 'In Transit',    icon: '🚴' },
  delivered:  { label: 'Delivered',     icon: '✅' },
};

export default function TrackOrder() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Connect to socket and join the tracking room for this order
  const socketRef = useSocket(trackingId);

  // Fetch initial order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/track/${trackingId}`);
        setOrder(data);

        // If an agent is assigned, fetch their last known location
        if (data.agentId) {
          try {
            const locRes = await api.get(`/location/${data.agentId._id || data.agentId}`);
            setAgentLocation({ lat: locRes.data.lat, lng: locRes.data.lng });
          } catch {
            // Agent location not available yet — that's fine
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [trackingId]);

  // Listen for real-time socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Agent moved — update the map marker
    const handleLocationUpdate = ({ lat, lng }) => {
      setAgentLocation({ lat, lng });
    };

    // Status changed — update the timeline
    const handleStatusChange = ({ status, statusHistory }) => {
      setOrder((prev) => prev ? { ...prev, status, statusHistory } : prev);
    };

    socket.on('agent_location_update', handleLocationUpdate);
    socket.on('order_status_changed', handleStatusChange);

    return () => {
      socket.off('agent_location_update', handleLocationUpdate);
      socket.off('order_status_changed', handleStatusChange);
    };
  }, [socketRef]);

  // Calculate ETA if we have both agent and delivery positions
  const eta = agentLocation && order?.deliveryAddress
    ? calculateETA(
        agentLocation.lat, agentLocation.lng,
        order.deliveryAddress.lat, order.deliveryAddress.lng
      )
    : null;

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-xl font-semibold text-gray-700">{error}</p>
          <p className="text-gray-400 text-sm mt-2">Double-check your tracking ID and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs text-gray-400 font-mono">{order.trackingId}</p>
            <h1 className="text-xl font-bold text-gray-800">{order.packageDescription}</h1>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map — takes up 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: '65vh' }}>
              <MapView
                deliveryAddress={order.deliveryAddress}
                agentLocation={agentLocation}
                orderStatus={order.status}
              />
            </div>

            {/* ETA card */}
            {eta && order.status !== 'delivered' && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="font-semibold text-blue-800">
                    Estimated arrival: ~{eta.etaMinutes} min
                  </p>
                  <p className="text-xs text-blue-500">
                    {eta.distanceKm} km straight-line distance from agent
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — status timeline + order details */}
          <div className="space-y-4">
            {/* Status timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">Delivery Progress</h2>
              <ol className="relative border-l-2 border-gray-200 ml-3 space-y-5">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const { label, icon } = STEP_LABELS[step];

                  return (
                    <li key={step} className="ml-5">
                      {/* Circle indicator */}
                      <span
                        className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full text-sm
                          ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                      >
                        {icon}
                      </span>
                      <p className={`font-medium text-sm ${isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                        {label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-blue-500 mt-0.5">Current status</p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Order details */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3 text-sm">
              <h2 className="font-semibold text-gray-700">Order Details</h2>
              <div>
                <p className="text-xs text-gray-400">Pickup</p>
                <p className="text-gray-700">{order.pickupAddress?.label}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Delivery</p>
                <p className="text-gray-700">{order.deliveryAddress?.label}</p>
              </div>
              {order.agentId && (
                <div>
                  <p className="text-xs text-gray-400">Delivery Agent</p>
                  <p className="text-gray-700">
                    {order.agentId.name}
                    {order.agentId.phone && (
                      <a href={`tel:${order.agentId.phone}`} className="ml-2 text-blue-500 hover:underline">
                        {order.agentId.phone}
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
