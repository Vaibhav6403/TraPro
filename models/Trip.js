const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  createdBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, unique: true },
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{ timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);