'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddAssetModal from './AddAssetModal';

export default function QuickActions() {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);

  function show(msg: string) {
    setNotice(msg);
  }

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => setOpenAdd(true)}
        >
          Add New Asset
        </button>
        <button
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => {
            show('Generating report...');
            window.open('/api/report', '_blank');
          }}
        >
          Generate Report
        </button>
        <button
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => router.push('/alerts')}
        >
          View All Alerts
        </button>
        <button
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => router.push('/settings')}
        >
          System Settings
        </button>
      </div>

      {notice && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white shadow px-4 py-3 text-sm text-gray-800">
          {notice}
        </div>
      )}

      <AddAssetModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={() => show('Asset created')}
      />
    </div>
  );
}
