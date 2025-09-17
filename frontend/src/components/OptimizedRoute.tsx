import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Clock, Route, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

interface OptimizedRouteProps {
  onBack: () => void;
}

const OptimizedRoute: React.FC<OptimizedRouteProps> = ({ onBack }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'safest'>('safest');
  const [evacuationStatus, setEvacuationStatus] = useState<'planning' | 'active' | 'complete'>('planning');

  const currentLocation = [37.7749, -122.4194];
  const safeZones = [
    {
      id: 1,
      name: 'Emergency Assembly Point Alpha',
      coordinates: [37.7849, -122.4094],
      distance: '2.1 km',
      estimatedTime: '8 minutes',
      capacity: '500 personnel',
      facilities: ['First Aid', 'Communication Hub', 'Food & Water']
    },
    {
      id: 2,
      name: 'Evacuation Center Beta',
      coordinates: [37.7649, -122.4294],
      distance: '3.4 km',
      estimatedTime: '12 minutes',
      capacity: '1000 personnel',
      facilities: ['Medical Facility', 'Shelter', 'Equipment Storage']
    },
    {
      id: 3,
      name: 'Safe Zone Gamma',
      coordinates: [37.7949, -122.3894],
      distance: '4.2 km',
      estimatedTime: '15 minutes',
      capacity: '300 personnel',
      facilities: ['Basic Shelter', 'Communication']
    }
  ];

  const routes = {
    fastest: {
      name: 'Fastest Route',
      description: 'Direct path via main access road',
      time: '8 minutes',
      distance: '2.1 km',
      risks: 'Passes through medium risk zone',
      color: '#f97316'
    },
    safest: {
      name: 'Safest Route',
      description: 'Avoids all high-risk geological areas',
      time: '12 minutes',
      distance: '3.4 km',
      risks: 'Clear of all danger zones',
      color: '#22c55e'
    }
  };

  const turnByTurnDirections = [
    { step: 1, instruction: 'Head northwest on Mine Access Road', distance: '0.8 km' },
    { step: 2, instruction: 'Turn left onto Safety Bypass Route', distance: '1.2 km' },
    { step: 3, instruction: 'Continue straight past Equipment Station', distance: '0.9 km' },
    { step: 4, instruction: 'Turn right into Emergency Assembly Point', distance: '0.3 km' },
    { step: 5, instruction: 'Arrive at safe zone checkpoint', distance: '0 km' }
  ];

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: currentLocation as [number, number],
        zoom: 13,
        zoomControl: true
      });

      mapInstanceRef.current = map;

      // Add satellite tile layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      }).addTo(map);

      // Add current location marker
      const currentIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
        className: 'custom-div-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker(currentLocation as [number, number], { icon: currentIcon })
        .addTo(map)
        .bindPopup('<div class="text-center"><strong>Current Location</strong><br>Mine Operations Center</div>');

      // Add safe zone markers
      safeZones.forEach(zone => {
        const safeIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker(zone.coordinates as [number, number], { icon: safeIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold mb-2">${zone.name}</h3>
              <p class="text-sm mb-2">Distance: ${zone.distance}</p>
              <p class="text-sm mb-2">ETA: ${zone.estimatedTime}</p>
              <p class="text-sm">Capacity: ${zone.capacity}</p>
            </div>
          `);
      });

      // Add danger zones
      const dangerZones = [
        { coordinates: [37.7849, -122.4194], color: '#ef4444', radius: 300 },
        { coordinates: [37.7749, -122.4394], color: '#f97316', radius: 200 }
      ];

      dangerZones.forEach(zone => {
        L.circle(zone.coordinates as [number, number], {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.2,
          radius: zone.radius,
          weight: 2
        }).addTo(map);
      });

      // Add route line (simplified)
      const routeCoords = [
        currentLocation,
        [37.7799, -122.4144],
        [37.7849, -122.4094]
      ] as [number, number][];

      L.polyline(routeCoords, {
        color: routes[selectedRoute].color,
        weight: 4,
        opacity: 0.8,
        dashArray: selectedRoute === 'safest' ? undefined : '10, 10'
      }).addTo(map);
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedRoute]);

  const startEvacuation = () => {
    setEvacuationStatus('active');
    // Simulate evacuation progress
    setTimeout(() => {
      setEvacuationStatus('complete');
    }, 10000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Compact Header */}
        <div className="mb-2">
          <div className="flex items-center space-x-3 mb-2">
            <img 
              src="/falcon-logo.png" 
              alt="FALCON Logo" 
              className="w-6 h-6 object-contain"
            />
            <div className="p-1.5 bg-green-600 rounded">
              <Route className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Emergency Route Planning</h1>
              <p className="text-xs text-slate-300">Optimized evacuation route to safe zones</p>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`p-2 rounded border ${
            evacuationStatus === 'planning' 
              ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300'
              : evacuationStatus === 'active'
              ? 'bg-orange-900/30 border-orange-500/50 text-orange-300 animate-pulse'
              : 'bg-green-900/30 border-green-500/50 text-green-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {evacuationStatus === 'planning' && <Clock className="h-4 w-4" />}
                {evacuationStatus === 'active' && <AlertTriangle className="h-4 w-4" />}
                {evacuationStatus === 'complete' && <CheckCircle className="h-4 w-4" />}
                <span className="font-medium text-sm">
                  {evacuationStatus === 'planning' && 'Route Ready'}
                  {evacuationStatus === 'active' && 'Evacuation In Progress'}
                  {evacuationStatus === 'complete' && 'Evacuation Complete'}
                </span>
              </div>
              {evacuationStatus === 'planning' && (
                <button
                  onClick={startEvacuation}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors duration-200"
                >
                  Start Evacuation
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-3 flex-1 min-h-0">
          {/* Route Planning Panel */}
          <div className="space-y-2 overflow-y-auto">
            {/* Route Options */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                <Navigation className="h-3 w-3 text-blue-400" />
                <span>Routes</span>
              </h3>

              <div className="space-y-1.5">
                {Object.entries(routes).map(([key, route]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedRoute(key as 'fastest' | 'safest')}
                    className={`p-2 border rounded cursor-pointer transition-all duration-200 ${
                      selectedRoute === key
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white text-xs">{route.name}</h4>
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: route.color }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{route.time}</span>
                      <span>{route.distance}</span>
                    </div>
                    <p className="text-xs text-slate-500">{route.risks}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                <Phone className="h-3 w-3 text-red-400" />
                <span>Emergency</span>
              </h3>

              <div className="space-y-1.5">
                <button className="w-full p-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded text-left transition-colors duration-200">
                  <div className="flex justify-between items-center text-xs">
                    <span>Emergency</span>
                    <span>911</span>
                  </div>
                </button>
                <button className="w-full p-1.5 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded text-left transition-colors duration-200">
                  <div className="flex justify-between items-center text-xs">
                    <span>Mine Safety</span>
                    <span>555-SAFE</span>
                  </div>
                </button>
                <button className="w-full p-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded text-left transition-colors duration-200">
                  <div className="flex justify-between items-center text-xs">
                    <span>Coordinator</span>
                    <span>555-EVAC</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Turn-by-Turn Directions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white mb-2">Directions</h3>
              
              <div className="space-y-1.5">
                {turnByTurnDirections.map((direction) => (
                  <div key={direction.step} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {direction.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-xs">{direction.instruction}</p>
                      <p className="text-slate-400 text-xs">{direction.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div className="lg:col-span-2 min-h-0">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-slate-700/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <h3 className="text-base font-semibold text-white">Route Map</h3>
                  </div>
                  <p className="text-slate-300 text-xs">
                    {routes[selectedRoute].name} • {routes[selectedRoute].time}
                  </p>
                </div>
              </div>
              <div className="p-3 flex-1 min-h-0">
                <div ref={mapRef} className="h-full rounded overflow-hidden" />
              </div>
            </div>
          </div>
          {/* Safe Zone Info Sidebar */}
          <div className="space-y-2 overflow-y-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-white mb-2">Safe Zones</h3>
              <div className="space-y-2">
                {safeZones.map((zone) => (
                  <div key={zone.id} className="bg-slate-700/30 rounded p-2">
                    <h4 className="font-medium text-white text-xs mb-1">{zone.name.split(' ')[0]} {zone.name.split(' ')[1]}</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dist:</span>
                        <span className="text-white">{zone.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ETA:</span>
                        <span className="text-white">{zone.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-1">
                        {zone.facilities.slice(0, 2).map((facility, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-green-900/30 text-green-400 text-xs rounded"
                          >
                            {facility.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Results Button */}
            <div className="mt-2">
              <button
                onClick={onBack}
                className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors duration-200 font-medium"
              >
                ← Back to Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedRoute;