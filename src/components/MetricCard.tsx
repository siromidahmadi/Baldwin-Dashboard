import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export function MetricCard({ title, value, change, trend }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className={`ml-2 flex items-baseline text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" aria-hidden="true" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" aria-hidden="true" />
          )}
          <span className="sr-only">{trend === 'up' ? 'Increased' : 'Decreased'} by</span>
          {change}
        </div>
      </div>
    </div>
  );
}
