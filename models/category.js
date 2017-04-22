const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Category = new Schema({
    name: String,
    description: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('Category', Category);