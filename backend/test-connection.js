// Test script to verify backend is receiving data
// Run with: node test-connection.js

const axios = require('axios');

const testData = {
    temperature: 25.5,
    humidity: 65.0,
    soilMoisture: 45.0,
    rainLevel: 10.0,
    cropHealth: 85,
    obstacleDistance: 30
};

console.log('🧪 Testing backend connection...\n');
console.log('Sending test data:', testData);

axios.post('http://localhost:3001/api/sensor-data', testData)
    .then(response => {
        console.log('\n✅ SUCCESS! Backend received data');
        console.log('Response:', response.data);
        console.log('\n📊 Check your dashboard - data should appear!');
    })
    .catch(error => {
        console.log('\n❌ ERROR! Backend not reachable');
        if (error.code === 'ECONNREFUSED') {
            console.log('Backend is not running on port 3001');
            console.log('Start it with: cd backend && npm run dev');
        } else {
            console.log('Error:', error.message);
        }
    });
