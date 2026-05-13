import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';

const CITY_PRESETS = [
  { label: 'Mumbai, Maharashtra',  lat: 19.076,  lng: 72.8777 },
  { label: 'New Delhi, Delhi',     lat: 28.6139, lng: 77.209  },
  { label: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { label: 'Pune, Maharashtra',    lat: 18.5204, lng: 73.8567 },
  { label: 'Hyderabad, Telangana', lat: 17.385,  lng: 78.4867 },
];

const EMPTY_FORM = {
  customerId: '',
  packageDescription: '',
  pickupCity: '',
  deliveryCity: '',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [assigningId, setAssigningId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch orders, agents, and customers in parallel
        const [ordersRes, agentsRes, customersRes] = await Promise.all([
          api.get('/orders'),
          api.get('/users/agents'),
          api.get('/users/customers'),
        ]);
        setOrders(ordersRes.data);
        setAgents(agentsRes.data);
        setCustomers(customersRes.data);
      } catch (err) {
        console.error('Failed to load admin data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    const pickup = CITY_PRESETS.find((c) => c.label === form.pickupCity);
    const delivery = CITY_PRESETS.find((c) => c.label === form.deliveryCity);

    if (!pickup || !delivery) return setFormError('Please select valid pickup and delivery cities');
    if (form.pickupCity === form.deliveryCity) return setFormError('Pickup and delivery cities must be different');

    setCreating(true);
    try {
      const { data: newOrder } = await api.post('/orders', {
        customerId: form.customerId,
        packageDescription: form.packageDescription,
        pickupAddress: pickup,
        deliveryAddress: delivery,
      });

      // The API returns the order with customerId as a plain ID string.
      // Enrich it with the full customer object so the table row renders correctly
      // without needing a page refresh.
      const customer = customers.find((c) => c._id === form.customerId);
      const enrichedOrder = { ...newOrder, customerId: customer || newOrder.customerId };

      setOrders((prev) => [enrichedOrder, ...prev]);
      setForm(EMPTY_FORM);
      setActiveTab('orders');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    if (!agentId) return;
    setAssigningId(orderId);
    try {
      const { data: updatedOrder } = await api.put(`/orders/${orderId}/assign`, { agentId });

      // The API returns the updated order but agentId may not be populated.
      // Enrich it with the full agent object so the Agent column updates instantly.
      const agent = agents.find((a) => a._id === agentId);
      const enrichedOrder = { ...updatedOrder, agentId: agent || updatedOrder.agentId };

      setOrders((prev) => prev.map((o) => (o._id === orderId ? enrichedOrder : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign agent');
    } finally {
      setAssigningId(null);
    }
  };

  // Stats are derived from local state — they update instantly when orders change
  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === 'pending').length,
    inTransit: orders.filter((o) => o.status === 'in_transit').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage orders and assign delivery agents</p>
        </div>

        {/* Stats — update instantly from local state */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Orders', value: stats.total,     color: 'text-gray-700'   },
            { label: 'Pending',      value: stats.pending,   color: 'text-yellow-600' },
            { label: 'In Transit',   value: stats.inTransit, color: 'text-orange-600' },
            { label: 'Delivered',    value: stats.delivered, color: 'text-green-600'  },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            + Create Order
          </button>
        </div>

        {/* Create order form */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 max-w-lg">
            <h2 className="font-semibold text-gray-700 mb-4">New Order</h2>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select customer…</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Description</label>
                <input
                  name="packageDescription"
                  type="text"
                  value={form.packageDescription}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Electronics — Laptop"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup City</label>
                <select
                  name="pickupCity"
                  value={form.pickupCity}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select city…</option>
                  {CITY_PRESETS.map((c) => (
                    <option key={c.label} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery City</label>
                <select
                  name="deliveryCity"
                  value={form.deliveryCity}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select city…</option>
                  {CITY_PRESETS.map((c) => (
                    <option key={c.label} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {creating ? 'Creating…' : 'Create Order'}
              </button>
            </form>
          </div>
        )}

        {/* Orders table */}
        {activeTab === 'orders' && (
          <>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Tracking ID', 'Customer', 'Description', 'Status', 'Agent', 'Assign Agent', 'Created'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.trackingId}</td>
                          <td className="px-4 py-3 text-gray-700">{order.customerId?.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{order.packageDescription}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {order.agentId?.name || <span className="text-gray-300">Unassigned</span>}
                          </td>
                          <td className="px-4 py-3">
                            {order.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue=""
                                  onChange={(e) => handleAssignAgent(order._id, e.target.value)}
                                  disabled={assigningId === order._id}
                                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Pick agent…</option>
                                  {agents.map((a) => (
                                    <option key={a._id} value={a._id}>{a.name}</option>
                                  ))}
                                </select>
                                {assigningId === order._id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p>No orders yet. Create one above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
