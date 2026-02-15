# 🌱 AgroTrack - Smart Agriculture IoT Monitoring System

Real-time agricultural monitoring system using ESP32 sensors, Node.js backend, and React dashboard.

![AgroTrack](https://img.shields.io/badge/Status-Active-success)
![ESP32](https://img.shields.io/badge/ESP32-Compatible-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Overview

AgroTrack is a full-stack IoT solution for monitoring agricultural fields in real-time. It collects data from ESP32-based sensor nodes (temperature, humidity, soil moisture, rain detection) and displays it on a responsive web dashboard with real-time updates via WebSocket.

**Key Feature:** Dashboard shows **ONLY real ESP32 sensor data** - no simulated or demo data!

---

## ✨ Features

### 📊 Real-Time Monitoring
- Live sensor data from ESP32 every 5 seconds
- WebSocket-based instant notifications
- Interactive charts and graphs
- **Shows actual sensor readings only**

### 🌡️ Multi-Sensor Support
- Temperature monitoring (DHT11)
- Humidity tracking
- Soil moisture levels
- Rain detection
- Obstacle detection (Ultrasonic)
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
- Glassmorphism design

### 🌐 ESP32 Web Dashboard
- Built-in web server on ESP32
- Access sensor data directly from ESP32
- No backend needed for quick checks
- Mobile-friendly interface

---

## 🏗️ System Architecture

```
┌─────────────┐         WiFi          ┌─────────────┐
│   ESP32     │ ──────────────────►   │   Backend   │
│  + Sensors  │    HTTP POST          │  (Node.js)  │
└─────────────┘    Every 5s           └──────┬──────┘
       │                                     │
       │ Built-in Web Server                 │ MongoDB
       ▼                                     ▼
┌─────────────┐      WebSocket        ┌─────────────┐
│   Direct    │                       │   React     │
│   Access    │ ◄────────────────────►│  Dashboard  │
│ (Optional)  │    Real-time Data     │   (Main)    │
└─────────────┘                       └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
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
MONGO_URI=mongodb://localhost:27017/agrotrack
PORT=3001
ENABLE_SIMULATOR=false
JWT_SECRET=your_secret_key
```

Start backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. ESP32 Setup

**Option 1: Main Sensor Node (Sends to Backend)**
1. Open `esp32_code/agrotrack_sensor_node/agrotrack_sensor_node.ino`
2. Update WiFi: `NetKing` / `11111111`
3. Update server URL with your laptop IP:
   ```cpp
   const char* serverUrl = "http://YOUR_LAPTOP_IP:3001/api/sensor-data";
   ```
4. Upload to ESP32

**Option 2: Web Dashboard Node (Built-in Web Server)**
1. Open `esp32_code/agrotrack_web_dashboard/agrotrack_web_dashboard.ino`
2. Update WiFi credentials
3. Upload to ESP32
4. Access dashboard at `http://ESP32_IP`

### 5. Access Dashboard
Open browser: `http://localhost:5173`

**Login:**
- Email: `admin@agro.com`
- Password: `admin`

---

## 🔌 ESP32 Hardware Setup

### Required Components
- ESP32 Development Board
- DHT11 Temperature/Humidity Sensor
- Capacitive Soil Moisture Sensor
- Rain Sensor Module
- HC-SR04 Ultrasonic Sensor
- Jumper wires & Breadboard

### Wiring Diagram
```
DHT11:
  VCC  → ESP32 3.3V
  DATA → ESP32 GPIO 4
  GND  → ESP32 GND

Soil Moisture:
  VCC  → ESP32 3.3V
  AOUT → ESP32 GPIO 34
  GND  → ESP32 GND

Rain Sensor:
  VCC  → ESP32 3.3V
  AOUT → ESP32 GPIO 35
  GND  → ESP32 GND

Ultrasonic HC-SR04:
  VCC  → ESP32 5V
  TRIG → ESP32 GPIO 5
  ECHO → ESP32 GPIO 18
  GND  → ESP32 GND
```

**See:** [ESP32_WIRING_DIAGRAM.md](ESP32_WIRING_DIAGRAM.md) for detailed connections

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_CONFIG.md](QUICK_CONFIG.md) | Simple WiFi/IP configuration |
| [DATA_FLOW_VERIFICATION.md](DATA_FLOW_VERIFICATION.md) | Verify ESP32 → Dashboard data flow |
| [FINAL_SETUP_COMPLETE.md](FINAL_SETUP_COMPLETE.md) | Current system status |
| [FIX_CONNECTION_REFUSED.md](FIX_CONNECTION_REFUSED.md) | Troubleshoot connection issues |
| [TESTING_WITHOUT_SENSORS.md](TESTING_WITHOUT_SENSORS.md) | Test without physical sensors |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server

### Hardware
- **ESP32** - Microcontroller
- **DHT11** - Temperature/Humidity sensor
- **Capacitive Soil Moisture Sensor**
- **Rain Sensor Module**
- **HC-SR04** - Ultrasonic distance sensor

---

## 🔄 Data Flow

1. **ESP32** reads sensors every 5 seconds
2. **HTTP POST** sends data to backend API
3. **Backend** saves to MongoDB and logs: `📥 Received sensor data: {...}`
4. **Socket.IO** broadcasts to connected clients
5. **React Dashboard** updates in real-time
6. **Alerts** trigger on threshold violations

**Dashboard shows EXACTLY what ESP32 Serial Monitor shows!**

---

## 🎯 Key Features

### ✅ Real Data Only
- **No simulator** - Disabled completely
- **No demo data** - Database cleared
- **ESP32 OFF** = Dashboard shows no data
- **ESP32 ON** = Dashboard shows live sensor readings

### ✅ Dual Dashboard Access
1. **Main Dashboard** - Full-featured web app (http://localhost:5173)
2. **ESP32 Dashboard** - Direct access from ESP32 (http://ESP32_IP)

### ✅ Real-Time Updates
- WebSocket connection for instant updates
- Green "System Online" indicator when connected
- Updates every 5 seconds automatically

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:3001/health
```

### Test ESP32 Connection
1. Open Serial Monitor (115200 baud)
2. Check for:
   ```
   ✅ WiFi Connected
   IP: 10.194.155.xxx
   📤 POST → HTTP 201
   ```

### Test Dashboard
1. Login to dashboard
2. Check for green "System Online" indicator
3. Turn ON ESP32
4. Verify data updates match Serial Monitor

---

## 🔧 Configuration

### Current WiFi Settings
- **SSID:** NetKing
- **Password:** 11111111
- **Backend IP:** 10.194.155.197
- **Backend Port:** 3001

### To Change Settings
Edit `QUICK_CONFIG.md` for step-by-step instructions

---

## 🆘 Troubleshooting

### ESP32 shows "connection refused"
**Solution:**
1. Start backend: `npm start`
2. Check firewall allows port 3001
3. Verify IP address in ESP32 code

### Dashboard shows old/wrong data
**Solution:**
```bash
cd backend
node clearData.js
```
Then refresh browser: `Ctrl+Shift+R`

### Dashboard shows no data
**Solution:**
- This is correct if ESP32 is OFF
- Turn ON ESP32 to see live data
- Check Serial Monitor for `📤 POST → HTTP 201`

**See:** [DATA_FLOW_VERIFICATION.md](DATA_FLOW_VERIFICATION.md) for complete troubleshooting

---

## 📁 Project Structure

```
AgroTrack/
├── backend/
│   ├── models/
│   │   ├── SensorData.js
│   │   ├── Alert.js
│   │   └── User.js
│   ├── server.js
│   ├── clearData.js          # Clear database script
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx  # Main dashboard
│   │   └── config.js
│   └── package.json
│
├── esp32_code/
│   ├── agrotrack_sensor_node/
│   │   └── agrotrack_sensor_node.ino  # Main ESP32 code
│   └── agrotrack_web_dashboard/
│       └── agrotrack_web_dashboard.ino  # ESP32 with web server
│
├── QUICK_CONFIG.md
├── DATA_FLOW_VERIFICATION.md
├── FINAL_SETUP_COMPLETE.md
└── README.md
```

---

## ✅ System Status

- ✅ Backend configured (port 3001)
- ✅ Frontend configured (port 5173)
- ✅ Simulator disabled
- ✅ Database cleared
- ✅ ESP32 code ready
- ✅ WiFi configured
- ✅ Real data only mode

---

## 🎓 How It Works

### When ESP32 is OFF:
- Dashboard shows no data or zeros
- This is correct behavior!
- System waits for ESP32 to connect

### When ESP32 is ON:
- ESP32 reads sensors every 5 seconds
- Sends data to backend via HTTP POST
- Backend logs: `📥 Received sensor data: {...}`
- Dashboard updates via WebSocket
- Shows EXACT values from Serial Monitor

**Example:**
```
Serial Monitor: Temp: 28.5°C | Humidity: 65.2%
Dashboard:      Temperature: 28.5°C, Humidity: 65.2%
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🌟 Features Roadmap

- [x] Real-time sensor monitoring
- [x] ESP32 integration
- [x] Web dashboard
- [x] ESP32 built-in web server
- [x] Real data only mode
- [ ] Email/SMS alerts
- [ ] Multi-field support
- [ ] Weather API integration
- [ ] Mobile app
- [ ] Machine learning predictions

---

**Built with ❤️ for sustainable agriculture 🌱**

**Start monitoring your farm with real sensor data today! 🚜🌾**
