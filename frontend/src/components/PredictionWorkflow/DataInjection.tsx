import React, { useState } from 'react';
import { Upload, MapPin, Image, Mountain, CheckCircle, AlertCircle } from 'lucide-react';

interface DataInjectionProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const DataInjection: React.FC<DataInjectionProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    satelliteImage: null as File | null,
    demPhoto: null as File | null,
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.satelliteImage) {
      newErrors.satelliteImage = 'Satellite image is required';
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

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
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
                  title="Satellite Image"
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
                  disabled={!formData.satelliteImage || !formData.demPhoto || !formData.latitude || !formData.longitude}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 text-sm font-body"
                >
                  Process Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInjection;