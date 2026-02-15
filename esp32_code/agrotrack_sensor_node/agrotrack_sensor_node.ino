/*
  AgroTrack ESP32 Sensor Node
  Final Circuit-Aligned Version

  Sensors:
  - DHT11 (GPIO 4)
  - Soil Moisture (GPIO 34 - ADC)
  - Rain Sensor (GPIO 35 - ADC)
  - Ultrasonic HC-SR04 (TRIG 5, ECHO 18)
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ================= WIFI =================
const char *ssid = "NetKing";
const char *password = "11111111";

const char *serverUrl =
    "http://10.194.155.197:3001/api/sensor-data";

// ================= GPIO =================
#define DHTPIN 4
#define DHTTYPE DHT11

#define SOIL_PIN 34
#define RAIN_PIN 35
#define TRIG_PIN 5
#define ECHO_PIN 18

// Soil calibration (adjust after testing)
#define SOIL_DRY 4095
#define SOIL_WET 1500

// Rain calibration
#define RAIN_DRY 4095
#define RAIN_WET 0

// ================= SETTINGS =================
const unsigned long sendInterval = 5000;
unsigned long lastSendTime = 0;

DHT dht(DHTPIN, DHTTYPE);

// ======================================================
void setup()
{
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  analogReadResolution(12); // 0–4095
  analogSetAttenuation(ADC_11db);

  dht.begin();

  Serial.println("\n🌱 AgroTrack ESP32 Sensor Node Started");
  connectWiFi();
}

// ======================================================
void loop()
{

  if (WiFi.status() != WL_CONNECTED)
  {
    connectWiFi();
  }

  if (millis() - lastSendTime >= sendInterval)
  {
    readAndSendSensorData();
    lastSendTime = millis();
  }
}

// ======================================================
void connectWiFi()
{

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("📡 Connecting to WiFi");

  unsigned long startAttempt = millis();

  while (WiFi.status() != WL_CONNECTED &&
         millis() - startAttempt < 10000)
  {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\n✅ WiFi Connected");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println("\n❌ WiFi Connection Failed");
  }
}

// ======================================================
long readUltrasonicDistance()
{

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration == 0)
    return -1;

  long distance = duration * 0.034 / 2;

  if (distance > 400)
    return -1;

  return distance;
}

// ======================================================
void readAndSendSensorData()
{
  // -------- DHT11 with retry --------
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("⚠️ DHT11 Error - Retrying...");
    delay(2000); // DHT11 needs time
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    
    if (isnan(temperature) || isnan(humidity))
    {
      Serial.println("❌ DHT11 Not Connected - Using defaults");
      temperature = 25.0; // Default room temp
      humidity = 60.0;    // Default humidity
    }
  }

  // -------- Soil Moisture --------
  int soilRaw = analogRead(SOIL_PIN);
  Serial.printf("[DEBUG] Soil Raw ADC: %d\n", soilRaw);
  
  float soilPercent;
  if (soilRaw == 0 || soilRaw == 4095) {
    Serial.println("⚠️ Soil sensor may not be connected");
    soilPercent = map(soilRaw, SOIL_DRY, SOIL_WET, 0, 100);
  } else {
    soilPercent = map(soilRaw, SOIL_DRY, SOIL_WET, 0, 100);
  }
  soilPercent = constrain(soilPercent, 0, 100);

  // -------- Rain Sensor --------
  int rainRaw = analogRead(RAIN_PIN);
  Serial.printf("[DEBUG] Rain Raw ADC: %d\n", rainRaw);
  
  float rainPercent;
  if (rainRaw == 0 || rainRaw == 4095) {
    Serial.println("⚠️ Rain sensor may not be connected");
    rainPercent = map(rainRaw, RAIN_DRY, RAIN_WET, 0, 100);
  } else {
    rainPercent = map(rainRaw, RAIN_DRY, RAIN_WET, 0, 100);
  }
  rainPercent = constrain(rainPercent, 0, 100);

  // -------- Ultrasonic --------
  long obstacleDistance = readUltrasonicDistance();
  if (obstacleDistance == -1)
    obstacleDistance = 0;

  // -------- Crop Health --------
  int cropHealth = calculateCropHealth(
      temperature,
      humidity,
      soilPercent);

  // -------- Serial Debug --------
  Serial.println("\n📊 Sensor Readings:");
  Serial.printf("Temp: %.1f°C | Humidity: %.1f%%\n", temperature, humidity);
  Serial.printf("Soil Raw: %d → %.1f%%\n", soilRaw, soilPercent);
  Serial.printf("Rain Raw: %d → %.1f%%\n", rainRaw, rainPercent);
  Serial.printf("Obstacle: %ld cm\n", obstacleDistance);
  Serial.printf("Crop Health: %d/100\n", cropHealth);

  // -------- Send to Backend --------
  sendDataToBackend(
      temperature,
      humidity,
      soilPercent,
      rainPercent,
      cropHealth,
      obstacleDistance);
}

// ======================================================
int calculateCropHealth(float temp,
                        float humidity,
                        float moisture)
{

  int health = 100;

  if (temp < 15 || temp > 35)
    health -= 20;
  if (moisture < 20)
    health -= 40;
  if (humidity < 30 || humidity > 85)
    health -= 15;

  return constrain(health, 0, 100);
}

// ======================================================
void sendDataToBackend(float temp,
                       float humidity,
                       float moisture,
                       float rain,
                       int health,
                       long obstacle)
{

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("❌ No WiFi - Skipping POST");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);

  StaticJsonDocument<256> doc;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = moisture;
  doc["rainLevel"] = rain;
  doc["cropHealth"] = health;
  doc["obstacleDistance"] = obstacle;

  String payload;
  serializeJson(doc, payload);

  int code = http.POST(payload);

  if (code > 0)
  {
    Serial.printf("📤 POST → HTTP %d\n", code);
  }
  else
  {
    Serial.printf("❌ HTTP Error: %s\n",
                  http.errorToString(code).c_str());
  }

  http.end();
}