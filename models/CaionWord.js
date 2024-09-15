const mongoose = require('mongoose');

const caionWordSchema = new mongoose.Schema({
  caionWord: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,},
  meanings: [{ type: String, required: true, lowercase: true }],
});

module.exports = mongoose.model('CaionWord', caionWordSchema);
