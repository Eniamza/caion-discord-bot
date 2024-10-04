const mongoose = require('mongoose');

const translationsSchema = new mongoose.Schema({
  translatedSentence: { 
    type: String,
    index: true, 
    unique: true, 
    required: true,
    lowercase: true,},
  originSentence: { type: String, required: true, lowercase: true },
});

module.exports = mongoose.model('Translations', translationsSchema);
