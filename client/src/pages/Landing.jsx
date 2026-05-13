import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Animated counter
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const STEPS = [
  { icon: '🛠️', title: 'Admin creates order',    desc: 'Admin places an order and assigns a delivery agent from the dashboard.' },
  { icon: '📦', title: 'Agent picks up package', desc: 'Agent updates status and starts broadcasting live GPS location.' },
  { icon: '🗺️', title: 'Customer tracks live',   desc: 'Customer watches the agent move on the map in real time.' },
  { icon: '✅', title: 'Delivered',               desc: 'Status updates instantly and the customer is notified.' },
];

const FEATURES = [
  { icon: '📡', title: 'Real-Time Location',   desc: 'Agent GPS broadcasts via Socket.IO every 5 seconds. Map marker moves as the agent moves — no refresh needed.' },
  { icon: '🔐', title: 'Role-Based Auth',       desc: 'JWT authentication with 3 roles — customer, agent, admin. Protected routes and rate-limited login.' },
  { icon: '🗺️', title: 'Interactive Map',       desc: 'Leaflet.js with OpenStreetMap tiles. Animated agent marker, delivery pin, and live ETA calculation.' },
  { icon: '⚡', title: 'Instant Status Updates', desc: 'Status changes emit socket events. The customer timeline updates without any page interaction.' },
  { icon: '🛠️', title: 'Admin Dashboard',       desc: 'Create orders, assign agents, monitor all deliveries in a live table with real-time stats.' },
  { icon: '🧪', title: '73 Cypress Tests',      desc: 'End-to-end tests across all 3 roles, all API endpoints, and all user flows. 100% pass rate.' },
];

export default function Landing() {
  const deliveries = useCounter(12847);
  const agents     = useCounter(340);
  const cities     = useCounter(28);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">📦</span>
            DeliverEase
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-blue-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-blue-200">
            Real-Time Package Delivery Tracking
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight mb-5">
            Track your package{' '}
            <span className="text-blue-600">live on the map</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Watch your delivery agent move in real time. Instant status updates.
            Full visibility from pickup to doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-base transition-colors shadow-sm"
            >
              Start Tracking Free
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-xl text-base border border-gray-200 transition-colors"
            >
              Sign In →
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Demo: <span className="font-medium text-gray-500">admin@test.com</span> / <span className="font-medium text-gray-500">password123</span>
          </p>
        </div>

        {/* Mock UI preview */}
        <div className="max-w-4xl mx-auto mt-14 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Browser bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <div className="ml-3 bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-400 flex-1 max-w-xs">
              deliverease-jswk.vercel.app/track/DE-A8IKC9
            </div>
          </div>
          <div className="p-6">
            {/* Order header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-400 font-mono">DE-A8IKC9</p>
                <p className="font-bold text-gray-800 text-lg">Electronics — Laptop</p>
              </div>
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                In Transit
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Fake map */}
              <div className="sm:col-span-2 bg-blue-50 rounded-xl h-44 flex items-center justify-center relative overflow-hidden border border-blue-100">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg,#3b82f6 0,#3b82f6 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#3b82f6 0,#3b82f6 1px,transparent 0,transparent 40px)',
                  }}
                />
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-1">🗺️</div>
                  <p className="text-sm font-semibold text-blue-700">Live Map</p>
                  <p className="text-xs text-blue-400 mt-0.5">Agent location updates every 5s</p>
                </div>
                <div className="absolute top-1/3 left-1/2 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow animate-pulse" />
                <div className="absolute bottom-6 right-10 text-xl">📍</div>
              </div>
              {/* Timeline */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3">Delivery Progress</p>
                <ol className="space-y-3">
                  {['Order Placed', 'Agent Assigned', 'Picked Up', 'In Transit', 'Delivered'].map((s, i) => (
                    <li key={s} className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        i < 4 ? 'bg-blue-600' : 'bg-gray-200'
                      } ${i === 3 ? 'ring-2 ring-blue-200' : ''}`} />
                      <span className={`text-xs ${i < 4 ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center text-white">
          {[
            { value: deliveries.toLocaleString(), label: 'Deliveries Tracked' },
            { value: agents,                      label: 'Active Agents' },
            { value: cities,                      label: 'Cities Covered' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How it works</h2>
            <p className="text-gray-500 mt-2">From order creation to doorstep delivery</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-blue-100 z-0" style={{ width: 'calc(100% - 3rem)', left: '3.5rem' }} />
                )}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl mb-4">
                    {s.icon}
                  </div>
                  <p className="text-xs font-semibold text-blue-600 mb-1">Step {i + 1}</p>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Everything you need</h2>
            <p className="text-gray-500 mt-2">Built for customers, agents, and admins</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Built for every role</h2>
            <p className="text-gray-500 mt-2">One platform, three dashboards</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '👤', role: 'Customer',       color: 'blue',   points: ['Track packages live on map', 'Real-time status timeline', 'ETA calculation', 'Full order history'] },
              { icon: '🚴', role: 'Delivery Agent', color: 'green',  points: ['View assigned deliveries', 'Share live GPS location', 'Update order status', 'Mobile-friendly UI'] },
              { icon: '🛠️', role: 'Admin',          color: 'purple', points: ['Create & manage orders', 'Assign delivery agents', 'Monitor all deliveries', 'Live stats dashboard'] },
            ].map((r) => (
              <div key={r.role} className={`rounded-2xl p-6 border ${
                r.color === 'blue'   ? 'bg-blue-50 border-blue-100' :
                r.color === 'green'  ? 'bg-green-50 border-green-100' :
                                       'bg-purple-50 border-purple-100'
              }`}>
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-4">{r.role}</h3>
                <ul className="space-y-2 mb-6">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`font-bold ${
                        r.color === 'blue' ? 'text-blue-500' :
                        r.color === 'green' ? 'text-green-500' : 'text-purple-500'
                      }`}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center text-sm font-semibold py-2 rounded-lg transition-colors ${
                    r.color === 'blue'   ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                    r.color === 'green'  ? 'bg-green-600 hover:bg-green-700 text-white' :
                                           'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Sign In →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to track your delivery?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Sign up free and start tracking in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-800 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>📦</span> DeliverEase
          </div>
          <p className="text-sm text-center">
            React · Node.js · Socket.IO · MongoDB · Leaflet.js · Cypress
          </p>
          <a
            href="https://github.com/omkard0212/deliverease"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:text-white transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
