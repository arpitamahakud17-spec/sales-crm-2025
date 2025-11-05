const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  source: { type: String }, // e.g., Website, Referral, Cold Call
  status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Qualified', 'Lost'] }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);