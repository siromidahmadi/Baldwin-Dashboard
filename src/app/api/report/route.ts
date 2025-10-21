import { NextResponse } from 'next/server';

export async function GET() {
  // Simple CSV from mock sensors API
  const origin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  try {
    const res = await fetch(`${origin}/api/sensors`, { cache: 'no-store' });
    const sensors = await res.json();

    const lines: string[] = [];
    lines.push('section,id,lat,lon,pm25,speed,deg,from_lon,from_lat,to_lon,to_lat,flow,ts');

    for (const a of sensors.airQuality || []) {
      lines.push(`air_quality,${a.id},${a.lat},${a.lon},${a.pm25},,,,,,${''},${a.ts}`);
    }
    for (const w of sensors.wind || []) {
      lines.push(`wind,${w.id},${w.lat},${w.lon},,${w.speed},${w.deg},,,,,${w.ts}`);
    }
    for (const s of sensors.stormwater || []) {
      lines.push(`stormwater,${s.id},,,,,,${s.from?.[0]},${s.from?.[1]},${s.to?.[0]},${s.to?.[1]},${s.flow},${s.ts}`);
    }

    const csv = lines.join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="dashboard-report.csv"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'failed to generate report' }, { status: 500 });
  }
}
