from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import datetime
from pathlib import Path

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

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "service": "FALCON API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)