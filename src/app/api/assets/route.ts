import { NextResponse } from 'next/server';

type Asset = {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'critical';
  location?: { lat: number; lon: number };
  createdAt: number;
};

const assets: Asset[] = [
  { id: 'a-1', name: 'Turbine #1', status: 'operational', createdAt: Date.now() },
  { id: 'a-2', name: 'Turbine #2', status: 'warning', createdAt: Date.now() },
];

export async function GET() {
  return NextResponse.json({ items: assets.slice().reverse() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const status: Asset['status'] = (body.status === 'warning' || body.status === 'critical') ? body.status : 'operational';
    const lat = body.lat !== undefined && body.lat !== '' ? Number(body.lat) : undefined;
    const lon = body.lon !== undefined && body.lon !== '' ? Number(body.lon) : undefined;
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
    const asset: Asset = {
      id: crypto.randomUUID(),
      name,
      status,
      location: lat !== undefined && lon !== undefined ? { lat, lon } : undefined,
      createdAt: Date.now(),
    };
    assets.push(asset);
    return NextResponse.json(asset, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
}
