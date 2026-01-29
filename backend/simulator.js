const mongoose = require('mongoose');
const SensorData = require('./models/SensorData');
const Alert = require('./models/Alert');

// Random number generator within range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Simulation state
let currentTemp = 25;
let currentMoisture = 60;
let currentHumidity = 50;
let currentBattery = 100;

const simulateData = async (io) => {
    // Drift values naturally
    currentTemp += random(-1, 1);
    if (currentTemp < 10) currentTemp = 10;
    if (currentTemp > 40) currentTemp = 40;

    currentMoisture += random(-2, 1); // Tend to dry out
    if (currentMoisture < 0) currentMoisture = 0;
    if (currentMoisture > 100) currentMoisture = 100;

    currentHumidity += random(-1, 1);
    if (currentHumidity < 20) currentHumidity = 20;
    if (currentHumidity > 90) currentHumidity = 90;

    if (Math.random() > 0.95) currentBattery -= 1; // Drain battery slowly

    const newData = new SensorData({
        soilMoisture: currentMoisture,
        temperature: currentTemp,
        humidity: currentHumidity,
        cropHealth: random(70, 95), // Relatively healthy
        batteryLevel: currentBattery,
        location: { lat: 12.9716, lng: 77.5946 } // Static for now
    });

    try {
        await newData.save();
        console.log('🌱 Data Simulated:', newData);

        // Check for Alerts
        if (currentMoisture < 30) {
            const alert = new Alert({ type: 'moisture', message: 'Low Soil Moisture Detected!', severity: 'warning' });
            await alert.save();
            if (io) io.emit('alert', alert);
        }
        else if (currentTemp > 35) {
            const alert = new Alert({ type: 'temperature', message: 'High Temperature Alert!', severity: 'critical' });
            await alert.save();
            if (io) io.emit('alert', alert);
        }

        // Emit real-time update
        if (io) {
            io.emit('sensor-update', newData);
        }

    } catch (err) {
        console.error('Simulation Error:', err);
    }
};

module.exports = { simulateData };
