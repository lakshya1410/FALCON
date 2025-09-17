import React, { useState, useEffect } from 'react';
import { Brain, Satellite, Mountain, Cloud, Activity, CheckCircle, Zap, ArrowRight, Database } from 'lucide-react';

interface ModelPredictingProps {
  data: any;
  onComplete: (results: any) => void;
  onBack: () => void;
}

const ModelPredicting: React.FC<ModelPredictingProps> = ({ data, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processingSteps = [
    {
      id: 1,
      name: 'Analyzing Satellite Data',
      description: 'Processing satellite imagery for terrain features',
      icon: Satellite,
      duration: 2000,
      color: 'text-blue-400'
    },
    {
      id: 2,
      name: 'Processing DEM Data',
      description: 'Analyzing digital elevation model for slope stability',
      icon: Mountain,
      duration: 2500,
      color: 'text-green-400'
    },
    {
      id: 3,
      name: 'Weather Data Integration',
      description: 'Incorporating meteorological conditions',
      icon: Cloud,
      duration: 1500,
      color: 'text-yellow-400'
    },
    {
      id: 4,
      name: 'Seismic Analysis',
      description: 'Evaluating ground movement and stability',
      icon: Activity,
      duration: 2000,
      color: 'text-red-400'
    },
    {
      id: 5,
      name: 'Running AI Models',
      description: 'CNN and ML models generating predictions',
      icon: Brain,
      duration: 3000,
      color: 'text-purple-400'
    }
  ];

  const processNextStep = React.useCallback(() => {
    if (currentStep < processingSteps.length) {
      const step = processingSteps[currentStep];
      
      // Calculate proper increment rate: 100% over step.duration milliseconds
      const incrementRate = 100 / (step.duration / 100); // Progress per 100ms
      
      // Simulate processing time with accurate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep(prevStep => {
                const nextStep = prevStep + 1;
                if (nextStep >= processingSteps.length) {
                  // Processing complete
                  setTimeout(() => {
                    onComplete({
                      overallRisk: 'High',
                      confidence: 87,
                      zones: [
                        { 
                          id: 1, 
                          risk: 'Critical', 
                          confidence: 94, 
                          area: 'North Face - Zone A',
                          probability: 94,
                          lastUpdate: '2 min ago'
                        },
                        { 
                          id: 2, 
                          risk: 'High', 
                          confidence: 82, 
                          area: 'East Ridge - Zone C',
                          probability: 78,
                          lastUpdate: '5 min ago'
                        },
                        { 
                          id: 3, 
                          risk: 'Medium', 
                          confidence: 73, 
                          area: 'South Valley - Zone B',
                          probability: 45,
                          lastUpdate: '8 min ago'
                        },
                        { 
                          id: 4, 
                          risk: 'Safe', 
                          confidence: 96, 
                          area: 'West Plateau - Zone D',
                          probability: 12,
                          lastUpdate: '3 min ago'
                        }
                      ],
                      timestamp: new Date().toISOString(),
                      recommendations: [
                        'Immediate evacuation of North Face area required',
                        'Enhanced monitoring of East Ridge with hourly assessments',
                        'Deploy additional seismic sensors in high-risk zones',
                        'Establish safe evacuation routes through West Plateau',
                        'Activate emergency response protocols',
                        'Notify all personnel of current risk status'
                      ]
                    });
                  }, 1000);
                } else {
                  processNextStep();
                }
                return nextStep;
              });
              setProgress(0);
            }, 500);
            return 100;
          }
          return Math.min(100, prev + incrementRate);
        });
      }, 100); // Update every 100ms for smooth animation
    }
  }, [currentStep, onComplete]);

  useEffect(() => {
    if (!isProcessing) {
      setIsProcessing(true);
      processNextStep();
    }
  }, [isProcessing, processNextStep]);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'processing';
    return 'pending';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Minimal Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/falcon-logo.png" 
                alt="FALCON Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-display font-bold text-white">AI Model Processing</h1>
                <p className="text-slate-400 text-xs">Advanced geological risk analysis in progress</p>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1.5">
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Step 2 of 3</span>
                </div>
                <div className="w-px h-3 bg-slate-600"></div>
                <span className="text-purple-400 font-medium">Processing & Analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Optimized Layout */}
        <div className="grid lg:grid-cols-12 gap-2 flex-1 min-h-0">
          {/* Main Processing Pipeline - Takes 8 columns */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-white flex items-center space-x-1.5">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>Processing Pipeline</span>
                </h2>
                <div className="flex items-center space-x-1.5 text-xs">
                  <Database className="h-3 w-3 text-blue-400" />
                  <span className="text-slate-300">Real-time Analysis</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto">
                {processingSteps.map((step, index) => {
                  const status = getStepStatus(index);
                  const IconComponent = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`relative flex items-center space-x-2.5 p-2.5 rounded-lg transition-all duration-500 ${
                        status === 'completed'
                          ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-500/40 shadow-lg shadow-green-500/10'
                          : status === 'processing'
                          ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/20 border border-purple-500/40 shadow-lg shadow-purple-500/20'
                          : 'bg-slate-700/20 border border-slate-600/30 hover:bg-slate-700/30'
                      }`}
                    >
                      {/* Compact Status Indicator */}
                      <div className="flex-shrink-0 relative">
                        {status === 'completed' ? (
                          <div className="relative">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                          </div>
                        ) : status === 'processing' ? (
                          <div className="relative">
                            <div className="animate-spin">
                              <IconComponent className={`h-5 w-5 ${step.color}`} />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="p-1.5 bg-slate-600/50 rounded-full">
                              <IconComponent className="h-2.5 w-2.5 text-slate-400" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Compact Step Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className={`font-semibold text-sm ${
                            status === 'completed' ? 'text-green-400' :
                            status === 'processing' ? 'text-white' : 'text-slate-400'
                          }`}>
                            {step.name}
                          </h3>
                          <div className="flex items-center space-x-1.5">
                            {status === 'completed' && (
                              <span className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded border border-green-500/30">
                                ✓
                              </span>
                            )}
                            {status === 'processing' && (
                              <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 animate-pulse">
                                ●
                              </span>
                            )}
                            {status === 'pending' && (
                              <span className="text-xs bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600/30">
                                ○
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{step.description}</p>
                        
                        {status === 'processing' && (
                          <div className="space-y-1.5">
                            <div className="w-full bg-slate-600/50 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300 relative"
                                style={{ width: `${progress}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-purple-400">Processing...</span>
                              <span className="text-white font-medium">{Math.floor(progress)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Connection Line */}
                      {index < processingSteps.length - 1 && (
                        <div className={`absolute -bottom-3 left-8 w-0.5 h-6 ${
                          status === 'completed' ? 'bg-green-400/50' : 
                          status === 'processing' ? 'bg-purple-400/50' : 'bg-slate-600/50'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Compact */}
          <div className="lg:col-span-4 flex flex-col space-y-2 min-h-0">
            {/* Data Sources Panel */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-lg p-2.5 backdrop-blur-sm border border-slate-700/40 shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-1.5">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Data Sources</span>
              </h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center p-2 bg-green-900/30 border border-green-500/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Satellite className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-300">Satellite Data</div>
                      <div className="text-xs text-green-400">Real-time active</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-green-900/30 border border-green-500/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-300">DEM Data</div>
                      <div className="text-xs text-green-400">High resolution</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-blue-900/30 border border-blue-500/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-300">Location</div>
                      <div className="text-xs text-blue-400 font-mono">{data.latitude}°, {data.longitude}°</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-purple-900/30 border border-purple-500/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-300">AI Models</div>
                      <div className="text-xs text-purple-400">CNN + ML</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Control Panel */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-lg p-3 backdrop-blur-sm border border-slate-700/40 shadow-lg flex-1">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-1.5">
                <Brain className="h-4 w-4 text-purple-400" />
                <span>Analysis Control</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Step</span>
                  <span className="text-white font-medium">
                    {Math.min(currentStep + 1, processingSteps.length)} of {processingSteps.length}
                  </span>
                </div>
                
                <div className="w-full bg-slate-600/50 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 relative"
                    style={{ 
                      width: `${Math.min(100, ((currentStep * 100) + (currentStep < processingSteps.length ? progress : 0)) / processingSteps.length)}%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white font-bold">
                    {Math.min(100, Math.floor(((currentStep * 100) + (currentStep < processingSteps.length ? progress : 0)) / processingSteps.length))}%
                  </span>
                </div>
                
                {currentStep < processingSteps.length && (
                  <div className="p-2.5 bg-slate-700/40 rounded-lg border border-slate-600/30 mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium text-sm">
                        Currently Processing
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {processingSteps[currentStep]?.name}
                    </p>
                  </div>
                )}
                
                {currentStep >= processingSteps.length ? (
                  <>
                    <div className="text-center p-3 bg-green-900/30 border border-green-500/40 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-semibold text-base">Analysis Complete</span>
                      </div>
                      <p className="text-green-300 text-sm">Ready to view results</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (currentStep >= processingSteps.length) {
                          onComplete({
                            overallRisk: 'High',
                            confidence: 87,
                            zones: [
                              { 
                                id: 1, 
                                risk: 'Critical', 
                                confidence: 94, 
                                area: 'North Face - Zone A',
                                probability: 94,
                                lastUpdate: '2 min ago'
                              },
                              { 
                                id: 2, 
                                risk: 'High', 
                                confidence: 82, 
                                area: 'East Ridge - Zone C',
                                probability: 78,
                                lastUpdate: '5 min ago'
                              },
                              { 
                                id: 3, 
                                risk: 'Medium', 
                                confidence: 73, 
                                area: 'South Valley - Zone B',
                                probability: 45,
                                lastUpdate: '8 min ago'
                              },
                              { 
                                id: 4, 
                                risk: 'Safe', 
                                confidence: 96, 
                                area: 'West Plateau - Zone D',
                                probability: 12,
                                lastUpdate: '3 min ago'
                              }
                            ],
                            timestamp: new Date().toISOString(),
                            recommendations: [
                              'Immediate evacuation of North Face area required',
                              'Enhanced monitoring of East Ridge with hourly assessments',
                              'Deploy additional seismic sensors in high-risk zones',
                              'Establish safe evacuation routes through West Plateau',
                              'Activate emergency response protocols',
                              'Notify all personnel of current risk status'
                            ]
                          });
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg transition-all duration-200 font-semibold text-base flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25"
                    >
                      <span>View Analysis Results</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-amber-400 font-semibold text-base">Processing Data</span>
                      </div>
                      <p className="text-amber-300 text-sm">Analysis in progress...</p>
                    </div>
                    
                    <button
                      onClick={onBack}
                      className="w-full py-3 bg-slate-700/50 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 text-base font-medium"
                    >
                      Cancel Analysis
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPredicting;