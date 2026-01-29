import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import SensorCard from '../components/SensorCard';
import { Droplets, Thermometer, CloudFog, Activity, Cpu } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    // State
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        soilMoisture: 0,
        cropHealth: 0,
        batteryLevel: 0,
        timestamp: new Date()
    });

    const [isConnected, setIsConnected] = useState(false);
    const [history, setHistory] = useState([]);

    // Socket Connection
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to WebSocket');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('sensor-update', (data) => {
            setSensorData(data);
            setHistory(prev => {
                const newHistory = [...prev, data];
                if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
                return newHistory;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Chart Data Preparation
    const labels = history.map(d => new Date(d.timestamp).toLocaleTimeString());

    const tempHumidityData = {
        labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: history.map(d => d.temperature),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4
            },
            {
                label: 'Humidity (%)',
                data: history.map(d => d.humidity),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.4
            }
        ]
    };

    const moistureData = {
        labels,
        datasets: [
            {
                label: 'Soil Moisture (%)',
                data: history.map(d => d.soilMoisture),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#94a3b8' } },
            title: { display: false }
        },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Field Monitor Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-slate-400 font-medium">{isConnected ? 'System Online' : 'Disconnected'}</span>
                </div>
            </div>

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SensorCard
                    title="Soil Moisture"
                    value={sensorData.soilMoisture}
                    unit="%"
                    icon={Droplets}
                    color="text-blue-400"
                    trend={-2}
                />
                <SensorCard
                    title="Temperature"
                    value={sensorData.temperature}
                    unit="°C"
                    icon={Thermometer}
                    color="text-orange-400"
                    trend={5}
                />
                <SensorCard
                    title="Humidity"
                    value={sensorData.humidity}
                    unit="%"
                    icon={CloudFog}
                    color="text-cyan-400"
                />
                <SensorCard
                    title="Crop Health"
                    value={sensorData.cropHealth}
                    unit="Index"
                    icon={Activity}
                    color="text-green-400"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Thermometer size={20} className="text-slate-400" />
                        Environmental Trends
                    </h3>
                    <Line data={tempHumidityData} options={chartOptions} />
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Droplets size={20} className="text-slate-400" />
                        Soil Moisture Analysis
                    </h3>
                    <Bar data={moistureData} options={chartOptions} />
                </div>
            </div>

            {/* Robot Status & Map Placeholder */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="card md:col-span-1">
                    <h3 className="text-xl font-bold mb-4">Robot Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-400">Battery Level</span>
                            <div className="flex items-center gap-2 font-bold text-green-400">
                                <Cpu size={16} />
                                {sensorData.batteryLevel}%
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-400">Signal Strength</span>
                            <span className="font-bold text-white">Excellent (-45dBm)</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-400">Next Scan</span>
                            <span className="font-bold text-white">00:05:00</span>
                        </div>
                    </div>
                </div>

                <div className="card md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Live Field Map</h3>
                    <div className="aspect-video bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500">
                        Map Visualization (Pending GPS Integration)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
