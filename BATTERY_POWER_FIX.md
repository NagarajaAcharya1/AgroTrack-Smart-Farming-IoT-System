# 🔋 Battery Power & Sensor Issues - Solutions

## Issue 1: No Data When Running on Battery

### Problem:
- Works fine when connected to laptop USB
- No data sent to backend when powered by battery
- Backend only shows: `🔌 Client connected`

### Root Causes:

**1. Insufficient Battery Voltage**
- ESP32 needs stable 3.3V or 5V
- Battery voltage drops under load (motors + WiFi)
- ESP32 browns out or WiFi fails

**2. Power Distribution**
- Motors draw high current (500mA-1A each)
- ESP32 WiFi needs 200-400mA
- Battery can't supply enough current

**3. Voltage Regulator Issues**
- L298N motor driver has built-in 5V regulator
- May not handle total current load
- Voltage drops below ESP32 minimum

### Solutions:

#### Solution 1: Separate Power Supplies (RECOMMENDED)
```
Battery 1 (7.4V LiPo) → L298N → Motors
Battery 2 (3.7V LiPo) → ESP32 VIN (or use voltage regulator)
```

**Wiring:**
```
Battery 1 (7.4V):
  + → L298N +12V
  - → L298N GND

Battery 2 (3.7V):
  + → ESP32 VIN (or 3.3V pin)
  - → ESP32 GND

Connect GNDs together: L298N GND ↔ ESP32 GND
```

#### Solution 2: Use Buck Converter
```
Battery (7.4V-12V) → Buck Converter (5V 3A) → ESP32
                   ↓
                L298N → Motors
```

**Components Needed:**
- LM2596 Buck Converter (adjustable, 3A)
- Set output to 5V
- Connect to ESP32 VIN pin

#### Solution 3: Add Capacitors
```
Add 1000µF capacitor across:
- ESP32 power pins (VIN to GND)
- L298N power input (+12V to GND)
```

This smooths voltage spikes from motors.

#### Solution 4: Reduce Power Consumption
```cpp
// In ESP32 code, reduce WiFi power
WiFi.setTxPower(WIFI_POWER_11dBm); // Lower power mode

// Increase send interval
const unsigned long sendInterval = 10000; // 10 seconds instead of 5
```

---

## Issue 2: Ultrasonic Sensor Reading Zero

### Problem:
- Serial Monitor shows: `[DEBUG] No echo received`
- Obstacle distance always 0 cm
- Backend receives: `obstacle: 0`

### Root Causes:

**1. Wiring Issues**
- Loose connections
- Wrong GPIO pins
- Insufficient power to sensor

**2. Sensor Power**
- HC-SR04 needs 5V (not 3.3V)
- May work intermittently on 3.3V
- Battery voltage drop affects sensor

**3. Timing Issues**
- Motor noise interferes with ultrasonic
- Servo movement causes voltage drop
- pulseIn() timeout too short

### Solutions:

#### Solution 1: Check Wiring
```
HC-SR04 Connections:
  VCC  → ESP32 5V (or VIN if using 5V supply)
  TRIG → ESP32 GPIO 5
  ECHO → ESP32 GPIO 18 (use voltage divider if powering sensor with 5V)
  GND  → ESP32 GND

Voltage Divider for ECHO (if using 5V):
  ECHO → 1kΩ resistor → GPIO 18
              ↓
           2kΩ resistor
              ↓
             GND
```

#### Solution 2: Test Sensor Separately
```cpp
// Upload this test code to verify sensor works
void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 50000);
  long distance = duration * 0.034 / 2;
  
  Serial.printf("Duration: %ld | Distance: %ld cm\n", duration, distance);
  delay(500);
}
```

#### Solution 3: Add Delay Before Reading
```cpp
// In autonomousObstacleAvoidance()
stopMotor(); // Stop motors first
delay(100);  // Wait for vibrations to settle
int frontDistance = readUltrasonicDistance();
```

#### Solution 4: Increase Timeout
```cpp
long readUltrasonicDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Increase timeout to 50ms (allows up to 8.5m range)
  long duration = pulseIn(ECHO_PIN, HIGH, 50000);
  
  if (duration <= 0) {
    return -1;
  }
  
  long distance = duration * 0.034 / 2;
  return distance;
}
```

---

## Issue 3: Motor Direction Wrong

### Problem:
- Front wheels rotate in opposite directions
- Robot spins instead of moving forward

### Solution: ✅ FIXED
The code has been updated with correct motor directions:

```cpp
void moveForward() {
  // Both motors forward - same direction
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}
```

**If still wrong, swap motor wires:**
- Swap IN1 ↔ IN2 for left motor
- OR swap IN3 ↔ IN4 for right motor
- OR physically swap motor wire connections

---

## Complete Troubleshooting Checklist

### When Running on Battery:

- [ ] Battery fully charged (7.4V LiPo should read 8.4V when full)
- [ ] Battery can supply 2-3A continuous current
- [ ] Voltage doesn't drop below 6V under load
- [ ] ESP32 VIN receives stable 5V
- [ ] All GNDs connected together
- [ ] Capacitors added for voltage smoothing
- [ ] WiFi power reduced if needed
- [ ] Serial Monitor shows WiFi connected
- [ ] Serial Monitor shows POST Code: 201

### For Ultrasonic Sensor:

- [ ] Sensor powered with 5V (not 3.3V)
- [ ] ECHO pin protected with voltage divider
- [ ] Wiring secure (no loose connections)
- [ ] Sensor facing forward (not blocked)
- [ ] Motors stopped before reading
- [ ] Serial Monitor shows duration > 0
- [ ] Distance reading makes sense (2-400 cm)

### For Motor Direction:

- [ ] Both wheels rotate same direction for forward
- [ ] Both wheels rotate opposite direction for backward
- [ ] Left turn: left wheel back, right wheel forward
- [ ] Right turn: left wheel forward, right wheel back

---

## Recommended Hardware Setup

### Power System:
```
Main Battery (7.4V 2200mAh LiPo)
  ├─→ Buck Converter (5V 3A) → ESP32 VIN
  └─→ L298N Motor Driver → Motors
```

### Sensor Power:
```
ESP32 5V Pin → HC-SR04 VCC (with voltage divider on ECHO)
ESP32 3.3V → DHT11, Soil, Rain sensors
```

### Current Requirements:
- ESP32 WiFi: 200-400mA
- Each Motor: 500-1000mA
- Sensors: 50-100mA
- **Total: 1.5-2.5A**

Use battery rated for at least 3A continuous discharge.

---

## Quick Test Procedure

### 1. Test with USB Power First
```
✅ Upload code
✅ Open Serial Monitor
✅ Verify WiFi connects
✅ Verify sensors read correctly
✅ Verify data posts to backend
✅ Check dashboard updates
```

### 2. Test with Battery (Motors Disabled)
```cpp
// Temporarily disable motors in loop()
void loop() {
  // autonomousObstacleAvoidance(); // Comment out
  stopMotor(); // Keep motors off
  
  // Rest of code...
}
```

If WiFi works with motors off, it's a power issue.

### 3. Test with Battery (Motors Enabled)
```
✅ Fully charge battery
✅ Upload code with motors enabled
✅ Monitor Serial output
✅ Check if WiFi stays connected
✅ Verify data still posts
```

If WiFi fails, add separate power supply for ESP32.

---

## Debug Output to Watch

**Good Output:**
```
WiFi Connected
10.194.155.xxx
[DEBUG] Ultrasonic duration: 5800
[DEBUG] Calculated distance: 98 cm
Front Distance: 98 cm
Sensor Data:
Temp: 25.0 C
Obstacle: 98 cm
POST Code: 201
```

**Bad Output (Power Issue):**
```
WiFi Connected
10.194.155.xxx
[DEBUG] No echo received
Front Distance: 0 cm
POST Code: -1  ← WiFi failed
```

**Bad Output (Sensor Issue):**
```
WiFi Connected
[DEBUG] Ultrasonic duration: 0
[DEBUG] No echo received
POST Code: 201  ← WiFi OK, sensor failed
```

---

## Final Recommendations

1. **Use separate power for ESP32** - Most reliable solution
2. **Add 1000µF capacitors** - Smooth voltage spikes
3. **Test sensors individually** - Isolate problems
4. **Monitor battery voltage** - Replace when below 7V
5. **Use quality batteries** - Cheap batteries can't supply enough current

**The updated code now has:**
- ✅ Fixed motor directions
- ✅ Ultrasonic debugging output
- ✅ Better error handling
- ✅ Assumes clear path if sensor fails

Upload and test!
