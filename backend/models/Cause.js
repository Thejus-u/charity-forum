const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled', 'expired'], default: 'active' },
  supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Cause', causeSchema); 