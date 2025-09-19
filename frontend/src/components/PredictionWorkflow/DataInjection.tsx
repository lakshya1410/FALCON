import React, { useState } from 'react';
import { Upload, MapPin, Image, Mountain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiService, CompleteAnalysisResponse } from '../../services/api';

interface DataInjectionProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const DataInjection: React.FC<DataInjectionProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    satelliteImage: null as File | null,
    demPhoto: null as File | null,
    latitude: '',
    longitude: '',
    siteName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [weatherData, setWeatherData] = useState<CompleteAnalysisResponse | null>(null);
  const [processStep, setProcessStep] = useState<'input' | 'processing' | 'results'>('input');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.satelliteImage) {
      newErrors.satelliteImage = 'Drone image is required';
    }
    if (!formData.demPhoto) {
      newErrors.demPhoto = 'DEM photo is required';
    }
    if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required';
    }
    if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required';
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (lng < -180 || lng > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (file: File, type: 'satellite' | 'dem') => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type === 'satellite' ? 'satelliteImage' : 'demPhoto']: 'Only JPG and PNG files are allowed'
      }));
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [type === 'satellite' ? 'satelliteImage' : 'demPhoto']: 'File size must be less than 10MB'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [type === 'satellite' ? 'satelliteImage' : 'demPhoto']: file
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[type === 'satellite' ? 'satelliteImage' : 'demPhoto'];
      return newErrors;
    });
  };

  const handleDrop = (e: React.DragEvent, type: 'satellite' | 'dem') => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessStep('processing');

    try {
      // Create FormData for comprehensive analysis (all three models)
      const formDataToSend = new FormData();
      formDataToSend.append('satellite_image', formData.satelliteImage!);
      formDataToSend.append('dem_image', formData.demPhoto!);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      if (formData.siteName) {
        formDataToSend.append('site_name', formData.siteName);
      }

      // Call comprehensive analysis API (Weather + Crack Segmentation + DEM)
      console.log('🚀 Calling comprehensive analysis API...');
      const response = await apiService.analyzeCompleteData(formDataToSend);
      console.log('📡 API Response:', response);
      
      if (response.success && response.data) {
        setWeatherData(response.data);
        setProcessStep('results');
        // Pass the complete data including all analysis results to the next step
        // Skip ModelPredicting and go directly to results since we have comprehensive analysis
        onNext({
          ...formData,
          completeAnalysisData: response.data,
          skipModelPredicting: true // Flag to indicate we should skip the modeling step
        });
      } else {
        // Handle complex error objects properly
        let errorMessage = 'Unknown error';
        if (response.error) {
          if (typeof response.error === 'string') {
            errorMessage = response.error;
          } else if (typeof response.error === 'object') {
            errorMessage = JSON.stringify(response.error);
          }
        }
        
        setErrors(prev => ({
          ...prev,
          api: `Complete analysis failed: ${errorMessage}`
        }));
        setProcessStep('input');
      }
    } catch (error) {
      console.error('Complete analysis error:', error);
      setErrors(prev => ({
        ...prev,
        api: `Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`
      }));
      setProcessStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const FileUploadArea: React.FC<{
    type: 'satellite' | 'dem';
    title: string;
    icon: React.ReactNode;
    file: File | null;
    error?: string;
  }> = ({ type, title, icon, file, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {title} *
      </label>
      <div
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(type);
        }}
        onDragLeave={() => setDragOver(null)}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragOver === type
            ? 'border-purple-400 bg-purple-900/20'
            : file
            ? 'border-green-400 bg-green-900/20'
            : error
            ? 'border-red-400 bg-red-900/20'
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-12 w-12 text-green-400" />
            <p className="text-green-400 font-medium">{file.name}</p>
            <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {icon}
            <p className="text-slate-300">
              Drag & drop your {title.toLowerCase()} here
            </p>
            <p className="text-slate-400 text-sm">or click to browse</p>
            <p className="text-slate-500 text-xs">JPG, PNG files up to 10MB</p>
          </div>
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], type)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-orange-500/5 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl animate-float delay-1000"></div>
      
      <div className="max-w-6xl mx-auto flex-1 flex flex-col relative z-10">
        {/* Compact Header */}
        <div className="mb-3 text-center flex-shrink-0">
          <div className="flex items-center justify-center space-x-3 mb-2 group">
            <div className="relative">
              <img 
                src="/falcon-logo.png" 
                alt="FALCON Logo" 
                className="w-8 h-8 object-contain relative z-10"
              />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">Data Injection Phase</h1>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-200 font-body font-semibold">Step 1 of 3</span>
            </div>
            <span className="text-slate-300 font-body font-medium">Data Collection & Preparation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 flex-1 min-h-0">
          {/* File Upload Section */}
          <div className="space-y-3 flex flex-col h-full">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex-1">
              <h2 className="text-base font-heading font-semibold text-white mb-3 flex items-center space-x-2">
                <Upload className="h-4 w-4 text-purple-400" />
                <span>Upload Analysis Data</span>
              </h2>

              <div className="space-y-3">
                <FileUploadArea
                  type="satellite"
                  title="Drone Image"
                  icon={<Image className="h-12 w-12 text-slate-400" />}
                  file={formData.satelliteImage}
                  error={errors.satelliteImage}
                />

                <FileUploadArea
                  type="dem"
                  title="DEM (Digital Elevation Model) Photo"
                  icon={<Mountain className="h-12 w-12 text-slate-400" />}
                  file={formData.demPhoto}
                  error={errors.demPhoto}
                />
              </div>
            </div>
          </div>

          {/* Coordinates Section */}
          <div className="space-y-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
              <h2 className="text-base font-heading font-semibold text-white mb-3 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Analysis Coordinates</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-body font-medium text-slate-300 mb-2">
                    Site Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="e.g., Delhi Mining Site, Mumbai Port Area"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-slate-300 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="37.7749"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.latitude && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.latitude}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-slate-300 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="-122.4194"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.longitude && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.longitude}</span>
                    </p>
                  )}
                </div>

                {formData.latitude && formData.longitude && !errors.latitude && !errors.longitude && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-sm flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Coordinates validated: {formData.latitude}, {formData.longitude}</span>
                    </p>
                  </div>
                )}

                {/* API Error Display */}
                {errors.api && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.api}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress & Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Progress</span>
                <span className="text-purple-400 text-sm">Step 1 of 3</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1 mb-3">
                <div className="bg-purple-600 h-1 rounded-full w-1/3"></div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={onBack}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 text-sm font-body"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.satelliteImage || !formData.demPhoto || !formData.latitude || !formData.longitude || isProcessing}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 text-sm font-body flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Process Data</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {processStep === 'processing' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-lg mx-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Analysis in Progress</h3>
            <p className="text-slate-300 mb-6">
              Running all three analysis models on your data...
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>🌤️ Weather Risk Analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>🔍 Crack Segmentation Analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>🏔️ DEM Geological Analysis</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-400">
              This may take a few moments to process all models...
            </div>
          </div>
        </div>
      )}

      {/* Complete Analysis Results Display */}
      {processStep === 'results' && weatherData && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Complete Analysis Results</h3>
              <button
                onClick={() => setProcessStep('input')}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Overall Assessment */}
              {weatherData.overall_assessment && (
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Overall Risk Assessment</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      weatherData.overall_assessment.risk_level === 'LOW' 
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                        : weatherData.overall_assessment.risk_level === 'MEDIUM'
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                        : weatherData.overall_assessment.risk_level === 'HIGH'
                        ? 'bg-orange-900/30 text-orange-400 border border-orange-500/30'
                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    }`}>
                      {weatherData.overall_assessment.risk_level}
                    </span>
                  </div>
                  <div className="text-white text-lg font-semibold">
                    Combined Risk Score: {weatherData.overall_assessment.risk_score.toFixed(1)}/100
                  </div>
                  <div className="text-slate-400 text-sm mt-2">
                    {weatherData.overall_assessment.recommendation}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                {/* Weather Analysis */}
                {weatherData.analyses?.weather && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">🌤️</span>
                      <h4 className="text-white font-medium">Weather Analysis</h4>
                      <div className={`w-2 h-2 rounded-full ${weatherData.analyses.weather.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    {weatherData.analyses.weather.success ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Risk Level:</span>
                          <span className="text-white">{weatherData.analyses.weather.risk_assessment?.risk_level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Temperature:</span>
                          <span className="text-white">{weatherData.analyses.weather.current_weather?.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Risk Score:</span>
                          <span className="text-white">{weatherData.analyses.weather.risk_assessment?.risk_score?.toFixed(1)}/100</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm">
                        {weatherData.analyses.weather.error}
                      </div>
                    )}
                  </div>
                )}

                {/* Crack Segmentation Analysis */}
                {weatherData.analyses?.crack_segmentation && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">🔍</span>
                      <h4 className="text-white font-medium">Crack Analysis</h4>
                      <div className={`w-2 h-2 rounded-full ${weatherData.analyses.crack_segmentation.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    {weatherData.analyses.crack_segmentation.success ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Cracks Found:</span>
                          <span className="text-white">{weatherData.analyses.crack_segmentation.analysis?.total_cracks || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Total Area:</span>
                          <span className="text-white">{weatherData.analyses.crack_segmentation.analysis?.total_crack_area?.toFixed(2) || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">File:</span>
                          <span className="text-white text-xs truncate">{weatherData.analyses.crack_segmentation.filename}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm">
                        {weatherData.analyses.crack_segmentation.error}
                      </div>
                    )}
                  </div>
                )}

                {/* DEM Analysis */}
                {weatherData.analyses?.dem && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">🏔️</span>
                      <h4 className="text-white font-medium">DEM Analysis</h4>
                      <div className={`w-2 h-2 rounded-full ${weatherData.analyses.dem.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    {weatherData.analyses.dem.success ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Max Slope:</span>
                          <span className="text-white">{weatherData.analyses.dem.analysis?.slope_statistics?.max_slope?.toFixed(1) || 0}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Avg Slope:</span>
                          <span className="text-white">{weatherData.analyses.dem.analysis?.slope_statistics?.mean_slope?.toFixed(1) || 0}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">File:</span>
                          <span className="text-white text-xs truncate">{weatherData.analyses.dem.filename}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm">
                        {weatherData.analyses.dem.error}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Combined Recommendations */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Combined Analysis Summary</h4>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• <strong>Weather:</strong> {weatherData.analyses?.weather?.success ? `${weatherData.analyses.weather.risk_assessment?.risk_level} risk conditions` : 'Analysis failed'}</p>
                  <p>• <strong>Structural:</strong> {weatherData.analyses?.crack_segmentation?.success ? `${weatherData.analyses.crack_segmentation.analysis?.total_cracks || 0} cracks detected` : 'Analysis failed'}</p>
                  <p>• <strong>Geological:</strong> {weatherData.analyses?.dem?.success ? `Slopes up to ${weatherData.analyses.dem.analysis?.slope_statistics?.max_slope?.toFixed(1) || 0}°` : 'Analysis failed'}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-600">
                <button
                  onClick={() => setProcessStep('input')}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Back to Form
                </button>
                <button
                  onClick={() => onNext({ ...formData, completeAnalysisData: weatherData })}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Continue to Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInjection;