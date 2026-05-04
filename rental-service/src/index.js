const tracer = require('dd-trace').init();
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const rentalRoutes = require('./routes/rental');
app.use('/api/rentals', rentalRoutes);

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Rental Service: MongoDB bağlantısı başarılı.'))
  .catch((err) => console.error('❌ Rental Service: MongoDB bağlantı hatası:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'rental-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Rental Service ${PORT} portunda çalışıyor.`);
});