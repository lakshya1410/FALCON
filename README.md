# 🪨 AI-Powered Rockfall Prediction System 

> An advanced geological risk assessment and management system that combines FastAPI backend with a modern React frontend to provide real-time rockfall prediction and monitoring capabilities.

<div align="center">

![System Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61dafb?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi&logoColor=white)

**🏔️ Protecting Lives Through Advanced Geological Intelligence 🏔️**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-api-endpoints) • [🤝 Contributing](#-contributing) • [💬 Support](#-support)

</div>

---

## 🌟 Overview

The **AI-Powered Rockfall Prediction System** is a cutting-edge solution designed to monitor, predict, and manage geological hazards in real-time. By leveraging machine learning algorithms, interactive mapping, and comprehensive risk assessment tools, this system helps protect communities from rockfall disasters.

### 🎯 Why This Matters
- 🪨 **Rockfall Events** cause significant infrastructure damage and pose serious threats to human life
- ⚡ **Early Warning Systems** can reduce casualties by up to 90%
- 🤖 **AI-Powered Predictions** provide accurate risk assessments using geological data
- 🗺️ **Real-time Monitoring** enables immediate response to changing conditions

---

## ✨ Key Features

### 🎯 **Core Functionality**
- 🧠 **AI-Powered Risk Assessment** with machine learning prediction models
- 🗺️ **Interactive Risk Zone Mapping** using Leaflet.js with high-resolution satellite imagery  
- 📊 **Dynamic Dashboard** with live monitoring and comprehensive status indicators
- 🚨 **Emergency Alert System** with automated notifications and escalation protocols
- 🛡️ **Resource Management** for coordinated emergency response operations

### 🗺️ **Advanced Mapping Features**
- 🇮🇳 **Indian Geological Focus**: Optimized for Indian terrain (24.27°N, 80.17°E)
- 🎨 **Color-Coded Risk Zones**: 
  - 🔴 **Critical** (Immediate Action Required)
  - 🟠 **High Risk** (Enhanced Monitoring)
  - 🟡 **Medium Risk** (Regular Assessment)
  - 🟢 **Safe Zone** (Stable Conditions)
- 📍 **Real-time Incident Markers**: Live geological event tracking
- 🛰️ **Satellite Overlay Integration**: High-resolution terrain analysis
- 💬 **Interactive Popups**: Detailed risk profiles and incident data

### 🎨 **Modern User Interface**
- 🌙 **Professional Dark Theme** with elegant gradient styling
- 🧭 **Enhanced Navigation Bar** with streamlined single-line design
- 📱 **Fully Responsive Layout** with intelligent sidebar navigation
- ⚡ **Real-time Status Indicators** for AI models and system health monitoring
- ✨ **Modern Typography** with optimized spacing and exceptional readability

---

## 🛠️ Technology Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **🔧 Backend** | FastAPI • Uvicorn • Python 3.8+ • CORS Middleware |
| **⚛️ Frontend** | React 18 • Tailwind CSS • Leaflet.js • Lucide React |
| **🛠️ Development** | Git • npm • pip • Virtual Environment • Webpack |
| **🧠 AI/ML** | TensorFlow • Scikit-learn • NumPy • Pandas |
| **🗄️ Data** | SQLite • PostgreSQL • GeoJSON • REST APIs |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites
Before you begin, ensure you have the following installed:
- 🐍 **Python 3.8+** 
- 📦 **Node.js 16+**
- 🔧 **npm** or **yarn**
- 🌐 **Git**

### ⚙️ Backend Setup (FastAPI)

1. **📥 Clone the Repository**
   ```bash
   git clone https://github.com/lakshya1410/Rockfall-Prediction-System.git
   cd Rockfall-Prediction-System
   ```

2. **🐍 Create Virtual Environment**
   ```bash
   # Windows
   python -m venv rockfall-env
   rockfall-env\Scripts\activate
   
   # Linux/macOS
   python3 -m venv rockfall-env
   source rockfall-env/bin/activate
   ```

3. **📦 Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **🚀 Launch Backend Server**
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   
   ✅ **Backend Available**: `http://localhost:8000`  
   📚 **API Documentation**: `http://localhost:8000/docs`

### ⚛️ Frontend Setup (React)

1. **📁 Navigate to Frontend**
   ```bash
   cd frontend
   ```

2. **📦 Install Node Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **🚀 Start Development Server**
   ```bash
   npm start
   # or  
   yarn start
   ```
   
   ✅ **Frontend Available**: `http://localhost:3000`

---

## 🛡️ API Documentation

### 🪨 **Geological Risk Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | 💓 System health check |
| `GET` | `/geological-risks` | 🗂️ Retrieve active geological risks |
| `POST` | `/geological-risks` | ➕ Add new risk assessment |
| `GET` | `/emergency-messages` | 📢 Get emergency notifications |
| `POST` | `/emergency-messages` | 🚨 Create emergency alert |
| `GET` | `/resource-allocation` | 📊 Get resource distribution |
| `POST` | `/resource-allocation` | 🛡️ Allocate emergency resources |
| `GET` | `/emergency-actions` | 📋 Retrieve recommended actions |
| `POST` | `/emergency-actions` | 📝 Log emergency responses |

### 🎯 **Prediction Models**
| Endpoint | Model Type | Purpose |
|----------|------------|---------|
| `/predict/dem` | 🏔️ Digital Elevation Model | Terrain analysis |
| `/predict/cnn` | 🧠 CNN Analysis | Image-based prediction |
| `/predict/weather` | 🌤️ Weather Integration | Meteorological factors |
| `/predict/seismic` | 🌊 Seismic Monitor | Earthquake correlation |

---

## 📊 System Dashboard

### 🧭 **Navigation Tabs**
- 🎮 **Command Center**: Main operational dashboard with real-time monitoring
- 📥 **Data Ingestion**: Geological data input, processing, and validation
- 🤖 **Model Prediction**: AI model status, results, and performance metrics
- 🪨 **Rockfall Forecast**: Predictive analysis and long-term forecasting

### ⚡ **System Status Monitoring**
- 🏔️ **DEM Model**: Digital Elevation Model processing status
- 🧠 **CNN Model**: Convolutional Neural Network analysis status  
- 🌤️ **Weather API**: Real-time meteorological data integration
- 🌊 **Seismic Monitor**: Earthquake and seismic activity tracking

### 🎨 **Risk Zone Classification System**
| Zone | Color | Risk Level | Action Required |
|------|-------|------------|----------------|
| 🔴 **Critical** | Red | Extreme | Immediate evacuation |
| 🟠 **High** | Orange | Severe | Enhanced monitoring |
| 🟡 **Medium** | Yellow | Moderate | Regular assessment |
| 🟢 **Safe** | Green | Low | Standard monitoring |

---

## 📁 Project Architecture

```
🪨 Rockfall-Prediction-System/
├── 🐍 main.py                    # FastAPI backend core
├── 📋 requirements.txt           # Python dependencies
├── 🚫 .gitignore                # Git ignore configuration
├── 📖 README.md                 # Project documentation
├── 🐍 myenv/                    # Python virtual environment
├── 🧪 tests/                    # Testing suite
│   ├── 🧪 test_api.py           # API endpoint tests
│   └── 🧪 test_models.py        # ML model tests
├── 📊 models/                   # AI/ML model files
│   ├── 🏔️ dem_model.pkl        # Digital Elevation Model
│   ├── 🧠 cnn_model.h5         # CNN prediction model
│   └── 📈 risk_classifier.pkl   # Risk classification model
└── ⚛️ frontend/                 # React frontend application
    ├── 🌐 public/               # Static assets and icons
    │   ├── 🪨 favicon.ico       # Rock-themed favicon
    │   └── 📱 manifest.json     # PWA configuration
    ├── ⚛️ src/                  # React source code
    │   ├── 🧩 components/       # Reusable React components
    │   │   ├── 🧭 Navbar.js              # Enhanced navigation
    │   │   ├── 🗺️ MapSection.js          # Interactive geological map
    │   │   ├── 📊 LeftSidebar.js         # Risk monitoring panel
    │   │   ├── 🛡️ RightSidebar.js        # Resource management
    │   │   └── 🎮 RockfallDashboard.js   # Main dashboard
    │   ├── 🎨 styles/           # CSS and styling
    │   ├── 🔧 utils/            # Utility functions
    │   ├── ⚛️ App.js            # Root React component
    │   └── 🚀 index.js          # Application entry point
    ├── 📦 package.json          # Node.js dependencies
    └── 🎨 tailwind.config.js    # Tailwind CSS configuration
```

---

## 🚧 Development Roadmap

### ✅ **Completed Features**
- ✅ FastAPI backend with comprehensive REST API
- ✅ React frontend with modern, responsive UI design
- ✅ Interactive Leaflet map with Indian geological focus
- ✅ Real-time monitoring dashboard with status indicators
- ✅ Risk zone visualization with color-coded mapping

### 🔄 **In Progress**
- 🔄 Advanced AI prediction models (CNN, DEM processing)
- 🔄 Real-time data ingestion from geological sensors
- 🔄 Mobile application for field personnel
- 🔄 Integration with government warning systems

### 📋 **Planned Features**
- 📋 PostgreSQL database integration for data persistence
- 📋 User authentication and role-based access control
- 📋 Advanced analytics and historical trend analysis
- 📋 SMS/Email notification system for emergency alerts
- 📋 Multi-language support for broader accessibility
- 📋 Offline mode capabilities for remote locations

---

## 🧪 Testing

Run the comprehensive test suite to ensure system reliability:

```bash
# Backend Tests
python -m pytest tests/ -v

# Frontend Tests  
cd frontend
npm test

# Integration Tests
npm run test:integration

# Performance Tests
npm run test:performance
```

---

## 🤝 Contributing

We welcome contributions from the geological, AI, and web development communities! 

### 🚀 **Getting Started**
1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-rockfall-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing rockfall prediction feature'`)
4. 📤 **Push** to your branch (`git push origin feature/amazing-rockfall-feature`)
5. 🔄 **Open** a Pull Request with detailed description

### 📋 **Contribution Guidelines**
- 🪨 Follow geological data standards and best practices
- 🧪 Include comprehensive tests for new features
- 📖 Update documentation for API changes
- 🎨 Maintain consistent code style and formatting
- 🔍 Ensure all tests pass before submitting

### 🏆 **Contributors**
- 👨‍💻 **Lakshya** - Lead Developer & Geological Systems Architect

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Community

### 💬 **Get Help**
- 🐛 **Issues**: [GitHub Issues](https://github.com/lakshya1410/Rockfall-Prediction-System/issues)
- 📧 **Email**:lakshyatripathiconnect@gmail.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/lakshya1410/Rockfall-Prediction-System/discussions)

### 📚 **Resources**
- 📖 **Documentation**: Available in this README and `/docs` folder
- 🎓 **Geological Guidelines**: WHO/UNESCO geological safety standards
- 🤖 **AI Models**: TensorFlow and PyTorch implementation guides
- 🗺️ **Mapping**: Leaflet.js and GeoJSON integration tutorials

---

## 🏆 Acknowledgments

Special thanks to:
- 🏛️ **Geological Survey Organizations** for providing critical geological data
- 🤖 **Open Source AI Community** for machine learning frameworks
- 🗺️ **OpenStreetMap Contributors** for mapping data
- 🌍 **Emergency Response Teams** for field testing and feedback

---

<div align="center">

**🪨 Built with ❤️ for Geological Safety and Disaster Prevention 🪨**

**🌍 Making the World Safer, One Rock at a Time 🌍**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/lakshya1410/Rockfall-Prediction-System)
[![Issues](https://img.shields.io/badge/Issues-Welcome-blue?style=for-the-badge&logo=github)](https://github.com/lakshya1410/Rockfall-Prediction-System/issues)
[![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github)](https://github.com/lakshya1410/Rockfall-Prediction-System/pulls)

**⭐ If this project helps protect lives in your community, please give it a star! ⭐**

</div>

---

*Last Updated: September 2025 | Version 2.0.0*
