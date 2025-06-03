const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],   
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],    
      required: true
    }
  },
  category: { type: String },
  preference: { type: String },
  price: { type: Number },
  persons: { type: Number },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
