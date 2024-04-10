const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true },
  generalName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
  bestByDate: { type: Date, required: true },
  dateAdded: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },
});

const StockSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [itemSchema],
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;