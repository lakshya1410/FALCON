import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Satellite, Activity } from 'lucide-react';

const MapSection = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map with coordinates for central India (24.27°N 80.17°E)
      mapInstanceRef.current = L.map(mapRef.current).setView([24.27, 80.17], 12);

      // Add satellite tile layer for better geological visualization
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri &copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(mapInstanceRef.current);

      // Enhanced risk zones with coordinates around 24.27°N 80.17°E
      const riskZones = [
        {
          coords: [[24.280, 80.160], [24.290, 80.170], [24.285, 80.180], [24.275, 80.175]],
          risk: 'high',
          label: 'ROCKFALL ZONE A',
          color: '#ef4444',
          description: 'Active slope instability detected'
        },
        {
          coords: [[24.260, 80.150], [24.270, 80.160], [24.265, 80.170], [24.255, 80.165]],
          risk: 'critical',
          label: 'CRITICAL ZONE B',
          color: '#dc2626',
          description: 'Immediate evacuation required'
        },
        {
          coords: [[24.275, 80.185], [24.285, 80.195], [24.280, 80.205], [24.270, 80.200]],
          risk: 'safe',
          label: 'SAFE ZONE C',
          color: '#22c55e',
          description: 'Stable geological conditions'
        },
        {
          coords: [[24.250, 80.140], [24.260, 80.150], [24.255, 80.160], [24.245, 80.155]],
          risk: 'medium',
          label: 'MONITOR ZONE D',
          color: '#f59e0b',
          description: 'Requires continuous monitoring'
        }
      ];

      // Add enhanced risk zones to map
      riskZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.4,
          weight: 3,
          opacity: 0.8
        }).addTo(mapInstanceRef.current);

        // Enhanced popup with more details
        polygon.bindPopup(`
          <div class="text-black p-2">
            <div class="font-bold text-lg mb-2">${zone.label}</div>
            <div class="mb-2">
              <span class="font-semibold">Risk Level:</span> 
              <span class="font-bold" style="color: ${zone.color}">${zone.risk.toUpperCase()}</span>
            </div>
            <div class="mb-2">${zone.description}</div>
            <div class="text-sm text-gray-600">
              Last Updated: ${new Date().toLocaleTimeString()}
            </div>
          </div>
        `);
      });

      // Enhanced markers for specific geological incidents around the new coordinates
      const incidents = [
        {
          coords: [24.275, 80.165],
          type: 'Slope Crack Detection',
          severity: 'Critical',
          icon: '🚨',
          details: 'Crack width: 5.2mm, Length: 15m'
        },
        {
          coords: [24.265, 80.155],
          type: 'Rockfall Event',
          severity: 'High',
          icon: '⛰️',
          details: 'Volume: 2.3m³, Impact radius: 8m'
        },
        {
          coords: [24.280, 80.190],
          type: 'Seismic Activity',
          severity: 'Medium',
          icon: '📊',
          details: 'Magnitude: 2.1, Depth: 12m'
        },
        {
          coords: [24.255, 80.145],
          type: 'Drainage Issue',
          severity: 'Medium',
          icon: '💧',
          details: 'Water accumulation, Monitor required'
        }
      ];

      incidents.forEach(incident => {
        // Custom marker with enhanced styling
        const marker = L.marker(incident.coords, {
          icon: L.divIcon({
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg">
                <span class="text-white text-xs">${incident.icon}</span>
              </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="text-black p-3">
            <div class="font-bold text-lg mb-2 flex items-center">
              <span class="mr-2">${incident.icon}</span>
              ${incident.type}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Severity:</span> 
              <span class="font-bold text-red-600">${incident.severity}</span>
            </div>
            <div class="mb-2 text-sm">${incident.details}</div>
            <div class="text-xs text-gray-600">
              <div>Coordinates: ${incident.coords[0].toFixed(4)}, ${incident.coords[1].toFixed(4)}</div>
              <div>Detected: ${new Date().toLocaleString()}</div>
            </div>
          </div>
        `);
      });

      // Add scale control
      L.control.scale({
        metric: true,
        imperial: false,
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-full bg-gray-900">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Enhanced Map Legend */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-xl p-4 z-[1000] backdrop-blur-sm border border-orange-500/30 shadow-2xl max-w-xs">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1.5 rounded-lg mr-2">
            <Satellite className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Geological Risk Map</h4>
            <p className="text-gray-400 text-xs">Real-time slope analysis</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded shadow-lg"></div>
            <div>
              <span className="text-white text-xs font-medium">Critical Risk</span>
              <p className="text-gray-400 text-xs">Immediate action</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded shadow-lg"></div>
            <div>
              <span className="text-white text-xs font-medium">High Risk</span>
              <p className="text-gray-400 text-xs">Enhanced monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded shadow-lg"></div>
            <div>
              <span className="text-white text-xs font-medium">Medium Risk</span>
              <p className="text-gray-400 text-xs">Regular assessment</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded shadow-lg"></div>
            <div>
              <span className="text-white text-xs font-medium">Safe Zone</span>
              <p className="text-gray-400 text-xs">Stable conditions</p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>4 Active Incidents</span>
          </div>
        </div>
      </div>

      {/* Processing Indicator */}
      <div className="absolute top-4 right-4 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-xl p-3 z-[1000] backdrop-blur-sm border border-blue-500/30 shadow-2xl">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <span className="text-white text-xs font-medium">AI Analysis</span>
            <p className="text-gray-400 text-xs">Processing...</p>
          </div>
        </div>
        <div className="mt-1 flex items-center space-x-1">
          <Activity className="w-3 h-3 text-green-500" />
          <span className="text-green-400 text-xs font-medium">Neural network online</span>
        </div>
      </div>

      {/* Map Controls Enhancement */}
      <div className="absolute bottom-4 left-4 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-xl p-2 z-[1000] backdrop-blur-sm border border-gray-600/30 shadow-2xl">
        <div className="text-white text-xs space-y-1">
          <div className="font-medium">Controls</div>
          <div className="text-gray-400">Click zones for details</div>
          <div className="text-gray-400">Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;