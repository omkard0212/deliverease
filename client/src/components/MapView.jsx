import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Fix Leaflet's broken default icon paths in Vite ───────────────────────────
// Vite's asset pipeline changes the URL of bundled images, which breaks
// Leaflet's internal icon resolution. We point it to the CDN directly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Blue pin for the delivery destination
const deliveryIcon = new L.Icon({
  iconUrl:       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
});

// Animated red pulsing dot for the agent's live position
const agentIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;
    background:#ef4444;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 3px rgba(239,68,68,0.4);
    animation:pulse 1.5s infinite;
  "></div>
  <style>
    @keyframes pulse{
      0%  {box-shadow:0 0 0 0   rgba(239,68,68,0.6);}
      70% {box-shadow:0 0 0 10px rgba(239,68,68,0);}
      100%{box-shadow:0 0 0 0   rgba(239,68,68,0);}
    }
  </style>`,
  iconSize:   [18, 18],
  iconAnchor: [9, 9],
});

// Smoothly pans the map and moves the marker when the agent's position changes
function AgentMarker({ position }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (position && markerRef.current) {
      markerRef.current.setLatLng(position);
      map.panTo(position, { animate: true, duration: 1 });
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={agentIcon} ref={markerRef}>
      <Popup>🚴 Delivery Agent (live)</Popup>
    </Marker>
  );
}

/**
 * MapView
 * Props:
 *   deliveryAddress  { lat, lng, label }
 *   agentLocation    { lat, lng } | null
 *   orderStatus      string — used to decide what overlay message to show
 */
export default function MapView({ deliveryAddress, agentLocation, orderStatus }) {
  const center = deliveryAddress
    ? [deliveryAddress.lat, deliveryAddress.lng]
    : [20.5937, 78.9629]; // Default: centre of India

  // Decide what status message to show over the map
  const showWaiting  = !agentLocation && orderStatus !== 'delivered' && orderStatus !== 'pending';
  const showPending  = orderStatus === 'pending';
  const showDelivered = orderStatus === 'delivered';

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '400px' }}
      >
        {/* Free OpenStreetMap tiles — no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Delivery destination marker */}
        {deliveryAddress && (
          <Marker position={[deliveryAddress.lat, deliveryAddress.lng]} icon={deliveryIcon}>
            <Popup>📦 Delivery Address: {deliveryAddress.label}</Popup>
          </Marker>
        )}

        {/* Agent live location marker */}
        {agentLocation && (
          <AgentMarker position={[agentLocation.lat, agentLocation.lng]} />
        )}
      </MapContainer>

      {/* ── Overlay messages ─────────────────────────────────────────────── */}

      {/* Order not yet assigned — no agent yet */}
      {showPending && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]
                        bg-white/90 backdrop-blur-sm border border-gray-200
                        rounded-xl px-4 py-2 flex items-center gap-2 shadow-md text-sm text-gray-600">
          <span className="text-lg">⏳</span>
          Waiting for agent assignment…
        </div>
      )}

      {/* Agent assigned but hasn't started sharing location yet */}
      {showWaiting && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]
                        bg-white/90 backdrop-blur-sm border border-yellow-200
                        rounded-xl px-4 py-2 flex items-center gap-2 shadow-md text-sm text-yellow-700">
          <span className="animate-pulse text-lg">📡</span>
          Waiting for agent location…
        </div>
      )}

      {/* Order delivered */}
      {showDelivered && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]
                        bg-green-50/90 backdrop-blur-sm border border-green-200
                        rounded-xl px-4 py-2 flex items-center gap-2 shadow-md text-sm text-green-700">
          <span className="text-lg">✅</span>
          Package delivered successfully
        </div>
      )}
    </div>
  );
}
