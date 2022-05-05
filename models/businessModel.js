const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  business_id: String,
  name: String,
  address: String,
  city: String,
  state: String,
  postal_code: String,
  stars: Number,
  review_count: Number,
  is_open: Number,
  attributes: Object,
  categories: String,
  hours: Object,
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
  },
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
