const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    maxlength: 32
  },
  description: {
    type: String,
    require: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    trim: true,
    require: true,
    maxlength: 32
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true
  },
  quantity: {
    type: Number
  },
  sold: {
    type: Number,
    default: 0
  },
  // quantos já foram vendidos - não sei se vou usar isso
  photo: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);