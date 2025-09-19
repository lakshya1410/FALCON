import cv2
import numpy as np
import os
from PIL import Image
import base64
from io import BytesIO
from pathlib import Path
import pickle
import joblib
from scipy import ndimage
from sklearn.preprocessing import StandardScaler
import pandas as pd

class DEMProcessor:
    """
    Digital Elevation Model (DEM) Processor for Geological Risk Assessment
    Analyzes topographic data to assess slope stability and geological hazards
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the DEM processor
        
        Args:
            model_path (str): Path to the trained DEM model file
        """
        if model_path is None:
            current_dir = Path(__file__).parent
            model_path = current_dir / "models" / "DEM.pkl"
        
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        
        # DEM analysis parameters
        self.pixel_size = 1.0  # Default pixel size in meters
        self.min_slope_threshold = 5.0  # Minimum slope for risk consideration (degrees)
        self.high_risk_slope = 30.0  # High risk slope threshold (degrees)
        self.critical_slope = 45.0  # Critical slope threshold (degrees)
        
        # Try to load the model
        self.load_model()
    
    def load_model(self):
        """Load the trained DEM model if available"""
        try:
            if os.path.exists(self.model_path):
                # Try different loading methods
                try:
                    self.model = pickle.load(open(self.model_path, 'rb'))
                    print(f"✅ DEM model loaded successfully from {self.model_path}")
                except Exception as e:
                    print(f"⚠️ Could not load pickled model: {e}")
                    print("📝 Will use built-in DEM analysis algorithms")
                    self.model = None
            else:
                print(f"⚠️ Model file not found at {self.model_path}")
                print("📝 Using built-in DEM analysis algorithms")
                self.model = None
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            print("📝 Falling back to built-in DEM analysis")
            self.model = None
    
    def preprocess_dem_image(self, image_input):
        """
        Preprocess DEM image for analysis
        
        Args:
            image_input: DEM image (file path, PIL Image, or numpy array)
            
        Returns:
            tuple: (elevation_array, original_image)
        """
        try:
            # Handle different input types
            if isinstance(image_input, str):
                # File path
                img = cv2.imread(image_input, cv2.IMREAD_GRAYSCALE)
                if img is None:
                    raise ValueError(f"Could not read image from path: {image_input}")
                pil_img = Image.open(image_input)
            elif isinstance(image_input, Image.Image):
                # PIL Image - convert to grayscale if needed
                if image_input.mode != 'L':
                    img = np.array(image_input.convert('L'))
                    pil_img = image_input.convert('L')
                else:
                    img = np.array(image_input)
                    pil_img = image_input
            elif isinstance(image_input, np.ndarray):
                # Numpy array
                if len(image_input.shape) == 3:
                    img = cv2.cvtColor(image_input, cv2.COLOR_RGB2GRAY)
                else:
                    img = image_input
                pil_img = Image.fromarray(img)
            else:
                raise ValueError("Unsupported image input type")
            
            # Normalize elevation data (assuming 8-bit grayscale represents elevation)
            # Scale to realistic elevation range (0-4000m for example)
            elevation_array = img.astype(np.float32) * (4000.0 / 255.0)
            
            return elevation_array, pil_img
            
        except Exception as e:
            print(f"❌ Error preprocessing DEM image: {str(e)}")
            raise e
    
    def calculate_slope(self, elevation_array):
        """
        Calculate slope from elevation data using gradient analysis
        
        Args:
            elevation_array: 2D numpy array of elevation values
            
        Returns:
            tuple: (slope_degrees, slope_direction)
        """
        try:
            # Calculate gradients in x and y directions
            dy, dx = np.gradient(elevation_array, self.pixel_size)
            
            # Calculate slope magnitude in radians, then convert to degrees
            slope_radians = np.arctan(np.sqrt(dx**2 + dy**2))
            slope_degrees = np.degrees(slope_radians)
            
            # Calculate aspect (slope direction)
            slope_direction = np.degrees(np.arctan2(-dx, dy))
            slope_direction = (slope_direction + 360) % 360  # Normalize to 0-360
            
            return slope_degrees, slope_direction
            
        except Exception as e:
            print(f"❌ Error calculating slope: {str(e)}")
            raise e
    
    def calculate_curvature(self, elevation_array):
        """
        Calculate surface curvature for stability analysis
        
        Args:
            elevation_array: 2D numpy array of elevation values
            
        Returns:
            dict: Contains profile_curvature, plan_curvature, and mean_curvature
        """
        try:
            # Calculate second derivatives
            dy, dx = np.gradient(elevation_array)
            dxx, dxy = np.gradient(dx)
            dyx, dyy = np.gradient(dy)
            
            # Calculate curvatures
            dxx2 = dxx * dxx
            dyy2 = dyy * dyy
            dxy2 = dxy * dxy
            
            # Plan curvature (horizontal curvature)
            denominator = (1 + dxx2 + dyy2)
            plan_curvature = np.divide(
                (dyy * dxx2 + dxx * dyy2 - 2 * dxy * dx * dy),
                denominator**1.5,
                out=np.zeros_like(denominator),
                where=denominator != 0
            )
            
            # Profile curvature (vertical curvature)  
            profile_curvature = np.divide(
                (dxx * dxx2 + 2 * dxy * dx * dy + dyy * dyy2),
                denominator**1.5,
                out=np.zeros_like(denominator),
                where=denominator != 0
            )
            
            # Mean curvature
            mean_curvature = (plan_curvature + profile_curvature) / 2
            
            return {
                'plan_curvature': plan_curvature,
                'profile_curvature': profile_curvature,
                'mean_curvature': mean_curvature
            }
            
        except Exception as e:
            print(f"❌ Error calculating curvature: {str(e)}")
            return {
                'plan_curvature': np.zeros_like(elevation_array),
                'profile_curvature': np.zeros_like(elevation_array), 
                'mean_curvature': np.zeros_like(elevation_array)
            }
    
    def extract_features(self, elevation_array, slope_degrees, slope_direction, curvature_data):
        """
        Extract features for risk assessment
        
        Returns:
            dict: Feature dictionary for analysis
        """
        try:
            features = {}
            
            # Basic elevation statistics
            features['elevation_mean'] = np.mean(elevation_array)
            features['elevation_std'] = np.std(elevation_array)
            features['elevation_min'] = np.min(elevation_array)
            features['elevation_max'] = np.max(elevation_array)
            features['elevation_range'] = features['elevation_max'] - features['elevation_min']
            
            # Slope statistics
            features['slope_mean'] = np.mean(slope_degrees)
            features['slope_std'] = np.std(slope_degrees)
            features['slope_max'] = np.max(slope_degrees)
            features['slope_90th_percentile'] = np.percentile(slope_degrees, 90)
            
            # High slope area percentage
            high_slope_mask = slope_degrees > self.high_risk_slope
            features['high_slope_percentage'] = np.sum(high_slope_mask) / slope_degrees.size * 100
            
            # Critical slope area percentage  
            critical_slope_mask = slope_degrees > self.critical_slope
            features['critical_slope_percentage'] = np.sum(critical_slope_mask) / slope_degrees.size * 100
            
            # Curvature statistics
            features['mean_curvature_avg'] = np.mean(curvature_data['mean_curvature'])
            features['plan_curvature_std'] = np.std(curvature_data['plan_curvature'])
            features['profile_curvature_std'] = np.std(curvature_data['profile_curvature'])
            
            # Roughness (terrain complexity)
            features['terrain_roughness'] = np.std(slope_degrees) / np.mean(slope_degrees) if np.mean(slope_degrees) > 0 else 0
            
            # Aspect variability (slope direction consistency)
            features['aspect_variability'] = np.std(slope_direction)
            
            return features
            
        except Exception as e:
            print(f"❌ Error extracting features: {str(e)}")
            raise e
    
    def calculate_risk_score(self, features, slope_degrees):
        """
        Calculate geological risk score based on DEM analysis
        
        Args:
            features: Dictionary of extracted features
            slope_degrees: 2D array of slope values
            
        Returns:
            dict: Risk assessment results
        """
        try:
            # If trained model is available, use it
            if self.model is not None:
                try:
                    # Prepare feature vector for model prediction
                    feature_vector = np.array([
                        features['slope_mean'],
                        features['slope_max'], 
                        features['high_slope_percentage'],
                        features['critical_slope_percentage'],
                        features['elevation_range'],
                        features['terrain_roughness'],
                        features['mean_curvature_avg']
                    ]).reshape(1, -1)
                    
                    # Make prediction (assuming model returns risk probability)
                    risk_probability = self.model.predict_proba(feature_vector).flatten()
                    risk_score = risk_probability[1] * 100 if len(risk_probability) > 1 else risk_probability[0] * 100
                    
                except Exception as e:
                    print(f"⚠️ Model prediction failed: {e}, using rule-based approach")
                    risk_score = None
            else:
                risk_score = None
            
            # Fallback to rule-based risk assessment
            if risk_score is None:
                risk_score = self._rule_based_risk_assessment(features, slope_degrees)
            
            # Determine risk level and color
            if risk_score < 30:
                risk_level = "Low"
                risk_color = "green"
            elif risk_score < 60:
                risk_level = "Medium" 
                risk_color = "orange"
            else:
                risk_level = "High"
                risk_color = "red"
            
            # Calculate additional metrics
            total_pixels = slope_degrees.size
            high_risk_pixels = np.sum(slope_degrees > self.high_risk_slope)
            critical_pixels = np.sum(slope_degrees > self.critical_slope)
            
            return {
                'risk_level': risk_level,
                'risk_color': risk_color,
                'risk_score': float(round(float(risk_score), 2)),
                'high_slope_percentage': float(round(features['high_slope_percentage'], 2)),
                'critical_slope_percentage': float(round(features['critical_slope_percentage'], 2)),
                'max_slope': float(round(features['slope_max'], 2)),
                'mean_slope': float(round(features['slope_mean'], 2)),
                'elevation_range': float(round(features['elevation_range'], 2)),
                'terrain_roughness': float(round(features['terrain_roughness'], 3)),
                'total_pixels': int(total_pixels),
                'high_risk_pixels': int(high_risk_pixels),
                'critical_pixels': int(critical_pixels)
            }
            
        except Exception as e:
            print(f"❌ Error calculating risk score: {str(e)}")
            raise e
    
    def _rule_based_risk_assessment(self, features, slope_degrees):
        """
        Rule-based risk assessment when model is not available
        """
        risk_score = 0
        
        # Slope-based risk (40% weight)
        slope_risk = min(features['slope_max'] / self.critical_slope * 40, 40)
        risk_score += slope_risk
        
        # High slope area percentage (25% weight)
        area_risk = min(features['high_slope_percentage'] / 20 * 25, 25)
        risk_score += area_risk
        
        # Critical slope percentage (20% weight) 
        critical_risk = min(features['critical_slope_percentage'] / 10 * 20, 20)
        risk_score += critical_risk
        
        # Terrain complexity (10% weight)
        complexity_risk = min(features['terrain_roughness'] * 10, 10)
        risk_score += complexity_risk
        
        # Elevation range (5% weight)
        elevation_risk = min(features['elevation_range'] / 2000 * 5, 5)
        risk_score += elevation_risk
        
        return min(risk_score, 100)  # Cap at 100
    
    def create_risk_visualization(self, original_image, slope_degrees, elevation_array):
        """
        Create visualization showing risk areas on the DEM
        
        Returns:
            numpy.ndarray: Colored risk overlay image
        """
        try:
            # Convert original to RGB if grayscale
            if len(original_image.shape) == 2:
                base_img = cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
            else:
                base_img = original_image.copy()
            
            # Create risk mask based on slope
            low_risk_mask = slope_degrees < self.min_slope_threshold
            medium_risk_mask = (slope_degrees >= self.min_slope_threshold) & (slope_degrees < self.high_risk_slope)
            high_risk_mask = (slope_degrees >= self.high_risk_slope) & (slope_degrees < self.critical_slope)
            critical_risk_mask = slope_degrees >= self.critical_slope
            
            # Apply color coding
            overlay = base_img.copy()
            overlay[low_risk_mask] = [0, 255, 0]      # Green for low risk
            overlay[medium_risk_mask] = [255, 255, 0]  # Yellow for medium risk  
            overlay[high_risk_mask] = [255, 165, 0]    # Orange for high risk
            overlay[critical_risk_mask] = [255, 0, 0]  # Red for critical risk
            
            # Blend with original image
            alpha = 0.4
            risk_visualization = cv2.addWeighted(overlay, alpha, base_img, 1 - alpha, 0)
            
            return risk_visualization
            
        except Exception as e:
            print(f"❌ Error creating risk visualization: {str(e)}")
            # Return original image if visualization fails
            if len(original_image.shape) == 2:
                return cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
            return original_image
    
    def image_to_base64(self, image_array):
        """Convert numpy image array to base64 string"""
        try:
            if image_array.dtype != np.uint8:
                # Normalize to 0-255 range
                image_array = ((image_array - image_array.min()) / 
                              (image_array.max() - image_array.min()) * 255).astype(np.uint8)
            
            pil_image = Image.fromarray(image_array)
            buffer = BytesIO()
            pil_image.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            print(f"❌ Error converting image to base64: {str(e)}")
            raise e
    
    def process_dem_image(self, image_input):
        """
        Complete pipeline: Process DEM image and return risk analysis
        
        Args:
            image_input: DEM image input (file path, PIL Image, or numpy array)
            
        Returns:
            dict: Complete DEM analysis results
        """
        try:
            # Step 1: Preprocess DEM image
            elevation_array, original_img = self.preprocess_dem_image(image_input)
            
            # Step 2: Calculate slope and aspect
            slope_degrees, slope_direction = self.calculate_slope(elevation_array)
            
            # Step 3: Calculate curvature
            curvature_data = self.calculate_curvature(elevation_array)
            
            # Step 4: Extract features
            features = self.extract_features(elevation_array, slope_degrees, slope_direction, curvature_data)
            
            # Step 5: Calculate risk assessment
            risk_assessment = self.calculate_risk_score(features, slope_degrees)
            
            # Step 6: Create risk visualization
            risk_viz = self.create_risk_visualization(np.array(original_img), slope_degrees, elevation_array)
            
            # Step 7: Convert images to base64
            original_b64 = self.image_to_base64(np.array(original_img))
            risk_viz_b64 = self.image_to_base64(risk_viz)
            slope_viz_b64 = self.image_to_base64(slope_degrees)
            
            # Compile results
            result = {
                "success": True,
                "risk_assessment": risk_assessment,
                "terrain_analysis": {
                    "elevation_stats": {
                        "mean": float(round(features['elevation_mean'], 2)),
                        "max": float(round(features['elevation_max'], 2)),
                        "min": float(round(features['elevation_min'], 2)),
                        "range": float(round(features['elevation_range'], 2))
                    },
                    "slope_stats": {
                        "mean": float(round(features['slope_mean'], 2)),
                        "max": float(round(features['slope_max'], 2)),
                        "std": float(round(features['slope_std'], 2))
                    },
                    "terrain_complexity": float(round(features['terrain_roughness'], 3))
                },
                "images": {
                    "original": original_b64,
                    "risk_overlay": risk_viz_b64,
                    "slope_analysis": slope_viz_b64
                },
                "metadata": {
                    "model_used": "DEM Analysis Model" if self.model else "Rule-based Analysis",
                    "image_size": f"{elevation_array.shape[1]}x{elevation_array.shape[0]}",
                    "processing_complete": True,
                    "pixel_size_meters": self.pixel_size
                }
            }
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "risk_assessment": None,
                "terrain_analysis": None,
                "images": None,
                "metadata": {"processing_complete": False}
            }

# Initialize global processor instance
dem_processor = None

def get_dem_processor():
    """Get or create the global DEM processor instance"""
    global dem_processor
    if dem_processor is None:
        dem_processor = DEMProcessor()
    return dem_processor