import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface SimpleMapProps {
  center: [number, number];
  selectedRisk?: any;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ center }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const riskZones = [
    {
      id: 1,
      coordinates: [center[0] + 0.01, center[1] - 0.01] as [number, number],
      level: 'Critical',
      location: 'Anantapur Mining Zone A',
      color: '#dc2626',
      radius: 200
    },
    {
      id: 2,
      coordinates: [center[0], center[1] + 0.01] as [number, number],
      level: 'High', 
      location: 'Kurnool Ridge - Zone C',
      color: '#ea580c',
      radius: 150
    },
    {
      id: 3,
      coordinates: [center[0] - 0.01, center[1]] as [number, number],
      level: 'Medium',
      location: 'Kadapa Valley - Zone B', 
      color: '#ca8a04',
      radius: 180
    },
    {
      id: 4,
      coordinates: [center[0] + 0.005, center[1] + 0.005] as [number, number],
      level: 'Safe',
      location: 'Chittoor Plateau - Zone D',
      color: '#16a34a', 
      radius: 120
    }
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // Create map
      const map = L.map(mapRef.current).setView(center, 13);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add risk zones
      riskZones.forEach(zone => {
        L.circle(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.3,
          radius: zone.radius
        }).addTo(map).bindPopup(`
          <b>${zone.location}</b><br>
          Risk Level: ${zone.level}
        `);
      });

      // Add center marker
      L.marker(center).addTo(map).bindPopup('Andhra Pradesh Mining Site Center<br>16.3°N 80.43°E');

    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center]);

  return (
        <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-xl border border-slate-700/50"
        style={{ minHeight: '400px' }}
      />      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-white text-sm shadow-xl z-[1000]">
        <h4 className="font-semibold mb-3 text-white">Risk Assessment Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-slate-300">Critical Risk</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            <span className="text-slate-300">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-slate-300">Safe Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;