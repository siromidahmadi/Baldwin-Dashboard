interface StatusIndicatorProps {
  status: 'operational' | 'warning' | 'critical';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusStyles = {
    operational: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-400',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-400',
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-400',
    },
  };

  const { bg, text, dot } = statusStyles[status];
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dot}`}></span>
      {statusText}
    </span>
  );
}
