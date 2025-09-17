from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

app = FastAPI(title="Rockfall Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Rockfall Prediction Command Center API", "status": "online"}

@app.get("/api/active-risks")
def get_active_risks():
    """Get current active rockfall risks"""
    return {
        "risks": [
            {
                "id": 1,
                "type": "Rockfall",
                "severity": "HIGH",
                "location": "North East Slope",
                "detected": "30 minutes ago",
                "confidence": 94.1,
                "coordinates": [40.7200, -74.0075]
            },
            {
                "id": 2,
                "type": "Slope Instability",
                "severity": "CRITICAL",
                "location": "Zone A - Main Access",
                "detected": "15 minutes ago", 
                "confidence": 89.0,
                "coordinates": [40.7100, -74.0125]
            }
        ]
    }

@app.get("/api/emergency-messages")
def get_emergency_messages():
    """Get NLP-processed emergency communications"""
    return {
        "messages": [
            {
                "id": 1,
                "priority": "CRITICAL",
                "message": "Slope crack growth exceeded threshold in Zone A",
                "category": "Structural Alert",
                "time": "5 minutes ago",
                "confidence": 96
            },
            {
                "id": 2, 
                "priority": "HIGH",
                "message": "Rainfall intensity high in Zone C - monitor drainage",
                "category": "Weather Alert",
                "time": "10 minutes ago",
                "confidence": 87
            }
        ]
    }

@app.get("/api/resource-allocation")
def get_resource_allocation():
    """Get current resource allocation status"""
    return {
        "resources": [
            {
                "name": "Inspection Drones",
                "zone": "Zone Alpha",
                "current": 3,
                "estimated": 8,
                "allocated": 37.5,
                "needed": 5,
                "status": "shortage"
            },
            {
                "name": "Safety Barriers", 
                "zone": "Zone Beta",
                "current": 12,
                "estimated": 30,
                "allocated": 40.0,
                "needed": 18,
                "status": "shortage"
            },
            {
                "name": "Workforce Allocation",
                "zone": "Zone Gamma", 
                "current": 15,
                "estimated": 25,
                "allocated": 60.0,
                "needed": 10,
                "status": "adequate"
            }
        ]
    }

@app.get("/api/recommended-actions")
def get_recommended_actions():
    """Get AI-recommended preventive actions"""
    return {
        "actions": [
            {
                "id": 1,
                "action": "Rescan NE slope within 12 hrs",
                "priority": "high",
                "zone": "Zone A",
                "status": "pending",
                "estimated_time": "2 hours"
            },
            {
                "id": 2,
                "action": "Restrict heavy vehicles in Zone A", 
                "priority": "critical",
                "zone": "Zone A",
                "status": "pending",
                "estimated_time": "immediate"
            },
            {
                "id": 3,
                "action": "Deploy protective mesh on unstable slope",
                "priority": "medium",
                "zone": "Zone B", 
                "status": "in-progress",
                "estimated_time": "4 hours"
            }
        ]
    }

@app.get("/api/system-status")
def get_system_status():
    """Get system component status"""
    return {
        "components": [
            {"name": "CV Model", "status": "online", "last_update": "2 minutes ago"},
            {"name": "NLP Model", "status": "online", "last_update": "1 minute ago"},
            {"name": "Route Optimizer", "status": "processing", "last_update": "30 seconds ago"},
            {"name": "Resource Predictor", "status": "online", "last_update": "5 minutes ago"}
        ],
        "last_system_update": datetime.now().strftime("%I:%M:%S %p")
    }
