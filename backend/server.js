// -------------------- Imports --------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Simulator
const { simulateData } = require('./simulator');

// Models
const SensorData = require('./models/SensorData');
const Alert = require('./models/Alert');
const User = require('./models/User');

// -------------------- Config --------------------
dotenv.config();

const app = express();
app.set('trust proxy', 1);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

// -------------------- Middlewares --------------------
app.use(cors({
    origin: [
        "https://agrotrack-frontend.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// -------------------- Database Connection --------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// -------------------- Health Check --------------------
app.get('/health', (req, res) => {
    res.json({
        status: 'AgroTrack backend running 🚜🌱',
        timestamp: new Date()
    });
});

// -------------------- Auth APIs (Simple Demo) --------------------
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password === password) {
        return res.json({
            token: 'mock-jwt-token',
            user: { email: user.email, role: user.role }
        });
    }

    // Demo admin login
    if (email === 'admin@agro.com' && password === 'admin') {
        return res.json({
            token: 'admin-token',
            user: { email, role: 'admin' }
        });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

// -------------------- Sensor Data APIs --------------------
app.post('/api/sensor-data', async (req, res) => {
    try {
        const {
            soilMoisture,
            temperature,
            humidity,
            cropHealth,
            batteryLevel,
            location
        } = req.body;

        const newData = new SensorData({
            soilMoisture,
            temperature,
            humidity,
            cropHealth: cropHealth || 85,
            batteryLevel: batteryLevel || 100,
            location: location || { lat: 12.9716, lng: 77.5946 }
        });

        await newData.save();

        // Alert condition
        if (soilMoisture < 30) {
            const alert = new Alert({
                type: 'moisture',
                message: 'Critical: Low Soil Moisture Detected!',
                severity: 'critical'
            });
            await alert.save();
            io.emit('alert', alert);
        }

        // Real-time update
        io.emit('sensor-update', newData);

        res.status(201).json({
            message: 'Sensor data saved',
            data: newData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/sensor-data', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const data = await SensorData.find()
            .sort({ timestamp: -1 })
            .limit(limit);

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
            query.timestamp = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }

        const data = await SensorData.find(query).sort({ timestamp: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find()
            .sort({ timestamp: -1 })
            .limit(10);

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- Admin APIs --------------------
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalReadings = await SensorData.countDocuments();
        const totalAlerts = await Alert.countDocuments();

        // Simple system status logic: if last reading is < 1 min ago, it's Online
        const lastReading = await SensorData.findOne().sort({ timestamp: -1 });
        const now = new Date();
        const isOnline = lastReading && (now - new Date(lastReading.timestamp)) < 60000;

        res.json({
            totalReadings,
            totalAlerts,
            systemStatus: isOnline ? 'Online' : 'Offline',
            lastUpdated: new Date()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- Socket.IO --------------------
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// -------------------- Simulator Control --------------------
if (process.env.ENABLE_SIMULATOR === 'true') {
    console.log('🧪 Sensor simulator enabled');
    setInterval(() => {
        simulateData(io);
    }, 5000);
}

// -------------------- Server Start --------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 AgroTrack server running on port ${PORT}`);
});
