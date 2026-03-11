/*
  MOTOR TEST - Test L298N connections
  Upload this first to verify motors work
*/

// Motor Driver L298N pins
#define IN1 26
#define IN2 27
#define IN3 14
#define IN4 12
#define ENA 25
#define ENB 33

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n🔧 MOTOR TEST STARTING...");
  
  // Set all pins as OUTPUT
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  
  // Enable motors - KEEP HIGH
  digitalWrite(ENA, HIGH);
  digitalWrite(ENB, HIGH);
  
  // Stop all motors initially
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  
  Serial.println("✅ Pins configured");
  Serial.println("⚠️ MAKE SURE:");
  Serial.println("   - Battery connected (7.4V)");
  Serial.println("   - L298N jumpers REMOVED from ENA/ENB");
  Serial.println("   - Common GND connected");
  Serial.println("\n🚀 Starting motor test in 3 seconds...\n");
  delay(3000);
}

void loop() {
  // Test 1: FORWARD
  Serial.println("⬆️ TEST 1: FORWARD (3 sec)");
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  delay(3000);
  
  // STOP
  Serial.println("🛑 STOP (2 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  delay(2000);
  
  // Test 2: BACKWARD
  Serial.println("⬇️ TEST 2: BACKWARD (3 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  delay(3000);
  
  // STOP
  Serial.println("🛑 STOP (2 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  delay(2000);
  
  // Test 3: LEFT
  Serial.println("↰ TEST 3: LEFT (3 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  delay(3000);
  
  // STOP
  Serial.println("🛑 STOP (2 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  delay(2000);
  
  // Test 4: RIGHT
  Serial.println("↱ TEST 4: RIGHT (3 sec)");
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  delay(3000);
  
  // STOP
  Serial.println("🛑 STOP (5 sec)");
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  delay(5000);
  
  Serial.println("\n✅ Test cycle complete! Repeating...\n");
  delay(2000);
}
