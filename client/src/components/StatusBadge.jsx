// Maps each order status to a Tailwind color scheme
const STATUS_STYLES = {
  pending:    'bg-gray-100 text-gray-700',
  assigned:   'bg-blue-100 text-blue-700',
  picked_up:  'bg-yellow-100 text-yellow-700',
  in_transit: 'bg-orange-100 text-orange-700',
  delivered:  'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  pending:    'Pending',
  assigned:   'Assigned',
  picked_up:  'Picked Up',
  in_transit: 'In Transit',
  delivered:  'Delivered',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
