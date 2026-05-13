import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issue with bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Blue pin for the delivery destination
const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Red animated dot for the agent's live position
const agentIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px;
    background: #ef4444;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.4);
    animation: pulse 1.5s infinite;
  "></div>
  <style>
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
      70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
      100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
    }
  </style>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Inner component that smoothly pans the map when the agent moves
function AgentMarker({ position }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (position && markerRef.current) {
      markerRef.current.setLatLng(position);
      // Gently pan toward the agent without jarring the user
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
 * MapView — renders a Leaflet map with:
 *   - A blue pin at the delivery address
 *   - An animated red dot at the agent's current location (updates live)
 *
 * Props:
 *   deliveryAddress  { lat, lng, label }
 *   agentLocation    { lat, lng } | null
 */
export default function MapView({ deliveryAddress, agentLocation }) {
  const center = deliveryAddress
    ? [deliveryAddress.lat, deliveryAddress.lng]
    : [20.5937, 78.9629]; // Default: center of India

  return (
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
  );
}
