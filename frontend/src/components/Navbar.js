import React from 'react';
import { Mountain, Shield, Brain, Database, TrendingUp, Zap } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Command Center', icon: Shield },
    { name: 'Data Ingestion', icon: Database },
    { name: 'Model Predicting', icon: Brain },
    { name: 'Rockfall Forecast', icon: TrendingUp }
  ];
  
  const statusIndicators = [
    { name: 'DEM Model', status: 'online' },
    { name: 'CNN Model', status: 'online' },
    { name: 'Weather API', status: 'connected' },
    { name: 'Seismic Monitor', status: 'online' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-orange-500/30 shadow-2xl h-20">
      <div className="px-12 py-3 h-full max-w-full">
        <div className="flex items-center justify-between h-full w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent whitespace-nowrap">
                FALCON
              </h1>
              <p className="text-xs text-gray-400 flex items-center whitespace-nowrap">
                <Zap className="w-3 h-3 mr-1 text-yellow-500 flex-shrink-0" />
                Real-time Geological Risk Assessment & Management
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 flex-shrink-0 mx-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.name
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-orange-300'
                }`}
              >
                <tab.icon className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="grid grid-cols-2 gap-1">
              {statusIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center space-x-1 bg-gray-800/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    {indicator.status === 'online' || indicator.status === 'connected' ? (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                    ) : indicator.status === 'processing' ? (
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce flex-shrink-0"></div>
                    ) : (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                    )}
                    <span className="text-xs text-gray-300 font-medium whitespace-nowrap">{indicator.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
