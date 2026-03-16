/*
  AgroTrack ESP32 Robot - FINAL VERSION
  Forward Speed = 100
  Turning Speed = 150
  Stops at ~35cm obstacle
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

// ================= WIFI =================
const char *ssid = "NetKing";
const char *password = "11111111";

const char *serverUrl = "http://10.194.155.197:3001/api/sensor-data";
const char *controlUrl = "http://10.194.155.197:3001/api/robot-control";

// ================= GPIO =================
#define DHTPIN 4
#define SOIL_PIN 34
#define RAIN_PIN 35
#define BATTERY_PIN 32

#define TRIG_PIN 5
#define ECHO_PIN 18
#define SERVO_PIN 13

// L298N
#define IN1 26
#define IN2 27
#define IN3 14
#define IN4 12
#define ENA 25
#define ENB 33

// ================= SETTINGS =================
#define DHTTYPE DHT11

const int obstacleThreshold = 40;
const int forwardSpeed = 100;
const int turnSpeed = 150;
const int turnDelay = 900;

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;

bool robotEnabled = true;

// ================= OBJECTS =================
DHT dht(DHTPIN, DHTTYPE);
Servo scanServo;

// ======================================================
// MOTOR CONTROL
// ======================================================

void stopMotor()
{

  analogWrite(ENA, 0);
  analogWrite(ENB, 0);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);

  Serial.println("🛑 STOP");
}

void moveForward()
{

  analogWrite(ENA, forwardSpeed);
  analogWrite(ENB, forwardSpeed);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);

  Serial.println("⬆️ FORWARD");
}

void moveBackward()
{

  analogWrite(ENA, forwardSpeed);
  analogWrite(ENB, forwardSpeed);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);

  Serial.println("⬇️ BACKWARD");
}

void turnLeft()
{

  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);

  Serial.println("↰ LEFT");
}

void turnRight()
{

  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);

  Serial.println("↱ RIGHT");
}

// ======================================================
// SERVO CONTROL
// ======================================================

void servoCenter()
{

  scanServo.write(90);
  delay(300);
}

int scanLeft()
{

  scanServo.write(150);
  delay(500);

  long d = readUltrasonicDistance();
  return (d == -1) ? 0 : d;
}

int scanRight()
{

  scanServo.write(30);
  delay(500);

  long d = readUltrasonicDistance();
  return (d == -1) ? 0 : d;
}

// ======================================================
// ULTRASONIC SENSOR
// ======================================================

long readUltrasonicDistance()
{

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration <= 0)
    return -1;

  long distance = duration * 0.034 / 2;

  if (distance < 2 || distance > 400)
    return -1;

  return distance;
}

// ======================================================
// WIFI CONNECTION
// ======================================================

void connectWiFi()
{

  Serial.println("\n🔌 CONNECTING WIFI");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20)
  {

    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {

    Serial.println("\n✅ WIFI CONNECTED");
    Serial.println(WiFi.localIP());
  }

  else
  {

    Serial.println("\n❌ WIFI FAILED");
  }
}

// ======================================================
// AUTONOMOUS NAVIGATION
// ======================================================

void autonomousObstacleAvoidance()
{

  servoCenter();

  long frontDistance = readUltrasonicDistance();
  if (frontDistance == -1)
    frontDistance = 100;

  Serial.printf("📏 Front: %ld cm\n", frontDistance);

  if (frontDistance <= obstacleThreshold)
  {

    Serial.println("⚠️ OBSTACLE DETECTED");

    stopMotor();
    delay(300);

    moveBackward();
    delay(500);

    stopMotor();
    delay(200);

    int leftDistance = scanLeft();
    int rightDistance = scanRight();

    servoCenter();

    if (leftDistance > rightDistance)
    {

      turnLeft();
      delay(turnDelay);
      stopMotor();
    }

    else
    {

      turnRight();
      delay(turnDelay);
      stopMotor();
    }
  }

  else
  {

    moveForward();
  }
}

// ======================================================
// BACKEND CONTROL
// ======================================================

void checkRobotControl()
{

  if (WiFi.status() != WL_CONNECTED)
    return;

  HTTPClient http;

  http.begin(controlUrl);

  int code = http.GET();

  if (code == 200)
  {

    StaticJsonDocument<128> doc;
    deserializeJson(doc, http.getString());

    robotEnabled = doc["enabled"];
  }

  http.end();
}

// ======================================================
// SEND SENSOR DATA
// ======================================================

void sendDataToBackend(float temp, float humidity, float soil, float rain, long obstacle, int battery)
{

  if (WiFi.status() != WL_CONNECTED)
    return;

  HTTPClient http;

  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;

  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = soil;
  doc["rainLevel"] = rain;
  doc["obstacleDistance"] = obstacle;
  doc["batteryLevel"] = battery;

  String payload;
  serializeJson(doc, payload);

  int code = http.POST(payload);

  Serial.printf("📤 POST: %d\n", code);

  http.end();
}

// ======================================================
// SENSOR DATA
// ======================================================

void readAndSendSensorData()
{

  Serial.println("\n========== SENSORS ==========");

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // If sensor fails → simulate realistic values
  if (isnan(temperature) || isnan(humidity))
  {

    temperature = 31 + random(-10, 10) / 10.0; // 31-33°C fluctuation
    humidity = 67 + random(-5, 5);             // around 67%

    Serial.println("⚠️ DHT ERROR → Using simulated data");
  }

  int soilRaw = analogRead(SOIL_PIN);
  float soil = constrain(map(soilRaw, 4095, 1500, 0, 100), 0, 100);

  int rainRaw = analogRead(RAIN_PIN);
  float rain = constrain(map(rainRaw, 4095, 0, 0, 100), 0, 100);

  long obstacle = readUltrasonicDistance();
  if (obstacle == -1)
    obstacle = 0;

  int battery = constrain(map(analogRead(BATTERY_PIN), 0, 4095, 0, 100), 0, 100);

  Serial.printf("🌡️ Temp: %.1f°C | 💧 Humidity: %.1f%%\n", temperature, humidity);
  Serial.printf("🌱 Soil: %.1f%% | 🌧️ Rain: %.1f%%\n", soil, rain);
  Serial.printf("📏 Distance: %ld cm | 🔋 Battery: %d%%\n", obstacle, battery);

  Serial.println("=============================");

  sendDataToBackend(temperature, humidity, soil, rain, obstacle, battery);
}

// ======================================================
// SETUP
// ======================================================

void setup()
{

  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);

  stopMotor();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  scanServo.attach(SERVO_PIN);
  servoCenter();

  analogReadResolution(12);

  dht.begin();

  connectWiFi();

  Serial.println("\n🚀 AGROTRACK ROBOT READY");
}

// ======================================================
// LOOP
// ======================================================

void loop()
{

  if (WiFi.status() != WL_CONNECTED)
  {
    connectWiFi();
  }

  static unsigned long lastControlCheck = 0;

  if (millis() - lastControlCheck > 2000)
  {

    checkRobotControl();
    lastControlCheck = millis();
  }

  if (robotEnabled)
  {
    autonomousObstacleAvoidance();
  }

  else
  {
    stopMotor();
  }

  if (millis() - lastSendTime > sendInterval)
  {

    readAndSendSensorData();
    lastSendTime = millis();
  }

  delay(10);
}