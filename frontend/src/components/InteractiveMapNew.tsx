import React, { useEffect, useRef, useState } from 'react';

interface InteractiveMapProps {
  center: [number, number];
  selectedRisk?: any;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ center, selectedRisk }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const riskZones = [
    {
      id: 1,
      coordinates: [center[0] + 0.008, center[1] - 0.012] as [number, number],
      level: 'Critical',
      location: 'Northern Slope - Zone Alpha',
      color: '#dc2626',
      radius: 250,
      confidence: 92,
      probability: 85
    },
    {
      id: 2,
      coordinates: [center[0] - 0.006, center[1] + 0.015] as [number, number],
      level: 'High', 
      location: 'Eastern Ridge - Zone Beta',
      color: '#ea580c',
      radius: 180,
      confidence: 88,
      probability: 72
    },
    {
      id: 3,
      coordinates: [center[0] + 0.012, center[1] + 0.008] as [number, number],
      level: 'High',
      location: 'Northeast Face - Zone Gamma', 
      color: '#ea580c',
      radius: 200,
      confidence: 84,
      probability: 68
    },
    {
      id: 4,
      coordinates: [center[0] - 0.010, center[1] - 0.006] as [number, number],
      level: 'Medium',
      location: 'Western Valley - Zone Delta',
      color: '#ca8a04', 
      radius: 160,
      confidence: 76,
      probability: 45
    },
    {
      id: 5,
      coordinates: [center[0] + 0.004, center[1] + 0.018] as [number, number],
      level: 'Medium',
      location: 'Eastern Plateau - Zone Echo',
      color: '#ca8a04', 
      radius: 140,
      confidence: 71,
      probability: 38
    },
    {
      id: 6,
      coordinates: [center[0] - 0.008, center[1] - 0.014] as [number, number],
      level: 'Safe',
      location: 'Southwest Base - Zone Foxtrot',
      color: '#16a34a', 
      radius: 120,
      confidence: 94,
      probability: 12
    }
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const initializeMap = async () => {
      if (!mapRef.current) return;
      
      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        setIsLoading(true);
        setMapError(null);

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 200));

        // Import Leaflet dynamically
        const L = await import('leaflet');
        
        // Fix Leaflet default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create the map with basic options first
        const map = L.map(mapRef.current, {
          preferCanvas: false,
          attributionControl: true,
          zoomControl: true
        }).setView(center, 14);
        
        mapInstanceRef.current = map;

        // Add OpenStreetMap as the primary layer (most reliable)
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        // Wait for the base layer to load
        await new Promise(resolve => {
          osmLayer.on('load', resolve);
          setTimeout(resolve, 2000); // Fallback timeout
        });

        // Add simple risk zones
        riskZones.forEach(zone => {
          try {
            const circle = L.circle(zone.coordinates, {
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.4,
              radius: zone.radius,
              weight: 2
            }).addTo(map);

            // Simple popup
            circle.bindPopup(`
              <div>
                <h3><strong>${zone.location}</strong></h3>
                <p><strong>Risk Level:</strong> ${zone.level}</p>
                <p><strong>Confidence:</strong> ${zone.confidence}%</p>
                <p><strong>Probability:</strong> ${zone.probability}%</p>
              </div>
            `);
          } catch (error) {
            console.warn('Error adding risk zone:', zone.location, error);
          }
        });

        // Add center marker
        try {
          L.marker(center).addTo(map).bindPopup(`
            <div>
              <h3><strong>FALCON Monitoring Station</strong></h3>
              <p><strong>Location:</strong> ${center[0].toFixed(4)}°N, ${center[1].toFixed(4)}°E</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Monitoring:</strong> ${riskZones.length} Risk Zones</p>
            </div>
          `);
        } catch (error) {
          console.warn('Error adding center marker:', error);
        }

        // Finalize map loading
        setTimeout(() => {
          try {
            setIsLoading(false);
            map.invalidateSize();
            console.log('Map initialized successfully at:', center);
          } catch (error) {
            console.warn('Error finalizing map:', error);
            setIsLoading(false);
          }
        }, 1000);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    // Small delay to ensure component is mounted
    timeoutId = setTimeout(initializeMap, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
      }
    };
  }, [center]);

  // Handle selected risk highlighting
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRisk) return;

    const selectedZone = riskZones.find(zone => zone.id === selectedRisk.id);
    if (selectedZone) {
      mapInstanceRef.current.setView(selectedZone.coordinates, 15, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedRisk]);

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700">
        <div className="text-center text-white p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-sm text-slate-300 mb-4">{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-lg overflow-hidden bg-slate-800"
        style={{ 
          minHeight: '500px',
          height: '100%',
          width: '100%',
          zIndex: 1,
          position: 'relative'
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-lg font-medium">Loading Interactive Map...</p>
            <p className="text-sm text-slate-300 mt-1">Setting up geological visualization</p>
          </div>
        </div>
      )}
      
      {/* Simplified Legend */}
      {!isLoading && !mapError && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-lg p-3 text-slate-800 text-xs shadow-lg z-[1000]">
          <h4 className="font-semibold mb-2">Risk Zones</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Safe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;