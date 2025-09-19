// API configuration and service functions for FALCON frontend
const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  siteName: string;
  latitude: string;
  longitude: string;
  mobile: string;
  role: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  siteName: string;
  latitude: string;
  longitude: string;
  mobile: string;
}

interface PredictionData {
  satelliteImage?: File | null;
  demPhoto?: File | null;
  latitude: string;
  longitude: string;
}

interface RiskZone {
  id: number;
  risk: string;
  confidence: number;
  area: string;
  probability: number;
  lastUpdate: string;
}

interface WeatherRiskRequest {
  latitude: number;
  longitude: number;
  site_name?: string;
}

interface WeatherRiskResponse {
  success: boolean;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    site_name: string;
  };
  current_weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    rainfall: number;
    wind_speed: number;
    weather_condition: string;
    weather_description: string;
    visibility: number;
    clouds: number;
  };
  derived_metrics: {
    heat_index: number;
    wind_chill: number;
    comfort_index: number;
  };
  risk_assessment: {
    risk_level: string;
    risk_score: number;
    confidence: number;
    risk_probabilities: Record<string, number>;
    primary_risk_factors: string[];
    recommendations: string[];
  };
  metadata: {
    model_used: string;
    api_source: string;
    processing_time: string;
    model_features: string[];
    model_confidence: number;
  };
  error?: string;
}

interface CompleteAnalysisResponse {
  success: boolean;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    site_name: string;
  };
  analyses: {
    weather?: {
      success: boolean;
      risk_assessment?: {
        risk_level: string;
        risk_score: number;
        confidence: number;
        recommendations: string[];
      };
      current_weather?: {
        temperature: number;
        humidity: number;
        pressure: number;
        rainfall: number;
        wind_speed: number;
      };
      error?: string;
    };
    crack_segmentation?: {
      success: boolean;
      filename?: string;
      analysis?: {
        total_cracks: number;
        total_crack_area: number;
        average_crack_width: number;
        max_crack_length: number;
      };
      error?: string;
    };
    dem?: {
      success: boolean;
      filename?: string;
      analysis?: {
        slope_statistics: {
          max_slope: number;
          mean_slope: number;
          std_slope: number;
        };
        elevation_statistics: {
          max_elevation: number;
          min_elevation: number;
          mean_elevation: number;
        };
      };
      error?: string;
    };
  };
  overall_assessment: {
    risk_level: string;
    risk_score: number;
    contributing_factors: number;
    recommendation: string;
  };
  error?: string;
}

interface PredictionResults {
  overallRisk: string;
  confidence: number;
  zones: RiskZone[];
  timestamp: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Don't set Content-Type for FormData, let browser handle it
      const headers: Record<string, string> = {};
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.user || data.results || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Prediction methods
  async analyzePrediction(data: PredictionData): Promise<ApiResponse<PredictionResults>> {
    // For now, we'll send the data as JSON (file upload can be added later)
    const requestData = {
      latitude: data.latitude,
      longitude: data.longitude,
      // Note: File upload would require FormData and different handling
    };

    return this.request<PredictionResults>('/prediction/analyze', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Monitoring methods
  async getLiveData() {
    return this.request('/monitoring/live-data');
  }

  async getPredictionHistory() {
    return this.request('/prediction/history');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Weather analysis methods
  async analyzeWeatherRisk(data: WeatherRiskRequest): Promise<ApiResponse<WeatherRiskResponse>> {
    return this.request<WeatherRiskResponse>('/weather-analysis/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWeatherStatus(): Promise<ApiResponse<any>> {
    return this.request('/weather-analysis/status');
  }

  async batchWeatherAnalysis(locations: WeatherRiskRequest[]): Promise<ApiResponse<any>> {
    return this.request('/weather-analysis/batch', {
      method: 'POST',
      body: JSON.stringify({ locations }),
    });
  }

  // Crack segmentation analysis
  async analyzeCrackFromUpload(formData: FormData): Promise<ApiResponse<any>> {
    return this.request('/crack-analysis/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // DEM analysis
  async analyzeDEMFromUpload(formData: FormData): Promise<ApiResponse<any>> {
    return this.request('/dem-analysis/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Comprehensive analysis - all models
  async analyzeCompleteData(formData: FormData): Promise<ApiResponse<CompleteAnalysisResponse>> {
    return this.request<CompleteAnalysisResponse>('/prediction/complete-analysis', {
      method: 'POST',
      body: formData,
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  User,
  LoginRequest,
  RegisterRequest,
  PredictionData,
  PredictionResults,
  RiskZone,
  ApiResponse,
  WeatherRiskRequest,
  WeatherRiskResponse,
  CompleteAnalysisResponse,
};