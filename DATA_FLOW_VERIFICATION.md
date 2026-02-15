# ✅ Data Flow Verification Guide

## 🎯 How It Works

**ESP32 Serial Monitor** → **Backend Server** → **Website Dashboard**

The dashboard shows **EXACTLY** what ESP32 sends!

---

## 📊 Example Data Flow

### 1️⃣ ESP32 Serial Monitor Shows:
```
📊 Sensor Readings:
Temp: 28.5°C | Humidity: 65.2%
Soil Raw: 2100 → 52.0%
Rain Raw: 3500 → 15.0%
Obstacle: 25 cm
Crop Health: 85/100
📤 POST → HTTP 201
```

### 2️⃣ Backend Console Shows:
```
📥 Received sensor data: {
  temp: 28.5,
  humidity: 65.2,
  soil: 52,
  rain: 15,
  obstacle: 25,
  health: 85
}
```

### 3️⃣ Website Dashboard Shows:
```
Temperature: 28.5°C
Humidity: 65.2%
Soil Moisture: 52%
Crop Health: 85
```

---

## ✅ Verification Steps

### Step 1: Start Backend
```bash
cd backend
npm start
```

Wait for:
```
🚀 AgroTrack server running on port 3001
✅ MongoDB Atlas Connected
```

### Step 2: Upload ESP32 Code
1. Open `agrotrack_sensor_node.ino`
2. Upload to ESP32
3. Open Serial Monitor (115200 baud)

### Step 3: Watch Serial Monitor
Every 5 seconds you should see:
```
📊 Sensor Readings:
Temp: X.X°C | Humidity: X.X%
Soil Raw: XXXX → XX.X%
📤 POST → HTTP 201  ← This means data sent successfully!
```

### Step 4: Check Backend Console
You should see:
```
📥 Received sensor data: { temp: X.X, humidity: X.X, ... }
```

### Step 5: Open Dashboard
```bash
cd frontend
npm run dev
```

Browser: `http://localhost:5173`
Login: `admin@agro.com` / `admin`

### Step 6: Verify Dashboard Shows Same Values
Dashboard should show **EXACTLY** what Serial Monitor shows!

---

## 🔍 Troubleshooting

### ❌ Serial Monitor shows "HTTP Error: connection refused"
**Problem:** Backend not running or not reachable

**Solution:**
1. Start backend: `npm start` in backend folder
2. Check firewall allows port 3001
3. Verify ESP32 has correct IP in code

### ❌ Backend shows no "📥 Received sensor data"
**Problem:** ESP32 not reaching backend

**Solution:**
1. Check ESP32 Serial Monitor for "📤 POST → HTTP 201"
2. If showing error, check IP address in ESP32 code
3. Verify ESP32 and computer on same WiFi

### ❌ Dashboard shows old/wrong data
**Problem:** Browser cache or old database data

**Solution:**
1. Clear database: `node clearData.js` in backend folder
2. Hard refresh browser: `Ctrl+Shift+R`
3. Wait 5 seconds for new ESP32 data

### ❌ Dashboard shows zeros
**Problem:** No data received yet OR sensors not connected

**Solution:**
1. Check Serial Monitor - if showing zeros, sensors not connected
2. If Serial Monitor shows real values but dashboard shows zeros:
   - Backend not receiving data
   - Check backend console for "📥 Received sensor data"

---

## 📋 Quick Checklist

- [ ] Backend running (port 3001)
- [ ] ESP32 connected to WiFi
- [ ] Serial Monitor shows "📤 POST → HTTP 201"
- [ ] Backend console shows "📥 Received sensor data"
- [ ] Frontend running (port 5173)
- [ ] Dashboard logged in
- [ ] Dashboard shows green "System Online"

---

## 🎯 Expected Behavior

**Without Sensors:**
- Serial Monitor: `Temp: 25.0°C | Humidity: 60.0%` (defaults)
- Dashboard: `Temperature: 25°C, Humidity: 60%`

**With Sensors:**
- Serial Monitor: `Temp: 28.5°C | Humidity: 65.2%` (real values)
- Dashboard: `Temperature: 28.5°C, Humidity: 65.2%` (same values!)

---

## ✅ Success Indicators

1. ✅ Serial Monitor: `📤 POST → HTTP 201`
2. ✅ Backend Console: `📥 Received sensor data: {...}`
3. ✅ Dashboard: Green "System Online" indicator
4. ✅ Dashboard values match Serial Monitor values
5. ✅ Dashboard updates every 5 seconds

---

**The dashboard ALWAYS shows exactly what ESP32 sends! 🌱**
