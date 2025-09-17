# FALCON Command Center 🦅

**F**orecasting **A**nd **L**anding zone **C**alculation for **O**ptimal **N**avigation

A comprehensive full-stack application for rockfall prediction, risk analysis, and route optimization using satellite imagery and machine learning.

## 🏗️ Architecture

The project is structured as a modern full-stack application:

```
boltfalcon/
├── frontend/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PredictionWorkflow/
│   │   │   │   ├── DataInjection.tsx
│   │   │   │   ├── ModelPredicting.tsx
│   │   │   │   └── RockfallForecast.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── OptimizedRoute.tsx
│   │   │   └── RiskAnalysisPanel.tsx
│   │   ├── services/
│   │   │   └── api.ts           # API service layer
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── vite.config.ts           # Vite configuration with proxy
│   └── package.json
├── backend/                     # FastAPI Python Backend
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
├── start-dev.bat               # Windows development launcher
├── package.json                # Root package for dev scripts
└── README.md
```

## 🚀 Features

### Frontend (React)
- **Interactive Dashboard** with real-time monitoring
- **Risk Analysis Panel** with severity mapping
- **Route Optimization** with Google Maps integration  
- **Prediction Workflow** for data injection and modeling
- **Authentication System** with secure login/logout
- **Responsive Design** with Tailwind CSS
- **Modern Typography** with Google Fonts

### Backend (FastAPI)
- **RESTful API** with automatic documentation
- **Authentication Endpoints** for user management
- **Prediction Analysis** with ML model integration
- **Real-time Monitoring** data streams
- **File Upload** for satellite images and DEM data
- **CORS Configuration** for seamless frontend integration

## 🛠️ Tech Stack

### Frontend
- React 18.3.1 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Google Fonts (DM Sans, Plus Jakarta Sans, Outfit, Clash Display)

### Backend
- FastAPI with Python 3.8+
- Pydantic for data validation
- Uvicorn ASGI server with auto-reload
- Python-multipart for file uploads
- CORS middleware configured for development
- Automatic API documentation generation

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip package manager

### Quick Start

1. **Install all dependencies:**
```bash
cd boltfalcon
npm run install:all
```

2. **Configure environment (optional):**
```bash
# Create backend/.env if needed
cd backend
echo SECRET_KEY=your-secret-key-here >> .env
echo DATABASE_URL=sqlite:///./falcon.db >> .env
```

3. **Start development servers:**
```bash
# Option 1: Use batch script (Windows)
start-dev.bat

# Option 2: Use npm script
npm run dev
```

This will start both:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Manual Setup

**Frontend Development:**
```bash
cd frontend
npm install
npm run dev
# Frontend will be available at http://localhost:5173
```

**Backend Development:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# Backend will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

## 🔧 Development Scripts

From the root directory:

- `npm run dev` - Start both frontend and backend concurrently
- `npm run dev:frontend` - Start only frontend server (Vite)
- `npm run dev:backend` - Start only backend server (FastAPI)
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies (frontend + backend)
- `npm run install:frontend` - Install frontend dependencies only
- `npm run install:backend` - Install backend dependencies only

### Quick Start Scripts

**Windows:**
```cmd
start-dev.bat
```

**Command Line:**
```bash
# Install all dependencies
npm run install:all

# Start development environment
npm run dev
```

## 📚 API Documentation

Once the backend is running, visit:
- **Interactive API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Prediction Analysis
- `POST /api/prediction/analyze` - Analyze uploaded data
- `GET /api/prediction/history` - Get prediction history

#### Monitoring
- `GET /api/monitoring/live-data` - Real-time monitoring data
- `GET /api/monitoring/alerts` - System alerts

## 🎨 UI Components

### Typography System
- **font-display** - Clash Display for logos and headings
- **font-heading** - Plus Jakarta Sans for section titles
- **font-body** - DM Sans for body text and UI elements

### Key Components
- `Navigation.tsx` - Top navigation with FALCON branding
- `Dashboard.tsx` - Main control center with welcome notification
- `AuthModal.tsx` - Login/register modal system
- `RiskAnalysisPanel.tsx` - Risk assessment visualization
- `OptimizedRoute.tsx` - Route planning interface
- `InteractiveMap.tsx` - Map integration component

### Prediction Workflow
- `DataInjection.tsx` - Data upload and preprocessing
- `ModelPredicting.tsx` - ML model execution
- `RockfallForecast.tsx` - Results visualization

## 🔐 Security Features

- JWT token-based authentication
- CORS protection with specific origins
- Request validation with Pydantic
- Secure file upload handling
- Environment variable configuration

## 🌟 Design Features

- **Glassmorphism Effects** - Modern transparent UI elements
- **Gradient Backgrounds** - Beautiful color transitions
- **Responsive Design** - Mobile-first approach
- **Single-Screen Layouts** - No scrolling required on main pages
- **Professional Notifications** - Clean toast-style alerts

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service (Vercel, Netlify, etc.)
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt

# Production with Gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Or direct with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Variables
Create `backend/.env` for production:
```env
SECRET_KEY=your-production-secret-key
DATABASE_URL=your-production-database-url
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review component code in `frontend/src/components/`
- Examine API endpoints in `backend/main.py`

---

**FALCON Command Center** - Advanced geospatial analysis for safer navigation 🦅