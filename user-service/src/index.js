const tracer = require('dd-trace').init();
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Gelen HTTP isteklerini konsola basan (ve böylece Datadog'un yakalayacağı) detaylı loglayıcı
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[İSTEK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Süre: ${duration}ms`);
  });
  next();
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Bağlantısı
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ User Service: MongoDB bağlantısı başarılı.TEST 3: Jenkins mantığı tamamen anlaşıldı!'))
  .catch((err) => console.error('❌ User Service: MongoDB bağlantı hatası:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`🚀 User Service ${PORT} portunda çalışıyor.`);
});