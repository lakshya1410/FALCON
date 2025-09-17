@echo off
echo Starting FALCON Development Environment...
echo.

echo Starting Backend (FastAPI)...
start cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo Starting Frontend (React + Vite)...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo API Documentation: http://localhost:8000/docs
echo.
pause