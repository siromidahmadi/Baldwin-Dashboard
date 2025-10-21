import { NextResponse } from 'next/server';

// In-memory storage (ephemeral). Replace with DB in production.
type Feedback = {
  id: string;
  name: string;
  message: string;
  lat?: number;
  lon?: number;
  ts: number;
};

const store: Feedback[] = [];

export async function GET() {
  return NextResponse.json({ items: store.slice().reverse() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item: Feedback = {
      id: crypto.randomUUID(),
      name: String(body.name || 'Anonymous'),
      message: String(body.message || ''),
      lat: body.lat !== undefined ? Number(body.lat) : undefined,
      lon: body.lon !== undefined ? Number(body.lon) : undefined,
      ts: Date.now(),
    };
    if (!item.message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }
    store.push(item);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
}
