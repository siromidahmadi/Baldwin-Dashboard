'use client';

import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Sensors = {
  airQuality: { id: string; lat: number; lon: number; pm25: number; ts: number }[];
  wind: { id: string; lat: number; lon: number; speed: number; deg: number; ts: number }[];
  stormwater: { id: string; from: [number, number]; to: [number, number]; flow: number; ts: number }[];
};

export default function MapView() {
  const [geojson, setGeojson] = useState<any | null>(null);
  const [sensors, setSensors] = useState<Sensors | null>(null);

  useEffect(() => {
    fetch('/data/baldwin-corridor.geojson')
      .then((r: Response) => r.json())
      .then((data: any) => setGeojson(data));
    axios
      .get('/api/sensors')
      .then((r: { data: Sensors }) => setSensors(r.data));
  }, []);

  const corridorFill = useMemo(() => ({
    id: 'corridor-fill',
    type: 'fill' as const,
    paint: { 'fill-color': '#0ea5e9', 'fill-opacity': 0.12 }
  }), []);

  const corridorLine = useMemo(() => ({
    id: 'corridor-line',
    type: 'line' as const,
    paint: { 'line-color': '#0ea5e9', 'line-width': 2 }
  }), []);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;

  if (!token) {
    return (
      <div className="w-full h-[480px] rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200 text-sm text-gray-700">
        Set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local and restart the dev server.
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden">
      <Map
        mapboxAccessToken={token}
        initialViewState={{ longitude: -118.361, latitude: 34.012, zoom: 12 }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl position="top-left" />
        {geojson && (
          <Source id="corridor" type="geojson" data={geojson}>
            <Layer {...corridorFill} />
            <Layer {...corridorLine} />
          </Source>
        )}
        {sensors && (
          <>
            <Source
              id="aq-src"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: sensors.airQuality.map((p) => ({
                  type: 'Feature',
                  properties: { pm25: p.pm25 },
                  geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
                })),
              }}
            >
              <Layer
                id="aq-heatmap"
                type="heatmap"
                paint={{
                  'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'pm25'],
                    0, 0,
                    12, 0.2,
                    35, 0.7,
                    55, 1
                  ],
                  'heatmap-intensity': 1,
                  'heatmap-radius': 30,
                  'heatmap-opacity': 0.6,
                  'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33,102,172,0)',
                    0.2, 'rgb(103,169,207)',
                    0.4, 'rgb(209,229,240)',
                    0.6, 'rgb(253,219,199)',
                    0.8, 'rgb(239,138,98)',
                    1, 'rgb(178,24,43)'
                  ],
                }}
              />
              <Layer
                id="aq-points"
                type="circle"
                paint={{
                  'circle-radius': 4,
                  'circle-color': '#0ea5e9',
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff'
                }}
              />
            </Source>

            <Source
              id="sw-src"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: sensors.stormwater.map((f) => ({
                  type: 'Feature',
                  properties: { flow: f.flow },
                  geometry: { type: 'LineString', coordinates: [f.from, f.to] },
                })),
              }}
            >
              <Layer
                id="sw-lines"
                type="line"
                paint={{
                  'line-color': '#22c55e',
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['get', 'flow'],
                    0, 1,
                    10, 2,
                    20, 4
                  ],
                  'line-opacity': 0.9,
                }}
              />
            </Source>

            {sensors.wind.map((w) => (
              <Marker key={w.id} longitude={w.lon} latitude={w.lat} anchor="center">
                <div
                  style={{ transform: `rotate(${w.deg}deg)` }}
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-gray-700 drop-shadow"
                />
              </Marker>
            ))}
          </>
        )}
      </Map>
    </div>
  );
}
