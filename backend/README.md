# FALCON Backend API

This is the backend API server for the FALCON geological risk assessment system.

## Project Structure

```
backend/
├── .env.example                 # Environment variables template
├── main.py                     # FastAPI application entry point
├── crack_segmentation.py       # Crack segmentation model processor
├── dem_processor.py            # DEM analysis processor
├── requirements.txt            # Python dependencies
├── falcon_env/                 # Python virtual environment
├── models/                     # ML model files
│   ├── crack_segmentation.h5   # U-Net crack segmentation model
│   ├── DEM.pkl                 # Digital Elevation Model
│   ├── geotechnical.pkl        # Geotechnical analysis model
│   └── weather_pipeline.pkl    # Weather prediction model
└── uploads/                    # Temporary file uploads
```

## Features

### 1. Crack Segmentation Analysis
- **Upload endpoint**: `POST /api/crack-analysis/upload`
- **Base64 endpoint**: `POST /api/crack-analysis/base64`
- **Status check**: `GET /api/crack-analysis/status`

**Capabilities:**
- U-Net based crack detection in satellite images
- Risk score calculation based on crack density
- Visual crack overlay generation
- Support for PNG, JPEG, JPG, BMP, TIFF formats

### 2. DEM (Digital Elevation Model) Analysis
- **Upload endpoint**: `POST /api/dem-analysis/upload`
- **Base64 endpoint**: `POST /api/dem-analysis/base64`
- **Status check**: `GET /api/dem-analysis/status`

**Capabilities:**
- Slope analysis and gradient calculation
- Elevation statistics and terrain complexity
- Geological risk assessment based on slope angles
- Risk visualization with color-coded zones
- Support for DEM images and GeoTIFF formats

### 3. User Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`

### 4. Prediction & Monitoring
- **Risk prediction**: `POST /api/prediction/analyze`
- **Live monitoring**: `GET /api/monitoring/live-data`
- **Prediction history**: `GET /api/prediction/history`

## Installation & Setup

1. **Create virtual environment:**
   ```bash
   python -m venv falcon_env
   ```

2. **Activate environment:**
   ```bash
   # Windows
   falcon_env\Scripts\activate
   
   # Linux/Mac
   source falcon_env/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Environment Variables

Copy `.env.example` to `.env` and configure:
```bash
# Database settings
DATABASE_URL=sqlite:///./falcon.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Dependencies

### Core Framework
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Machine Learning
- **TensorFlow**: Deep learning framework
- **OpenCV**: Computer vision
- **scikit-learn**: ML algorithms
- **NumPy**: Numerical computing
- **SciPy**: Scientific computing

### Image Processing
- **Pillow**: Image manipulation
- **Matplotlib**: Visualization

### Authentication
- **python-jose**: JWT tokens
- **passlib**: Password hashing
- **bcrypt**: Secure hashing

## Health Check

Check server status: `GET /api/health`

Response includes:
- Server status
- Available services (crack segmentation, DEM analysis)
- Timestamp

## Error Handling

The API returns standard HTTP status codes:
- **200**: Success
- **400**: Bad Request (invalid input)
- **404**: Not Found
- **500**: Internal Server Error
- **503**: Service Unavailable (ML models not loaded)

## Security

- CORS middleware enabled for frontend communication
- Password hashing with bcrypt
- JWT token authentication
- Input validation with Pydantic models

## Performance

- Async/await support for concurrent requests
- Efficient image processing with OpenCV
- Model caching to avoid repeated loading
- Background task support for long-running operations

## Development

For development with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will automatically reload when code changes are detected.