'use client';

import { useState } from 'react';

export default function AddAssetModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: () => void }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'operational' | 'warning' | 'critical'>('operational');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, lat: lat || undefined, lon: lon || undefined })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create asset');
      }
      setName('');
      setStatus('operational');
      setLat('');
      setLon('');
      onCreated?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add New Asset</h3>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="Asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <label className="col-span-3 text-xs text-gray-600">Status</label>
            <select
              className="col-span-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="operational">Operational</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Latitude (optional)"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Longitude (optional)"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
