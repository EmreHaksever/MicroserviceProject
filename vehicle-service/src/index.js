const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const vehicleRoutes = require('./routes/vehicle');
app.use('/api/vehicles', vehicleRoutes);

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Vehicle Service: MongoDB bağlantısı başarılı.'))
  .catch((err) => console.error('❌ Vehicle Service: MongoDB bağlantı hatası:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'vehicle-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Vehicle Service ${PORT} portunda çalışıyor.`);
});