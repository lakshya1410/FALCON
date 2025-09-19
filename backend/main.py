from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import datetime
from pathlib import Path
import base64
from io import BytesIO
from PIL import Image
import numpy as np

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    import os
    # Load .env file from the same directory as this script
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(env_path)
except ImportError:
    # If python-dotenv is not available, continue without it
    pass

# Import crack segmentation processor
try:
    from crack_segmentation import get_crack_processor
    CRACK_SEGMENTATION_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Crack segmentation not available: {e}")
    CRACK_SEGMENTATION_AVAILABLE = False

# Import DEM processor
try:
    from dem_processor import get_dem_processor
    DEM_PROCESSING_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ DEM processing not available: {e}")
    DEM_PROCESSING_AVAILABLE = False

# Import weather processor
try:
    from weather_processor import weather_processor
    WEATHER_ANALYSIS_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Weather analysis not available: {e}")
    WEATHER_ANALYSIS_AVAILABLE = False

app = FastAPI(title="FALCON API", description="FastAPI backend for FALCON geological monitoring system", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class User(BaseModel):
    id: str
    email: str
    fullName: str
    siteName: str
    latitude: str
    longitude: str
    mobile: str
    role: str = "operator"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    fullName: str
    siteName: str
    latitude: str
    longitude: str
    mobile: str

class PredictionData(BaseModel):
    satelliteImage: Optional[str] = None
    demPhoto: Optional[str] = None
    latitude: str
    longitude: str

class RiskZone(BaseModel):
    id: int
    risk: str
    confidence: int
    area: str
    probability: int
    lastUpdate: str

class PredictionResults(BaseModel):
    overallRisk: str
    confidence: int
    zones: List[RiskZone]
    timestamp: str

# Crack Segmentation Models
class CrackAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    site_name: Optional[str] = None

class RiskAssessment(BaseModel):
    risk_level: str
    risk_color: str
    risk_score: float
    crack_density_percent: float
    total_pixels: int
    crack_pixels: int

class CrackAnalysisResponse(BaseModel):
    success: bool
    risk_assessment: Optional[RiskAssessment] = None
    images: Optional[dict] = None
    metadata: Optional[dict] = None
    error: Optional[str] = None

# DEM Analysis Models
class DEMAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    site_name: Optional[str] = None
    pixel_size_meters: Optional[float] = 1.0

class TerrainStats(BaseModel):
    elevation_stats: dict
    slope_stats: dict
    terrain_complexity: float

class DEMRiskAssessment(BaseModel):
    risk_level: str
    risk_color: str
    risk_score: float
    high_slope_percentage: float
    critical_slope_percentage: float
    max_slope: float
    mean_slope: float
    elevation_range: float
    terrain_roughness: float
    total_pixels: int
    high_risk_pixels: int
    critical_pixels: int

class DEMAnalysisResponse(BaseModel):
    success: bool
    risk_assessment: Optional[DEMRiskAssessment] = None
    terrain_analysis: Optional[TerrainStats] = None
    images: Optional[dict] = None
    metadata: Optional[dict] = None
    error: Optional[str] = None

# Weather Analysis Models
class WeatherAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    site_name: Optional[str] = None

class WeatherRiskAssessment(BaseModel):
    risk_level: str
    risk_score: float
    confidence: float
    risk_probabilities: dict
    primary_risk_factors: List[str]
    recommendations: List[str]

class CurrentWeather(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    rainfall: float
    wind_speed: float
    weather_condition: str
    weather_description: str
    visibility: float
    clouds: float

class DerivedMetrics(BaseModel):
    heat_index: float
    wind_chill: float
    pressure_trend: str
    rainfall_intensity: str
    wind_category: str
    comfort_index: float

class WeatherLocation(BaseModel):
    latitude: float
    longitude: float
    site_name: str

class WeatherMetadata(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    model_used: str
    api_source: str
    processing_time: str

class WeatherAnalysisResponse(BaseModel):
    success: bool
    timestamp: Optional[str] = None
    location: Optional[WeatherLocation] = None
    current_weather: Optional[CurrentWeather] = None
    derived_metrics: Optional[DerivedMetrics] = None
    risk_assessment: Optional[WeatherRiskAssessment] = None
    metadata: Optional[WeatherMetadata] = None
    error: Optional[str] = None

# In-memory storage (replace with database in production)
users_db = {}
prediction_results_db = {}

# Test user data
test_user = User(
    id="test-user-123",
    email="test@falcon.com",
    fullName="Test User",
    siteName="Demo Mine Site",
    latitude="26.0",
    longitude="15.0",
    mobile="+918960464789",
    role="operator"
)

@app.get("/")
async def root():
    return {"message": "FALCON API is running", "version": "1.0.0"}

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """User login endpoint"""
    # Test account login
    if login_data.email == "test@falcon.com" and login_data.password == "test123":
        return {
            "success": True,
            "user": test_user.dict(),
            "message": "Login successful"
        }
    
    # Check registered users
    user_key = login_data.email.lower()
    if user_key in users_db:
        stored_user = users_db[user_key]
        if stored_user["password"] == login_data.password:
            user_data = {k: v for k, v in stored_user.items() if k != "password"}
            return {
                "success": True,
                "user": user_data,
                "message": "Login successful"
            }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/register")
async def register(register_data: RegisterRequest):
    """User registration endpoint"""
    user_key = register_data.email.lower()
    
    # Check if user already exists
    if user_key in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    new_user = {
        "id": f"user-{len(users_db) + 1}",
        "email": register_data.email,
        "fullName": register_data.fullName,
        "siteName": register_data.siteName,
        "latitude": register_data.latitude,
        "longitude": register_data.longitude,
        "mobile": register_data.mobile,
        "role": "operator",
        "password": register_data.password  # In production, hash this password
    }
    
    users_db[user_key] = new_user
    
    # Return user data without password
    user_data = {k: v for k, v in new_user.items() if k != "password"}
    
    return {
        "success": True,
        "user": user_data,
        "message": "Registration successful"
    }

@app.post("/api/prediction/analyze")
async def analyze_geological_data(prediction_data: PredictionData):
    """Process geological data and return risk analysis"""
    
    # Simulate AI processing time
    import time
    time.sleep(2)  # Simulate processing
    
    # Generate mock prediction results
    results = PredictionResults(
        overallRisk="High",
        confidence=87,
        zones=[
            RiskZone(
                id=1,
                risk="Critical",
                confidence=94,
                area="North Face - Zone A",
                probability=94,
                lastUpdate="2 min ago"
            ),
            RiskZone(
                id=2,
                risk="High",
                confidence=82,
                area="East Ridge - Zone C",
                probability=78,
                lastUpdate="5 min ago"
            ),
            RiskZone(
                id=3,
                risk="Medium",
                confidence=65,
                area="South Valley - Zone B",
                probability=45,
                lastUpdate="10 min ago"
            )
        ],
        timestamp=datetime.datetime.now().isoformat()
    )
    
    # Store results (in production, save to database)
    prediction_results_db[prediction_data.latitude + "," + prediction_data.longitude] = results.dict()
    
    return {
        "success": True,
        "results": results.dict(),
        "message": "Analysis completed successfully"
    }

@app.post("/api/prediction/complete-analysis")
async def complete_analysis(
    satellite_image: UploadFile = File(...),
    dem_image: UploadFile = File(...),
    latitude: str = Form(...),
    longitude: str = Form(...),
    site_name: Optional[str] = Form(None)
):
    """
    Comprehensive analysis using all three models:
    1. Weather risk analysis
    2. Crack segmentation from satellite image  
    3. DEM geological analysis
    """
    results = {
        "success": True,
        "timestamp": datetime.datetime.now().isoformat(),
        "location": {
            "latitude": float(latitude),
            "longitude": float(longitude),
            "site_name": site_name or f"Location {latitude}, {longitude}"
        },
        "analyses": {}
    }
    
    try:
        # 1. Weather Risk Analysis
        try:
            from weather_processor import weather_processor
            weather_result = weather_processor.predict_weather_risk(
                latitude=float(latitude),
                longitude=float(longitude),
                site_name=site_name
            )
            results["analyses"]["weather"] = weather_result
        except Exception as e:
            results["analyses"]["weather"] = {
                "success": False,
                "error": f"Weather analysis failed: {str(e)}"
            }

        # 2. Crack Segmentation Analysis
        try:
            if CRACK_SEGMENTATION_AVAILABLE:
                # Read uploaded satellite image
                sat_contents = await satellite_image.read()
                sat_image = Image.open(BytesIO(sat_contents))
                
                # Get crack processor and analyze
                processor = get_crack_processor()
                crack_result = processor.analyze_cracks(sat_image)
                
                results["analyses"]["crack_segmentation"] = {
                    "success": True,
                    "filename": satellite_image.filename,
                    "analysis": crack_result
                }
            else:
                results["analyses"]["crack_segmentation"] = {
                    "success": False,
                    "error": "Crack segmentation service not available"
                }
        except Exception as e:
            results["analyses"]["crack_segmentation"] = {
                "success": False,
                "error": f"Crack analysis failed: {str(e)}"
            }

        # 3. DEM Analysis
        try:
            if DEM_PROCESSING_AVAILABLE:
                # Read uploaded DEM image
                dem_contents = await dem_image.read()
                dem_img = Image.open(BytesIO(dem_contents))
                
                # Get DEM processor and analyze
                processor = get_dem_processor()
                dem_result = processor.process_dem_image(dem_img)
                
                results["analyses"]["dem"] = {
                    "success": True,
                    "filename": dem_image.filename,
                    "analysis": dem_result
                }
            else:
                results["analyses"]["dem"] = {
                    "success": False,
                    "error": "DEM processing service not available"
                }
        except Exception as e:
            results["analyses"]["dem"] = {
                "success": False,
                "error": f"DEM analysis failed: {str(e)}"
            }

        # Calculate overall risk assessment
        risk_scores = []
        if results["analyses"]["weather"].get("success"):
            risk_scores.append(results["analyses"]["weather"]["risk_assessment"]["risk_score"])
        
        if results["analyses"]["crack_segmentation"].get("success"):
            crack_data = results["analyses"]["crack_segmentation"]["analysis"]
            # Approximate risk from crack data
            if crack_data.get("total_crack_area", 0) > 0:
                crack_risk = min(100, crack_data["total_crack_area"] * 10)  # Scale to 0-100
                risk_scores.append(crack_risk)
        
        if results["analyses"]["dem"].get("success"):
            dem_data = results["analyses"]["dem"]["analysis"]
            # Use slope analysis for risk
            if "slope_statistics" in dem_data:
                slope_risk = min(100, dem_data["slope_statistics"].get("max_slope", 0) * 2)
                risk_scores.append(slope_risk)

        # Overall assessment
        if risk_scores:
            overall_risk_score = max(risk_scores)  # Take highest risk
            if overall_risk_score < 25:
                overall_risk_level = "LOW"
            elif overall_risk_score < 50:
                overall_risk_level = "MEDIUM"
            elif overall_risk_score < 75:
                overall_risk_level = "HIGH"
            else:
                overall_risk_level = "CRITICAL"
        else:
            overall_risk_score = 0
            overall_risk_level = "UNKNOWN"

        results["overall_assessment"] = {
            "risk_level": overall_risk_level,
            "risk_score": overall_risk_score,
            "contributing_factors": len([a for a in results["analyses"].values() if a.get("success")]),
            "recommendation": "Detailed analysis complete. Review individual model results for specific recommendations."
        }

        return results

    except Exception as e:
        return {
            "success": False,
            "error": f"Complete analysis failed: {str(e)}",
            "timestamp": datetime.datetime.now().isoformat()
        }

@app.get("/api/monitoring/live-data")
async def get_live_monitoring_data():
    """Get real-time monitoring data"""
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "activeAlerts": 3,
        "monitoringPoints": 12,
        "systemStatus": "operational",
        "lastUpdate": "Real-time"
    }

@app.get("/api/prediction/history")
async def get_prediction_history():
    """Get historical prediction data"""
    return {
        "predictions": list(prediction_results_db.values()),
        "total": len(prediction_results_db)
    }

# ============= CRACK SEGMENTATION ENDPOINTS =============

@app.post("/api/crack-analysis/upload", response_model=CrackAnalysisResponse)
async def analyze_crack_from_upload(
    file: UploadFile = File(...),
    latitude: Optional[str] = Form(None),
    longitude: Optional[str] = Form(None),
    site_name: Optional[str] = Form(None)
):
    """
    Upload satellite image for crack segmentation analysis
    """
    if not CRACK_SEGMENTATION_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Crack segmentation service is not available. Please install required ML dependencies."
        )
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read uploaded file
        contents = await file.read()
        
        # Convert to PIL Image
        image = Image.open(BytesIO(contents))
        
        # Get crack processor and analyze
        processor = get_crack_processor()
        results = processor.process_satellite_image(image)
        
        if not results["success"]:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {results.get('error', 'Unknown error')}")
        
        # Create response model
        risk_data = results["risk_assessment"] 
        response = CrackAnalysisResponse(
            success=True,
            risk_assessment=RiskAssessment(
                risk_level=risk_data["risk_level"],
                risk_color=risk_data["risk_color"],
                risk_score=risk_data["risk_score"],
                crack_density_percent=risk_data["crack_density_percent"],
                total_pixels=risk_data["total_pixels"],
                crack_pixels=risk_data["crack_pixels"]
            ),
            images=results["images"],
            metadata={
                **results["metadata"],
                "filename": file.filename,
                "file_size": len(contents),
                "upload_timestamp": datetime.datetime.now().isoformat(),
                "coordinates": {"latitude": latitude, "longitude": longitude},
                "site_name": site_name
            }
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/crack-analysis/base64", response_model=CrackAnalysisResponse)
async def analyze_crack_from_base64(request: CrackAnalysisRequest):
    """
    Analyze crack segmentation from base64 encoded image
    """
    if not CRACK_SEGMENTATION_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Crack segmentation service is not available. Please install required ML dependencies."
        )
    
    try:
        if not request.image_base64:
            raise HTTPException(status_code=400, detail="image_base64 is required")
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if request.image_base64.startswith('data:image'):
                request.image_base64 = request.image_base64.split(',')[1]
            
            image_data = base64.b64decode(request.image_base64)
            image = Image.open(BytesIO(image_data))
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")
        
        # Get crack processor and analyze
        processor = get_crack_processor()
        results = processor.process_satellite_image(image)
        
        if not results["success"]:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {results.get('error', 'Unknown error')}")
        
        # Create response model
        risk_data = results["risk_assessment"]
        response = CrackAnalysisResponse(
            success=True,
            risk_assessment=RiskAssessment(
                risk_level=risk_data["risk_level"],
                risk_color=risk_data["risk_color"],
                risk_score=risk_data["risk_score"],
                crack_density_percent=risk_data["crack_density_percent"],
                total_pixels=risk_data["total_pixels"],
                crack_pixels=risk_data["crack_pixels"]
            ),
            images=results["images"],
            metadata={
                **results["metadata"],
                "analysis_timestamp": datetime.datetime.now().isoformat(),
                "coordinates": {"latitude": request.latitude, "longitude": request.longitude},
                "site_name": request.site_name
            }
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/crack-analysis/status")
async def get_crack_analysis_status():
    """
    Get status of crack segmentation service
    """
    return {
        "service_available": CRACK_SEGMENTATION_AVAILABLE,
        "model_loaded": CRACK_SEGMENTATION_AVAILABLE and get_crack_processor().model is not None if CRACK_SEGMENTATION_AVAILABLE else False,
        "supported_formats": ["PNG", "JPEG", "JPG", "BMP", "TIFF"],
        "max_image_size": "50MB",
        "processing_time_estimate": "5-15 seconds",
        "model_info": {
            "type": "U-Net Crack Segmentation",
            "input_size": "256x256",
            "output": "Binary crack mask"
        }
    }

# ============= END CRACK SEGMENTATION ENDPOINTS =============

# ============= DEM ANALYSIS ENDPOINTS =============

@app.post("/api/dem-analysis/upload", response_model=DEMAnalysisResponse)
async def analyze_dem_from_upload(
    file: UploadFile = File(...),
    latitude: Optional[str] = Form(None),
    longitude: Optional[str] = Form(None),
    site_name: Optional[str] = Form(None),
    pixel_size_meters: Optional[float] = Form(1.0)
):
    """
    Upload DEM image for geological risk analysis
    """
    if not DEM_PROCESSING_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="DEM processing service is not available. Please install required dependencies."
        )
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read uploaded file
        contents = await file.read()
        
        # Convert to PIL Image
        image = Image.open(BytesIO(contents))
        
        # Get DEM processor and analyze
        processor = get_dem_processor()
        
        # Set pixel size if provided
        if pixel_size_meters and pixel_size_meters > 0:
            processor.pixel_size = pixel_size_meters
        
        results = processor.process_dem_image(image)
        
        if not results["success"]:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {results.get('error', 'Unknown error')}")
        
        # Create response model
        risk_data = results["risk_assessment"]
        terrain_data = results["terrain_analysis"]
        
        response = DEMAnalysisResponse(
            success=True,
            risk_assessment=DEMRiskAssessment(
                risk_level=risk_data["risk_level"],
                risk_color=risk_data["risk_color"],
                risk_score=risk_data["risk_score"],
                high_slope_percentage=risk_data["high_slope_percentage"],
                critical_slope_percentage=risk_data["critical_slope_percentage"],
                max_slope=risk_data["max_slope"],
                mean_slope=risk_data["mean_slope"],
                elevation_range=risk_data["elevation_range"],
                terrain_roughness=risk_data["terrain_roughness"],
                total_pixels=risk_data["total_pixels"],
                high_risk_pixels=risk_data["high_risk_pixels"],
                critical_pixels=risk_data["critical_pixels"]
            ),
            terrain_analysis=TerrainStats(
                elevation_stats=terrain_data["elevation_stats"],
                slope_stats=terrain_data["slope_stats"],
                terrain_complexity=terrain_data["terrain_complexity"]
            ),
            images=results["images"],
            metadata={
                **results["metadata"],
                "filename": file.filename,
                "file_size": len(contents),
                "upload_timestamp": datetime.datetime.now().isoformat(),
                "coordinates": {"latitude": latitude, "longitude": longitude},
                "site_name": site_name,
                "pixel_size_meters": pixel_size_meters
            }
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DEM analysis failed: {str(e)}")

@app.post("/api/dem-analysis/base64", response_model=DEMAnalysisResponse)
async def analyze_dem_from_base64(request: DEMAnalysisRequest):
    """
    Analyze DEM from base64 encoded image
    """
    if not DEM_PROCESSING_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="DEM processing service is not available. Please install required dependencies."
        )
    
    try:
        if not request.image_base64:
            raise HTTPException(status_code=400, detail="image_base64 is required")
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if request.image_base64.startswith('data:image'):
                request.image_base64 = request.image_base64.split(',')[1]
            
            image_data = base64.b64decode(request.image_base64)
            image = Image.open(BytesIO(image_data))
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")
        
        # Get DEM processor and analyze
        processor = get_dem_processor()
        
        # Set pixel size if provided
        if request.pixel_size_meters and request.pixel_size_meters > 0:
            processor.pixel_size = request.pixel_size_meters
        
        results = processor.process_dem_image(image)
        
        if not results["success"]:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {results.get('error', 'Unknown error')}")
        
        # Create response model
        risk_data = results["risk_assessment"]
        terrain_data = results["terrain_analysis"]
        
        response = DEMAnalysisResponse(
            success=True,
            risk_assessment=DEMRiskAssessment(
                risk_level=risk_data["risk_level"],
                risk_color=risk_data["risk_color"],
                risk_score=risk_data["risk_score"],
                high_slope_percentage=risk_data["high_slope_percentage"],
                critical_slope_percentage=risk_data["critical_slope_percentage"],
                max_slope=risk_data["max_slope"],
                mean_slope=risk_data["mean_slope"],
                elevation_range=risk_data["elevation_range"],
                terrain_roughness=risk_data["terrain_roughness"],
                total_pixels=risk_data["total_pixels"],
                high_risk_pixels=risk_data["high_risk_pixels"],
                critical_pixels=risk_data["critical_pixels"]
            ),
            terrain_analysis=TerrainStats(
                elevation_stats=terrain_data["elevation_stats"],
                slope_stats=terrain_data["slope_stats"],
                terrain_complexity=terrain_data["terrain_complexity"]
            ),
            images=results["images"],
            metadata={
                **results["metadata"],
                "analysis_timestamp": datetime.datetime.now().isoformat(),
                "coordinates": {"latitude": request.latitude, "longitude": request.longitude},
                "site_name": request.site_name,
                "pixel_size_meters": request.pixel_size_meters
            }
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DEM analysis failed: {str(e)}")

@app.get("/api/dem-analysis/status")
async def get_dem_analysis_status():
    """
    Get status of DEM analysis service
    """
    return {
        "service_available": DEM_PROCESSING_AVAILABLE,
        "processor_loaded": DEM_PROCESSING_AVAILABLE and get_dem_processor() is not None if DEM_PROCESSING_AVAILABLE else False,
        "supported_formats": ["PNG", "JPEG", "JPG", "BMP", "TIFF", "GeoTIFF"],
        "max_image_size": "50MB",
        "processing_time_estimate": "3-10 seconds",
        "analysis_features": [
            "Slope analysis",
            "Elevation statistics", 
            "Terrain curvature",
            "Risk visualization",
            "Geological stability assessment"
        ],
        "risk_parameters": {
            "min_slope_threshold": 5.0,
            "high_risk_slope": 30.0,
            "critical_slope": 45.0,
            "default_pixel_size": "1.0 meters"
        }
    }

# ============= END DEM ANALYSIS ENDPOINTS =============

# Weather Analysis Endpoints
@app.get("/api/weather-analysis/status")
async def weather_analysis_status():
    """Get weather analysis service status"""
    if not WEATHER_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Weather analysis service not available")
    
    return weather_processor.get_status()

@app.post("/api/weather-analysis/predict", response_model=WeatherAnalysisResponse)
async def predict_weather_risk(request: WeatherAnalysisRequest):
    """
    Predict weather-based geological risk for given coordinates
    """
    if not WEATHER_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Weather analysis service not available")
    
    try:
        result = weather_processor.predict_weather_risk(
            latitude=request.latitude,
            longitude=request.longitude,
            site_name=request.site_name
        )
        
        if not result.get("success", False):
            raise HTTPException(status_code=400, detail=result.get("error", "Weather analysis failed"))
        
        return WeatherAnalysisResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather analysis error: {str(e)}")

@app.get("/api/weather-analysis/current/{latitude}/{longitude}")
async def get_current_weather(latitude: float, longitude: float, site_name: str = None):
    """
    Get current weather conditions for specific coordinates
    """
    if not WEATHER_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Weather analysis service not available")
    
    try:
        result = weather_processor.predict_weather_risk(
            latitude=latitude,
            longitude=longitude,
            site_name=site_name
        )
        
        if not result.get("success", False):
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to fetch weather data"))
        
        return {
            "success": True,
            "location": result.get("location"),
            "current_weather": result.get("current_weather"),
            "derived_metrics": result.get("derived_metrics"),
            "timestamp": result.get("timestamp")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather data error: {str(e)}")

@app.post("/api/weather-analysis/batch")
async def batch_weather_analysis(locations: List[WeatherAnalysisRequest]):
    """
    Analyze weather risk for multiple locations
    """
    if not WEATHER_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Weather analysis service not available")
    
    if len(locations) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 locations allowed per batch request")
    
    results = []
    for location in locations:
        try:
            result = weather_processor.predict_weather_risk(
                latitude=location.latitude,
                longitude=location.longitude,
                site_name=location.site_name
            )
            results.append(result)
        except Exception as e:
            results.append({
                "success": False,
                "error": str(e),
                "location": {
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "site_name": location.site_name
                }
            })
    
    return {
        "success": True,
        "total_locations": len(locations),
        "results": results,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "service": "FALCON API",
        "crack_segmentation_available": CRACK_SEGMENTATION_AVAILABLE,
        "dem_analysis_available": DEM_PROCESSING_AVAILABLE,
        "weather_analysis_available": WEATHER_ANALYSIS_AVAILABLE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)