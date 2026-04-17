const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  userId: { type: String, required: true },    // User Service'ten gelecek ID
  vehicleId: { type: String, required: true }, // Vehicle Service'ten gelecek ID
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);