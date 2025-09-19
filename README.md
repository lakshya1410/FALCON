# FALCON Command Center 🦅

**F**all **A**lert **L**andslide  **C**ondition  **O**bservation **N**etwork

A full-stack application for rockfall prediction, risk analysis, and route optimization using drone imagery and machine learning.

## ⚡ Quick Start

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🏗️ Architecture

### Project Structure

```
FALCON/
├── frontend/                           # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PredictionWorkflow/
│   │   │   │   ├── DataInjection.tsx   # File upload & data input
│   │   │   │   ├── ModelPredicting.tsx # ML model execution
│   │   │   │   └── RockfallForecast.tsx # Results visualization
│   │   │   ├── AuthModal.tsx           # Authentication system
│   │   │   ├── Dashboard.tsx           # Main control center
│   │   │   ├── InteractiveMapNew.tsx   # Map visualization
│   │   │   ├── Navigation.tsx          # Top navigation bar
│   │   │   ├── OptimizedRoute.tsx      # Route planning
│   │   │   ├── RiskAnalysisPanel.tsx   # Risk assessment display
│   │   │   ├── LeftSidebar.js          # Dashboard sidebar
│   │   │   ├── RightSidebar.js         # Dashboard controls
│   │   │   └── SimpleMap.tsx           # Basic map component
│   │   ├── services/
│   │   │   └── api.ts                  # API service layer
│   │   ├── lib/
│   │   │   ├── completeAuth.ts         # Authentication logic
│   │   │   └── firebaseConfig.ts       # Firebase configuration
│   │   ├── App.tsx                     # Main application component
│   │   ├── main.tsx                    # Application entry point
│   │   └── index.css                   # Global styles
│   ├── public/
│   │   ├── falcon-logo.png             # Application logo
│   │   └── index.html                  # HTML template
│   ├── vite.config.ts                  # Vite build configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   └── package.json                    # Frontend dependencies
├── backend/                            # FastAPI Python Backend
│   ├── main.py                         # FastAPI application & endpoints
│   ├── models/                         # ML Model files
│   │   ├── weather_pipeline.pkl        # Weather prediction model
│   │   ├── crack_segmentation.h5       # Crack detection model
│   │   └── DEM.pkl                     # Digital Elevation Model
│   ├── weather_processor.py            # Weather analysis module
│   ├── crack_segmentation.py           # Crack detection module
│   ├── dem_processor.py                # DEM analysis module
│   ├── requirements.txt                # Python dependencies
│   └── .env                           # Environment variables
├── package.json                        # Root development scripts
└── README.md                          # Project documentation
```

### System Architecture

#### Frontend Layer (React + TypeScript)
- **Component-Based Architecture**: Modular React components with TypeScript
- **State Management**: React hooks and context for global state
- **Styling**: Tailwind CSS with glassmorphism design patterns
- **Routing**: Client-side routing for SPA experience
- **API Integration**: Axios-based service layer for backend communication

#### Backend Layer (FastAPI + Python)
- **RESTful API**: FastAPI framework with automatic OpenAPI documentation
- **ML Pipeline**: Multi-model prediction system with three specialized models:
  - **Weather Model**: Meteorological risk assessment
  - **Crack Segmentation**: Computer vision for structural analysis
  - **DEM Analysis**: Topographical and geological risk evaluation
- **Data Processing**: File upload handling for drone images and elevation data
- **Authentication**: JWT-based user authentication system
- **CORS Configuration**: Cross-origin resource sharing for frontend integration

#### Machine Learning Pipeline
```
Data Input → Preprocessing → Multi-Model Analysis → Risk Averaging → Results
    ↓              ↓              ↓                    ↓            ↓
Drone Images   Image/Data    [Weather Model]      Combined      Risk Zones
DEM Data       Validation    [Crack Detection]    Risk Score    Visualizations
Location       Formatting    [DEM Analysis]       Confidence    Recommendations
```

#### Data Flow Architecture
1. **Data Injection**: User uploads drone images, DEM data, and location coordinates
2. **Model Prediction**: Backend processes data through three ML models simultaneously
3. **Risk Aggregation**: Individual model results are averaged for comprehensive assessment
4. **Visualization**: Frontend displays risk zones, confidence levels, and recommendations
5. **Route Optimization**: System generates safe navigation routes based on analysis

## 🚀 Features

### Frontend
- Interactive dashboard with real-time monitoring
- Risk analysis panel with severity mapping
- Route optimization with interactive maps
- Prediction workflow (Data Injection → Model Prediction → Results)
- Authentication system with glassmorphism design

### Backend
- RESTful API with auto-documentation
- ML model integration (Weather, Crack Segmentation, DEM)
- Multi-model risk assessment with averaging
- File upload for drone images and DEM data
- Real-time data processing

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS  
**Backend:** FastAPI, Python 3.8+, Machine Learning Models  
**ML Models:** Weather Pipeline, Crack Segmentation, DEM Analysis

## 🔧 Commands

```bash
npm run dev              # Start both servers
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build           # Build for production
npm run install:all     # Install all dependencies
```

## 📚 Key API Endpoints

- `POST /api/comprehensive-analysis` - Multi-model risk analysis
- `POST /api/auth/login` - User authentication
- `GET /api/monitoring/live-data` - Real-time monitoring

## 🚀 Deployment

**Frontend:**
```bash
cd frontend : npm run dev
```

**Backend:**
```bash
cd backend ; pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📄 License

MIT License

---
**FALCON Command Center** - Advanced geospatial analysis for safer navigation 🦅
