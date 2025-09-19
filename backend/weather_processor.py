#!/usr/bin/env python3
"""
Weather Risk Assessment Processor for FALCON System
"""

import os
import logging
import requests
import joblib
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    # Load .env file from the same directory as this script
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(env_path)
except ImportError:
    # If python-dotenv is not available, continue without it
    pass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeatherProcessor:
    """
    Weather-based risk assessment processor using OpenWeather API
    and trained machine learning pipeline
    """
    
    def __init__(self):
        self.model_path = "weather_pipeline.pkl"
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.pipeline = None
        self.features = [
            'latitude', 'longitude', 'temperature', 'humidity', 
            'pressure', 'rainfall', 'wind_speed'
        ]
        self.risk_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        self.load_model()
    
    def load_model(self) -> bool:
        """Load the trained weather pipeline model"""
        try:
            if os.path.exists(self.model_path):
                self.pipeline = joblib.load(self.model_path)
                logger.info(f"✅ Weather pipeline loaded from {self.model_path}")
                return True
            else:
                logger.warning(f"⚠️ Weather pipeline model not found at {self.model_path}")
                return False
        except Exception as e:
            logger.error(f"❌ Error loading weather pipeline: {e}")
            return False
    
    def fetch_weather_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch current weather data from OpenWeather API
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Dictionary containing weather data
        """
        if not self.api_key:
            raise ValueError("OpenWeather API key not configured. Please set OPENWEATHER_API_KEY environment variable.")
        
        # OpenWeather API endpoint
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': self.api_key,
            'units': 'metric'  # Use metric units (Celsius, m/s, etc.)
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract and structure weather data
            weather_data = {
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                "latitude": latitude,
                "longitude": longitude,
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "rainfall": data.get("rain", {}).get("1h", 0.0),  # 1-hour rainfall in mm
                "wind_speed": data["wind"]["speed"],
                "weather_condition": data["weather"][0]["main"],
                "weather_description": data["weather"][0]["description"],
                "visibility": data.get("visibility", 10000),  # Visibility in meters
                "clouds": data.get("clouds", {}).get("all", 0),  # Cloud coverage %
                "location_name": data.get("name", "Unknown")
            }
            
            logger.info(f"✅ Weather data fetched for coordinates ({latitude}, {longitude})")
            return weather_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API request failed: {e}")
            raise Exception(f"Failed to fetch weather data: {e}")
        except KeyError as e:
            logger.error(f"❌ Unexpected API response format: {e}")
            raise Exception(f"Invalid weather data format: {e}")
    
    def calculate_derived_features(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add basic derived features to weather data"""
        enhanced_data = weather_data.copy()
        
        # Add simple derived metrics
        temp = weather_data['temperature']
        humidity = weather_data['humidity']
        
        enhanced_data.update({
            'heat_index': temp + (humidity - 50) * 0.1,  # Simplified heat index
            'wind_chill': temp - weather_data['wind_speed'] * 0.5,  # Simplified wind chill
            'comfort_index': 100 - abs(temp - 25) * 2 - abs(humidity - 50) * 0.5
        })
        
        return enhanced_data
    
    def predict_weather_risk(self, latitude: float, longitude: float, 
                           site_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Predict weather-based geological risk for given coordinates
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            site_name: Optional site name for identification
            
        Returns:
            Complete weather risk assessment
        """
        try:
            # Fetch current weather data
            weather_data = self.fetch_weather_data(latitude, longitude)
            
            # Calculate derived features
            enhanced_data = self.calculate_derived_features(weather_data)
            
            # Prepare features for model prediction
            feature_data = {feature: enhanced_data[feature] for feature in self.features}
            X_new = pd.DataFrame([feature_data])
            
            # Require ML model for predictions
            if not self.pipeline:
                raise ValueError("Weather pipeline model not loaded. Cannot make predictions without ML model.")
            
            # Make prediction using ML model
            risk_prediction = self.pipeline.predict(X_new)[0]
            risk_probabilities = self.pipeline.predict_proba(X_new)[0]
            
            # Create probability mapping
            prob_mapping = {
                level: float(prob) for level, prob in zip(self.risk_levels, risk_probabilities)
            }
            
            predicted_risk_level = self.risk_levels[risk_prediction]
            confidence_score = float(max(risk_probabilities))
            
            logger.info(f"✅ Weather risk prediction completed using ML model: {predicted_risk_level}")
            logger.info(f"   Confidence: {confidence_score:.3f}")
            logger.info(f"   Probabilities: {prob_mapping}")
            
            # Calculate overall risk score (0-100) based on ML model probabilities
            risk_score = self._calculate_ml_risk_score(prob_mapping, predicted_risk_level)
            
            return {
                "success": True,
                "timestamp": enhanced_data["timestamp"],
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "site_name": site_name or enhanced_data.get("location_name", "Unknown"),
                },
                "current_weather": {
                    "temperature": enhanced_data["temperature"],
                    "humidity": enhanced_data["humidity"],
                    "pressure": enhanced_data["pressure"],
                    "rainfall": enhanced_data["rainfall"],
                    "wind_speed": enhanced_data["wind_speed"],
                    "weather_condition": enhanced_data["weather_condition"],
                    "weather_description": enhanced_data["weather_description"],
                    "visibility": enhanced_data["visibility"],
                    "clouds": enhanced_data["clouds"]
                },
                "derived_metrics": {
                    "heat_index": enhanced_data["heat_index"],
                    "wind_chill": enhanced_data["wind_chill"],
                    "comfort_index": enhanced_data["comfort_index"]
                },
                "risk_assessment": {
                    "risk_level": predicted_risk_level,
                    "risk_score": risk_score,
                    "confidence": confidence_score,
                    "risk_probabilities": prob_mapping,
                    "primary_risk_factors": self._identify_risk_factors(enhanced_data),
                    "recommendations": self._generate_recommendations(predicted_risk_level, enhanced_data)
                },
                "metadata": {
                    "model_used": "weather_pipeline.pkl",
                    "api_source": "OpenWeatherMap",
                    "processing_time": datetime.now(timezone.utc).isoformat(),
                    "model_features": self.features,
                    "model_confidence": confidence_score
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Weather risk prediction failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    def _calculate_ml_risk_score(self, prob_mapping: Dict[str, float], risk_level: str) -> float:
        """
        Calculate numerical risk score (0-100) based on ML model probabilities
        
        Args:
            prob_mapping: Model probability distribution across risk levels
            risk_level: Predicted risk level
            
        Returns:
            Risk score from 0-100
        """
        # Base scores for each risk level
        level_scores = {"LOW": 20, "MEDIUM": 50, "HIGH": 75, "CRITICAL": 95}
        
        # Calculate weighted risk score using probabilities
        weighted_score = sum(
            prob_mapping.get(level, 0) * level_scores[level] 
            for level in self.risk_levels
        )
        
        # Ensure score is within bounds
        risk_score = max(0, min(100, weighted_score))
        
        logger.info(f"   ML Risk Score calculation:")
        logger.info(f"   - Weighted Score: {weighted_score:.1f}")
        logger.info(f"   - Final Score: {risk_score:.1f}")
        
        return float(risk_score)
    

    
    def _identify_risk_factors(self, weather_data: Dict[str, Any]) -> List[str]:
        """Identify primary risk factors from weather conditions"""
        factors = []
        
        if weather_data['temperature'] < 0:
            factors.append("Freezing temperatures")
        elif weather_data['temperature'] > 35:
            factors.append("Extreme heat")
        
        if weather_data['rainfall'] > 10:
            factors.append("Heavy rainfall")
        elif weather_data['rainfall'] > 5:
            factors.append("Moderate rainfall")
        
        if weather_data['wind_speed'] > 15:
            factors.append("Strong winds")
        elif weather_data['wind_speed'] > 10:
            factors.append("Fresh winds")
        
        if weather_data['humidity'] > 80:
            factors.append("High humidity")
        
        if weather_data['pressure'] < 995:
            factors.append("Low atmospheric pressure")
        
        if weather_data.get('comfort_index', 50) < 30:
            factors.append("Poor comfort conditions")
        
        if not factors:
            factors.append("Normal weather conditions")
        
        return factors
    
    def _generate_recommendations(self, risk_level: str, weather_data: Dict[str, Any]) -> List[str]:
        """Generate safety recommendations based on risk level and conditions"""
        recommendations = []
        
        if risk_level in ["HIGH", "CRITICAL"]:
            recommendations.append("Avoid outdoor geological survey activities")
            recommendations.append("Monitor weather conditions closely")
            recommendations.append("Ensure emergency protocols are in place")
        
        if weather_data['rainfall'] > 5:
            recommendations.append("Risk of landslides and rockfall increased due to rainfall")
            recommendations.append("Check slope stability before field work")
        
        if weather_data['wind_speed'] > 10:
            recommendations.append("Strong winds may affect equipment stability")
            recommendations.append("Secure all field equipment properly")
        
        if weather_data['temperature'] < 0:
            recommendations.append("Freezing conditions may affect rock stability")
            recommendations.append("Use appropriate cold weather safety gear")
        
        if weather_data['visibility'] < 5000:
            recommendations.append("Reduced visibility conditions - exercise caution")
        
        if risk_level == "LOW":
            recommendations.append("Weather conditions are favorable for field work")
            recommendations.append("Continue with normal safety protocols")
        
        return recommendations
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of weather processor"""
        return {
            "service_available": True,
            "model_loaded": self.pipeline is not None,
            "model_required": True,  # Indicates ML model is required for predictions
            "model_path": self.model_path,
            "api_key_configured": self.api_key is not None,
            "supported_features": self.features,
            "risk_levels": self.risk_levels,
            "prediction_method": "ML_ONLY",  # No rule-based fallback
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

# Global instance
weather_processor = WeatherProcessor()