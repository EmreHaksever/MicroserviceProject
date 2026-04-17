const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true }, // Plaka
  brand: { type: String, required: true },                     // Marka (örn: Renault)
  model: { type: String, required: true },                     // Model (örn: Megane)
  year: { type: Number, required: true },                      // Yıl
  dailyPrice: { type: Number, required: true },                // Günlük Kiralama Bedeli
  isAvailable: { type: Boolean, default: true }                // Müsait mi? (Kiralanınca false olacak)
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);