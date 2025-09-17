import React from 'react';
import { Users, Shield, Truck, AlertCircle, CheckCircle, Activity, Wrench, HardHat } from 'lucide-react';

const RightSidebar = () => {
  const resources = [
    {
      name: 'Inspection Drones',
      zone: 'Zone Alpha',
      current: 3,
      estimated: 8,
      allocated: 37.5,
      needed: 5,
      status: 'critical',
      icon: Shield,
      color: 'text-red-500',
      description: 'Aerial surveillance units'
    },
    {
      name: 'Safety Barriers',
      zone: 'Zone Beta',
      current: 12,
      estimated: 30,
      allocated: 40.0,
      needed: 18,
      status: 'shortage',
      icon: HardHat,
      color: 'text-orange-500',
      description: 'Protective mesh systems'
    },
    {
      name: 'Response Teams',
      zone: 'Zone Gamma',
      current: 6,
      estimated: 15,
      allocated: 40.0,
      needed: 9,
      status: 'shortage',
      icon: Users,
      color: 'text-yellow-500',
      description: 'Emergency personnel'
    },
    {
      name: 'Heavy Equipment',
      zone: 'Zone Delta',
      current: 2,
      estimated: 5,
      allocated: 40.0,
      needed: 3,
      status: 'adequate',
      icon: Truck,
      color: 'text-green-500',
      description: 'Excavation machinery'
    }
  ];

  const recommendedActions = [
    {
      id: 1,
      action: 'Deploy additional seismic monitors in Zone A',
      priority: 'critical',
      zone: 'Zone A',
      status: 'pending',
      estimatedTime: '2 hours',
      impact: 'high',
      difficulty: 'medium'
    },
    {
      id: 2,
      action: 'Restrict heavy vehicle access on unstable slopes',
      priority: 'high',
      zone: 'Zone A & B',
      status: 'pending',
      estimatedTime: 'immediate',
      impact: 'high',
      difficulty: 'low'
    },
    {
      id: 3,
      action: 'Install protective mesh on critical slope sections',
      priority: 'high',
      zone: 'Zone B',
      status: 'in-progress',
      estimatedTime: '6 hours',
      impact: 'medium',
      difficulty: 'high'
    },
    {
      id: 4,
      action: 'Update evacuation routes based on risk assessment',
      priority: 'medium',
      zone: 'All Zones',
      status: 'completed',
      estimatedTime: '4 hours',
      impact: 'medium',
      difficulty: 'medium'
    }
  ];

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Resource Allocation */}
      <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-4 border border-purple-500/20 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg mr-2">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Resource Allocation
          </h3>
          <div className="bg-purple-500/20 px-2 py-1 rounded-full">
            <span className="text-purple-400 text-xs font-medium">AI Optimized</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          AI-predicted needs & current deployment optimization
        </p>
        
        <div className="space-y-3">
          {resources.slice(0, 3).map((resource, index) => (
            <div key={index} className="bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg bg-gray-700/50`}>
                    <resource.icon className={`w-4 h-4 ${resource.color}`} />
                  </div>
                  <div>
                    <span className="font-semibold text-white text-sm">{resource.name}</span>
                    <p className="text-xs text-gray-400">{resource.zone}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  resource.status === 'critical' ? 'bg-red-500 text-white' :
                  resource.status === 'shortage' ? 'bg-orange-500 text-white' : 
                  'bg-green-500 text-white'
                }`}>
                  {resource.status === 'critical' ? '🚨' : resource.status === 'shortage' ? '⚠️' : '✅'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Available / Required</span>
                  <span className="text-white font-semibold">{resource.current} / {resource.estimated}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        resource.status === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        resource.status === 'shortage' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${resource.allocated}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{resource.allocated}% allocated</span>
                  <span className={`font-medium ${
                    resource.status === 'adequate' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {resource.needed} needed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-4 border border-green-500/20 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1.5 rounded-lg mr-2">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            Recommended Actions
          </h3>
          <div className="bg-green-500/20 px-2 py-1 rounded-full">
            <span className="text-green-400 text-xs font-medium">AI Suggested</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Machine learning-driven preventive measures & response protocols
        </p>
        
        <div className="space-y-3">
          {recommendedActions.slice(0, 3).map((action) => (
            <div key={action.id} className="bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                  action.priority === 'critical' ? 'bg-red-500 text-white' :
                  action.priority === 'high' ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {action.priority === 'critical' && <AlertCircle className="w-3 h-3" />}
                  <span>{action.priority.toUpperCase()}</span>
                </span>
                <div className="flex items-center text-xs space-x-1">
                  {action.status === 'pending' ? (
                    <div className="flex items-center text-yellow-400">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-1"></div>
                      <span>Pending</span>
                    </div>
                  ) : action.status === 'in-progress' ? (
                    <div className="flex items-center text-blue-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></div>
                      <span>In Progress</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-white mb-2 leading-relaxed">{action.action}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-700/50 p-1.5 rounded">
                  <span className="text-gray-400">Zone:</span>
                  <div className="text-white font-medium text-xs">{action.zone}</div>
                </div>
                <div className="bg-gray-700/50 p-1.5 rounded">
                  <span className="text-gray-400">ETA:</span>
                  <div className="text-orange-400 font-medium text-xs">{action.estimatedTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
