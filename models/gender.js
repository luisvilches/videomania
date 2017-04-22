const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Gender = new Schema({
    name: String,
    description: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('Gender', Gender);