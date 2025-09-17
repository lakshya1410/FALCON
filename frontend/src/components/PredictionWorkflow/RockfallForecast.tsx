import React, { useState } from 'react';
import { AlertTriangle, Shield, CheckCircle, Navigation, TrendingUp, Clock, MapPin, Route } from 'lucide-react';
import InteractiveMap from '../InteractiveMapNew';

interface RockfallForecastProps {
  results: any;
  onGetSafeRoute: () => void;
  onBack: () => void;
  onBackToDashboard: () => void;
}

const RockfallForecast: React.FC<RockfallForecastProps> = ({ 
  results, 
  onGetSafeRoute, 
  onBack, 
  onBackToDashboard 
}) => {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      case 'safe': return 'text-green-400 bg-green-900/30 border-green-500/50';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-500/50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <TrendingUp className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getAlertMessage = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return {
          title: 'IMMEDIATE EVACUATION REQUIRED',
          description: 'Critical geological instability detected. All personnel must evacuate immediately.',
          action: 'Evacuate Now',
          priority: 'EMERGENCY'
        };
      case 'high':
        return {
          title: 'ENHANCED MONITORING NEEDED',
          description: 'Elevated risk conditions require increased surveillance and safety measures.',
          action: 'Increase Monitoring',
          priority: 'HIGH'
        };
      case 'medium':
        return {
          title: 'REGULAR ASSESSMENT RECOMMENDED',
          description: 'Moderate risk levels require standard monitoring protocols.',
          action: 'Continue Monitoring',
          priority: 'MEDIUM'
        };
      default:
        return {
          title: 'STABLE CONDITIONS',
          description: 'Geological conditions are within safe operational parameters.',
          action: 'Maintain Vigilance',
          priority: 'LOW'
        };
    }
  };

  const alertInfo = getAlertMessage(results.overallRisk);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Clean Top Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/falcon-logo.png" 
              alt="FALCON Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-display font-bold text-white">Rockfall Forecast Results</h1>
              <p className="text-sm text-slate-400">AI Geological Analysis • Generated {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-medium">Analysis Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* Left Panel - Risk Zones */}
        <div className="col-span-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex flex-col h-full">
          
          {/* Compact Risk Zones Header */}
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-400" />
              <span>Risk Zones</span>
            </h3>
            <p className="text-xs text-slate-400">Click zones to view on map</p>
          </div>

          {/* Optimized Risk Zone List */}
          <div className="space-y-1.5 overflow-y-auto pr-1">
            {results.zones.map((zone: any) => (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-1.5 rounded border cursor-pointer transition-all duration-200 hover:shadow-sm ${getRiskColor(zone.risk)} ${
                  selectedZone?.id === zone.id ? 'ring-1 ring-purple-400 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <div className="scale-75">{getRiskIcon(zone.risk)}</div>
                    <span className="font-bold text-xs">{zone.risk}</span>
                  </div>
                  <span className="text-xs font-bold">{zone.confidence}%</span>
                </div>
                
                <h4 className="font-medium text-xs mb-1 text-white truncate">{zone.area}</h4>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-80">Prob: {zone.probability}%</span>
                  <span className="opacity-70">{zone.lastUpdate}</span>
                </div>
                
                {selectedZone?.id === zone.id && (
                  <div className="mt-1 pt-1 border-t border-current/20">
                    <div className="text-xs text-white font-medium">🎯 Selected</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Summary Footer */}
          <div className="mt-2 text-xs text-slate-400 text-center bg-slate-700/30 rounded p-2">
            <span className="font-medium">{results.zones.length} zones identified</span> • 
            <span className="text-red-400 font-medium">
              {results.zones.filter((z: any) => z.risk.toLowerCase() === 'critical' || z.risk.toLowerCase() === 'high').length} high-risk
            </span>
          </div>
        </div>

        {/* Central Map Area */}
        <div className="col-span-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
          
          {/* Map Header */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Navigation className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Geological Risk Visualization</h3>
                  <p className="text-sm text-slate-400">Interactive map showing predicted rockfall zones</p>
                </div>
              </div>
              {selectedZone && (
                <div className="bg-slate-700/70 rounded-lg px-3 py-2 border border-slate-600/50">
                  <p className="text-xs text-slate-400 font-medium">SELECTED ZONE</p>
                  <p className="font-bold text-white">{selectedZone.area}</p>
                  <p className="text-sm text-slate-300">{selectedZone.risk} Risk • {selectedZone.confidence}% Confidence</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 p-3">
            <div className="h-full bg-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-lg overflow-hidden shadow-inner">
              <InteractiveMap 
                center={[24.35, 79.34]}
                selectedRisk={selectedZone}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Analysis & Controls */}
        <div className="col-span-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col space-y-4">
          
          {/* Risk Assessment Card */}
          <div className={`p-4 rounded-lg border-2 ${getRiskColor(results.overallRisk)} animate-pulse`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                {getRiskIcon(results.overallRisk)}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-white mb-1">{alertInfo.title}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">{results.overallRisk} Risk</span>
                  <span className="text-sm opacity-75">•</span>
                  <span className="text-sm font-semibold">{results.confidence}% Confidence</span>
                </div>
              </div>
            </div>
            <div className="bg-current/10 rounded-lg p-2">
              <span className="text-xs font-medium uppercase tracking-wide">{alertInfo.priority}</span>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>Analysis Summary</span>
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">Overall Risk</span>
                <span className={`font-bold ${getRiskColor(results.overallRisk).split(' ')[0]}`}>
                  {results.overallRisk}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">AI Confidence</span>
                <span className="text-white font-bold">{results.confidence}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">Risk Zones</span>
                <span className="text-white font-bold">{results.zones.length} Identified</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            <button
              onClick={onGetSafeRoute}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Route className="h-4 w-4" />
              <span>Show Optimized Route</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onBack}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                onClick={onBackToDashboard}
                className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockfallForecast;