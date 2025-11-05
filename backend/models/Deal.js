const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  stage: { type: String, default: 'New', enum: ['New', 'In Progress', 'Won', 'Lost'] },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  closeDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);