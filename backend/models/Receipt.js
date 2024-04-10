const mongoose = require('mongoose');

const receiptItemSchema = new mongoose.Schema({
  name: String,
  generalName: String,
  price: Number,
});

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: { type: Date, default: Date.now }, // Automatically sets to current date & time
  groceryData: [receiptItemSchema], // Array of grocery items
  // other fields...
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
