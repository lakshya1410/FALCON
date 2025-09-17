import React, { useState, useEffect } from 'react';
import RiskAnalysisPanel from './RiskAnalysisPanel';
import SimpleMap from './SimpleMap';
import { Users, Shield, AlertTriangle, Phone, CheckCircle, X } from 'lucide-react';

interface DashboardProps {
  user: any;
  onStartPrediction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartPrediction }) => {
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);

  // Show welcome notification when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeNotification(true);
    }, 1000); // Show after 1 second

    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
      setShowWelcomeNotification(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHideTimer);
    };
  }, []);

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", icon: Phone },
    { name: "Mine Safety Office", number: "18003451006", icon: Shield },
    { name: "Evacuation Team", number: "23387277", icon: Users }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-orange-500/5 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Enhanced Welcome Header */}
      <div className="px-4 py-4 bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-md border-b border-gradient-to-r from-purple-500/20 via-blue-500/20 to-orange-500/20 flex-shrink-0 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="/falcon-logo.png" 
                  alt="FALCON Logo" 
                  className="w-12 h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent group-hover:from-orange-200 group-hover:via-white group-hover:to-blue-200 transition-all duration-300">Welcome back, {user.fullName}</h1>
                <p className="text-slate-300 text-sm font-body group-hover:text-slate-200 transition-colors duration-300 flex items-center space-x-2">
                  <span>{user.siteName}</span>
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Real-time Monitoring Active</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {emergencyContacts.map((contact, index) => (
                <button
                  key={index}
                  className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600/30 to-red-700/30 hover:from-red-600/60 hover:to-red-700/60 text-red-200 hover:text-red-100 rounded-xl text-sm font-body font-semibold transition-all duration-300 border border-red-500/40 hover:border-red-400/60 shadow-lg hover:shadow-red-500/20 transform hover:scale-105 animate-pulse hover:animate-none"
                  title={`Call ${contact.name}: ${contact.number}`}
                >
                  <contact.icon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden md:inline">{contact.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Risk Analysis Panel */}
        <div className="lg:w-[35%] flex-shrink-0">
          <RiskAnalysisPanel 
            onStartPrediction={onStartPrediction}
            onRiskSelect={setSelectedRisk}
            selectedRisk={selectedRisk}
          />
        </div>

        {/* Right Side - Interactive Map */}
        <div className="flex-1 min-h-0">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl h-full shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span>Site Risk Assessment</span>
                  </h2>
                  <p className="text-slate-300 mt-1 text-sm font-body">
                    Real-time geological monitoring for {user.siteName || 'Mine Site Alpha'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-body text-green-300 bg-green-900/30 px-2 py-1 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex-1 min-h-0">
              <SimpleMap 
                center={[16.3, 80.43]} 
                selectedRisk={selectedRisk}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-800 font-heading font-semibold text-sm">
                    Welcome to FALCON Command Center
                  </h4>
                  <button
                    onClick={() => setShowWelcomeNotification(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-slate-600 text-xs font-body mt-1">
                  Real-time geological monitoring system is now active. All systems operational.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <img 
                    src="/falcon-logo.png" 
                    alt="FALCON Logo" 
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-xs text-slate-500 font-body">FALCON v2.1 • Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;