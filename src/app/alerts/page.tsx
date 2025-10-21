export default function AlertsPage() {
  const alerts = [
    { id: 1, level: 'critical', message: 'High temperature detected in Turbine #4', time: '5 min ago' },
    { id: 2, level: 'warning', message: 'Vibration levels high in Turbine #2', time: '12 min ago' },
    { id: 3, level: 'info', message: 'Scheduled maintenance in 2 days', time: '1 hour ago' },
    { id: 4, level: 'warning', message: 'PM2.5 elevated near SW corner', time: '1 hour ago' },
  ] as const;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Alerts</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start">
              <div className={`flex-shrink-0 h-2 w-2 mt-1 rounded-full ${
                alert.level === 'critical' ? 'bg-red-500' : 
                alert.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
