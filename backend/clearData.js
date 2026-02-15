const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const SensorData = require('./models/SensorData');
const Alert = require('./models/Alert');

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const sensorCount = await SensorData.countDocuments();
        const alertCount = await Alert.countDocuments();

        console.log(`\n📊 Current Data:`);
        console.log(`   Sensor Readings: ${sensorCount}`);
        console.log(`   Alerts: ${alertCount}`);

        if (sensorCount === 0 && alertCount === 0) {
            console.log('\n✨ Database is already empty!');
            process.exit(0);
        }

        console.log('\n🗑️  Clearing all demo/simulated data...');

        await SensorData.deleteMany({});
        await Alert.deleteMany({});

        console.log('✅ All data cleared!');
        console.log('\n💡 Now only real ESP32 data will be shown.');
        console.log('   Upload your ESP32 code and start sending real sensor data.\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

clearDatabase();
