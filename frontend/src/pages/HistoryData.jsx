import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Download } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const HistoryData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ start: '', end: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/sensor-data');
            // Assuming API returns array of objects
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const headers = ["Timestamp", "Avg Temp", "Avg Humidity", "Avg Moisture", "Battery"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + data.map(row => `${new Date(row.timestamp).toISOString()},${row.temperature},${row.humidity},${row.soilMoisture},${row.batteryLevel}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "agrotrack_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Calendar className="text-agro-500" />
                    Historical Data
                </h1>

                <div className="flex gap-2">
                    <button onClick={handleDownload} className="btn-outline flex items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                    <input type="date" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">End Date</label>
                    <input type="date" className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                </div>
                <button className="btn-primary" onClick={() => alert('Filter logic to be connected to API')}>
                    <Search size={18} /> Filter
                </button>
            </div>

            {/* Data Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700">
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Temperature</th>
                                <th className="p-4">Humidity</th>
                                <th className="p-4">Soil Moisture</th>
                                <th className="p-4">Crop Health</th>
                                <th className="p-4">Battery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No data found</td></tr>
                            ) : (
                                data.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-750/50 transition-colors">
                                        <td className="p-4 text-slate-300">{new Date(row.timestamp).toLocaleString()}</td>
                                        <td className="p-4 font-mono text-orange-300">{row.temperature}°C</td>
                                        <td className="p-4 font-mono text-cyan-300">{row.humidity}%</td>
                                        <td className="p-4 font-mono text-blue-300">{row.soilMoisture}%</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.cropHealth > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {row.cropHealth}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500">{row.batteryLevel}%</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryData;
