import React, { useState } from 'react';
import { Menu, X, Info, User, LogIn } from 'lucide-react';

interface NavigationProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
  user?: any;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onShowLogin, onShowRegister, user, onLogout }) => {
  const [showModelsInfo, setShowModelsInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-md border-b border-gradient-to-r from-purple-500/20 via-blue-500/20 to-orange-500/20 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="/falcon-logo.png" 
                  alt="FALCON Logo" 
                  className="w-12 h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-orange-200 group-hover:to-white transition-all duration-300 tracking-tight">FALCON</h1>
                <p className="text-xs font-body text-slate-300 hidden sm:block group-hover:text-slate-200 transition-colors duration-300 tracking-wide">AI-based Rockfall Prediction System</p>
              </div>
            </div>
          </div>

          {/* Center - Models Info */}
          <div className="hidden md:flex relative">
            <button
              onClick={() => setShowModelsInfo(!showModelsInfo)}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-300 hover:text-purple-200 rounded-xl transition-all duration-300 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/40 shadow-lg hover:shadow-purple-500/20"
            >
              <Info className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-heading font-semibold tracking-tight">Models Info</span>
            </button>
            
            {showModelsInfo && (
              <div className="absolute top-full mt-2 w-80 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl p-4 z-50">
                <h3 className="text-lg font-semibold text-white mb-3">AI Models & Data Sources</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-white font-medium">DEM Model</p>
                      <p className="text-slate-300">Digital Elevation Model for terrain analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-white font-medium">CNN Model</p>
                      <p className="text-slate-300">Convolutional Neural Network for image analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-white font-medium">Weather API</p>
                      <p className="text-slate-300">Real-time meteorological data integration</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-white font-medium">Seismic Monitor</p>
                      <p className="text-slate-300">Continuous ground movement detection</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Auth Buttons or User Info */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">{user.fullName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onShowRegister}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Create Account</span>
                </button>
                <button
                  onClick={onShowLogin}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 text-white bg-slate-700 rounded-md">
                    Welcome, {user.fullName}
                  </div>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-red-700 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onShowRegister}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-slate-700 rounded-md"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={onShowLogin}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-slate-700 rounded-md"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;