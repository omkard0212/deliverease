import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Live GPS Tracking',
    desc: 'Watch your delivery agent move on a real-time map. Location updates every 5 seconds.',
  },
  {
    icon: '⚡',
    title: 'Instant Status Updates',
    desc: 'Get notified the moment your package is picked up, in transit, or delivered.',
  },
  {
    icon: '🔐',
    title: 'Secure & Role-Based',
    desc: 'Separate dashboards for customers, agents, and admins — all secured with JWT.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    desc: 'Agents update status and share location directly from their phone.',
  },
  {
    icon: '📦',
    title: 'Full Order Management',
    desc: 'Admins create orders, assign agents, and monitor all deliveries in one place.',
  },
  {
    icon: '📍',
    title: 'ETA Calculation',
    desc: 'Straight-line distance from agent to destination gives you an estimated arrival time.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Admin creates order', desc: 'Admin places an order and assigns a delivery agent.' },
  { step: '02', title: 'Agent picks up package', desc: 'Agent updates status and starts sharing live GPS location.' },
  { step: '03', title: 'Customer tracks live', desc: 'Customer watches the agent move on the map in real time.' },
  { step: '04', title: 'Delivered!', desc: 'Status updates to Delivered and the customer is notified instantly.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <span className="text-2xl">📦</span> DeliverEase
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Real-Time Delivery Tracking
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Track your package
            <span className="text-blue-600"> live on the map</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            DeliverEase lets customers watch their delivery agent move in real time,
            agents update status from their phone, and admins manage everything from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200"
            >
              Start Tracking Free
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3.5 rounded-xl text-lg border border-gray-200 transition-colors"
            >
              Sign In →
            </Link>
          </div>

          {/* Demo credentials hint */}
          <p className="mt-6 text-sm text-gray-400">
            Try demo: <span className="font-mono text-gray-500">admin@test.com</span> / <span className="font-mono text-gray-500">password123</span>
          </p>
        </div>

        {/* Hero visual */}
        <div className="max-w-3xl mx-auto mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400 font-mono">deliverease-jswk.vercel.app/track/DE-A8IKC9</span>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 font-mono">DE-A8IKC9</p>
                <p className="font-bold text-gray-800 text-lg">Electronics — Laptop</p>
              </div>
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                In Transit
              </span>
            </div>
            {/* Fake map */}
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{backgroundImage: 'repeating-linear-gradient(0deg,#94a3b8 0,#94a3b8 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#94a3b8 0,#94a3b8 1px,transparent 0,transparent 50%)', backgroundSize: '40px 40px'}}
              />
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-sm font-semibold text-gray-600">Live Map View</p>
                <p className="text-xs text-gray-400 mt-1">Agent location updates every 5s</p>
              </div>
              {/* Fake agent dot */}
              <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
              {/* Fake destination pin */}
              <div className="absolute bottom-8 right-16 text-2xl">📍</div>
            </div>
            {/* Timeline */}
            <div className="mt-4 flex items-center justify-between">
              {['Placed', 'Assigned', 'Picked Up', 'In Transit', 'Delivered'].map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${i <= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  <span className={`text-xs ${i <= 3 ? 'text-blue-600 font-semibold' : 'text-gray-300'} hidden sm:block`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-3 text-lg">Built for customers, agents, and admins</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-gray-800 mt-3 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3 text-lg">From order creation to doorstep delivery</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
                <span className="text-3xl font-extrabold text-blue-100">{h.step}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{h.title}</h3>
                  <p className="text-gray-500 text-sm">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Built for every role</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '👤', role: 'Customer', color: 'blue', points: ['Track packages live on map', 'View order status timeline', 'See ETA in real time', 'Full order history'] },
              { icon: '🚴', role: 'Delivery Agent', color: 'green', points: ['See assigned deliveries', 'Share live GPS location', 'Update order status', 'Mobile-friendly UI'] },
              { icon: '🛠️', role: 'Admin', color: 'purple', points: ['Create and manage orders', 'Assign agents to orders', 'Monitor all deliveries', 'View live stats'] },
            ].map((r) => (
              <div key={r.role} className={`rounded-2xl p-6 border-2 ${
                r.color === 'blue' ? 'border-blue-100 bg-blue-50' :
                r.color === 'green' ? 'border-green-100 bg-green-50' :
                'border-purple-100 bg-purple-50'
              }`}>
                <span className="text-4xl">{r.icon}</span>
                <h3 className="font-bold text-gray-800 text-lg mt-3 mb-4">{r.role}</h3>
                <ul className="space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to track your delivery?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Sign up free and start tracking in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl text-lg hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl text-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>📦</span> DeliverEase
          </div>
          <p className="text-sm">Built with React · Node.js · Socket.IO · MongoDB · Leaflet.js</p>
          <a
            href="https://github.com/Omii0227/deliverease"
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
