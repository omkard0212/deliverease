import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target, duration = 1500) {
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

// ── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return <span className={on ? 'opacity-100' : 'opacity-0'}>█</span>;
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 38);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span>{displayed}</span>;
}

// ── Fake live feed ────────────────────────────────────────────────────────────
const FEED_ITEMS = [
  { id: 'DE-A8IKC9', status: 'IN_TRANSIT', city: 'Mumbai → Pune',    agent: 'Ravi Kumar' },
  { id: 'DE-B3XKP2', status: 'PICKED_UP',  city: 'Delhi → Hyderabad', agent: 'Priya Sharma' },
  { id: 'DE-C7MNQ1', status: 'DELIVERED',  city: 'Bangalore → Pune',  agent: 'Arjun Singh' },
  { id: 'DE-D2WRT5', status: 'ASSIGNED',   city: 'Pune → Delhi',      agent: 'Ravi Kumar' },
  { id: 'DE-E9LVS8', status: 'IN_TRANSIT', city: 'Hyderabad → Mumbai', agent: 'Priya Sharma' },
];

const STATUS_COLOR = {
  IN_TRANSIT: 'text-amber-400',
  PICKED_UP:  'text-cyan-400',
  DELIVERED:  'text-green-400',
  ASSIGNED:   'text-orange-300',
  PENDING:    'text-gray-500',
};

export default function Landing() {
  const [activeRow, setActiveRow] = useState(0);
  const deliveries = useCounter(12847);
  const agents     = useCounter(340);
  const cities     = useCounter(28);

  // Cycle active row in feed
  useEffect(() => {
    const t = setInterval(() => setActiveRow(r => (r + 1) % FEED_ITEMS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen text-amber-50 overflow-x-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* ── Scanline overlay ───────────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)',
        }}
      />

      {/* ── Grid background ────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(251,191,36,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="relative z-10 border-b border-amber-900/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 font-bold text-lg tracking-[0.2em] uppercase">
              DeliverEase
            </span>
            <span className="text-amber-900 text-xs tracking-widest hidden sm:block">
              // OPERATIONS CONTROL
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-900 text-xs mr-4 hidden sm:block">
              SYS_STATUS: <span className="text-green-400">ONLINE</span>
            </span>
            <Link
              to="/login"
              className="text-xs tracking-widest text-amber-500 hover:text-amber-300 border border-amber-900 hover:border-amber-600 px-4 py-2 transition-all uppercase"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-xs tracking-widest text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 ml-2 transition-all uppercase font-bold"
            >
              Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">

          {/* Left — headline */}
          <div className="lg:pr-16 lg:border-r border-amber-900/30">
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mb-6">
              &gt; INITIALIZING TRACKING SYSTEM...
            </p>
            <h1
              className="text-5xl sm:text-7xl font-black leading-none mb-2 text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              REAL
            </h1>
            <h1
              className="text-5xl sm:text-7xl font-black leading-none mb-2"
              style={{ letterSpacing: '-0.03em', color: '#f59e0b' }}
            >
              TIME.
            </h1>
            <h1
              className="text-5xl sm:text-7xl font-black leading-none mb-10 text-white"
              style={{ letterSpacing: '-0.03em', opacity: 0.3 }}
            >
              ALWAYS.
            </h1>

            <p className="text-amber-200/60 text-sm leading-relaxed max-w-sm mb-10 tracking-wide">
              Live GPS tracking. Instant status updates. Every package, every agent,
              every delivery — visible in real time on a live operations map.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="group relative text-xs tracking-[0.3em] uppercase font-bold px-8 py-4 bg-amber-400 text-black hover:bg-amber-300 transition-all overflow-hidden"
              >
                <span className="relative z-10">Initialize Account</span>
              </Link>
              <Link
                to="/login"
                className="text-xs tracking-[0.3em] uppercase font-bold px-8 py-4 border border-amber-800 text-amber-500 hover:border-amber-500 hover:text-amber-300 transition-all"
              >
                Enter System →
              </Link>
            </div>

            <p className="mt-5 text-amber-900 text-xs tracking-widest">
              DEMO: admin@test.com / password123
            </p>
          </div>

          {/* Right — live operations panel */}
          <div className="lg:pl-16 mt-12 lg:mt-0">
            <div className="border border-amber-900/50 bg-black/40">
              {/* Panel header */}
              <div className="border-b border-amber-900/50 px-4 py-2 flex items-center justify-between">
                <span className="text-amber-600 text-xs tracking-widest uppercase">
                  Live Feed // Active Deliveries
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">LIVE</span>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-4 px-4 py-2 border-b border-amber-900/20">
                {['ORDER_ID', 'STATUS', 'ROUTE', 'AGENT'].map(h => (
                  <span key={h} className="text-amber-900 text-xs tracking-widest">{h}</span>
                ))}
              </div>

              {/* Feed rows */}
              {FEED_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-4 px-4 py-3 border-b border-amber-900/10 transition-all duration-500 ${
                    i === activeRow ? 'bg-amber-400/5 border-l-2 border-l-amber-400' : ''
                  }`}
                >
                  <span className="text-amber-300 text-xs font-bold">{item.id}</span>
                  <span className={`text-xs font-bold ${STATUS_COLOR[item.status]}`}>
                    {item.status}
                  </span>
                  <span className="text-amber-200/50 text-xs truncate">{item.city}</span>
                  <span className="text-amber-200/40 text-xs truncate">{item.agent}</span>
                </div>
              ))}

              {/* Terminal line */}
              <div className="px-4 py-3 text-amber-900 text-xs">
                &gt; <Typewriter text="Tracking 12,847 active deliveries across 28 cities..." delay={800} />
                <Cursor />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border border-t-0 border-amber-900/50">
              {[
                { label: 'DELIVERIES', value: deliveries.toLocaleString() },
                { label: 'AGENTS',     value: agents },
                { label: 'CITIES',     value: cities },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`px-4 py-4 ${i < 2 ? 'border-r border-amber-900/50' : ''}`}
                >
                  <p className="text-3xl font-black text-amber-400">{s.value}</p>
                  <p className="text-amber-900 text-xs tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="border-t border-amber-900/30 flex items-center gap-4">
          <span className="text-amber-900 text-xs tracking-widest whitespace-nowrap">// SYSTEM MODULES</span>
          <div className="flex-1 border-t border-amber-900/20" />
        </div>
      </div>

      {/* ── Features — asymmetric grid ─────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-amber-900/20">

          {/* Large feature */}
          <div className="md:col-span-5 bg-[#0a0a0a] p-8 border border-amber-900/20 hover:border-amber-700/40 transition-colors group">
            <div className="text-4xl mb-6">📡</div>
            <h3 className="text-white text-xl font-black tracking-tight mb-3 uppercase">
              Socket.IO Real-Time
            </h3>
            <p className="text-amber-200/40 text-sm leading-relaxed">
              Agent GPS coordinates broadcast every 5 seconds via WebSocket.
              Zero polling. Zero refresh. The map marker moves as the agent moves.
            </p>
            <div className="mt-6 text-amber-900 text-xs tracking-widest">
              LATENCY: <span className="text-green-400">&lt; 100ms</span>
            </div>
          </div>

          {/* Two stacked */}
          <div className="md:col-span-4 flex flex-col gap-px">
            <div className="bg-[#0a0a0a] p-6 border border-amber-900/20 hover:border-amber-700/40 transition-colors flex-1">
              <div className="text-2xl mb-4">🔐</div>
              <h3 className="text-white font-black tracking-tight mb-2 uppercase text-sm">JWT Auth</h3>
              <p className="text-amber-200/40 text-xs leading-relaxed">
                3 roles. Protected routes. Rate-limited login. Tokens expire. Bcrypt hashed passwords.
              </p>
            </div>
            <div className="bg-[#0a0a0a] p-6 border border-amber-900/20 hover:border-amber-700/40 transition-colors flex-1">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="text-white font-black tracking-tight mb-2 uppercase text-sm">Instant Status</h3>
              <p className="text-amber-200/40 text-xs leading-relaxed">
                Status changes emit socket events. Customer timeline updates without any page interaction.
              </p>
            </div>
          </div>

          {/* Tall right */}
          <div className="md:col-span-3 bg-[#0a0a0a] p-8 border border-amber-900/20 hover:border-amber-700/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-6">🗺️</div>
              <h3 className="text-white font-black tracking-tight mb-3 uppercase">Leaflet Maps</h3>
              <p className="text-amber-200/40 text-xs leading-relaxed">
                OpenStreetMap tiles. No API key. Animated agent marker. ETA via Haversine formula.
              </p>
            </div>
            <div className="mt-8 space-y-1">
              {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(c => (
                <div key={c} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="text-amber-900 text-xs">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom wide */}
          <div className="md:col-span-7 bg-[#0a0a0a] p-8 border border-amber-900/20 hover:border-amber-700/40 transition-colors">
            <div className="text-2xl mb-4">🛠️</div>
            <h3 className="text-white font-black tracking-tight mb-3 uppercase">Admin Operations Center</h3>
            <p className="text-amber-200/40 text-sm leading-relaxed mb-6">
              Create orders, assign agents, monitor all deliveries in a live table. Stats update instantly as orders change state.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {['Create Orders', 'Assign Agents', 'Live Stats'].map(f => (
                <div key={f} className="border border-amber-900/30 px-3 py-2 text-center">
                  <span className="text-amber-600 text-xs tracking-widest uppercase">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom right */}
          <div className="md:col-span-5 bg-[#0a0a0a] p-8 border border-amber-900/20 hover:border-amber-700/40 transition-colors">
            <div className="text-2xl mb-4">🧪</div>
            <h3 className="text-white font-black tracking-tight mb-3 uppercase">73 Cypress Tests</h3>
            <p className="text-amber-200/40 text-sm leading-relaxed mb-4">
              E2E tests across all 3 roles, all API endpoints, and all user flows. 100% pass rate.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-amber-900/20 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-green-400 text-xs font-bold">73/73</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role access ────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-amber-900/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-900 text-xs tracking-[0.4em] uppercase mb-10">
            // ACCESS LEVELS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: 'CUSTOMER',
                clearance: 'LEVEL-1',
                color: 'amber',
                items: ['Track package live on map', 'View status timeline', 'Real-time ETA', 'Order history'],
              },
              {
                role: 'AGENT',
                clearance: 'LEVEL-2',
                color: 'cyan',
                items: ['View assigned deliveries', 'Broadcast GPS location', 'Update order status', 'Mobile optimized'],
              },
              {
                role: 'ADMIN',
                clearance: 'LEVEL-3',
                color: 'orange',
                items: ['Create & manage orders', 'Assign delivery agents', 'Monitor all deliveries', 'Live dashboard stats'],
              },
            ].map((r) => (
              <div key={r.role} className="border border-amber-900/30 p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-black text-lg tracking-widest">{r.role}</span>
                  <span className={`text-xs tracking-widest ${
                    r.color === 'amber' ? 'text-amber-400' :
                    r.color === 'cyan' ? 'text-cyan-400' : 'text-orange-400'
                  }`}>
                    {r.clearance}
                  </span>
                </div>
                <ul className="space-y-3">
                  {r.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-xs text-amber-200/50 tracking-wide">
                      <span className={`mt-0.5 ${
                        r.color === 'amber' ? 'text-amber-400' :
                        r.color === 'cyan' ? 'text-cyan-400' : 'text-orange-400'
                      }`}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`mt-8 block text-center text-xs tracking-[0.3em] uppercase py-3 border transition-all ${
                    r.color === 'amber' ? 'border-amber-800 text-amber-600 hover:border-amber-400 hover:text-amber-400' :
                    r.color === 'cyan' ? 'border-cyan-900 text-cyan-700 hover:border-cyan-500 hover:text-cyan-400' :
                    'border-orange-900 text-orange-700 hover:border-orange-500 hover:text-orange-400'
                  }`}
                >
                  Request Access →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-amber-900/30 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-900 text-xs tracking-[0.4em] uppercase mb-4">
              // READY TO DEPLOY
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Your packages.<br />
              <span className="text-amber-400">Always visible.</span>
            </h2>
            <p className="text-amber-200/40 text-sm leading-relaxed max-w-md">
              Join the operations network. Real-time tracking, live maps, instant updates —
              everything you need to run a modern delivery operation.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              to="/register"
              className="text-center text-sm tracking-[0.3em] uppercase font-black px-8 py-5 bg-amber-400 text-black hover:bg-amber-300 transition-all"
            >
              Initialize Account
            </Link>
            <Link
              to="/login"
              className="text-center text-sm tracking-[0.3em] uppercase font-bold px-8 py-5 border border-amber-900 text-amber-700 hover:border-amber-600 hover:text-amber-500 transition-all"
            >
              Sign In to System
            </Link>
            <p className="text-center text-amber-900 text-xs tracking-widest">
              DEMO CREDENTIALS AVAILABLE ON LOGIN PAGE
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-amber-900/30 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-900 text-xs tracking-[0.3em] uppercase">
              DeliverEase // Operations Control v1.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs tracking-widest text-amber-900">
            <span>React · Node.js · Socket.IO · MongoDB · Leaflet</span>
            <a
              href="https://github.com/omkard0212/deliverease"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-600 transition-colors uppercase"
            >
              GitHub →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
