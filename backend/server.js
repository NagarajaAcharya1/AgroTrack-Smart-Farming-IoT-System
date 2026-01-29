const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { simulateData } = require('./simulator');

// Models
const SensorData = require('./models/SensorData');
const Alert = require('./models/Alert');
const User = require('./models/User');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agrotrack')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API Routes ---

// 1. Auth Headers (Mock for now or simple manual implementation)
// Note: Keeping it simple for the POC as requested, but structure is there.

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Ideally use bcrypt here, storing plain for POC as per request speed
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    // TODO: Implement proper bcrypt comparison and JWT generation
    const user = await User.findOne({ email });
    if (user && user.password === password) { // Insecure plain text for demo only if needed quickly, but using bcrypt in real app
        res.json({ token: 'mock-jwt-token', user: { email: user.email, role: user.role } });
    } else {
        // Mock admin login
        if (email === 'admin@agro.com' && password === 'admin') {
            res.json({ token: 'admin-token', user: { email, role: 'admin' } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
});

// 2. Real Sensor Data Ingestion
app.post('/api/sensor-data', async (req, res) => {
    try {
        const { soilMoisture, temperature, humidity, cropHealth, batteryLevel, location } = req.body;

        const newData = new SensorData({
            soilMoisture,
            temperature,
            humidity,
            cropHealth: cropHealth || 85, // Default if not provided
            batteryLevel: batteryLevel || 100,
            location: location || { lat: 12.9716, lng: 77.5946 }
        });

        await newData.save();

        // Check for critical alerts (simple logic)
        if (soilMoisture < 30) {
            const alert = new Alert({ type: 'moisture', message: 'Critical: Low Soil Moisture Detected via Sensor!', severity: 'critical' });
            await alert.save();
            io.emit('alert', alert);
        }

        // Real-time broadcast
        io.emit('sensor-update', newData);

        res.status(201).json({ message: 'Data received and saved', data: newData });
    } catch (err) {
        console.error('Error receiving sensor data:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/sensor-data', async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const data = await SensorData.find().sort({ timestamp: -1 }).limit(parseInt(limit));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/sensor-data/history', async (req, res) => {
    try {
        const { start, end } = req.query;
        const query = {};
        if (start && end) {
            query.timestamp = { $gte: new Date(start), $lte: new Date(end) };
        }
        const data = await SensorData.find(query).sort({ timestamp: 1 }); // Ascending for charts
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 }).limit(10);
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
    });
});

// --- Simulation Loop ---
// Simulate data every 5 seconds
setInterval(() => {
    simulateData(io);
}, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
