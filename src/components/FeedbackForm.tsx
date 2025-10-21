'use client';

import { useState } from 'react';

export default function FeedbackForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, lat: lat ? Number(lat) : undefined, lon: lon ? Number(lon) : undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }
      setName('');
      setMessage('');
      setLat('');
      setLon('');
      onSubmitted?.();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          className="col-span-2 md:col-span-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3 col-span-2 md:col-span-1">
          <input
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="Lat (optional)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="Lon (optional)"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </div>
      </div>
      <textarea
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
        placeholder="Share feedback (e.g., trail conditions, ideas)"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
