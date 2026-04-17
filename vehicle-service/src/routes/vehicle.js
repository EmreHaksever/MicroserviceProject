const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// YENİ ARAÇ EKLE (Postman'den test için)
router.post('/', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json({ message: 'Araç sisteme eklendi.', vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Araç eklenirken hata oluştu.', error: error.message });
  }
});

// TÜM MÜSAİT ARAÇLARI LİSTELE
router.get('/available', async (req, res) => {
  try {
    const availableVehicles = await Vehicle.find({ isAvailable: true });
    res.status(200).json(availableVehicles);
  } catch (error) {
    res.status(500).json({ message: 'Araçlar getirilemedi.', error: error.message });
  }
});

// ARAÇ DURUMUNU GÜNCELLE (Rental Service buraya istek atacak!)
router.put('/:id/status', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      { isAvailable }, 
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.status(200).json({ message: 'Araç durumu güncellendi.', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Durum güncellenemedi.', error: error.message });
  }
});

// TEK BİR ARACI GETİR (Rental Service fiyat hesaplamak için buraya istek atacak)
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Araç getirilemedi.', error: error.message });
  }
});

module.exports = router;