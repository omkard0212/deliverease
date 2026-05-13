/**
 * Calculates straight-line distance between two lat/lng points using the
 * Haversine formula, then converts to an approximate ETA in minutes.
 * Assumes an average delivery speed of 30 km/h in urban areas.
 */
export function calculateETA(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const avgSpeedKmh = 30;
  const etaMinutes = Math.round((distanceKm / avgSpeedKmh) * 60);

  return { distanceKm: distanceKm.toFixed(1), etaMinutes };
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
