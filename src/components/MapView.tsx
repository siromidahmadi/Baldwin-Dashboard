'use client';

import Map, { Source, Layer, Marker, NavigationControl, Popup } from 'react-map-gl';
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
  const [popup, setPopup] = useState<{ lng: number; lat: number; type: 'aq' | 'wind' | 'sw'; data: any } | null>(null);
  const [hover, setHover] = useState<{ lng: number; lat: number; type: 'aq' | 'sw'; data: any } | null>(null);
  const [cursor, setCursor] = useState<string>('');

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
        interactiveLayerIds={['aq-points', 'sw-lines']}
        onClick={(e) => {
          const f = e.features && e.features[0];
          if (f && f.layer && f.layer.id === 'aq-points') {
            const coords = (f.geometry as any).coordinates as [number, number];
            setPopup({ lng: coords[0], lat: coords[1], type: 'aq', data: { pm25: f.properties?.pm25 } });
          } else if (f && f.layer && f.layer.id === 'sw-lines') {
            const coords = (f.geometry as any).coordinates as [number, number][];
            const midLng = (coords[0][0] + coords[coords.length - 1][0]) / 2;
            const midLat = (coords[0][1] + coords[coords.length - 1][1]) / 2;
            setPopup({ lng: midLng, lat: midLat, type: 'sw', data: { flow: f.properties?.flow } });
          } else {
            setPopup(null);
          }
        }}
        onMouseMove={(e) => {
          const f = e.features && e.features[0];
          if (f && (f.layer?.id === 'aq-points' || f.layer?.id === 'sw-lines')) {
            setCursor('pointer');
            if (f.layer.id === 'aq-points') {
              const coords = (f.geometry as any).coordinates as [number, number];
              setHover({ lng: coords[0], lat: coords[1], type: 'aq', data: { pm25: f.properties?.pm25 } });
            } else if (f.layer.id === 'sw-lines') {
              const coords = (f.geometry as any).coordinates as [number, number][];
              const midLng = (coords[0][0] + coords[coords.length - 1][0]) / 2;
              const midLat = (coords[0][1] + coords[coords.length - 1][1]) / 2;
              setHover({ lng: midLng, lat: midLat, type: 'sw', data: { flow: f.properties?.flow } });
            }
          } else {
            setCursor('');
            setHover(null);
          }
        }}
        cursor={cursor}
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
                  role="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setPopup({ lng: w.lon, lat: w.lat, type: 'wind', data: { speed: w.speed, deg: w.deg } });
                  }}
                  title={`Wind ${w.speed} m/s @ ${w.deg}°`}
                  style={{ transform: `rotate(${w.deg}deg)` }}
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-gray-700 drop-shadow cursor-pointer"
                />
              </Marker>
            ))}

            {hover && (
              <Popup
                longitude={hover.lng}
                latitude={hover.lat}
                anchor="top"
                closeButton={false}
                closeOnClick={false}
                offset={10}
              >
                {hover.type === 'aq' && (
                  <div className="text-xs">
                    <div className="font-semibold">Air Quality</div>
                    <div>PM2.5: {hover.data.pm25}</div>
                  </div>
                )}
                {hover.type === 'sw' && (
                  <div className="text-xs">
                    <div className="font-semibold">Stormwater</div>
                    <div>Flow: {hover.data.flow}</div>
                  </div>
                )}
              </Popup>
            )}

            {popup && (
              <Popup
                longitude={popup.lng}
                latitude={popup.lat}
                anchor="top"
                closeOnClick={false}
                onClose={() => setPopup(null)}
              >
                {popup.type === 'aq' && (
                  <div className="text-sm">
                    <div className="font-semibold">Air Quality</div>
                    <div>PM2.5: {popup.data.pm25}</div>
                  </div>
                )}
                {popup.type === 'wind' && (
                  <div className="text-sm">
                    <div className="font-semibold">Wind</div>
                    <div>Speed: {popup.data.speed} m/s</div>
                    <div>Direction: {popup.data.deg}°</div>
                  </div>
                )}
                {popup.type === 'sw' && (
                  <div className="text-sm">
                    <div className="font-semibold">Stormwater</div>
                    <div>Flow: {popup.data.flow}</div>
                  </div>
                )}
              </Popup>
            )}
          </>
        )}
      </Map>

      {/* Legend */}
      <div className="pointer-events-none absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow px-3 py-2 text-xs text-gray-700">
        <div className="font-semibold mb-1">Legend</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span>
          <span>Air Quality Points (PM2.5)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-0 border-t-2 border-[#22c55e]"></span>
          <span>Stormwater Flow (width ∝ flow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-gray-700"></span>
          <span>Wind Direction</span>
        </div>
      </div>
    </div>
  );
}
