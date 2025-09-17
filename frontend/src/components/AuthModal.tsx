import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import * as auth from '../lib/completeAuth';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    siteName: '',
    latitude: '',
    longitude: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  // Test account credentials
  const testAccountData = {
    id: 'test-user-123',
    email: 'test@falcon.com',
    fullName: 'Test User',
    siteName: 'Demo Mine Site',
    latitude: '26.0',
    longitude: '15.0',
    mobile: '+918960464789',
    role: 'operator'
  };

  // Handle test account login
  const handleTestAccount = async () => {
    console.log('🧪 Using test account');
    setIsLoading(true);
    
    try {
      // Save test account to localStorage like a real login
      localStorage.setItem('falcon_current_user', JSON.stringify(testAccountData));
      
      // Simulate a brief loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Test account login successful');
      onLogin(testAccountData);
      onClose();
    } catch (error) {
      console.error('❌ Test account login failed:', error);
      setErrors({ general: 'Test account login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear errors when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setNeedsEmailConfirmation(false);
      setResendingEmail(false);
      setFormData({
        fullName: '',
        siteName: '',
        latitude: '',
        longitude: '',
        email: '',
        mobile: '',
        password: ''
      });
      
      // Simple auth - no complex connection testing needed
      console.log('AuthModal opened - using simplified Firebase Auth');
    }
  }, [isOpen, mode]);



  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCoordinate = (value: string, type: 'lat' | 'lng') => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (type === 'lat') return num >= -90 && num <= 90;
    return num >= -180 && num <= 180;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!validateCoordinate(formData.latitude, 'lat')) {
        newErrors.latitude = 'Valid latitude (-90 to 90) is required';
      }
      if (!validateCoordinate(formData.longitude, 'lng')) {
        newErrors.longitude = 'Valid longitude (-180 to 180) is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setErrors({});
    
    // Create a timeout wrapper for authentication operations
    const withTimeout = (promise: Promise<any>, timeoutMs: number = 15000): Promise<any> => {
      return Promise.race([
        promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out. Please check your internet connection and try again.')), timeoutMs)
        )
      ]);
    };
    
    try {
      if (mode === 'register') {
        console.log('Starting registration for:', formData.email);
        console.log('Form data:', {
          email: formData.email,
          fullName: formData.fullName,
          siteName: formData.siteName,
          latitude: formData.latitude,
          longitude: formData.longitude,
          mobile: formData.mobile
        });
        
        const { data, error } = await withTimeout(
          auth.register(
            formData.email,
            formData.password,
            {
              fullName: formData.fullName,
              siteName: formData.siteName,
              latitude: formData.latitude,
              longitude: formData.longitude,
              mobile: formData.mobile
            }
          )
        );

        if (error) {
          console.error('Registration error:', error);
          setErrors({ general: error.message });
          return;
        }

        if (data?.user) {
          console.log('Registration successful for:', data.user.email);
          // User is registered successfully - login directly
          onLogin(data.user);
          onClose();
        }
      } else {
        // Login mode
        console.log('Starting login for:', formData.email);
        const { data, error } = await withTimeout(
          auth.login(
            formData.email,
            formData.password
          )
        );

        if (error) {
          console.error('Login error:', error);
          // Handle specific error cases
          if (error.message.includes('Invalid login credentials') || 
              error.message.includes('No account found with this email') ||
              error.message.includes('Incorrect password') ||
              error.message.includes('auth/user-not-found') ||
              error.message.includes('auth/wrong-password') ||
              error.message.includes('auth/invalid-credential')) {
            setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
          } else if (error.message.includes('Email not confirmed')) {
            setNeedsEmailConfirmation(true);
            setErrors({ general: 'Please confirm your email address first. Check your inbox for the confirmation link.' });
          } else if (error.message.includes('Too many requests') || 
                     error.message.includes('auth/too-many-requests')) {
            setErrors({ general: 'Too many login attempts. Please wait a moment and try again.' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }

        if (data?.user) {
          console.log('Login successful for:', data.user.email);
          console.log('User data:', data.user);
          // User is authenticated - use the user data directly
          onLogin(data.user);
          onClose();
        } else {
          console.error('Login failed - no user data returned:', data);
          setErrors({ general: 'Login failed. Please try again.' });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      if (errorMessage.includes('timed out')) {
        setErrors({ general: 'Request timed out. Please check your internet connection and try again.' });
      } else if (errorMessage.includes('network')) {
        setErrors({ general: 'Network error. Please check your internet connection.' });
      } else if (errorMessage.includes('Firebase')) {
        setErrors({ general: 'Firebase service error. Please try again later.' });
      } else if (errorMessage.includes('auth/network-request-failed')) {
        setErrors({ general: 'Network request failed. Please check your internet connection.' });
      } else {
        setErrors({ general: 'Authentication failed. Please check your credentials and try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) return;
    
    setResendingEmail(true);
    try {
      const { error } = await auth.resendConfirmation(formData.email);
      if (error) {
        setErrors({ general: (error as any)?.message || 'Failed to resend confirmation email' });
      } else {
        setErrors({ general: 'Confirmation email sent! Please check your inbox.' });
      }
    } catch (error: any) {
      setErrors({ general: 'Failed to resend confirmation email. Please try again.' });
    } finally {
      setResendingEmail(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl border border-gradient-to-r from-purple-500/30 via-blue-500/30 to-orange-500/30 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 transform animate-slideUp">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src="/falcon-logo.png" 
                  alt="FALCON Logo" 
                  className="w-10 h-10 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                {mode === 'login' ? 'Mine Operator Login' : 'Create Account'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="group p-3 text-slate-400 hover:text-white rounded-xl hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-300 transform hover:scale-110"
            >
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Mitchell"
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                    Mine Site Name *
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Falcon Ridge Mine Site Alpha"
                  />
                  {errors.siteName && <p className="text-red-400 text-sm mt-1">{errors.siteName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                      Latitude *
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="16.3"
                    />
                    {errors.latitude && <p className="text-red-400 text-sm mt-1">{errors.latitude}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                      Longitude *
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="80.43"
                    />
                    {errors.longitude && <p className="text-red-400 text-sm mt-1">{errors.longitude}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91-9876543210"
                  />
                  {errors.mobile && <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-body font-medium text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-body font-medium transition-colors duration-200"
            >
              {isLoading 
                ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'login' ? 'Sign In to FALCON' : 'Create Account')
              }
            </button>
          </form>

          {/* Test Account Button - Only show in login mode */}
          {mode === 'login' && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleTestAccount}
                disabled={isLoading}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg font-body font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                title="Login with predefined test credentials"
              >
                <span>🧪</span>
                <span>Use Test Account</span>
              </button>
              
              <div className="text-xs text-slate-500 text-center mt-2 space-y-1">
                <p>Quick access with demo credentials</p>
                <p className="text-slate-600">• Test User • Demo Mine Site •</p>
              </div>
            </div>
          )}

          {needsEmailConfirmation && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-600/30 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-blue-300 text-sm font-medium">Email Confirmation Required</p>
              </div>
              <p className="text-blue-200 text-xs mb-3">
                After clicking the confirmation link in your email, return here and sign in with your credentials.
              </p>
              <button
                onClick={handleResendConfirmation}
                disabled={resendingEmail}
                className="text-blue-400 hover:text-blue-300 text-sm underline disabled:opacity-50"
              >
                {resendingEmail ? 'Sending...' : 'Resend confirmation email'}
              </button>
            </div>
          )}




        </div>
      </div>
    </div>
  );
};

export default AuthModal;