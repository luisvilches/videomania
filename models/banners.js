const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Banners = new Schema({
    category: String,
    img: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('Banners', Banners);