import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    Database,
    Server,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalReadings: 0, totalAlerts: 0, systemStatus: 'Checking...' });
    const [alerts, setAlerts] = useState([]);
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Parallel data fetching
            const [statsRes, alertsRes, dataRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/stats'),
                fetch('http://localhost:5000/api/alerts?limit=5'),
                fetch('http://localhost:5000/api/sensor-data?limit=10')
            ]);

            const statsData = await statsRes.json();
            const alertsData = await alertsRes.json();
            const sensorDataList = await dataRes.json();

            setStats(statsData);
            setAlerts(alertsData);
            setSensorData(sensorDataList);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Helper for status color
    const getStatusColor = (status) => {
        return status === 'Online' ? 'text-emerald-500' : 'text-rose-500';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Console</h1>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        Refresh Data
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Data Points</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalReadings}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Database className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Alerts</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalAlerts}</h3>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</p>
                                <h3 className={`text-2xl font-bold mt-1 ${getStatusColor(stats.systemStatus)}`}>
                                    {stats.systemStatus}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <Server className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Data Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity size={20} className="text-indigo-500" />
                                Data Inspector (Newest 10)
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Moisture</th>
                                        <th className="px-6 py-4">Temp</th>
                                        <th className="px-6 py-4">Battery</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {sensorData.map((data) => (
                                        <tr key={data._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {new Date(data.timestamp).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.soilMoisture < 30 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    }`}>
                                                    {data.soilMoisture}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{data.temperature}°C</td>
                                            <td className="px-6 py-4">{data.batteryLevel}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Alert Log */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle size={20} className="text-amber-500" />
                                Recent Alerts
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
                            {alerts.length === 0 ? (
                                <p className="p-6 text-center text-slate-500">No alerts recorded.</p>
                            ) : (
                                alerts.map((alert) => (
                                    <div key={alert._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                                                {alert.severity}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {alert.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
