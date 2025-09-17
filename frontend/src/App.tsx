import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import DataInjection from './components/PredictionWorkflow/DataInjection';
import ModelPredicting from './components/PredictionWorkflow/ModelPredicting';
import RockfallForecast from './components/PredictionWorkflow/RockfallForecast';
import OptimizedRoute from './components/OptimizedRoute';
import * as auth from './lib/completeAuth';

type AppState = 'welcome' | 'dashboard' | 'data-injection' | 'model-predicting' | 'rockfall-forecast' | 'optimized-route';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('welcome');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });
  const [user, setUser] = useState<any>(null);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize simple authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing user in localStorage
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setCurrentView('dashboard');
        }
        
        // Debug: Log auth initialization
        console.log('🔄 Auth initialized, current user:', currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = auth.addAuthListener((event: string, user: any) => {
      if (event === 'SIGNED_IN' && user) {
        setUser(user);
        setCurrentView('dashboard');
        setAuthModal({ isOpen: false, mode: 'login' });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentView('welcome');
        setPredictionData(null);
        setPredictionResults(null);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentView('dashboard');
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleLogout = async () => {
    try {
      const { error } = await auth.logout();
      if (error) {
        console.error('Error signing out:', error);
      }
      // The auth state change listener will handle the UI updates
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: manually clear state if Supabase logout fails
      setUser(null);
      setCurrentView('welcome');
      setPredictionData(null);
      setPredictionResults(null);
    }
  };

  const handleShowLogin = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleShowRegister = () => {
    setAuthModal({ isOpen: true, mode: 'register' });
  };

  const handleStartPrediction = () => {
    setCurrentView('data-injection');
  };

  const handleDataInjectionNext = (data: any) => {
    setPredictionData(data);
    setCurrentView('model-predicting');
  };

  const handlePredictionComplete = (results: any) => {
    setPredictionResults(results);
    setCurrentView('rockfall-forecast');
  };

  const handleGetSafeRoute = () => {
    setCurrentView('optimized-route');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setPredictionData(null);
    setPredictionResults(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onStartPrediction={handleStartPrediction}
          />
        );
      case 'data-injection':
        return (
          <DataInjection 
            onNext={handleDataInjectionNext}
            onBack={handleBackToDashboard}
          />
        );
      case 'model-predicting':
        return (
          <ModelPredicting 
            data={predictionData}
            onComplete={handlePredictionComplete}
            onBack={() => setCurrentView('data-injection')}
          />
        );
      case 'rockfall-forecast':
        return (
          <RockfallForecast 
            results={predictionResults}
            onGetSafeRoute={handleGetSafeRoute}
            onBack={() => setCurrentView('model-predicting')}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'optimized-route':
        return (
          <OptimizedRoute 
            onBack={() => setCurrentView('rockfall-forecast')}
          />
        );
      default:
        return <WelcomeScreen onLogin={handleShowLogin} onRegister={handleShowRegister} />;
    }
  };

  // Show loading screen while checking stored login
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">FALCON</h2>
          <p className="text-blue-200">Initializing AI-based Rockfall Prediction System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {currentView !== 'welcome' && (
        <Navigation 
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      {renderCurrentView()}

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onLogin={handleLogin}
      />
    </div>
  );
}

const WelcomeScreen: React.FC<{ onLogin: () => void; onRegister: () => void }> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-orange-500/5"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8">
          {/* FALCON Logo */}
          <div className="mb-8">
            <img 
              src="/falcon-logo.png" 
              alt="FALCON Logo" 
              className="w-64 h-64 mx-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <h1 className="text-5xl font-display font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent">
            Welcome to <span className="font-display bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">FALCON</span>
          </h1>
          <p className="text-xl font-heading font-medium text-slate-300 mb-8 bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300 bg-clip-text text-transparent">
            AI-based Rockfall Prediction and Alert System for Mine Operators
          </p>
          <p className="text-lg font-body text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Advanced geological risk assessment using cutting-edge AI technology, satellite imagery, 
            and real-time environmental monitoring to ensure mine site safety.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">Real-time Monitoring</h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-body">Continuous geological risk assessment with live alerts and notifications.</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-green-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-all duration-300">
              <svg className="w-6 h-6 text-green-400 group-hover:text-green-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-green-200 transition-colors duration-300">AI-Powered Analysis</h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-body">Advanced machine learning models for accurate rockfall prediction and risk assessment.</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">Emergency Response</h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-body">Optimized evacuation routes and emergency protocols for personnel safety.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
          <button
            onClick={onRegister}
            className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-emerald-500/40 border border-emerald-400/30 hover:border-emerald-300/60 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="flex items-center space-x-3 relative z-10">
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span className="text-lg font-heading font-semibold">Get Started - Create Account</span>
            </span>
          </button>
          <button
            onClick={onLogin}
            className="group relative px-10 py-5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-110 border border-slate-500/50 hover:border-slate-400/70 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="flex items-center space-x-3 relative z-10">
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <span className="text-lg font-heading font-semibold">Existing User - Sign In</span>
            </span>
          </button>
        </div>

        <div className="mt-8 text-sm text-slate-500 animate-pulse">
          Trusted by mine operators worldwide • Powered by advanced AI technology
        </div>
      </div>
    </div>
  );
};

export default App;