const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); // Gelen JSON verilerini okuyabilmek için

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Bağlantısı
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ User Service: MongoDB bağlantısı başarılı.'))
  .catch((err) => console.error('❌ User Service: MongoDB bağlantı hatası:', err));

// Sağlık Kontrolü (Healthcheck) Endpoint'i - Monitoring için lazım olacak!
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`🚀 User Service ${PORT} portunda çalışıyor.`);
});