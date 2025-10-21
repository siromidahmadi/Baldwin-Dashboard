import { ChartComponent } from '@/components/ChartComponent';
import { MetricCard } from '@/components/MetricCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import MapView from '@/components/MapView';
import FeedbackPanel from '@/components/FeedbackPanel';

export default function Home() {
  // Sample data - in a real app, this would come from an API
  const metrics = [
    { title: 'Total Assets', value: '24', change: '+2.5%', trend: 'up' },
    { title: 'Active Alerts', value: '3', change: '-1', trend: 'down' },
    { title: 'Uptime', value: '99.8%', change: '+0.2%', trend: 'up' },
    { title: 'Avg. Response Time', value: '42ms', change: '-5ms', trend: 'down' },
  ];

  const assets = [
    { id: 1, name: 'Turbine #1', status: 'operational', lastUpdated: '2 min ago' },
    { id: 2, name: 'Turbine #2', status: 'warning', lastUpdated: '5 min ago' },
    { id: 3, name: 'Turbine #3', status: 'operational', lastUpdated: '1 min ago' },
    { id: 4, name: 'Turbine #4', status: 'critical', lastUpdated: '10 min ago' },
  ];

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Digital Twin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your digital assets in real-time</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Corridor Map</h2>
            <MapView />
          </div>
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
            <div className="h-80">
              <ChartComponent />
            </div>
          </div>

          {/* Asset Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Asset Status</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status={asset.status as 'operational' | 'warning' | 'critical'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" className="text-primary-600 hover:text-primary-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              {[
                { id: 1, level: 'critical', message: 'High temperature detected in Turbine #4', time: '5 min ago' },
                { id: 2, level: 'warning', message: 'Vibration levels high in Turbine #2', time: '12 min ago' },
                { id: 3, level: 'info', message: 'Scheduled maintenance in 2 days', time: '1 hour ago' },
              ].map((alert) => (
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Add New Asset
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                View All Alerts
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                System Settings
              </button>
            </div>
          </div>

          {/* Community Feedback */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Community Feedback</h2>
            <FeedbackPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
