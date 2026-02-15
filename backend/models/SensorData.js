const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    soilMoisture: { type: Number, required: true }, // Percentage
    temperature: { type: Number, required: true }, // Celsius
    humidity: { type: Number, required: true }, // Percentage
    cropHealth: { type: Number, default: 0 }, // NDVI or index 0-100
    batteryLevel: { type: Number, default: 100 }, // Robot battery %
    rainLevel: { type: Number, default: 0 }, // Rain sensor %
    obstacleDistance: { type: Number, default: 0 }, // Ultrasonic distance cm
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    timestamp: { type: Date, default: Date.now }
});

// Index for efficient querying by date
sensorDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
