import React from 'react';
import { AlertTriangle, Clock, Mountain, Droplets, TrendingDown, Zap } from 'lucide-react';

const LeftSidebar = () => {
  const activeRisks = [
    {
      id: 1,
      type: 'Rockfall',
      severity: 'HIGH',
      location: 'North-East Slope Zone A',
      time: '25 minutes ago',
      confidence: '94.1%',
      icon: Mountain,
      color: 'border-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 2,
      type: 'Slope Instability',
      severity: 'CRITICAL',
      location: 'Main Access Road - Zone B',
      time: '12 minutes ago',
      confidence: '89.7%',
      icon: TrendingDown,
      color: 'border-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      id: 3,
      type: 'Rainfall Impact',
      severity: 'MEDIUM',
      location: 'Drainage Zone C',
      time: '45 minutes ago',
      confidence: '76.3%',
      icon: Droplets,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const emergencyMessages = [
    {
      id: 1,
      priority: 'CRITICAL',
      message: 'Slope crack growth exceeded 5mm threshold in Zone A - immediate action required',
      category: 'Structural Alert',
      time: '3 minutes ago',
      confidence: '96%',
      urgency: 'immediate'
    },
    {
      id: 2,
      priority: 'HIGH',
      message: 'Rainfall intensity 15mm/hr detected in Zone C - monitor drainage systems',
      category: 'Weather Alert',
      time: '8 minutes ago',
      confidence: '87%',
      urgency: 'within 2 hours'
    },
    {
      id: 3,
      priority: 'MEDIUM',
      message: 'Seismic activity 2.1 magnitude detected - assess slope stability',
      category: 'Seismic Alert',
      time: '15 minutes ago',
      confidence: '82%',
      urgency: 'within 4 hours'
    }
  ];

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Active Slope Risks */}
      <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-4 border border-orange-500/20 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1.5 rounded-lg mr-2">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            Active Slope Risks
          </h3>
          <div className="bg-red-500/20 px-2 py-1 rounded-full">
            <span className="text-red-400 text-xs font-medium">{activeRisks.length} Active</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          <Zap className="w-3 h-3 inline mr-1 text-yellow-500" />
          AI-detected geological threats requiring immediate attention
        </p>
        
        <div className="space-y-3">
          {activeRisks.map((risk) => (
            <div key={risk.id} className={`bg-gray-800/60 rounded-lg p-3 border-l-4 ${risk.color} ${risk.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${risk.bgColor}`}>
                    <risk.icon className={`w-4 h-4 ${risk.color.replace('border', 'text')}`} />
                  </div>
                  <div>
                    <span className="font-semibold text-white text-sm">{risk.type}</span>
                    <p className="text-gray-400 text-xs">{risk.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  risk.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                  risk.severity === 'HIGH' ? 'bg-orange-500 text-white' : 
                  'bg-yellow-500 text-black'
                }`}>
                  {risk.severity}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {risk.time}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Conf:</span>
                  <span className="text-green-400 font-semibold">{risk.confidence}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Messages */}
      <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-4 border border-blue-500/20 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-lg mr-2">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Emergency Messages
          </h3>
          <div className="bg-blue-500/20 px-2 py-1 rounded-full">
            <span className="text-blue-400 text-xs font-medium">NLP</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          NLP-classified priority communications & automated triggers
        </p>
        
        <div className="space-y-3">
          {emergencyMessages.map((message) => (
            <div key={message.id} className="bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                  message.priority === 'CRITICAL' ? 'bg-red-500 text-white' : 
                  message.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{message.priority}</span>
                </span>
                <div className="flex items-center text-xs text-gray-400 space-x-1">
                  <span className="text-green-400 font-semibold">{message.confidence}</span>
                </div>
              </div>
              <p className="text-xs text-white mb-2 leading-relaxed">{message.message}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">{message.category}</span>
                  <span className="text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {message.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
