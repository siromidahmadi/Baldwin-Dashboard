'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [heatmap, setHeatmap] = useState(true);
  const [style, setStyle] = useState<'light' | 'streets'>('light');

  useEffect(() => {
    const s = localStorage.getItem('map:style');
    const h = localStorage.getItem('map:heatmap');
    if (s === 'streets' || s === 'light') setStyle(s);
    if (h === '0' || h === '1') setHeatmap(h === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem('map:style', style);
  }, [style]);

  useEffect(() => {
    localStorage.setItem('map:heatmap', heatmap ? '1' : '0');
  }, [heatmap]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Map Style</label>
          <select
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
          >
            <option value="light">Light</option>
            <option value="streets">Streets</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input id="hm" type="checkbox" checked={heatmap} onChange={(e) => setHeatmap(e.target.checked)} />
          <label htmlFor="hm" className="text-sm text-gray-800">Show Air Quality Heatmap</label>
        </div>
        <p className="text-xs text-gray-500">Settings are stored in your browser and applied to the map.</p>
      </div>
    </div>
  );
}
