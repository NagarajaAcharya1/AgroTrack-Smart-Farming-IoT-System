# 🌱 AgroTrack - Smart Agriculture IoT Monitoring System

Real-time agricultural monitoring system using ESP32 sensors, Node.js backend, and React dashboard.

![AgroTrack](https://img.shields.io/badge/Status-Active-success)
![ESP32](https://img.shields.io/badge/ESP32-Compatible-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> 📚 **[Complete Documentation Index](DOCUMENTATION_INDEX.md)** - Find all guides and tutorials

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [ESP32 Hardware Setup](#esp32-hardware-setup)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## 🎯 Overview

AgroTrack is a full-stack IoT solution for monitoring agricultural fields in real-time. It collects data from ESP32-based sensor nodes (temperature, humidity, soil moisture) and displays it on a responsive web dashboard with real-time updates via WebSocket.

**Perfect for:**
- Small to medium farms
- Research projects
- Smart agriculture demonstrations
- IoT learning projects

---

## ✨ Features

### 📊 Real-Time Monitoring
- Live sensor data updates every 5 seconds
- WebSocket-based instant notifications
- Interactive charts and graphs

### 🌡️ Multi-Sensor Support
- Temperature monitoring (DHT22)
- Humidity tracking
- Soil moisture levels
- Crop health index calculation

### 🚨 Smart Alerts
- Automatic threshold-based alerts
- Critical moisture warnings
- Temperature anomaly detection

### 📈 Historical Data
- Date range filtering
- Trend analysis
- Data export capabilities

### 🎨 Modern UI
- Dark/Light mode toggle
- Responsive design (mobile-friendly)
- Real-time status indicators

### 🔐 User Management
- Authentication system
- Admin panel
- Role-based access

---

## 🏗️ System Architecture

```
┌─────────────┐         WiFi          ┌─────────────┐
│   ESP32     │ ──────────────────►   │   Backend   │
│  + Sensors  │    HTTP POST          │  (Node.js)  │
└─────────────┘                       └──────┬──────┘
                                             │
                                             │ MongoDB
                                             ▼
┌─────────────┐      WebSocket        ┌─────────────┐
│   React     │ ◄────────────────────►│  Socket.IO  │
│  Dashboard  │    Real-time Data     │   Server    │
└─────────────┘                       └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Arduino IDE (for ESP32)
- ESP32 board + sensors

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/agrotrack.git
cd agrotrack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
ENABLE_SIMULATOR=false
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Dashboard
Open browser: `http://localhost:5173`

**Demo Login:**
- Email: `admin@agro.com`
- Password: `admin`

---

## 🔌 ESP32 Hardware Setup

### Required Components
- ESP32 Development Board
- DHT22 Temperature/Humidity Sensor
- Capacitive Soil Moisture Sensor
- Jumper wires & Breadboard

### Quick Wiring
```
DHT22:
  VCC  → ESP32 3.3V
  DATA → ESP32 GPIO 4
  GND  → ESP32 GND

Soil Moisture:
  VCC  → ESP32 3.3V
  AOUT → ESP32 GPIO 34
  GND  → ESP32 GND
```

### Upload Code
1. Open `esp32_code/agrotrack_sensor_node.ino` in Arduino IDE
2. **Update WiFi credentials:** `iQOO Neo9 Pro` / `abcdefghi`
3. **Update server URL:** Replace `YOUR_LAPTOP_IP` with your actual laptop IP
4. Select Board: "ESP32 Dev Module"
5. Upload to ESP32
6. Open Serial Monitor (115200 baud)

**See:** [QUICK_CONFIG.md](QUICK_CONFIG.md) - Simple configuration guide

**See detailed guides:**
- 📘 [ESP32 Integration Guide](ESP32_INTEGRATION_GUIDE.md) - Complete setup
- ⚡ [Quick Start Guide](ESP32_QUICK_START.md) - 5-minute setup
- 🔌 [Wiring Diagram](ESP32_WIRING_DIAGRAM.md) - Visual connections

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CODE_STRUCTURE_GUIDE.md](CODE_STRUCTURE_GUIDE.md) | Complete code architecture & workflow |
| [ESP32_INTEGRATION_GUIDE.md](ESP32_INTEGRATION_GUIDE.md) | Full ESP32 hardware integration |
| [ESP32_QUICK_START.md](ESP32_QUICK_START.md) | 5-minute ESP32 setup |
| [ESP32_WIRING_DIAGRAM.md](ESP32_WIRING_DIAGRAM.md) | Detailed wiring instructions |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Deploy to Render & MongoDB Atlas |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates
- **React Router** - Navigation
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server
- **CORS** - Cross-origin support

### Hardware
- **ESP32** - Microcontroller
- **DHT22** - Temperature/Humidity sensor
- **Capacitive Soil Moisture Sensor**
- **Arduino IDE** - Programming environment

---

## 📸 Screenshots

### Dashboard
Real-time monitoring with live sensor cards and charts

### History View
Historical data analysis with date range filtering

### Admin Panel
System statistics and management

### Mobile Responsive
Works seamlessly on all devices

---

## 🗂️ Project Structure

```
AgroTrack/
├── backend/                    # Node.js Express server
│   ├── models/                 # MongoDB schemas
│   │   ├── SensorData.js
│   │   ├── Alert.js
│   │   └── User.js
│   ├── server.js              # Main server
│   ├── simulator.js           # Data simulator
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Route pages
│   │   ├── context/           # React context
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── esp32_code/                 # Arduino sketches
│   └── agrotrack_sensor_node.ino
│
├── CODE_STRUCTURE_GUIDE.md     # Architecture guide
├── ESP32_INTEGRATION_GUIDE.md  # Hardware setup
├── ESP32_QUICK_START.md        # Quick reference
├── ESP32_WIRING_DIAGRAM.md     # Wiring details
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

---

## 🔄 Data Flow

1. **ESP32** reads sensors every 5 seconds
2. **HTTP POST** sends data to backend API
3. **Backend** saves to MongoDB
4. **Socket.IO** broadcasts to connected clients
5. **React Dashboard** updates in real-time
6. **Alerts** trigger on threshold violations

---

## 🎯 Use Cases

- **Precision Agriculture**: Monitor soil conditions for optimal irrigation
- **Research**: Collect environmental data for agricultural studies
- **Education**: Learn IoT, full-stack development, and hardware integration
- **Smart Farming**: Automate farm management decisions
- **Remote Monitoring**: Check field conditions from anywhere

---

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrotrack
PORT=3001
ENABLE_SIMULATOR=true
NODE_ENV=development
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3001
```

### ESP32 Configuration
```cpp
const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* serverUrl = "http://192.168.1.100:3001/api/sensor-data";
```

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:3001/health
```

### Test ESP32 Connection
1. Open Serial Monitor in Arduino IDE
2. Check for "✅ WiFi Connected!"
3. Verify "✅ HTTP Response: 201"

### Test Dashboard
1. Login to dashboard
2. Check for green "System Online" indicator
3. Verify data updates every 5 seconds

---

## 🚀 Deployment

### Deploy to Render (Free)
1. Push code to GitHub
2. Create Render account
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Update environment variables

**See:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🆘 Support

### Common Issues

**ESP32 won't connect to WiFi?**
- Check SSID/password
- Use 2.4GHz WiFi (not 5GHz)
- Move closer to router

**Dashboard not updating?**
- Check backend is running
- Verify WebSocket connection
- Check browser console for errors

**Sensor readings incorrect?**
- Calibrate soil moisture sensor
- Check wiring connections
- Verify sensor power supply

### Get Help
- 📖 Read the documentation guides
- 🐛 Open an issue on GitHub
- 💬 Check existing issues for solutions

---

## 🎓 Learning Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB University](https://university.mongodb.com/)

---

## 🌟 Features Roadmap

- [ ] GPS location tracking
- [ ] Email/SMS alerts
- [ ] Multi-field support
- [ ] Weather API integration
- [ ] Mobile app (React Native)
- [ ] Data export (CSV/PDF)
- [ ] Machine learning predictions
- [ ] Solar power optimization

---

## 👥 Authors

- Your Name - Initial work

---

## 🙏 Acknowledgments

- Espressif for ESP32 platform
- Adafruit for sensor libraries
- MongoDB Atlas for free database hosting
- Render for free deployment

---

## 📊 Project Stats

- **Lines of Code**: ~3000+
- **Components**: 15+
- **API Endpoints**: 8
- **Supported Sensors**: 3+
- **Real-time Updates**: Yes
- **Mobile Responsive**: Yes

---

**Built with ❤️ for sustainable agriculture 🌱**

---

## 🔗 Quick Links

- [Live Demo](https://agrotrack-frontend.onrender.com)
- [API Documentation](https://agrotrack-backend.onrender.com/health)
- [GitHub Repository](https://github.com/yourusername/agrotrack)

---

**Start monitoring your farm today! 🚜🌾**
