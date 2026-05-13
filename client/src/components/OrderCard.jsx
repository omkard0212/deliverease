import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order }) {
  const { trackingId, status, packageDescription, deliveryAddress, createdAt } = order;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-400 font-mono">{trackingId}</p>
          <p className="font-semibold text-gray-800 mt-0.5 truncate max-w-xs">
            {packageDescription}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 text-sm text-gray-500">
        <p className="flex items-center gap-1">
          <span>📍</span>
          <span className="truncate">{deliveryAddress?.label}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Placed {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to={`/track/${trackingId}`}
          className="flex-1 text-center text-sm bg-blue-50 text-blue-600 font-medium py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Track Live
        </Link>
      </div>
    </div>
  );
}
