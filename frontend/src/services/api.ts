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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
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
};