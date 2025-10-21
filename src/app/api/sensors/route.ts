import { NextResponse } from 'next/server';

export async function GET() {
  const now = Date.now();
  const sensors = {
    airQuality: [
      { id: 'aq-1', lat: 34.008, lon: -118.365, pm25: 12, ts: now },
      { id: 'aq-2', lat: 34.018, lon: -118.352, pm25: 25, ts: now },
      { id: 'aq-3', lat: 34.001, lon: -118.342, pm25: 40, ts: now }
    ],
    wind: [
      { id: 'w-1', lat: 34.012, lon: -118.36, speed: 4.2, deg: 250, ts: now },
      { id: 'w-2', lat: 34.02, lon: -118.35, speed: 3.1, deg: 220, ts: now }
    ],
    stormwater: [
      { id: 'sw-1', from: [-118.375, 34.01], to: [-118.35, 34.02], flow: 15.2, ts: now }
    ]
  };
  return NextResponse.json(sensors);
}
