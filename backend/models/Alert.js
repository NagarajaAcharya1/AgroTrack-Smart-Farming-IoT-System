const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    type: { type: String, enum: ['moisture', 'temperature', 'health', 'system'], required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
