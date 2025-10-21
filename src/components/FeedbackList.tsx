'use client';

import { useEffect, useState } from 'react';

type Feedback = {
  id: string;
  name: string;
  message: string;
  lat?: number;
  lon?: number;
  ts: number;
};

export default function FeedbackList({ refreshKey }: { refreshKey?: number }) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <div className="space-y-3">
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {items.map((f) => (
        <div key={f.id} className="p-3 rounded-lg border border-gray-200 bg-white">
          <div className="text-sm text-gray-900">{f.message}</div>
          <div className="mt-1 text-xs text-gray-500">
            {(f.name || 'Anonymous')}
            {typeof f.lat === 'number' && typeof f.lon === 'number' && (
              <span> • ({f.lat.toFixed(4)}, {f.lon.toFixed(4)})</span>
            )}
          </div>
        </div>
      ))}
      {!loading && items.length === 0 && (
        <p className="text-sm text-gray-500">No feedback yet.</p>
      )}
    </div>
  );
}
