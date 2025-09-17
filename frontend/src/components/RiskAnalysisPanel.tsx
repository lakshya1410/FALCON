import React, { useState, useEffect } from 'react';
import { Play, Zap } from 'lucide-react';

interface RiskAnalysisPanelProps {
  onStartPrediction: () => void;
  onRiskSelect: (risk: any) => void;
  selectedRisk: any;
}

const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({ 
  onStartPrediction
}) => {
  const [liveData, setLiveData] = useState({
    timestamp: new Date(),
    activeAlerts: 3,
    monitoringPoints: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        timestamp: new Date()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Enhanced Live Status Header */}
      <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-gradient-to-r from-purple-500/30 via-blue-500/30 to-orange-500/30 rounded-2xl p-6 shadow-2xl shadow-black/20 flex-shrink-0 animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="/falcon-logo.png" 
                alt="FALCON Logo" 
                className="w-6 h-6 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Live Risk Assessment</span>
          </h2>
          <span className="text-sm text-slate-300 bg-gradient-to-r from-slate-700/60 to-slate-600/60 px-3 py-2 rounded-xl border border-slate-500/30 animate-shimmer">
            {liveData.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="group text-center bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-4 border border-red-500/40 hover:border-red-400/60 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/20">
            <p className="text-red-200 text-sm font-body font-semibold mb-1 group-hover:text-red-100 transition-colors duration-300">Active Alerts</p>
            <p className="text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">{liveData.activeAlerts}</p>
          </div>
          <div className="group text-center bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-4 border border-blue-500/40 hover:border-blue-400/60 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20">
            <p className="text-blue-200 text-sm font-body font-semibold mb-1 group-hover:text-blue-100 transition-colors duration-300">Monitoring Points</p>
            <p className="text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">{liveData.monitoringPoints}</p>
          </div>
        </div>
      </div>



      {/* Compact Predict Rockfall Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-shrink-0">
        <div className="text-center">
          <div className="mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-full mb-2">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-white mb-1">Predict Rockfall</h3>
            <p className="text-slate-300 text-xs mb-3">
              AI analysis for geological risk assessment
            </p>
          </div>

          {/* Compact Pipeline Visualization */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Data</span>
              <span>Analysis</span>
              <span>Forecast</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-1.5 bg-purple-600 rounded-full"></div>
              <div className="w-3 h-0.5 bg-slate-600"></div>
              <div className="w-6 h-1.5 bg-slate-600 rounded-full"></div>
              <div className="w-3 h-0.5 bg-slate-600"></div>
              <div className="w-6 h-1.5 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          <button
            onClick={onStartPrediction}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm"
          >
            <Play className="h-4 w-4" />
            <span>Start Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisPanel;