const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Family = new Schema({
    name: String,
    description: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('Family', Family);