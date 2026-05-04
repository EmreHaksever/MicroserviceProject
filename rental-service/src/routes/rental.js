const express = require('express');
const axios = require('axios');
const Rental = require('../models/Rental');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL; // http://localhost:3002/api/vehicles

// ARAÇ KİRALA
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    // 1. Gün sayısını hesapla
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // En az 1 gün

    // 2. Vehicle Service'e sor: Araç var mı ve güncel fiyatı nedir?
    const vehicleResponse = await axios.get(`${VEHICLE_SERVICE_URL}/${vehicleId}`);
    const vehicle = vehicleResponse.data;

    // 3. Araç müsait mi kontrol et
    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'Bu araç şu anda müsait değil veya kirada.' });
    }

    // 4. Toplam fiyatı hesapla
    const totalPrice = diffDays * vehicle.dailyPrice;

    // 5. Kiralama kaydını oluştur ve veritabanına kaydet
    const newRental = new Rental({
      userId,
      vehicleId,
      startDate,
      endDate,
      totalPrice
    });
    await newRental.save();

    // 6. Vehicle Service'e bildir: Aracı "kirada" (isAvailable: false) olarak güncelle
    await axios.put(`${VEHICLE_SERVICE_URL}/${vehicleId}/status`, 
      { isAvailable: false },
      { headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY } }
    );

    res.status(201).json({ 
        message: 'Araç başarıyla kiralandı.', 
        rental: newRental 
    });

  } catch (error) {
    // Axios'tan gelen hataları daha net yakalamak için
    const errorMsg = error.response ? error.response.data.message : error.message;
    res.status(500).json({ message: 'Kiralama işlemi başarısız.', error: errorMsg });
  }
});

// KULLANICININ KENDİ KİRALAMALARINI GÖRMESİ
router.get('/my-rentals', authMiddleware, async (req, res) => {
    try {
        const rentals = await Rental.find({ userId: req.user.userId });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Kiralama geçmişi getirilemedi.' });
    }
});

module.exports = router;